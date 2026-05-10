# Main Character — Design System & Site Direction

A working design document for the Main Character marketing site. Read top-to-bottom: it starts with the brand idea, then turns that idea into a token system (color, type, grid, motion), then walks the page section-by-section with concrete layout recipes.

---

## 1. Brand Idea (the thing that everything serves)

The product is a **service & product studio** named *Main Character*. The word does the heavy lifting — it's about putting clients in the lead role. Every design decision should pass one test:

> Does this make the visitor feel like they just walked onto a set with the spotlight on them?

That gives us three governing aesthetics, in priority order:

1. **Cinematic** — high contrast, wide gutters, breathing room, "the camera is pointed at you."
2. **Editorial** — confident typography, magazine-grade hierarchy, restrained color, intentional whitespace.
3. **Terminal / Pixel** — the existing ASCII wordmark sets a retro-computational counter-voice that keeps it from feeling like a luxury fashion site. This is our "studio in the back room shipping product" voice.

These three aren't equal weights. Cinematic is the **stage**. Editorial is the **typography of the program notes**. Terminal/Pixel is the **signature** — used like a watermark, not a wallpaper. If you find yourself reaching for VT323 in a body paragraph, you've gone too far.

---

## 2. The Hero — what's working and why

Read the hero ([components/Hero.tsx](components/Hero.tsx), [components/AsciiWordmark.tsx](components/AsciiWordmark.tsx)) as the **reference implementation** of the system. Everything below extends it.

What's doing the work:

| Element | Role | Don't break |
|---|---|---|
| `#050505` near-black ground | Stage / void | Don't use pure `#000` — the dot grid disappears and contrast feels harsh. |
| 5px radial dot grid at 7% white | Texture, "graph paper of the studio" | Keep dot density consistent across all dark sections (5px, 7% alpha). |
| ASCII wordmark, cursor-reactive physics | Identity moment | This is the *signature*. It appears **once** on the page — never repeat it as a pattern. |
| VT323 inner chars + edge decay | Pixel-typewriter character | Use VT323 only for: hero, section numerals, occasional eyebrow accents. |
| IBM Plex Mono, 11px, 0.18em tracked, UPPERCASE | "System voice" | Eyebrows, labels, nav, captions, metadata — anything that's *meta* about the content, not the content itself. |
| Four-corner layout (logo TL, contact TR, eyebrow BL, tagline BR) | Cinematic framing | Re-use this corner-grid framing on at least two more sections. |

The hero is a **monochrome anchor**. That's deliberate — it lets us spend color budget on the rest of the page without it feeling chaotic.

---

## 3. Color System

The brief asked for "more color" — but a studio site earns the right to color by being disciplined about it. The rule: **two anchors, one accent, two supports, one signal.** Six colors total, in tokens.

### Palette

```
Anchors (90% of the page)
  --ink         #0A0A0A   true near-black, body text on light surfaces
  --void        #050505   hero/dark sections ground (existing)
  --paper       #FAFAF9   warm off-white, light section ground (existing)
  --cream       #F1ECE3   second light surface, used to break up paper

Accent (8% of the page — the spotlight)
  --spotlight   #FFD23F   warm stage-light yellow, the "main character" color

Supports (used in pairs with anchors)
  --ember       #E5532D   cinematic warm-red, for CTAs and "live" markers
  --ink-50      #6B6B6B   muted body / captions on paper (existing as --mute)
  --line        #1A1A1A   hairlines on dark
  --line-paper  #E5E5E3   hairlines on paper (existing)

Signal (1–2% — used for state, not decoration)
  --signal      #00E08F   "shipping" / online / success cue
```

### Why these and not generic studio colors

- **Spotlight `#FFD23F`** — warmer than a tech-yellow, cooler than a school-bus yellow. It reads like a gel light on a stage, which is on-brief for "main character." Avoid `#FFEB3B` (too synthetic) and `#F4C430` (too retro / mustard).
- **Ember `#E5532D`** — a "kodachrome red" that pairs with the yellow without the page becoming a hazard sign. Use for CTAs, hover underlines, the "shipping" status dot, and one big editorial pull-quote per page max.
- **Cream `#F1ECE3`** — a second light surface so we can stack two light sections without them looking the same. The transition `paper → cream → paper` is the rhythm.

### Color application rules

