import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(".");
const dist = join(root, "dist");
const serverDir = join(dist, "server");

const copyItems = [
  ".gitignore",
  "README.md",
  "admin.css",
  "admin.html",
  "admin.js",
  "cms.js",
  "index.html",
  "landing.html",
  "script.js",
  "server-tracking-worker.js",
  "site-config.js",
  "styles.css",
  "vendor",
  "assets"
];

const textAssets = [
  ["/", "index.html", "text/html; charset=utf-8"],
  ["/index.html", "index.html", "text/html; charset=utf-8"],
  ["/app.html", "landing.html", "text/html; charset=utf-8"],
  ["/landing.html", "landing.html", "text/html; charset=utf-8"],
  ["/admin.html", "admin.html", "text/html; charset=utf-8"],
  ["/styles.css", "styles.css", "text/css; charset=utf-8"],
  ["/admin.css", "admin.css", "text/css; charset=utf-8"],
  ["/script.js", "script.js", "application/javascript; charset=utf-8"],
  ["/cms.js", "cms.js", "application/javascript; charset=utf-8"],
  ["/admin.js", "admin.js", "application/javascript; charset=utf-8"],
  ["/site-config.js", "site-config.js", "application/javascript; charset=utf-8"],
  ["/vendor/customer-package.js", "vendor/customer-package.js", "application/javascript; charset=utf-8"],
  ["/vendor/package-loader.js", "vendor/package-loader.js", "application/javascript; charset=utf-8"],
  ["/README.md", "README.md", "text/markdown; charset=utf-8"]
];

const binaryAssets = [
  ["/assets/smartplan-rewards.png", "assets/smartplan-rewards.png", "image/png"],
  ["/assets/avatar-alex.png", "assets/avatar-alex.png", "image/png"],
  ["/assets/avatar-mika.png", "assets/avatar-mika.png", "image/png"],
  ["/assets/avatar-nami.png", "assets/avatar-nami.png", "image/png"],
  ["/assets/hero-meetup.png", "assets/hero-meetup.png", "image/png"],
  ["/assets/profile-wall.png", "assets/profile-wall.png", "image/png"]
];

await rm(dist, { recursive: true, force: true });
await mkdir(serverDir, { recursive: true });

for (const item of copyItems) {
  const source = join(root, item);
  if (existsSync(source)) {
    await cp(source, join(dist, "static", item), { recursive: true });
  }
}

if (existsSync(join(root, ".openai", "hosting.json"))) {
  await mkdir(join(dist, ".openai"), { recursive: true });
  await cp(join(root, ".openai", "hosting.json"), join(dist, ".openai", "hosting.json"));
}

const assetEntries = [];

for (const [route, file, type] of textAssets) {
  const body = await readFile(join(root, file), "utf8");
  assetEntries.push([route, { type, kind: "text", body }]);
}

for (const [route, file, type] of binaryAssets) {
  const body = await readFile(join(root, file));
  assetEntries.push([route, { type, kind: "base64", body: body.toString("base64") }]);
}

