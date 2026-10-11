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

## Google SEO research

GitHub Pages can be crawled by Google when the published pages are public,
reachable, and indexable. GitHub Pages already serves this site over HTTPS.
GitHub Pages does not provide search ranking by itself, so page content,
internal links, metadata, and crawl signals still need to be maintained in
this repository.

### Current findings

Checked against the published site on October 11, 2026:

- `/`, `/support.html`, `/privacy.html`, and `/terms.html` return HTTP 200 over HTTPS.
- `/robots.txt` currently returns HTTP 404.
- `/sitemap.xml` currently returns HTTP 404.
- The pages have a language attribute, title, description, and H1.
- The pages do not yet have self-referencing `canonical` links or `hreflang` links.

### Multilingual URL plan

Keep the existing English URLs because they are used for App Store Connect, then
add translations under stable language paths:

```text
/                 English default page (x-default)
/ko/              Korean
/ja/              Japanese
/zh-Hans/         Simplified Chinese
```

Each translated document should have its own URL, translated `title`,
description, H1, body copy, navigation labels, and image `alt` text. Do not
redirect visitors automatically based on browser language. Provide visible
language links so users and crawlers can reach every version.

After a language version is actually published, connect equivalent documents
with reciprocal `hreflang` links and keep each page's canonical URL pointed to
itself. Do not advertise a language in `hreflang` or the sitemap before that
URL returns HTTP 200.

Example for the Korean home page:

```html
<link rel="canonical" href="https://cigncloud.github.io/kikoo-website/ko/">
<link rel="alternate" hreflang="en" href="https://cigncloud.github.io/kikoo-website/">
<link rel="alternate" hreflang="ko" href="https://cigncloud.github.io/kikoo-website/ko/">
<link rel="alternate" hreflang="ja" href="https://cigncloud.github.io/kikoo-website/ja/">
<link rel="alternate" hreflang="zh-Hans" href="https://cigncloud.github.io/kikoo-website/zh-Hans/">
<link rel="alternate" hreflang="x-default" href="https://cigncloud.github.io/kikoo-website/">
```

### Crawl files

Add `robots.txt` and `sitemap.xml` at the repository root. The minimum
`robots.txt` should be:

```text
User-agent: *
Allow: /
Sitemap: https://cigncloud.github.io/kikoo-website/sitemap.xml
```

The sitemap should contain only public, canonical URLs that return HTTP 200.
Do not include redirect URLs, duplicate URLs, `noindex` pages, or untranslated
paths. Submit the sitemap in Google Search Console after deployment.

### Google Search Console

Register `https://cigncloud.github.io/kikoo-website/` as a URL-prefix property,
submit `/sitemap.xml`, and use URL Inspection for the home, support, privacy,
and terms pages. Search Console is needed to see crawl and indexing problems;
adding a sitemap does not guarantee indexing or ranking.

Official references:

- [Localized versions of your page](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [robots.txt introduction](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [GitHub Pages documentation](https://docs.github.com/en/pages)

## SEO TODO

- [ ] Add a self-referencing `canonical` link to each current English page.
- [ ] Add `robots.txt` with the public sitemap URL.
- [ ] Add `sitemap.xml` for the four current English pages.
- [ ] Add a visible language selector to the site header and footer.
- [ ] Create Korean `/ko/` versions of home, support, privacy, and terms.
- [ ] Create Japanese `/ja/` versions of home, support, privacy, and terms.
- [ ] Create Simplified Chinese `/zh-Hans/` versions of home, support, privacy, and terms.
- [ ] Add reciprocal `hreflang` and self-canonical links after each translation is live.
- [ ] Translate page titles, descriptions, headings, navigation, and image alt text.
- [ ] Review translated privacy and terms pages for legal and data-processing consistency.
- [ ] Register the GitHub Pages URL in Google Search Console.
- [ ] Submit `sitemap.xml` and inspect representative URLs after deployment.
- [ ] Recheck all sitemap URLs and language links with HTTP 200 checks after every release.

## Local preview

From this directory, run:

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173/`.