1. **One accent per fold.** Spotlight OR ember in a single viewport, not both. They fight each other.
2. **No accent on dark.** Spotlight and ember belong on `paper`/`cream`. On `void`, color comes from imagery and video, not flat fills.
3. **Hover = accent.** Default link is `--ink`; hover underlines in `--ember`. Default eyebrow is `--ink-50`; hover is `--ink`.
4. **Buttons are typographic, not chips.** A primary CTA is `--ink` text on `--spotlight` block, no rounded corners (4px max). A secondary CTA is `--ink` text with `--ink` 1px underline, no fill.
5. **Section bands.** Stack of grounds creates rhythm: `void → paper → cream → void → paper → ember(full-bleed) → void(footer)`. Color isn't applied per-component — it's the section background.

### Section band map (top to bottom)

```
01 Hero               void     (existing)
02 Manifesto          paper    light, editorial breath after the dark fold
03 Showreel           void     pinned video, dark again — cinema room
04 Services           cream    warm light, dense list
05 Selected Work      paper    case study cards
06 Products           void     dark grid, "the lab"
07 Process            cream    timeline, lighter
08 Pull-quote         ember    full-bleed color moment, big serif quote
09 Contact / CTA      paper    spotlight CTA block
10 Footer             void     close on the same note we opened
```

This is the page's color score. Even if we cut a section, we don't break the alternation.

---

## 4. Typography System

We already load **VT323** and **IBM Plex Mono** in [app/layout.tsx](app/layout.tsx:5). We need one addition for editorial body and section headers.

### The four voices

| Voice | Family | Weight | Use |
|---|---|---|---|
| **Identity** | VT323 | regular | Hero wordmark only. Optionally a single section numeral (`/01`, `/02`) per band. |
| **System** | IBM Plex Mono | 400 / 500 | All meta text: eyebrows, labels, nav, captions, indices, timestamps, footer. Always **UPPERCASE**, tracked `0.18em`. |
| **Editorial** | **Instrument Serif** *(add)* | 400 + 400 italic | All section headlines, pull-quotes, case-study titles. Free, on Google Fonts, pairs well with Plex Mono. Italic is real italic — use it for the *"character"* style flourish in our wordmark and headlines. |
| **Reading** | Inter | 400 / 500 | Body copy, project descriptions, paragraphs longer than 12 words. (Already loaded as font fallback for the ASCII canvas.) |

If Instrument Serif feels too literary, the alternates are **Migra** (paid, Pangram), **GT Sectra** (paid), or **Tiempos Headline** (paid). Free fallback that holds the same vibe: **Fraunces** (variable, more stylistic options) — but *pick one* and stop. Don't ship both.

### Type scale (clamp-based, mobile → desktop)

```
display-xl   clamp(56px, 9vw, 144px)    Editorial section openers ("Selected Work")
display-lg   clamp(40px, 6vw, 96px)     Pull-quotes
display-md   clamp(32px, 4.5vw, 64px)   Case study titles
heading-lg   clamp(24px, 2.4vw, 36px)   Sub-headers
heading-md   20px / 28px                Card titles
body-lg      18px / 28px                Lead paragraphs (manifesto)
body         16px / 26px                Default body
caption      14px / 22px                Project descriptions
meta         11px / 16px tracked 0.18em System voice (uppercase)
meta-sm      10px / 14px tracked 0.20em Footer / fine print
```

### Type rules of thumb

- **Mono is always uppercase, tracked, 11–12px.** Never use Plex Mono at 16px + lowercase — it just looks like prose code.
- **Editorial serif is the only thing allowed to be huge.** If a number wants to be 144px, it gets serif. The pixel font owns the wordmark; everything else big is serif.
- **Italic is reserved.** "character" in the logo is italic. Italic in a headline = a deliberate accent on one word, max two. Don't italicize a whole headline.
- **Numerals.** Section numbers are mono (`/01 — Services`). Big stat numbers are serif.
- **Line length.** Reading paragraphs cap at ~62ch. Manifesto block can go to ~75ch since it sits alone.

---

## 5. Grid, Spacing, Layout

The hero is implicitly on a **12-column grid with generous margins** (`md:px-8`, `md:gap-8`). Codify it.

### Grid

