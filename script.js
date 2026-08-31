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
  const matchStatus = document.querySelector("#match-status");
  const matchDetail = document.querySelector("#match-detail");
  const leadForm = document.querySelector("#lead-form");
  const toast = document.querySelector("#toast");
  const defaultStates = [
    ["Memeriksa isyarat rangkaian", "Laluan tuntutan anda sedang disambungkan dengan selamat. Sila kekal di halaman ini."],
    ["Memuatkan tawaran tersedia", "Kempen mata permainan percuma sedang dimuatkan untuk pengguna Malaysia."],
    ["Menyediakan sambungan", "Hampir selesai. Halaman tuntutan anda sedang disediakan di latar belakang."],
    ["Membuka halaman tuntutan", "Sambungan dipulihkan. Anda akan dihantar ke halaman smartplan sekarang."]
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

  function showLanding() {
    const destination = getRuntimeConfig().destinationAfterMatch || "#landing";
    if (destination !== "#landing") {
      track("MatchComplete", { destination });
      window.location.href = destination;
      return;
    }

    document.body.classList.add("landing-ready");
    if (matchGate) matchGate.hidden = true;
    if (landing) landing.hidden = false;
    track("MatchComplete", { destination });
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    window.scrollTo(0, 0);
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
    matchStatus.textContent = activeCms.matchGate?.title || "Menyambung ke pautan Telegram";
    matchDetail.textContent = activeCms.matchGate?.detail || "Sila tunggu sementara akses tuntutan anda disediakan...";
    track("StartMatch", { seconds: total });

    let stateIndex = 0;
    const updateState = () => {
      const state = states[Math.min(states.length - 1, stateIndex)];
      matchStatus.textContent = state[0];
      matchDetail.textContent = state[1];
      stateIndex += 1;
    };
    const intervalMs = Math.max(1200, Math.floor((total * 1000) / Math.max(states.length, 1)));
    updateState();

    const stateTimer = window.setInterval(updateState, intervalMs);
    window.setTimeout(() => {
      window.clearInterval(stateTimer);
      showLanding();
    }, total * 1000);
  }

  document.addEventListener("click", (event) => {
    const cta = event.target.closest("a, button");
    if (!cta) return;
    const label = cta.textContent.trim().replace(/\s+/g, " ");
    track("CtaClick", { label, href: cta.getAttribute("href") || "" });
  });

  startButton?.addEventListener("click", startMatchingDelay);

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
