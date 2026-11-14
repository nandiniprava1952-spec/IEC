# SATARK TIPS (ସତର୍କ ବାଣୀ) — by ଆଶା (PWA)

Installable, offline-capable viewer for the IEC materials (bilingual English/Odia). Content lives in `content.json`
(generated from the XLSForm by `build.py`); media is loaded from `nandiniprava1952-spec/IEC` via jsDelivr.

## Deploy on GitHub Pages
1. Create a new GitHub repo (e.g. `iec-app`) and upload everything in this folder (keep `.nojekyll`).
2. Repo → Settings → Pages → Source: *Deploy from a branch* → `main` / root → Save.
3. Open `https://<your-username>.github.io/iec-app/` on the phone → browser menu → **Install app / Add to Home screen**.
4. On WiFi, tap **⬇ Offline** once to cache all images/PDFs.

## Update content
Edit the spreadsheet, run `python3 build.py` (needs `openpyxl`, `pillow`; set the xlsx path inside), commit `content.json`.
Bump `V` in `sw.js` if you change `index.html`.

## Notes
- Videos/audio stream from jsDelivr and are not cached (large, and browsers need range requests). They need internet.
- Video/audio/PDF-cover files are assumed to be in the same `IEC` repo root under the names in the spreadsheet.
  jsDelivr rejects GitHub files over 20 MB; if a video fails to play, host it elsewhere and edit its `url` in `content.json`.