- **12 columns**, gutter `24px` mobile / `32px` desktop.
- **Outer margin** `20px` mobile / `40px` desktop / `64px` for `>1440px`.
- **Max content width** `1600px` (matches hero canvas cap).
- **Baseline** 8px scale for spacing. Section vertical padding: `96px / 144px / 192px` (mobile / md / lg).

### The corner-anchor pattern

The hero anchors content to four corners. Re-use this on three more sections:

- **Manifesto**: section number `/02 — MANIFESTO` top-left (mono), date/version top-right, headline center, eyebrow tag bottom-left.
- **Showreel**: timecode top-left (`00:00 / 01:30`), label "NOW PLAYING" top-right, video center.
- **Footer**: logo bottom-left, sitemap bottom-right, "Made in [city]" bottom-center.

This corner-grid is a recurring framing device — it's part of the brand language now.

### Hairlines

1px lines in `--line-paper` (light bands) or `--line` (dark bands) divide sections, separate columns in dense lists, and underline links on hover. Never use shadow.

---

## 6. Section-by-section design

### 01. Hero (existing)

Keep as-is. One thing to consider: a tiny `SCROLL ↓` mono label, bottom-center, fading at 200px scroll — it gives an explicit invite to keep going. Optional.

### 02. Manifesto

**Ground:** `paper`. Padding `192px` top/bottom on desktop.

**Layout:** Single editorial block, asymmetric.

```
┌─[ /02 — MANIFESTO ]──────────────[ V01 · 2026 ]┐
│                                                │
│                                                │
│         We design services and ship           │
│         products for founders, teams,         │
│         and brands who refuse to play         │
│         a *supporting* role.                  │
│                                                │
│                                                │
│ [ EYEBROW: PHILOSOPHY ]                        │
└────────────────────────────────────────────────┘
```

- Headline: Instrument Serif, `display-xl`, left-aligned starting at column 2, ending at column 10 (8 col wide).
- The word *supporting* is italic and underlined in `--ember`.
- Top corners: mono labels (section number, version stamp).
- Bottom-left: mono eyebrow.
- No body paragraph — let the headline carry it. If we need more, add a single 65ch paragraph below at `body-lg`.

**Why this works:** after the dense, busy hero, this is *negative space as drama*. The cut to white and a single sentence makes the visitor stop.

### 03. Showreel — the "video scroll thing"

This is the section you specifically called out. Two design options; I recommend **Option A** as primary.

**Option A — Pinned scroll-scrubbed video** (Apple-style)

- Section is `100vh × 4` tall (4 viewport heights of scroll).
- Inside, a `position: sticky; top: 0` container holds a `<video muted playsinline preload="metadata">`.
- As the user scrolls, we drive `video.currentTime` from scroll progress (no autoplay — frame-accurate scrubbing). Use `requestAnimationFrame` + a debounced scroll listener, OR a library like `framer-motion`'s `useScroll` + `useTransform`.
- Ground: `void`. Same dot grid as hero, faded to 4% alpha so the video reads cleanly.
- Corner labels: top-left `00:00 / 01:30` (live timecode, updates with scroll), top-right `NOW PLAYING — REEL 2026`, bottom-left `/03 — SHOWREEL`, bottom-right rotating client list (`ACME · KODA · NORTH · 14 MORE`).
- Inside the video frame: subtle 1px `--line` border, no rounded corners.
- After the pinned phase ends (`100vh × 4`), scroll continues normally into Services.

**Asset cadence:** the video is a tightly cut 60–90 second studio reel — fragments of work, fast cuts. **No audio**, captions burned in for the keywords. This is critical: scroll-scrubbed video can't have audio that makes sense.

**Performance:**
- Encode H.265 + H.264 fallback, both ≤ 6 MB at 1080p, 24fps.
- `preload="metadata"` only.
- Skip the section entirely on `prefers-reduced-motion: reduce` — replace with a 3×3 still-image grid.
- Detect mobile and downgrade to **Option B**.

**Option B — Horizontal-scroll case study reel** (mobile fallback / alternative)

- Section is `100vh` tall.
- Inside, a horizontally scrolling track of 6–8 case-study video tiles (each 9:16 or 16:9, 4–6s loops, muted, autoplay).
- The page scroll converts to horizontal scroll while pinned.
- Each tile has a mono label overlay: client name + year + 2-word descriptor.

I'd ship **A on desktop, B on mobile.** Use `@media (hover: none) and (pointer: coarse)` plus `window.matchMedia` to switch.

### 04. Services

