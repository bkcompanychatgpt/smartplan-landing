(function () {
  const cmsConfig = typeof window.getLandingCms === "function" ? window.getLandingCms() : {};
  const legacyConfig = window.LANDING_CONFIG || {};
  const matchGate = document.querySelector("#match-gate");
  const accessPrep = document.querySelector("#access-prep");
  const continueToGuide = document.querySelector("#continue-to-guide");
  const landing = document.querySelector("#landing");
  const startButton = document.querySelector("#start-match");
  const countdownStage = document.querySelector("#countdown-stage");
  const matchRing = document.querySelector("#match-ring");
  const telegramClaimBtn = document.querySelector("#telegram-claim-btn");
  const matchStatus = document.querySelector("#match-status");
  const matchDetail = document.querySelector("#match-detail");
  const claimSteps = Array.from(document.querySelectorAll(".claim-step"));
  const leadForm = document.querySelector("#lead-form");
  const toast = document.querySelector("#toast");
  const defaultStates = [
    ["Hubungi khidmat pelanggan di Telegram", "Klik butang Telegram selepas loading dan mesej pasukan kami."],
    ["Berikan nombor telefon anda", "Pastikan nombor aktif supaya akaun boleh disediakan."],
    ["Beritahu permainan pilihan anda", "Nyatakan permainan yang anda mahu cuba dengan mata percuma."],
    ["Akaun dan mata percuma disediakan", "Khidmat pelanggan akan buka akaun dan masukkan mata untuk anda bermain."]
  ];

  function getActiveCms() {
    return window.LANDING_CMS || cmsConfig || {};
  }

  function getRuntimeConfig() {
    const activeCms = getActiveCms();
    return {
      ...legacyConfig,
      ...(activeCms.settings || {}),
      destinationAfterMatch: activeCms.settings?.postMatchDestination || legacyConfig.destinationAfterMatch,
      countdownSeconds: activeCms.settings?.countdownSeconds || legacyConfig.countdownSeconds
    };
  }

  async function refreshServerCms() {
    if (typeof window.loadLandingCms !== "function") return;
    try {
      window.LANDING_CMS = await window.loadLandingCms({ includeLocal: false });
    } catch (error) {
      console.warn("[cms-refresh-error]", error);
    }
  }

  const track = (eventName, payload = {}) => {
    const data = {
      event: eventName,
      timestamp: new Date().toISOString(),
      path: window.location.pathname,
      ...getUtmParams(),
      ...payload
    };

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(data);

    if (typeof window.fbq === "function") window.fbq("trackCustom", eventName, data);
    if (typeof window.ttq?.track === "function") window.ttq.track(eventName, data);
    if (typeof window.gtag === "function") window.gtag("event", eventName, data);
    if (typeof window.MATCH_LANDING_HOOKS?.onTrack === "function") {
      window.MATCH_LANDING_HOOKS.onTrack(eventName, data);
    }

    sendServerEvent(eventName, data);
    console.info("[landing-track]", eventName, data);
  };

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2600);
  };

  function getUtmParams() {
    const params = new URLSearchParams(window.location.search);
    const utm = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((key) => {
      const value = params.get(key);
      if (value) utm[key] = value;
    });
    return utm;
  }

  function getCookie(name) {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1] || "";
  }

  function sendServerEvent(eventName, data) {
    const trackingConfig = getActiveCms().tracking || {};
    if (!trackingConfig.serverTrackingEndpoint) return;
    const eventId = `${eventName}.${Date.now()}.${Math.random().toString(36).slice(2)}`;
    const body = {
      eventName,
      eventId,
      publicEventKey: trackingConfig.publicEventKey || "",
      sourceUrl: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      fbp: getCookie("_fbp"),
      fbc: getCookie("_fbc"),
      ttclid: new URLSearchParams(window.location.search).get("ttclid") || "",
      gclid: new URLSearchParams(window.location.search).get("gclid") || "",
      metaTestEventCode: trackingConfig.metaTestEventCode || "",
      tiktokTestEventCode: trackingConfig.tiktokTestEventCode || "",
      data
    };

    fetch(trackingConfig.serverTrackingEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true
    }).catch((error) => console.warn("[server-track-error]", error));
  }

  function openTelegramDestination() {
    const destination = getRuntimeConfig().destinationAfterMatch || "#";
    track("TelegramClaimClick", { destination });
    if (destination && destination !== "#") window.location.href = destination;
  }

  function completeMatchingDelay() {
    const activeCms = getActiveCms();
    const destination = getRuntimeConfig().destinationAfterMatch || "#";
    const states = activeCms.matchGate?.states || defaultStates;
    const finalState = states[Math.max(0, states.length - 1)];

    if (matchRing) matchRing.hidden = true;
    if (telegramClaimBtn) {
      telegramClaimBtn.hidden = false;
      telegramClaimBtn.textContent = activeCms.matchGate?.completeButtonText || "Hubungi kami di Telegram";
    }
    if (matchStatus && finalState?.[0]) matchStatus.textContent = finalState[0];
    if (matchDetail && finalState?.[1]) matchDetail.textContent = finalState[1];
    claimSteps.forEach((step, index) => step.classList.toggle("active", index === claimSteps.length - 1));
    track("MatchComplete", { destination, readyForTelegram: true });
  }

  function startMatchingDelay() {
    const activeCms = getActiveCms();
    const states = activeCms.matchGate?.states || defaultStates;
    const total = Number(getRuntimeConfig().countdownSeconds || 10);

    if (!startButton || !countdownStage || !matchRing || !matchStatus || !matchDetail) return;

    startButton.disabled = true;
    startButton.hidden = true;
    countdownStage.hidden = false;
    matchRing.removeAttribute("style");
    matchRing.hidden = false;
    if (telegramClaimBtn) telegramClaimBtn.hidden = true;
    matchStatus.textContent = activeCms.matchGate?.title || "Menyambung ke pautan Telegram";
    matchDetail.textContent = activeCms.matchGate?.detail || "Sila tunggu sementara akses tuntutan anda disediakan...";
    claimSteps.forEach((step, index) => {
      const state = states[Math.min(states.length - 1, index)];
      const title = step.querySelector("strong");
      const body = step.querySelector("p");
      if (title && state?.[0]) title.textContent = state[0];
      if (body && state?.[1]) body.textContent = state[1];
      step.classList.toggle("active", index === 0);
    });
    track("StartMatch", { seconds: total });

    let stateIndex = 0;
    const updateState = () => {
      const state = states[Math.min(states.length - 1, stateIndex)];
      matchStatus.textContent = state[0];
      matchDetail.textContent = state[1];
      claimSteps.forEach((step, index) => step.classList.toggle("active", index === Math.min(claimSteps.length - 1, stateIndex)));
      stateIndex += 1;
    };
    const intervalMs = Math.max(1200, Math.floor((total * 1000) / Math.max(states.length, 1)));
    updateState();

    const stateTimer = window.setInterval(updateState, intervalMs);
    window.setTimeout(() => {
      window.clearInterval(stateTimer);
      completeMatchingDelay();
    }, total * 1000);
  }

  document.addEventListener("click", (event) => {
    const cta = event.target.closest("a, button");
    if (!cta) return;
    const label = cta.textContent.trim().replace(/\s+/g, " ");
    track("CtaClick", { label, href: cta.getAttribute("href") || "" });
  });

  startButton?.addEventListener("click", startMatchingDelay);
  telegramClaimBtn?.addEventListener("click", openTelegramDestination);

  continueToGuide?.addEventListener("click", async () => {
    if (accessPrep) accessPrep.hidden = true;
    if (matchGate) matchGate.hidden = false;
    document.body.classList.remove("prep-ready");
    window.scrollTo(0, 0);
    window.requestAnimationFrame(() => window.scrollTo(0, 0));
    window.setTimeout(() => window.scrollTo(0, 0), 60);
    track("AccessPrepContinue", {});
    await refreshServerCms();
    startMatchingDelay();
  });

  leadForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(leadForm);
    track("Lead", {
      country: formData.get("country"),
      hasName: Boolean(formData.get("name")),
      hasPhone: Boolean(formData.get("phone"))
    });
    leadForm.reset();
    showToast("Dihantar. Akses tuntutan anda akan diberi keutamaan.");
  });

  if (window.location.hash === "#landing") {
    document.body.classList.add("landing-ready");
    if (matchGate) matchGate.hidden = true;
    if (landing) landing.hidden = false;
    window.scrollTo(0, 0);
  }

  track("PageView");
})();
