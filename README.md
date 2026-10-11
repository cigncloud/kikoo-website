# Kikoo website

Static App Store support, privacy, and product pages for Kikoo Selfie Club.

The site is designed for GitHub Pages. There is no build step and no server-side
form: support requests use the public support email shown on the site.

## Publish with GitHub Pages

1. Open **Settings -> Pages** in the `cigncloud/kikoo-website` repository.
2. Select **Deploy from a branch**.
3. Select `main` and `/(root)`, then save.
4. Wait for the deployment, then open `https://cigncloud.github.io/kikoo-website/`.

The App Store Connect URLs are:

- Support: `https://cigncloud.github.io/kikoo-website/support.html`
- Privacy: `https://cigncloud.github.io/kikoo-website/privacy.html`
- Marketing: `https://cigncloud.github.io/kikoo-website/`

## Local preview

From this directory, run:

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173/`.