**Ground:** `cream`. Padding `144px / 192px`.

**Layout:** Two-column. Left column is a sticky section header that stays in view while the right column scrolls through services.

```
┌─[ /04 — SERVICES ]───────────────────────────────────────┐
│                                                          │
│  Services.       │  Brand & Identity ─────────────       │
│  (sticky)        │  Logos, systems, guidelines.          │
│                  │  ─────────────────────────────        │
│                  │  Product Design ────────────          │
│                  │  Web, app, dashboard, marketing.      │
│                  │  ─────────────────────────────        │
│                  │  Engineering ───────────────          │
│                  │  Next.js, React, …                    │
│                  │  ─────────────────────────────        │
│                  │  Strategy ──────────────              │
│                  │  Positioning, naming, GTM.            │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

- Left column (`md:col-span-4`): editorial display headline `Services.` and a mono eyebrow above it.
- Right column (`md:col-span-7`, offset by 1): a list of 4–6 services, each row is a hover-expanding accordion.
  - Default: service name (`heading-lg`) + 1-line description (`body`) on the right.
  - On hover/focus: row expands, dotted line draws across to a small image/loop on the right edge, a `+` sign rotates to `×`.
- Hairlines `--line-paper` between rows.
- Sticky behavior on left column should release when the section ends (use `position: sticky; top: 80px`).

### 05. Selected Work

**Ground:** `paper`. Padding `144px / 192px`.

**Layout:** Asymmetric magazine grid — *not* a uniform 3×3 grid (those scream Webflow template).

```
┌──────────────────────────────────────────────────┐
│  Project A (large, 8 col)                       │
│  ┌────────────────┐                             │
│  │                │ ── meta col-3 ──            │
│  │   image/video  │   /001                      │
│  │                │   ACME · 2025               │
│  └────────────────┘   Brand, Web                │
│                                                  │
│                       Project B (medium, 5 col) │
│                       ┌────────────────┐        │
│   meta col-3 ──       │                │        │
│   /002                │    image       │        │
│   KODA · 2025         │                │        │
│   Product             └────────────────┘        │
│                                                  │
│  Project C (small, 4 col)    Project D (4 col) │
│  ...                          ...               │
└──────────────────────────────────────────────────┘
```

- Each project tile: image/video, then below it a meta block with mono `/001`, client + year, and `heading-md` serif title in italic.
- Tile aspect ratios alternate: `4:3`, `3:4`, `16:9`, `1:1`. No uniform grid.
- Hover: image scales `1.02`, mono index turns `--ember`, a 1px underline draws under the title.
- Loop short videos in tiles (4–6s, muted, autoplay). Fall back to stills under reduced motion.
- "View all work →" link at bottom-right, mono, `--ember` arrow.

### 06. Products

**Ground:** `void` (back to dark). Padding `144px / 192px`.

**Layout:** A 2×2 product grid, each tile is a glassy dark card with a soft glow.

- Each card: tile is `void` with a 1px `--line` border, hovered = the border becomes `--spotlight` (10% opacity).
- Inside: pixel-style icon (we can build these in a simple 16×16 grid using the same VT323 vibe), product name (Inter, 24px, medium), one-line description (`--ink-50` on dark = use `#9A9A9A`).
- Top-left of each card: a small "shipping" / "in beta" / "soon" pill. Shipping = `--signal` dot. Beta = `--spotlight` dot. Soon = empty circle.
- This is the **lab voice** — terminal energy.

### 07. Process

**Ground:** `cream`. Padding `144px / 192px`.

**Layout:** A horizontal timeline (4–5 nodes) on desktop, vertical on mobile.

```
01 ─────── 02 ─────── 03 ─────── 04 ─────── 05
LISTEN     SCOPE      DESIGN     SHIP       ITERATE
2 weeks    1 week     4-6 wks    2 wks      ongoing

(short paragraph under each node)
```

- Numbers in editorial serif `display-md`.
- Phase names in mono UPPERCASE.
- Connecting dashed line in `--line-paper`, animates from left to right as the section enters viewport.

### 08. Pull-quote (the color moment)

**Ground:** `--ember` full-bleed. **One line of copy. No padding penny-pinching — give it `192px` top/bottom.**

```
              "We don't do
              supporting roles."
                            — the studio
```

