# Thomas Ajai — Portfolio

Static portfolio for https://thomasajai.github.io/, maintained in
https://github.com/thomasajai/thomasajai.github.io.

The website was copied unchanged from the original portfolio's `dist/` folder.
HTML, CSS, JavaScript, fonts, illustrations, experiment figure, animation library,
and résumé are served directly from this repository. No installation or build is
required.

## Preview locally

```sh
npm run dev
```

Open http://127.0.0.1:8643/. Node.js 18 or later is needed only for this local
preview. GitHub Pages serves the files directly and does not run `server.mjs`.

## Edit

- `index.html`: page content, links, and contact information.
- `style.css`: appearance and responsive layout.
- `app.js`: project dialogs, animation, and browser-based workflow demonstration.
- `assets/`: fonts, licenses, GSAP, artwork, research figure, and résumé PDF.

The workflow demonstration runs in the browser without a backend or model calls.
The optional portrait remains disabled, matching the original website.

## Publish on GitHub Pages

Use this repository's existing `main` branch. Under **Settings → Pages**, the
publishing source should be **Deploy from a branch**, **main**, **/ (root)**.
The `.nojekyll` file keeps the site as plain static files.

Review and commit the replacement, then push `main` to `origin`. GitHub Pages
will publish the updated site at the same address after its deployment succeeds.
The previous website remains in Git history at commit
`d93d5c16dffc0c7f45f239a228089ff1d8eefe9e`.

## Credits

DM Sans and Instrument Serif use the SIL Open Font License; the license files
are included in `assets/`. The GSAP license notice is embedded in
`assets/gsap.min.js`. Original conceptual project illustrations and the recorded
research figure are retained from the source portfolio.
