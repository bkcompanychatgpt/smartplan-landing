# smartplan Landing Page

Static landing page package for Malaysia free game points campaigns.

## Flow

- Visitor opens `index.html` and sees the preparation/waiting page.
- Visitor scrolls down, reads the cards, and clicks the red continue button.
- The browser guide page explains opening the link in Safari, Chrome, or the main browser.
- Visitor continues to the click-to-match page.
- Visitor clicks the match button and sees the connection/loading page.
- After loading, the visitor is redirected to `app.html`, which serves the real landing page.

## Included

- `admin.html` dashboard for changing text, images, buttons, avatars, tracking IDs, and redirect URLs.
- Meta/Facebook Pixel, TikTok Pixel, and Google Tag support.
- UTM capture.
- `PageView`, `CtaClick`, `Lead`, `StartMatch`, and `MatchComplete` tracking events.
- Server-side `/api/track` endpoint example.
- Customer package support through `vendor/customer-package.js`.
- Optional multi-file customer package support through `vendor/client-package`.
- Shared CMS configuration for mobile and desktop views.

## Key Files

- `index.html`: preparation page, browser guide, click-to-match gate, and loading flow.
- `landing.html`: final smartplan landing page, served as `app.html`.
- `site-config.js`: default Malay content and editable CMS values.
- `cms.js`: loads saved admin settings and renders the public pages.
- `script.js`: routing, loading, form submit, UTM, and tracking events.
- `admin.html` / `admin.js` / `admin.css`: admin dashboard.
- `server.js`: local/Render server for static files, config saving, and tracking endpoint.
- `vendor/customer-package.js`: single client script slot.
- `vendor/client-package`: optional client package folder.

## Local Use

Run:

```text
npm start
```

Then open:

- Public flow: `http://localhost:10000/`
- Final landing page: `http://localhost:10000/app.html`
- Admin dashboard: `http://localhost:10000/admin.html`

Admin saves are written to `data/site-config.json` through `/api/config` when the server is running.
