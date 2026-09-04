# smartplan Landing Page

Claim flow package for Malaysia free game points campaigns.

## Flow

- Visitor opens `index.html` and sees a decorated smartplan reward page.
- Visitor clicks the animated Malay claim button.
- The page immediately shows a 10-second claim guide/loading countdown.
- After loading, the spinner becomes a Telegram button.
- Visitor clicks the Telegram button and is sent to the URL configured in admin.

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

- `index.html`: claim button, loading guide, and Telegram button flow.
- `landing.html`: legacy standalone page, not used in the current public flow.
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
- Admin dashboard: `http://localhost:10000/admin.html`

Admin saves are written to `data/site-config.json` through `/api/config` when the server is running.
