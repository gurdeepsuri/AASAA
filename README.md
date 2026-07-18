# AASAA — Architecture and Interior Design Studio

Website for AASAA, a Bangalore-based architecture and interior design studio.

## Structure

- `index.html` — single-page site (hero, about, services, projects, process, contact)
- `css/style.css` — styles, with a palette drawn from the studio logo
- `js/main.js` — mobile nav, scroll-reveal animations
- `assets/logo.svg` — full logo (vector recreation)
- `assets/mark.svg` — logo mark only (used in the header and as favicon)

## Run locally

It's a static site — just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Host it live (GitHub Pages)

1. On GitHub, go to the repository **Settings → Pages**.
2. Under **Build and deployment**, set Source to **Deploy from a branch**.
3. Choose the branch (e.g. `main`) and folder `/ (root)`, then save.
4. The site goes live at `https://<username>.github.io/AASAA/` within a minute or two.

To use a custom domain (e.g. `aasaa.in`), add it under the same Pages settings
and point the domain's DNS to GitHub Pages.

## To customise

- Contact details in `index.html` (`hello@aasaa.studio` and the phone number are placeholders).
- Project cards in the Projects section — swap the coloured placeholders for real photos.
- The original raster logo can be dropped into `assets/` and referenced instead of the SVG recreation if preferred.
