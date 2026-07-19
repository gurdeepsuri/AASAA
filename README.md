# AASAA — Architecture and Interior Design Studio

Website for AASAA, a Bangalore-based architecture and interior design studio.

The repo also contains **`app/`** — the AASAA Studio Manager, a private
phone-first PWA for running the studio (clients, projects, quotes, appointments,
expenses and hours). See [`app/README.md`](app/README.md).

## Structure

- `index.html` — single-page site (hero, about, services, projects, process, contact)
- `css/style.css` — styles, with a palette drawn from the studio logo
- `js/main.js` — mobile nav, scroll-reveal animations
- `assets/logo.svg` / `assets/mark.svg` — logo (vector) and mark-only version / favicon
- `assets/apple-touch-icon.png` — home-screen icon for iOS
- `assets/images/saanjh/` — optimised photos of the first project ("Saanjh")
- `assets/images/og-image.jpg` — social-share preview image

The photographs are resized and compressed for the web (each ~150–350 KB).
The full-resolution originals are not kept in the repo.

## Run locally

Static site — open `index.html`, or serve it:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Host it live

### 1. GitHub Pages (free, quickest)

1. Repo **Settings → Pages**.
2. **Source: Deploy from a branch**, branch `main`, folder `/ (root)`, **Save**.
3. Live at `https://gurdeepsuri.github.io/AASAA/` in a minute or two.

### 2. Point your own domain at it

Once Pages is on, add the custom domain under the same **Settings → Pages**
screen (the **Custom domain** field), then set these DNS records at your
registrar:

- For a root domain (e.g. `aasaa.in`), add four **A** records pointing to:
  `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- For a `www` subdomain, add a **CNAME** record pointing to
  `gurdeepsuri.github.io`

GitHub then provisions HTTPS automatically (tick **Enforce HTTPS**). A `CNAME`
file with the domain name is committed to the repo root once you save the
custom domain — keep it.

> Prefer a host with a dashboard? The same folder deploys as-is to **Netlify**
> or **Vercel** (drag-and-drop or connect the repo); both handle the domain and
> HTTPS for you.

## To customise later

- **Add more projects** — drop optimised photos into `assets/images/<project>/`
  and add a new `<figure>` block in the Projects section of `index.html`.
- **Contact details** live in the Contact section and footer of `index.html`.
