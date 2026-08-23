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
- Memorable moment: focusing a numbered finding activates the exact source
  highlight with the same tone and border.
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
| Highlight, primary | sampled mint `#E4EEE5`, darker green edge, indexed active state | inline overlay spans + CSS |
| Highlight, secondary | sampled amber `#FDF2DF`, `#E7BF79` edge | inline overlay spans + CSS |
| Ink | near-black `#171A18`; muted metadata | semantic text + CSS |
| Accent | sampled mineral green `#315443` | CSS token |
| Editor action | compact outlined rectangle at the editor's lower right | native button + CSS |
| Analysis summary | percentage, one sentence, hairline separation; no gauge | semantic headings and paragraphs |
| Findings | numbered rows separated by rules; phrase, reason, neutral wording | ordered list/articles + buttons |
| Empty state | deliberate quiet with one instruction, no illustration | semantic text |
| Motion | only 120-160ms focus/active-state transitions; none under reduced motion | CSS |
| Shipping rasters | none; the approved comp is review evidence only | accepted omission |

## Component grammar

- Corners: 0-4px; no pill containers except a compact status label.
- Lines: 1px cool-gray separators; 1px green/amber finding outlines.
- Elevation: none.
- Type ramp: 28px wordmark, 18px region titles, 16px UI/body, 14px
  metadata, 44-52px percentage.
- Density: generous reading room in the source; compact, scannable analysis.

## Constraints and unresolved decisions

- Do not introduce imagery, navigation, saving, history, or new product claims.
- Do not communicate findings by color alone; pair tone with numbering and
  explicit labels.
- Raw-submission persistence remains outside this redesign.
