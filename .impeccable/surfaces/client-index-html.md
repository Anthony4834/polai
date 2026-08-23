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
- Composition: a 56-64px masthead over one continuous desktop workspace;
  the source editor owns roughly 58% and the analysis rail 42%, divided by a
  single hairline. On compact screens the same regions stack in task order.
- Memorable moment: hovering an exact source highlight reveals and activates
  its matching finding with the same tone and border.
- Do not literalize: the comp's synthetic policy copy, generated percentage,
  or generated reasons. Runtime content remains authoritative.

## Built-world inventory

| Ingredient | Recorded treatment | Medium |
| --- | --- | --- |
| Page ground | sampled near-white `#FDFCFA` | semantic HTML + CSS |
| Masthead | matte ground, 1px `#E2E2E0` lower rule, no navigation | `header` + CSS |
| Wordmark | heavy workhorse sans, about 28px desktop | semantic text |
| Workspace seam | one 1px cool-gray vertical rule | CSS grid border |
| Source field | dominant, flat, no card shell; 18-20px prose at 1.75 line height | textarea + synchronized semantic overlay |
| Highlight, primary | cool graphite `#E4E8EA`, `#6F7B82` edge, indexed active state | inline overlay spans + CSS |
| Highlight, secondary | warm stone `#ECE7E2`, `#81746A` edge | inline overlay spans + CSS |
| Ink | near-black `#171A18`; muted metadata | semantic text + CSS |
| Accent | sampled mineral green `#315443` | CSS token |
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
- Do not communicate findings by color alone; pair tone with the exact quoted
  phrase and explicit labels.
- Raw-submission persistence remains outside this redesign.
