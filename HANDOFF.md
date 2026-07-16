# Portfolio Website — Session Handoff

## Project location
```
C:\Users\volvv\Documents\PortfolioWebsite\about-me-website\
```
- Live files are in `root/`
- Dev server: `npx live-server` from `root/`, or use `.claude/launch.json` (name: "portfolio", port 5500)
- WebP converter: `node convert-images.mjs` from the project root (not `root/`)

---

## Key files

| File | Purpose |
|------|---------|
| `root/assets/projects.json` | All projects — edit to add/update/reorder |
| `root/assets/shop.json` | All shop items — edit to add/update/reorder |
| `root/projects.html` | Projects page — reads from projects.json via JS |
| `root/shop.html` | Shop page — reads from shop.json via JS |
| `root/about.html` | About page — static HTML |
| `root/assets/Gallery/` | Gallery images (source PNGs/JPGs) |
| `root/assets/Gallery/webp/` | Auto-generated WebP versions |
| `root/assets/Shop/` | Shop-specific extra images |
| `root/assets/Shop/webp/` | Auto-generated WebP versions |

---

## Data file formats

### projects.json entry
```json
{
  "name": "Project Title",
  "type": "Medium / type",
  "tools": "Tools used (or empty string)",
  "year": "2025",
  "team": ["Name One", "Name Two", "Dev: Role Name"],
  "description": ["Paragraph one.", "Paragraph two (optional)."],
  "images": ["assets/Gallery/filename.jpg"]
}
```
- Team members with `:` in name render in light grey automatically
- Images from `assets/Gallery/` auto-get WebP `<picture>` sources

### shop.json entry
```json
{
  "id": "kebab-case-id",
  "title": "Title",
  "year": "2026",
  "dimensions": "40×50 cm",
  "medium": "Oil on canvas board",
  "price": "$130",
  "description": "Optional — shows in modal on click.",
  "images": ["assets/Gallery/webp/filename.webp"]
}
```
- Card width scales proportionally to physical `dimensions` width
- `"sold": true` — not yet implemented but planned
- After adding images, run `node convert-images.mjs` to generate WebPs

---

## Shop page — how proportional sizing works
```js
const BASE_PX = 400; // largest painting gets this many pixels wide
const maxW = Math.max(...items.map(it => parseDims(it.dimensions)?.w || 0));
const pxW = Math.round((dims.w / maxW) * BASE_PX);
```
Current items: 30×40 → 214px, 40×50 → 286px, 56×70 → 400px

---

## Pending work (priority order)

### 1. Mobile hover fix (shop page)
Title/price only shows on hover — invisible on touch screens.
Fix: add CSS to always show caption on mobile:
```css
@media (max-width: 700px) {
  .shop-card-caption { opacity: 1; }
}
```

### 2. Sold state (shop page)
Add `"sold": true` to a shop.json entry and render it greyed out.
In `loadShop()`, add a sold overlay or grey out the card + show "Sold" label.

### 3. Year sections in gallery (index page)
User wants to organize the gallery by year so more work can be shown.
Three options discussed: year section dividers, filter tabs, or both.
Gallery data is in `root/assets/Gallery/list.json`.

### 4. Add new projects to projects.json
Two projects exist as PDFs but are not yet on the site:
- **Breath Clock** — interactive art, Abu Dhabi 2026
- **The Landscape** — year-long generative/3D series, Abu Dhabi 2026
Images for these are in `C:\Users\volvv\Desktop\New folder (7)\`

---

## Design decisions made this session

- **Projects layout**: editorial — horizontal image strip + 3-column meta row (name | what/when | description), `align-items: baseline` for first-line alignment
- **Shop layout**: flex wrap, `align-items: flex-start` (top-aligned), cards sized proportionally to physical dimensions
- **Shop card**: hover reveals title/price (`opacity: 0 → 1`), click opens full modal
- **Modal**: full-screen dark overlay, `object-fit: contain`, thumbnails for multi-image items, close on click outside or Escape
- **Bio text** (about.html): "Viktoria Volokitina is an interdisciplinary artist and designer based in Abu Dhabi, originally from St. Petersburg. She works across oil painting, watercolor, digital media, and interactive installation. Her practice is marked by the exploration of repetitive rhythms and an examination of color..."