const worker = `const assets = new Map(${JSON.stringify(assetEntries)});
const configKey = "smartplan:cms";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    if (url.pathname === "/api/config") {
      return handleConfig(request, env);
    }

    if (url.pathname === "/api/track") {
      return handleTrack(request, env);
    }

    const asset = assets.get(url.pathname);
    if (!asset) return new Response("Not found", { status: 404 });
    const body = asset.kind === "base64" ? base64ToBytes(asset.body) : asset.body;
    return new Response(body, {
      headers: {
        "Content-Type": asset.type,
        "Cache-Control": asset.type.startsWith("text/") || asset.type.includes("javascript") ? "no-store" : "public, max-age=3600"
      }
    });
  }
};

async function handleConfig(request, env) {
  if (request.method === "GET") {
    const value = await env.SITE_STORAGE?.get(configKey);
    return json({ ok: true, config: value ? JSON.parse(value) : null });
  }

  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);
  const input = await request.json().catch(() => null);
  if (!input || typeof input !== "object") return json({ ok: false, error: "Invalid JSON" }, 400);
  await env.SITE_STORAGE?.put(configKey, JSON.stringify(input.config || input));
  return json({ ok: true });
}

async function handleTrack(request, env) {
  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);
  const input = await request.json().catch(() => null);
  if (!input) return json({ ok: false, error: "Invalid JSON" }, 400);
  if (env.PUBLIC_EVENT_KEY && input.publicEventKey !== env.PUBLIC_EVENT_KEY) return json({ ok: false, error: "Unauthorized" }, 401);

  const results = await Promise.allSettled([sendMeta(input, env), sendTikTok(input, env), sendGa4(input, env)]);
  return json({
    ok: true,
    eventName: input.eventName,
    eventId: input.eventId,
    results: results.map((result) => result.status === "fulfilled" ? result.value : { ok: false, error: String(result.reason?.message || result.reason) })
  });
}

async function sendMeta(input, env) {
  if (!env.META_PIXEL_ID || !env.META_ACCESS_TOKEN) return { platform: "meta", skipped: true };
  const endpoint = "https://graph.facebook.com/v20.0/" + encodeURIComponent(env.META_PIXEL_ID) + "/events?access_token=" + encodeURIComponent(env.META_ACCESS_TOKEN);
  return postJson("meta", endpoint, {
    data: [{
      event_name: input.eventName === "MatchComplete" ? "CompleteRegistration" : input.eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: input.eventId,
      action_source: "website",
      event_source_url: input.sourceUrl,
      user_data: { client_user_agent: input.userAgent, fbp: input.fbp || undefined, fbc: input.fbc || undefined },
      custom_data: input.data || {}
    }],
    test_event_code: input.metaTestEventCode || undefined
  });
}

async function sendTikTok(input, env) {
  if (!env.TIKTOK_PIXEL_CODE || !env.TIKTOK_ACCESS_TOKEN) return { platform: "tiktok", skipped: true };
  return postJson("tiktok", "https://business-api.tiktok.com/open_api/v1.3/event/track/", {
    event_source: "web",
    event_source_id: env.TIKTOK_PIXEL_CODE,
    test_event_code: input.tiktokTestEventCode || undefined,
    data: [{ event: input.eventName, event_time: Math.floor(Date.now() / 1000), event_id: input.eventId, page: { url: input.sourceUrl, referrer: input.referrer }, user: { user_agent: input.userAgent, ttclid: input.ttclid || undefined }, properties: input.data || {} }]
  }, { "Access-Token": env.TIKTOK_ACCESS_TOKEN });
}

async function sendGa4(input, env) {
  if (!env.GA4_MEASUREMENT_ID || !env.GA4_API_SECRET) return { platform: "ga4", skipped: true };
  const endpoint = "https://www.google-analytics.com/mp/collect?measurement_id=" + encodeURIComponent(env.GA4_MEASUREMENT_ID) + "&api_secret=" + encodeURIComponent(env.GA4_API_SECRET);
  return postJson("ga4", endpoint, {
    client_id: input.gclid || input.fbp || input.eventId,
    events: [{ name: String(input.eventName || "event").toLowerCase(), params: { event_id: input.eventId, page_location: input.sourceUrl, page_referrer: input.referrer, ...input.data } }]
  });
}

async function postJson(platform, endpoint, payload, headers = {}) {
  const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(payload) });
  return { platform, ok: response.ok, status: response.status, body: (await response.text()).slice(0, 500) };
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...corsHeaders() } });
}

function corsHeaders() {
  return { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
}

function base64ToBytes(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
`;

await writeFile(join(serverDir, "index.js"), worker);
await writeFile(join(dist, "package.json"), JSON.stringify({ type: "module" }, null, 2));
