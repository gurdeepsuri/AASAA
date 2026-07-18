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

## Adding the project photos

The Projects section is wired to photos of the studio's first project
("A Family Home"). Drop the photos into `assets/projects/residence-01/`
with exactly these names and they will appear automatically (until then,
each card shows a coloured placeholder):

| Filename | Photo |
|---|---|
| `living-room.jpg` | Living room with the curved wooden arch and beige sofa |
| `display-unit.jpg` | Fluted panelling opening to the mural-lined study nook |
| `kids-room.jpg` | Kids' room with jungle mural and sage daybed (portrait) |
| `study-corner.jpg` | Arched bookshelf, window seat and beaded timber cornice |
| `master-bedroom.jpg` | Master bedroom with plaster wall and block-printed linen |
| `jungle-mural.jpg` | Wide view of the giraffe mural over arched green panelling |
| `crockery-unit.jpg` | Bar unit with dark chinoiserie folding doors and terracotta tiles |
| `media-wall.jpg` | TV wall with fluted-oval console and burnt-orange niche |
| `dining-niches.jpg` | Dining wall with arched terracotta niches and brass pieces |
| `powder-room.jpg` | Powder room with carved wooden basin on black stone |

Easiest way: on GitHub, open the `assets/projects/residence-01/` folder →
**Add file → Upload files**, and rename each photo to match before uploading.

## To customise

- Contact details in `index.html` (`hello@aasaa.studio` and the phone number are placeholders).
- The original raster logo can be dropped into `assets/` and referenced instead of the SVG recreation if preferred.
