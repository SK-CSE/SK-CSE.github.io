# Saurabh Kumar — portfolio

A lightweight portfolio focused on architecture, engineering leadership, and applied AI. Built with semantic HTML, CSS, native SVG illustrations, and browser JavaScript. No framework or package dependencies are required.

## Preview

Requires Node.js 20 or newer.

```sh
npm run dev -- --port 4175
```

Open http://127.0.0.1:4175. Refresh the browser after edits; the preview server does not use hot reload.

```sh
npm test
npm run build
```

The build copies the static site into `dist/`. The root files also work directly on GitHub Pages. Enable Pages for the branch and directory you intend to publish, or deploy the contents of `dist/` with your existing workflow. This workspace has no configured remote; nothing has been published.

## Content and design

- `index.html`: identity, homepage copy, links, and illustrations.
- `styles.css`: responsive layout, navy/blue palette, animation, reduced-motion and print styles.
- `app.js`: scrolling narrative, navigation, case-study dialogs, and email copy feedback.
- `assets/favicon.svg`: vector monogram.
- `scripts/`: dependency-free preview server and static build.

Theme tokens are at the top of `styles.css`; illustration colors also live in inline SVG and component styles. The current palette is midnight navy `#0b1020`, electric blue `#8caaff`, cool white `#f2f5ff`, and a pale blue contact panel `#c3d4ff`.

Google Fonts supplies DM Sans and Instrument Serif, with local system fallbacks. The site remains usable if that service is blocked; self-host the licensed fonts if a fully offline setup is needed.

## Replace before publishing

The identity, location, 10+ years of experience, stack, email, and social destinations are taken from the original public portfolio. The leadership prose is proposed copy for review, not independently verified biographical evidence.

Both case studies are explicitly labeled illustrative concepts. Their detailed architecture proposals are in `caseStudies` in `app.js`. Replace these with approved real projects and verified outcomes when available. No employers, project results, client endorsements, or performance metrics have been invented. The monogram is an intentional graphic, not a stock photograph presented as Saurabh.

Update the `og:url` if publishing somewhere other than `https://sk-cse.github.io/`.

## Interaction and accessibility

- Native scrolling, anchor navigation, and a scroll-position reading indicator.
- A sticky diagram updates with the three narrative chapters, without hijacking scrolling.
- Decorative animations and reveals respect `prefers-reduced-motion`; core copy is visible without JavaScript.
- Keyboard-accessible mobile navigation and native dialogs, with Escape dismissal and restored focus.
- Email remains a working `mailto:` link even when clipboard permission is denied.

The static server is a local preview tool and binds only to loopback. Use a static host for production.

## Branch convention

Use `feature/…` or another user-approved prefix. Never use `codex/` in branch names.
