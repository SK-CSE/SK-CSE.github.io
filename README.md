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

The build copies the static site into `dist/`. The root files also work directly on GitHub Pages. Enable Pages for the branch and directory you intend to publish, or deploy the contents of `dist/` with your existing workflow. The repository remote is `SK-CSE/SK-CSE.github.io`; site publication is controlled by its GitHub Pages settings.

## Content and design

- `index.html`: identity, homepage copy, links, and illustrations.
- `styles.css`: responsive layout, navy/blue palette, animation, reduced-motion and print styles.
- `compact.css`: compact spacing, perspective workspace, project entrances, and tabbed approach layout.
- `app.js`: scroll-linked and keyboard-accessible tabs, navigation, case-study dialogs, and LinkedIn contact links.
- `motion.js`: bounded animation calculations, also exercised directly by the unit tests.
- `assets/favicon.svg`: vector monogram.
- `scripts/`: dependency-free preview server and static build.

Theme tokens are at the top of `styles.css`; illustration colors also live in inline SVG and component styles. The current palette is midnight navy `#0b1020`, electric blue `#8caaff`, cool white `#f2f5ff`, and a pale blue contact panel `#c3d4ff`.

Google Fonts supplies DM Sans for regular text and JetBrains Mono only for the formerly italic accents: emphasized heading phrases, the About signoff, and the monogram. Technical labels retain their original system monospace stack. Local fallbacks keep the site usable if Google Fonts is blocked; self-host the licensed fonts if a fully offline setup is needed.

## Replace before publishing

The identity, location, and social destinations are taken from the original public portfolio. The 11+ years of experience is supplied by Saurabh. The About section emphasizes architecture, technology decisions, and team enablement instead of a fixed list of languages and tools. Contact invitations direct visitors to LinkedIn; the site displays no phone number or email address. The leadership prose is proposed copy for review, not independently verified biographical evidence.

Both case studies are explicitly labeled illustrative concepts. Their detailed architecture proposals are in `caseStudies` in `app.js`. Replace these with approved real projects and verified outcomes when available. No employers, project results, client endorsements, or performance metrics have been invented. The monogram is an intentional graphic, not a stock photograph presented as Saurabh.

Update the `og:url` if publishing somewhere other than `https://sk-cse.github.io/`.

## Interaction and accessibility

- Native scrolling, anchor navigation, and a scroll-position reading indicator.
- A 3D architecture workspace settles into a front-facing view during the natural hero scroll. The project cards straighten as they enter the viewport.
- The approach shares one panel between three perspectives. A short sticky sequence advances the tabs and diagram over 240 pixels of desktop scrolling or 180 pixels on phones; scrolling back reverses it. Clicks and arrow/Home/End keys also select tabs.
- Manually selected tabs remain selected until scrolling resumes. Content containing keyboard focus is never automatically hidden.
- Reduced motion disables the automatic sequence and pinning, keeps the direct tab controls, and settles all decorative transforms. Without JavaScript, all three chapters are visible. Printing also includes all three chapters.
- Decorative animations and reveals respect `prefers-reduced-motion`; core copy is visible without JavaScript.
- Keyboard-accessible mobile navigation and native dialogs, with Escape dismissal and restored focus.
- Work, contact, and case-study invitations open the LinkedIn profile in a new tab and invite visitors to connect or follow. These links do not automatically submit connection or follow requests. A LinkedIn-generated personal Follow link can be added when supplied.

The static server is a local preview tool and binds only to loopback. Use a static host for production.

## Branch convention

Use `feature/…` or another user-approved prefix. Never use `codex/` in branch names.

## Design versions

The initial blue redesign is saved on `feature/engineering-leader-redesign` at `bcc7973`. The compact animation experiment is on `feature/compact-scroll-experiment`.

The perspective motion takes inspiration from [Framer University's Fey resource](https://framer.university/resources/fey-website-in-framer), implemented here with original HTML/SVG artwork and native browser transforms. No Framer runtime, copied product images, or animation dependencies are used.
