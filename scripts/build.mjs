import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import config from '../site.config.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const escape = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const lines = (s) => escape(s).replaceAll('\n', '<br>');
const heart = '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 27S3 19 3 10.5C3 3 13 2 16 9c3-7 13-6 13 1.5C29 19 16 27 16 27Z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/></svg>';
const star = '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="m16 3 3.5 9.5L29 16l-9.5 3.5L16 29l-3.5-9.5L3 16l9.5-3.5L16 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
const files = { home: 'index.html', privacy: 'privacy.html', support: 'support.html', terms: 'terms.html' };
const destination = (locale, page) => `${config.origin}${locale.path}${page === 'home' ? '' : files[page]}`;
const urls = [];

for (const locale of config.locales) {
  const text = JSON.parse(await readFile(path.join(root, 'locales', `${locale.code}.json`), 'utf8'));
  const baseline = JSON.parse(await readFile(path.join(root, 'locales', `${config.defaultLocale}.json`), 'utf8'));
  const check = (base, value, key = locale.code) => {
    if (typeof base === 'string' && (typeof value !== 'string' || !value.trim())) throw new Error(`Missing translation: ${key}`);
    if (Array.isArray(base)) {
      if (!Array.isArray(value) || value.length !== base.length) throw new Error(`Translation array mismatch: ${key}`);
      base.forEach((item, i) => check(item, value[i], `${key}.${i}`));
    } else if (base && typeof base === 'object') {
      for (const k of Object.keys(base)) check(base[k], value?.[k], `${key}.${k}`);
    }
  };
  check(baseline, text);
  const c = text.common;
  const screenshotIds = locale.screenshots ?? config.screenshots;
  const prefix = locale.path ? '../'.repeat(locale.path.split('/').filter(Boolean).length) : '';
  const asset = (name) => `${prefix}assets/${name}`;
  const href = (page) => page === 'home' ? './' : files[page];
  const rich = (html) => html.replace(/\{\{(contactUrl|contactLabel|privacyUrl|supportUrl|termsUrl)\}\}/g, (_, key) => ({ contactUrl: config.contact.url, contactLabel: config.contact.handle, privacyUrl: href('privacy'), supportUrl: href('support'), termsUrl: href('terms') }[key]));
  const photo = (id, alt) => {
    const [width, height] = { 'after-school': [680, 565], friendship: [311, 1000], 'sticker-diary': [680, 959] }[id];
    return `<img src="${asset(`photos/${id}.webp`)}" alt="${escape(alt)}" width="${width}" height="${height}" loading="lazy" decoding="async">`;
  };
  const screen = (index, { decorative = false, eager = false } = {}) => {
    const id = screenshotIds[index];
    return `<img src="${asset(`screenshots/${id}-480.webp`)}" srcset="${asset(`screenshots/${id}-480.webp`)} 480w, ${asset(`screenshots/${id}-720.webp`)} 720w" sizes="${decorative ? '(min-width: 960px) 240px, 45vw' : '(min-width: 1100px) 215px, (min-width: 600px) 30vw, 40vw'}" width="480" height="1041" alt="${decorative ? '' : escape(text.home.machines[index].alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  };
  const faq = (items) => `<div class="faq-list">${items.map((f) => `<details><summary>${escape(f.question)}<span aria-hidden="true">+</span></summary><p>${escape(f.answer)}</p></details>`).join('')}</div>`;
  const sections = (items) => items.map((s) => `<section id="${s.id}"><h2>${escape(s.title)}</h2>${rich(s.body)}${s.rows ? `<div class="data-cards">${s.rows.map((r) => `<article class="data-card"><h3>${escape(r.name)}</h3><p>${escape(r.data)}</p><p class="data-purpose">${escape(r.purpose)}</p></article>`).join('')}</div>${rich(s.after)}` : ''}</section>`).join('');

  for (const page of Object.keys(files)) {
    const t = text[page];
    const current = (key) => key === page ? ' aria-current="page"' : '';
    const langLinks = config.locales.length === 1
      ? `<span class="language" aria-label="${escape(c.languageLabel)}"><span aria-hidden="true">◎</span> ${escape(locale.label)}</span>`
      : `<nav class="language-links" aria-label="${escape(c.languageLabel)}">${config.locales.map((l) => `<a href="${destination(l, page)}" lang="${l.lang}" ${l.code === locale.code ? 'aria-current="true"' : ''}>${escape(l.label)}</a>`).join('')}</nav>`;
    const header = `<a class="skip-link" href="#main">${escape(c.skip)}</a>
      <header class="site-header wrap">
        <a class="brand" href="${href('home')}" aria-label="${escape(c.home)}"><img src="${asset('kikoo-icon-small.png')}" width="48" height="48" alt=""><span class="wordmark">kikoo<span>selfie club</span></span></a>
        <nav class="site-nav" aria-label="${escape(c.home)}"><a href="${href('home')}#about">${escape(c.nav[0])}</a><a href="${href('home')}#play">${escape(c.nav[1])}</a><a href="${href('privacy')}"${current('privacy')}>${escape(c.nav[2])}</a><a href="${href('support')}"${current('support')}>${escape(c.nav[3])}</a></nav>${langLinks}
      </header>`;
    const footer = `<footer class="site-footer wrap"><div class="footer-top"><a class="brand" href="${href('home')}"><img src="${asset('kikoo-icon-small.png')}" alt="" width="40" height="40"><span class="wordmark">kikoo<span>selfie club</span></span></a><p>${escape(c.footerNote)}</p><span class="footer-heart">${heart}</span></div><div class="footer-bottom"><p>© ${config.updated.slice(0, 4)} ${escape(config.operator)} · Kikoo Selfie Club</p><nav aria-label="${escape(c.terms)}"><a href="${config.contact.url}">${escape(config.contact.handle)}</a><a href="${href('support')}"${current('support')}>${escape(c.support)}</a><a href="${href('privacy')}"${current('privacy')}>${escape(c.privacy)}</a><a href="${href('terms')}"${current('terms')}>${escape(c.terms)}</a></nav></div></footer>`;
    let body;
    if (page === 'home') {
      body = `<main id="main">
        <section id="about" class="hero wrap">
          <div class="hero-copy"><p class="eyebrow pill"><span aria-hidden="true">✳</span> ${escape(t.eyebrow)}</p><h1>${escape(t.heading[0])}<br><span>${escape(t.heading[1])}</span></h1><p class="hero-intro">${lines(t.intro)}</p><p class="hero-tag">${escape(t.heroTag)}</p><div class="hero-actions"><a class="button" href="#play">${escape(t.primary)} <span aria-hidden="true">↘</span></a><a class="privacy-shortcut" href="${href('privacy')}">${heart}${escape(t.secondary)}</a></div></div>
          <div class="hero-collage" role="img" aria-label="${escape(t.collageLabel)}"><span class="doodle doodle-star">${star}</span><div class="hero-shot shot-left">${screen(1, { decorative: true })}</div><div class="hero-shot shot-right">${screen(4, { decorative: true })}</div><div class="hero-shot shot-center">${screen(2, { decorative: true, eager: true })}</div><span class="collage-note">${escape(t.collageNote)} ${heart}</span><span class="collage-seal">${t.seal.map(escape).join('<br>')}</span><span class="doodle doodle-heart">${heart}</span></div>
        </section>
        <div class="joy-ribbon" aria-label="${escape(t.heroTag)}"><div class="wrap">${t.ribbon.map((r) => `<span>${escape(r)}</span><span class="ribbon-star" aria-hidden="true">✳</span>`).join('')}</div></div>
        <section id="play" class="gallery-section wrap section-space"><div class="section-heading"><p class="eyebrow">${escape(t.galleryEyebrow)}</p><h2>${escape(t.galleryTitle)} <span class="heading-star" aria-hidden="true">✳</span></h2><p>${escape(t.galleryIntro)}</p></div><div class="machine-grid">${t.machines.map((m, i) => `<article class="machine-card"><a class="screen-link" href="${asset(`screenshots/${screenshotIds[i]}-720.webp`)}" aria-label="${escape(`${m.name} · ${c.screenLink}`)}">${screen(i)}<span class="screen-zoom" aria-hidden="true">↗</span></a><div class="machine-copy"><p class="machine-number">0${i + 1} <span>♡</span></p><h3>${escape(m.name)}</h3><p class="machine-tag">${escape(m.tag)}</p><p>${escape(m.description)}</p></div></article>`).join('')}</div><p class="screen-note">${escape(c.screenNote)}</p></section>
        <section class="memory-section section-space"><div class="wrap memory-layout"><div class="photo-board"><span class="paper-tape" aria-hidden="true"></span><div class="memory-photo memory-photo-one">${photo('after-school', t.photoAlts[0])}</div><div class="memory-photo memory-photo-two">${photo('friendship', t.photoAlts[1])}</div><div class="memory-photo memory-photo-three">${photo('sticker-diary', t.photoAlts[2])}</div><p class="photo-caption">${escape(t.photoCaption)} ${heart}</p></div><div class="memory-copy"><p class="eyebrow">${escape(t.storyEyebrow)}</p><h2>${lines(t.storyTitle)}</h2><p class="section-intro">${escape(t.storyIntro)}</p><div class="memory-features">${t.features.map((f, i) => `<article><span class="feature-number">0${i + 1}</span><div><h3>${escape(f.title)}</h3><p>${escape(f.body)}</p></div></article>`).join('')}</div></div></div></section>
        <section id="privacy-first" class="privacy-section wrap section-space"><div class="privacy-panel"><div class="privacy-heading"><span class="privacy-heart">${heart}</span><p class="eyebrow">${escape(t.privacyEyebrow)}</p><h2>${lines(t.privacyTitle)}</h2></div><div class="privacy-copy"><p>${escape(t.privacyBody)}</p><p class="small-copy">${escape(t.privacyNote)}</p><a class="text-link" href="${href('privacy')}">${escape(t.privacyLink)} <span aria-hidden="true">↗</span></a></div></div></section>
        <section class="faq-section wrap"><div class="section-heading"><p class="eyebrow">${escape(t.faqEyebrow)}</p><h2>${escape(t.faqTitle)}</h2></div>${faq(t.faqs)}</section>
        <section class="closing wrap section-space"><span class="closing-star" aria-hidden="true">✳</span><p class="eyebrow">${escape(t.closingEyebrow)}</p><h2>${lines(t.closingTitle)}</h2><p>${escape(t.closingBody)}</p><a class="button" href="${config.contact.url}">${escape(t.closingLink)} <span aria-hidden="true">↗</span></a></section>
      </main>`;
    } else if (page === 'support') {
      body = `<main id="main" class="wrap document-page"><div class="document-intro"><p class="eyebrow">${escape(t.eyebrow)}</p><h1>${lines(t.heading)}</h1><p class="lede">${escape(t.intro)}</p><a class="button" href="${config.contact.url}">${escape(t.contactLabel)} <span aria-hidden="true">↗</span></a><a class="contact-address" href="${config.contact.url}">${escape(config.contact.handle)}</a></div><div class="document-layout"><aside class="support-note"><span aria-hidden="true">♡</span><h2>${escape(t.noteTitle)}</h2><p>${escape(t.note)}</p></aside><div class="policy-content"><section id="purchases"><h2>${escape(t.purchasesTitle)}</h2><ol class="steps">${t.purchaseSteps.map((s) => `<li>${escape(s)}</li>`).join('')}</ol><p>${escape(t.purchaseNote)}</p></section><section><h2>${escape(t.refundTitle)}</h2><p>${escape(t.refundBody)}</p><a class="text-link" href="https://reportaproblem.apple.com/">${escape(t.refundLink)} ↗</a></section><section><h2>${escape(t.faqTitle)}</h2>${faq(t.faqs)}<p><a class="text-link" href="${config.contact.url}">${escape(t.privacyLink)} ↗</a></p><a href="${href('privacy')}">${escape(t.policyLink)}</a></section></div></div></main>`;
    } else {
      body = `<main id="main" class="wrap document-page"><div class="document-intro"><p class="eyebrow">${escape(t.eyebrow)}</p><h1>${lines(t.heading)}</h1><p class="lede">${escape(t.intro)}</p><p class="policy-meta"><time datetime="${config.updated}">${escape(c.updated)}</time></p></div>${t.summary ? `<aside class="policy-summary"><h2>${escape(t.summaryTitle)} ${heart}</h2><ul>${t.summary.map((s) => `<li>${escape(s)}</li>`).join('')}</ul></aside>` : ''}<div class="document-layout"><nav class="contents-nav" aria-label="${escape(c.toc)}"><p>${escape(c.toc)}</p>${t.sections.map((s) => `<a href="#${s.id}">${escape(s.title)}</a>`).join('')}</nav><article class="policy-content">${sections(t.sections)}</article></div><a class="back-home" href="${href('home')}">← ${escape(c.backHome)}</a></main>`;
    }
    const canonical = destination(locale, page);
    urls.push(canonical);
    const output = `<!doctype html>
<!-- Generated by scripts/build.mjs from locales/${locale.code}.json. Edit the source, then run node scripts/build.mjs. -->
<html lang="${locale.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${escape(t.description)}"><meta name="theme-color" content="#fffaf4"><title>${escape(t.title)}</title><link rel="canonical" href="${canonical}">${config.locales.map((l) => `<link rel="alternate" hreflang="${l.lang}" href="${destination(l, page)}">`).join('')}<link rel="alternate" hreflang="x-default" href="${destination(config.locales.find((l) => l.code === config.defaultLocale), page)}"><meta property="og:type" content="website"><meta property="og:locale" content="${locale.ogLocale || locale.lang}"><meta property="og:site_name" content="${config.brand}"><meta property="og:title" content="${escape(t.title)}"><meta property="og:description" content="${escape(t.description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${config.origin}assets/share-card.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${escape(text.home.title)}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="${asset('kikoo-icon-small.png')}" type="image/png"><link rel="stylesheet" href="${prefix}styles.css"></head><body>${header}${body}${footer}</body></html>\n`;
    await mkdir(path.join(root, locale.path), { recursive: true });
    await writeFile(path.join(root, locale.path, files[page]), output.replaceAll('><', '>\n<'));
  }
}
await writeFile(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url}</loc><lastmod>${config.updated}</lastmod></url>`).join('\n')}\n</urlset>\n`);
await writeFile(path.join(root, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${config.origin}sitemap.xml\n`);
console.log(`Built ${urls.length} static pages (${config.locales.map((l) => l.code).join(', ')}), sitemap.xml and robots.txt.`);