- Instrument Serif italic, `display-xl`, near-white text (`#FFF8F1` not pure white — pure white on ember is too sharp).
- Attribution mono, `meta`, white at 60%, bottom-right corner.

This is the **single bold color moment** of the page. Don't add another full-bleed accent section — it'd dilute this one.

### 09. Contact / CTA

**Ground:** `paper`. Padding `144px / 192px`.

**Layout:** Editorial. Big serif statement + a `--spotlight` CTA block.

```
┌─[ /09 — CONTACT ]────────────────────────────────┐
│                                                  │
│   Take the lead.                                 │
│   Let's design the                               │
│   thing only you                                 │
│   can ship.                                      │
│                                                  │
│   ┌──────────────────────────┐                  │
│   │  START A PROJECT  →      │ ← spotlight bg   │
│   └──────────────────────────┘                  │
│                                                  │
│   Or email founder@maincharacter.one             │
│                                                  │
└──────────────────────────────────────────────────┘
```

- Headline: Instrument Serif, `display-xl`, left-aligned, 4 lines.
- CTA: `--spotlight` background, `--ink` text, 4px corner radius, mono UPPERCASE 12px tracked 0.18em, 24px vertical / 32px horizontal padding. Hover: shifts up 2px and casts a 0/8/24 shadow at 12% opacity.
- Below CTA: a mono mailto link in `--ink-50`, underline on hover.

### 10. Footer

**Ground:** `void`. Padding `96px / 144px`.

**Layout:** Four-column corner-anchored, mirrors the hero.

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   main *character*                               │
│   service & product studio                       │
│                                                  │
│                                                  │
│   © 2026          Sitemap                        │
│   Made in [city]  Work · About · Services · …    │
└──────────────────────────────────────────────────┘
```

- Logo top-left (same as header, italic on "character").
- Sitemap bottom-right.
- Copyright/locale bottom-left.
- Optional: a tiny ASCII glyph in the bottom-right corner (`█▓░` 3-char animated decay) — a small "easter egg" callback to the hero.

---

## 7. Motion Principles

Motion should feel **deliberate** and **mechanical-organic**, not bouncy. Frame it as a camera moving on a dolly track, not a spring toy.

- **Curve.** Default ease is `cubic-bezier(0.2, 0.7, 0.2, 1)` (already in [globals.css](app/globals.css:30)). It's slow-in, fast-middle, slow-out — feels like a film cut.
- **Duration.** UI hover: `120–180ms`. Section reveals: `600–900ms`. Big reveals (hero, manifesto): `1100–1400ms`. Never longer.
- **Stagger.** When multiple elements enter, stagger by `60ms`. More than `120ms` and it feels theatrical.
- **Distance.** Reveal entry distance is `12–24px`. More than that reads as "scrolly animation site" instead of editorial.
- **Reduced motion.** Honor `prefers-reduced-motion: reduce`. Disable: ASCII physics, pinned video scrub, marquees, parallax. Keep: simple opacity fades, hover color changes.
- **One signature motion per page** — the cursor-reactive ASCII. Don't add cursor-followers, magnetic buttons, custom cursors. We have ours.

Specific mechanics worth building:

- **Scroll-driven section reveals**: use `IntersectionObserver` to add a class that triggers `fade-up`. Existing `.fade-up` rule already nailed this.
- **Marquee** for client logos in the showreel section: pure CSS `@keyframes` translateX, paused on hover, GPU-accelerated.
- **Hairline draw-on**: SVG line with `stroke-dasharray` animated to `0` on enter — used for the process timeline and the "draw" under hovered service rows.

---

## 8. Component patterns

### Buttons

- **Primary CTA.** `--spotlight` block, `--ink` text, mono UPPERCASE 12px tracked 0.18em, 4px radius, no border. Padding `16px 24px` or `24px 32px` (large). Hover: lift 2px, ember 1px outline appears.
- **Secondary CTA.** No fill, `--ink` text, 1px `--ink` underline at 0.5 offset. Hover: underline becomes `--ember`.
- **Tertiary / inline link.** Mono UPPERCASE 11px, `--ink-50`, hover: `--ink` + ember underline draws-on left-to-right.

### Cards

- **Work card** (light section): no border, no shadow, image directly on `paper`. Meta block sits below image, indented to the image's left edge.
- **Product card** (dark section): 1px `--line` border (`#1A1A1A`), no fill. Hover: border becomes `--spotlight` at 10% alpha.
- Never use both a border AND a shadow. We're not using shadows on the page (except the CTA hover lift).

