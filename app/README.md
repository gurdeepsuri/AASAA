# AASAA Studio Manager

A private, phone-first app to run the studio day to day — clients, projects,
quotes, appointments, expenses and hours in one place.

It's a **local-first PWA**: everything is stored on the device (in the browser's
IndexedDB), works offline, and can be installed to a phone home screen or a
laptop. No account, no server, no monthly cost. Because the data lives on the
device, use **Settings → Export backup** regularly, and to move to a new
device, export there and import here.

> Architecture note: the whole data layer is isolated in `js/db.js`. To grow
> this into a synced, multi-user SaaS later, that one file is swapped for an API
> client — the views and business logic don't change.

## Modules

- **Dashboard** — today at a glance: upcoming meetings, active projects,
  outstanding & overdue invoices, hours this week, spend this month, and
  quick-add buttons.
- **Clients** — contact directory; each client links to their projects, quotes,
  invoices and meetings.
- **Projects** — leads through completed, with budget and live rollups of money
  received, expenses, **profit**, and logged hours.
- **Quotes** — line-item estimates with GST and discount, status tracking, a
  **Print / Save-as-PDF** view on studio letterhead, share (WhatsApp/email), and
  one-tap **convert to invoice**.
- **Invoices** — raised directly or from a quote, with GST, **payment tracking**
  (part-payments, methods, running balance), auto status (Sent → Partially Paid →
  Paid / Overdue), printable letterhead, and share.
- **Schedule** — meetings as an **agenda and a month calendar**, colour-coded by
  type, with reminders and one-tap **Add to Calendar (.ics)** so the phone's own
  calendar notifies her.
- **Vendors** — contractors & suppliers organised by **trade** (carpenter,
  electrician, plumber, …) with search, trade filters, and tap-to-call/WhatsApp.
- **Expenses** — spend tracker, grouped by month, taggable to a project.
- **Hours** — time log with weekly totals and billable value.
- **Reports** — money in vs out: all-time summary, net profit, a 6-month
  received-vs-expenses trend, and **profit by project**.
- **Settings** — business profile, currency/rate/GST defaults, quote & invoice
  numbering, default reminder, data backup/restore (+ meetings `.ics` export),
  and an optional passcode lock.

## Notifications & sending — how it works today

- **Meeting reminders on the phone:** each meeting has a reminder setting and an
  **Add to Calendar** button that produces a standard `.ics` file. Opening it on
  an iPhone/Android adds the event to the native calendar, which then fires the
  reminder/notification. (Direct push notifications and two-way Google Calendar
  sync need the cloud backend — see below.)
- **Sending quotes & invoices:** **Print / Save-as-PDF** for the formal document,
  plus **Share** → WhatsApp / email / copy with a ready-made summary.

## Security & privacy

- Data never leaves the device; there are no third-party network calls.
- A strict Content-Security-Policy (`default-src 'self'`) is set on the app shell.
- All user-entered text is HTML-escaped before rendering.
- Optional device passcode lock.

## Growing into a multi-user product

The data layer is deliberately isolated in `js/db.js` behind an async,
REST-shaped API (`list / get / save / remove`). Moving to a synced, multi-tenant
SaaS (accounts, multi-device, web + mobile, push notifications, Google Calendar
sync, emailed invoices) means implementing that same interface against a backend
— the views and business logic stay as they are.

## Run locally

Static files — serve the repo root and open `/app/`:

```bash
python3 -m http.server 8000    # then visit http://localhost:8000/app/
```

## Host it

The app deploys as-is with the rest of the repo on GitHub Pages (or Netlify /
Vercel). Once live it's reachable at `…/app/`.

### Install to a phone

- **iPhone (Safari):** open the app URL → Share → **Add to Home Screen**.
- **Android (Chrome):** open the app URL → menu → **Install app**.

## Files

- `index.html` — app shell
- `manifest.webmanifest`, `sw.js` — installable + offline support
- `css/app.css` — styles (reuses the AASAA palette and fonts)
- `js/` — `app.js` (bootstrap), `router.js`, `state.js`, `db.js` (storage),
  `ui.js`, `form.js`, `util.js`, and one file per screen under `js/views/`
