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

## Notes
- Videos/audio stream from jsDelivr and are not cached (large, and browsers need range requests). They need internet.
- Video/audio/PDF-cover files are assumed to be in the same `IEC` repo root under the names in the spreadsheet.
  jsDelivr rejects GitHub files over 20 MB; if a video fails to play, host it elsewhere and edit its `url` in `content.json`.

## How updates reach users
The app checks for a new version when it opens, when the user comes back to it, and every 30 minutes
(logic in `update-kit.js`, which is the same file in all three apps).

1. **Update found** - a card appears at the top with a progress ring and percentage, "Downloading update…".
2. **Update ready** - at 100% it becomes "Update available" with **Update** and **Later**. *Later* hides the card until the next check.
3. **Installing** - *Update* shows a spinning ring, "Installing update…", then the app restarts on its own.
4. **After the restart** - "✔ Updated to the latest version".

**To release an update:** change your files, then bump the version name at the top of `sw.js` (`V`, e.g. `iec-v38`).
That is the only thing phones look at. `update-kit.js` must stay listed in the file list at the top of `sw.js`.

**Content-only changes:** if you only change `content.json` you do not need to bump `V`; the same card appears (it skips the download step) and the restart loads the new content.
