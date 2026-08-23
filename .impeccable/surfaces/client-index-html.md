---
version: 1
slug: "client-index-html"
primary_target: "client/index.html"
related_targets: ["client/src/components/main.tsx","client/src/components/input.tsx","client/src/components/analysis.tsx","client/src/index.css"]
---

# PolAI review workspace

## Scope and mode

- Scope: the single client workspace rooted at `client/index.html`.
- Visitor mode: Operate.
- Audience: people reviewing prose for United States political bias.
- Job: enter text, analyze it, connect each finding to its exact source span,
  and apply the suggested neutral wording.
- Primary action: Analyze text.
- Preserve: exact highlights, summary, explanations, bulk neutral replacement,
  loading, errors, and responsive behavior.

## Chosen direction

- Direction: Condition Report, grounded direction 4 from seed `3d60cd0a`.
- Approved comp: `.impeccable/mocks/decision/assigned.png`.
- Composition: a compact descriptive masthead over one continuous desktop workspace;
  the source editor owns roughly 58% and the analysis rail 42%, divided by a
  single hairline. On compact screens the same regions stack in task order.
- Memorable moment: hovering a finding row activates its exact source span;
  hovering that source span smoothly reveals and activates the matching row
  with the same tone and border, with an instant reduced-motion fallback.
- Do not literalize: the comp's synthetic policy copy, generated percentage,
  or generated reasons. Runtime content remains authoritative.

## Built-world inventory

| Ingredient | Recorded treatment | Medium |
| --- | --- | --- |
| Page ground | warm paper `#FDFCFA` or charcoal `#171916`, selected from system preference by default | semantic HTML + CSS |
| Masthead | matte ground, one lower rule, wordmark, product description, and native System/Light/Dark selector | `header` + CSS |
| Wordmark | heavy workhorse sans, about 28px desktop | semantic text |
| Workspace seam | one 1px cool-gray vertical rule | CSS grid border |
| Source field | dominant, flat, no card shell; 18-20px prose at 1.75 line height | textarea + synchronized semantic overlay |
| Highlight, primary | cool graphite `#E4E8EA`/`#30383C`, with `#6F7B82`/`#839199` edge, indexed active state | inline overlay spans + CSS |
| Highlight, secondary | warm stone `#ECE7E2`/`#3A3430`, with `#81746A`/`#A09185` edge | inline overlay spans + CSS |
| Ink | near-black `#171A18` or off-white `#F1F0EB`; muted metadata | semantic text + CSS |
| Accent | mineral green `#315443` in light and `#9FC5AD` in dark | CSS token |
| Editor focus | quiet mineral-tinted paper shift plus a short internal mineral rule above the writing line; no perimeter outline | CSS |
| Editor action | compact outlined rectangle at the editor's lower right | native button + CSS |
| Analysis summary | percentage, one sentence, hairline separation; no gauge | semantic headings and paragraphs |
| Findings | source-linked rows separated by rules; selectable phrase, reason, neutral wording | semantic list items |
| Empty state | deliberate quiet with one instruction, no illustration | semantic text |
| Motion | only 120-160ms focus/active-state transitions; none under reduced motion | CSS |
| Shipping rasters | none; the approved comp is review evidence only | accepted omission |

## Component grammar

- Corners: 0-4px; pills are reserved for short bias-category labels.
- Lines: 1px cool-gray separators; 1px graphite/stone finding outlines.
- Elevation: none.
- Type ramp: 28px wordmark, 18px region titles, 16px UI/body, 14px
  metadata, 44-52px percentage.
- Density: generous reading room in the source; compact, scannable analysis.
- Selection: source and analysis content remain copyable; chrome, headings,
  counts, category tags, and button labels do not select.

## Constraints and unresolved decisions

- Do not introduce imagery, navigation, saving, history, or new product claims.
- System theme is the default. Persist explicit Light or Dark choices and apply
  them before first paint.
- Do not communicate findings by color alone; pair tone with the exact quoted
  phrase and explicit labels.
- Raw-submission persistence remains outside this redesign.
