window.DEFAULT_LANDING_CMS = {
  settings: {
    brandName: "smartplan",
    brandInitial: "S",
    title: "smartplan - Tuntut Mata Permainan Percuma Malaysia",
    description: "Buka akses smartplan untuk menuntut mata permainan percuma di Malaysia dengan proses pantas, arahan jelas, dan penjejakan kempen penuh.",
    postMatchDestination: "app.html",
    countdownSeconds: 10,
    appStoreUrl: "#lead-form",
    googlePlayUrl: "#lead-form",
    webAppUrl: "#lead-form",
    apkUrl: "#lead-form"
  },
  tracking: {
    metaPixelId: "",
    tiktokPixelId: "",
    googleTagId: "",
    serverTrackingEndpoint: "/api/track",
    publicEventKey: "",
    metaTestEventCode: "",
    tiktokTestEventCode: "",
    customHeadScript: "",
    customBodyScript: ""
  },
  images: {
    matchBackground: "assets/smartplan-rewards.png",
    heroBackground: "assets/smartplan-rewards.png",
    heroPreview: "assets/smartplan-rewards.png",
    accessHero: "assets/smartplan-rewards.png"
  },
  accessPrep: {
    brand: "smartplan MY",
    status: "Sedang menyediakan akses",
    title: "Akses mata permainan percuma sedang disediakan",
    body: "Kekal di halaman ini sebentar sementara kami menyemak kelayakan dan menyediakan pautan tuntutan untuk pengguna Malaysia.",
    waitText: "Anggaran masa menunggu: 0s",
    queueTitle: "Ganjaran sedang menunggu",
    queueNote: "Akses anda hampir selesai",
    panelBadge: "• Akses MY",
    panelStatus: "Sedia",
    panelTitle: "Membuka tuntutan mata permainan",
    panelBody: "Kami sedang menyusun akses kempen, memeriksa isyarat peranti, dan menyediakan laluan selamat sebelum tuntutan diteruskan.",
    progressStart: "Sedia",
    progressEnd: "Dibuka",
    steps: [
      ["1", "Semak akses Malaysia", "Kempen disusun mengikut trafik dan kawasan anda."],
      ["2", "Buka apabila sudah sedia", "Teruskan sebaik sahaja akses tuntutan tersedia."],
      ["3", "Tuntut melalui pautan rasmi", "Anda boleh teruskan ke halaman tawaran yang telah ditetapkan."]
    ],
    readyTitle: "Akses percuma telah dibuka",
    readyBody: "Buka halaman seterusnya apabila anda sudah bersedia.",
    buttonText: "Teruskan akses percuma",
    footnote: "Akses sudah sedia. Sila teruskan di bawah.",
    faqEyebrow: "Soalan biasa",
    faq: [
      ["Mengapa perlu buka halaman seterusnya?", "Sesetengah pelayar dalam aplikasi boleh menghalang pautan tuntutan, borang, dan penjejakan kempen."],
      ["Adakah saya perlu memasang aplikasi?", "Tidak. Anda hanya perlu teruskan ke langkah seterusnya untuk membuka halaman dalam pelayar yang lebih stabil."]
    ]
  },
  matchGate: {
    buttonText: "Klik untuk padankan tawaran",
    title: "Menyambung ke tawaran mata percuma",
    detail: "Sambungan sedang dipulihkan sementara akses tuntutan disediakan. Sila tunggu...",
    states: [
      ["Memeriksa isyarat rangkaian", "Laluan tuntutan anda sedang disambungkan dengan selamat. Sila kekal di halaman ini."],
      ["Memuatkan tawaran tersedia", "Kempen mata permainan percuma sedang dimuatkan untuk pengguna Malaysia."],
      ["Menyediakan sambungan", "Hampir selesai. Halaman tuntutan anda sedang disediakan di latar belakang."],
      ["Membuka halaman tuntutan", "Sambungan dipulihkan. Anda akan dihantar ke halaman smartplan sekarang."]
    ]
  },
  browserGuide: {
    eyebrow: "Untuk pengalaman terbaik",
    headline: "Buka halaman ini dalam pelayar sebelum tuntutan.",
    body: "Sesetengah pelayar dalam aplikasi boleh menghalang pautan, borang, dan proses tuntutan. Buka pautan ini dalam Safari, Chrome, atau pelayar utama anda dahulu.",
    steps: [
      ["1", "Tekan ikon menu dalam pelayar aplikasi."],
      ["2", "Pilih Buka dalam pelayar atau Buka dalam Safari."],
      ["3", "Jika tiada apa berlaku, salin pautan dan tampal dalam pelayar anda."]
    ],
    buttonText: "Teruskan ke padanan"
  },
  nav: {
    links: [
      ["Ganjaran", "#activities"],
      ["Akses", "#verified"],
      ["Cara kerja", "#how"],
      ["Soalan", "#faq"]
    ],
    ctaText: "Tuntut",
    ctaUrl: "#lead-form"
  },
  hero: {
    eyebrow: "Mata permainan percuma untuk Malaysia",
    headline: "Tuntut mata permainan percuma melalui smartplan.",
    lead: "smartplan membantu pengguna Malaysia membuka akses kempen dengan langkah ringkas, paparan jelas, dan laluan tuntutan yang mudah dikemas kini untuk setiap pelanggan.",
    previewName: "Pakej MY Free Points",
    previewCity: "Malaysia",
    previewActivity: "Akses segera, semakan pantas, pautan tuntutan",
    previewCta: "Tuntut sekarang",
    highlights: [
      ["MY", "kempen Malaysia"],
      ["24/7", "akses halaman aktif"],
      ["100%", "boleh dikemas kini admin"]
    ],
    miniProfiles: [
      { name: "Pakej Starter", city: "Malaysia", activity: "Mata percuma", image: "assets/smartplan-rewards.png" },
      { name: "Pakej Bonus", city: "Malaysia", activity: "Ganjaran kempen", image: "assets/smartplan-rewards.png" },
      { name: "Pakej Express", city: "Malaysia", activity: "Akses pantas", image: "assets/smartplan-rewards.png" }
    ],
    trust: ["Akses kempen Malaysia", "Sokong Pixel dan UTM", "Pautan boleh ditukar dari admin"]
  },
  stats: [
    ["MY", "trafik Malaysia disokong"],
    ["5", "langkah aliran penuh"],
    ["3", "platform Pixel disokong"],
    ["1", "panel admin mudah"]
  ],
  activities: {
    eyebrow: "Tawaran tersedia",
    headline: "Susun kempen mata permainan mengikut keperluan pelanggan.",
    cards: [
      ["Malaysia", "Mata permainan percuma", "Akses hari ini", "Tuntutan dibuka"],
      ["Kempen baru", "Bonus pengguna baharu", "Boleh ditukar di admin", "CTA aktif"],
      ["Pautan klien", "Program pelanggan", "Vendor package tersedia", "Tracking siap"]
    ]
  },
  verified: {
    eyebrow: "Akses kempen",
    headline: "Semua bahagian penting boleh ditukar dari admin.",
    body: "Tukar headline, butang, gambar, pautan selepas loading, Pixel ID, Google Tag, dan skrip pelanggan tanpa menulis semula halaman.",
    checks: ["Meta/Facebook Pixel", "TikTok Pixel", "Google Tag", "Vendor customer package"]
  },
  profiles: [
    { name: "Free Points", city: "Malaysia", activity: "Tuntutan pantas", badge: "Aktif", image: "assets/smartplan-rewards.png" },
    { name: "Bonus Baru", city: "Malaysia", activity: "Kempen pelanggan", badge: "Sedia", image: "assets/smartplan-rewards.png" },
    { name: "Link Tawaran", city: "Malaysia", activity: "Redirect selepas match", badge: "Boleh tukar", image: "assets/smartplan-rewards.png" }
  ],
  proof: {
    eyebrow: "Direka untuk trafik iklan",
    headline: "Aliran penuh dari klik pertama hingga halaman tuntutan.",
    body: "smartplan mengekalkan logik lama: halaman menunggu, panduan pelayar, klik untuk padanan, loading, kemudian landing page sebenar.",
    bullets: ["UTM dibawa dalam event", "CTA click direkodkan", "StartMatch dan MatchComplete tersedia", "Lead submit tersedia"]
  },
  how: {
    eyebrow: "Cara kerja",
    headline: "Tiga langkah ke halaman tuntutan.",
    steps: [
      ["01", "Buka akses", "Pengguna melihat halaman persediaan dan meneruskan apabila butang merah muncul."],
      ["02", "Ikut panduan pelayar", "Pengguna diarahkan membuka pengalaman dalam pelayar yang lebih stabil."],
      ["03", "Padankan dan tuntut", "Klik padanan, tunggu loading, kemudian masuk ke landing page atau pautan pelanggan."]
    ]
  },
  conversion: {
    eyebrow: "Mula tuntutan",
    headline: "Masukkan maklumat untuk menerima akses mata permainan.",
    body: "Borang ini boleh digunakan untuk lead kempen. Setiap submit akan menghantar event Lead bersama maklumat UTM yang tersedia.",
    formTitle: "Daftar akses percuma",
    buttonText: "Tuntut sekarang",
    note: "Maklumat anda digunakan untuk mengutamakan akses kempen yang sesuai."
  },
  trust: {
    eyebrow: "Siap untuk pemasaran",
    headline: "Dibina untuk kempen berbayar dan pakej pelanggan.",
    cards: [
      ["Tracking", "Pixel dan Tag", "Meta, TikTok, Google Tag, UTM, CTA click, StartMatch, MatchComplete, dan Lead disediakan."],
      ["Admin", "Kawalan kandungan", "Tukar teks, imej, butang, avatar, tempoh loading, dan redirect tanpa mengubah kod."],
      ["Vendor", "Pakej pelanggan", "Letakkan program pelanggan di vendor/customer-package.js atau vendor/client-package untuk integrasi tambahan."]
    ]
  },
  testimonials: {
    eyebrow: "Kempen lebih mudah",
    headline: "Satu struktur untuk banyak pelanggan dan banyak iklan.",
    quotes: [
      ["Halaman boleh ditukar cepat untuk kempen Malaysia tanpa mengubah aliran utama.", "Media buyer - Kuala Lumpur"],
      ["Tracking dan vendor package sudah ada, jadi pelanggan boleh tambah skrip sendiri.", "Campaign ops - Malaysia"],
      ["Admin memudahkan pertukaran gambar, CTA, dan pautan destinasi untuk ujian A/B.", "Performance team - MY"]
    ]
  },
  faq: {
    eyebrow: "Perlu diketahui",
    headline: "Soalan lazim",
    items: [
      ["Bolehkah pautan selepas loading ditukar?", "Ya. Tetapkan After-match redirect URL di admin untuk membuka app.html, anchor, atau URL pelanggan."],
      ["Adakah Pixel disokong?", "Ya. Meta/Facebook Pixel, TikTok Pixel, Google Tag, dan server endpoint tersedia."],
      ["Di mana letak program pelanggan?", "Gunakan vendor/customer-package.js atau folder vendor/client-package. Loader sedia memuatkan fail pelanggan."],
      ["Adakah halaman mobile dan desktop sama?", "Ya. Kandungan datang daripada konfigurasi yang sama, jadi perubahan admin digunakan pada kedua-dua versi."]
    ]
  },
  finalCta: {
    headline: "Akses mata permainan percuma anda hanya satu klik lagi.",
    body: "Teruskan melalui aliran smartplan dan buka halaman tuntutan yang telah disediakan untuk kempen Malaysia.",
    primaryText: "Tuntut sekarang",
    primaryUrl: "#lead-form",
    secondaryText: "Lihat tawaran",
    secondaryUrl: "#activities"
  }
};