### Eyebrows

`/SECTION-NUMBER — SECTION-NAME` in mono UPPERCASE, `--ink-50` on light, `#9A9A9A` on dark. Always 11px tracked 0.18em. Always at the **top-left** of the section.

### Status pills (for products)

Inline-flex, `--line` border 1px, padding `4px 8px`, mono 10px tracked 0.20em. Dot precedes text:
- `● SHIPPING` — dot is `--signal`
- `● BETA` — dot is `--spotlight`
- `○ SOON` — empty 1px ring

---

## 9. Imagery & video direction

- **Real over rendered.** Photos of process — pinned-up sketches, screens with cursor highlights, hands on a keyboard, monitors at 3am. Avoid stock and avoid 3D abstract globs.
- **Color grade.** Slight warm tint (+5 warmth, -3 saturation), filmic contrast curve. Establishes the "stage" feel.
- **Aspect.** Mix of `16:9`, `4:3`, `3:4`, `1:1`. Never `21:9` (too cinema-bar) on tiles.
- **Video.** Muted by default everywhere except a single "play full reel" CTA in the showreel section. Loops 4–6s. No audio. No "click to unmute."
- **No emoji, no flat illustration, no Spline 3D.** Those break the editorial register.

---

## 10. Accessibility

- **Contrast.** All body and meta text passes WCAG AA on its ground. `--ink-50` (`#6B6B6B`) on `paper` is `5.7:1` — passes for `body` but **not** for `meta` at 11px. On dark, use `#9A9A9A` not `#6B6B6B` for the same role.
- **Focus rings.** `outline: 2px solid --spotlight; outline-offset: 2px;` — never `outline: none` without a replacement.
- **Hit targets.** 44×44 minimum. Mono nav links need padding to reach this on mobile.
- **Motion.** Honor `prefers-reduced-motion: reduce` everywhere — already wired in [globals.css](app/globals.css:27). Extend to ASCII physics and scroll-scrubbed video.
- **Alt text.** ASCII canvas already has `aria-label` ([AsciiWordmark.tsx:339](components/AsciiWordmark.tsx:339)). Every project image needs descriptive alt — not "image of website" but "ACME marketing site, hero in editorial serif over warm gradient."
- **Heading order.** One `<h1>` per page (the hero wordmark, semantically). Section openers are `<h2>`. Don't use heading levels for visual sizing.

---

## 11. What to add to the codebase to support this

In approximate order:

1. **Token expansion in [globals.css](app/globals.css)** — add `--spotlight`, `--ember`, `--cream`, `--signal`, `--ink-50`, `--line` (dark) to `@theme`.
2. **Add Instrument Serif** in [layout.tsx](app/layout.tsx) via `next/font/google`, expose as `--font-serif`, register in Tailwind theme.
3. **Build a `Section` component** that handles ground (`void | paper | cream | ember`), section number, eyebrow, and corner-anchored layout — so each section below is consistent.
4. **Build an `Eyebrow`, `SectionNumber`, `MetaLabel` set** — these three appear on every section.
5. **Manifesto, Services, Work, Products, Process, Quote, Contact, Footer** — section components in that order. Static markup, real copy, no CMS yet. Once it looks right, decide if we need MDX or a CMS.
6. **Showreel section last.** It's the most complex and the asset (the actual video) needs to exist before it's worth wiring up the scroll scrubber.

---

## 12. Decisions to make before we write code

These are the ones I want a yes/no on so I'm not designing in circles:

1. **Spotlight yellow vs. cinema red as primary accent.** I'm recommending yellow as primary (warm, optimistic, on-brief for "main character") and ember as secondary. Acceptable?
2. **Add Instrument Serif.** Free, on Google Fonts, ~22KB. OK to add a third font?
3. **Showreel scroll-scrubbed video.** This requires us to actually have a 60–90s reel. Do we have one or is this a placeholder for now?
4. **Pull-quote section.** It's the page's biggest color moment. If we're not ready to commit a single line of copy to a full-bleed red section, we drop it — but the page loses its color climax.
5. **Products grid.** Are there real products to show, or is this section a placeholder? If placeholder, we should cut it from v1 and re-introduce when we ship one.

Once these are answered, we're unblocked to start building section by section.
