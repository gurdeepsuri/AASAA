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

- **Dashboard** — today at a glance: upcoming meetings, active projects, open
  quotes, hours this week, spend this month, and quick-add buttons.
- **Clients** — contact directory; each client links to their projects, quotes
  and meetings.
- **Projects** — leads through completed, with budget and live rollups of
  accepted quotes, expenses and logged hours.
- **Quotes** — line-item estimates with GST and discount, status tracking, and
  a **Print / Save-as-PDF** view on studio letterhead.
- **Schedule** — meetings, site visits and calls as an agenda.
- **Expenses** — spend tracker, grouped by month, taggable to a project.
- **Hours** — time log with weekly totals and billable value.
- **Settings** — business profile, currency/rate/GST defaults, data
  backup/restore, and an optional passcode lock.

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
