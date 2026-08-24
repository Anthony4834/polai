---
name: PolAI
description: A calm, exact writing instrument for source-anchored political-bias review.
colors:
  paper: "#FDFCFA"
  paper-muted: "#F8F7F3"
  ink: "#171A18"
  ink-muted: "#626762"
  ink-faint: "#6F746F"
  mineral: "#315443"
  mineral-dark: "#223D30"
  action-tint: "#E4EEE5"
  action-tint-edge: "#8EAA96"
  focus-surface: "#F4F7F4"
  evidence-cool: "#E4E8EA"
  evidence-cool-edge: "#6F7B82"
  evidence-warm: "#ECE7E2"
  evidence-warm-edge: "#81746A"
  rule: "#E2E2E0"
  rule-strong: "#CCCECA"
  error: "#A33B31"
colors-dark:
  paper: "#171916"
  paper-muted: "#1D201C"
  ink: "#F1F0EB"
  ink-muted: "#A3AAA2"
  ink-faint: "#8C928A"
  mineral: "#9FC5AD"
  mineral-strong: "#B6D7C1"
  mineral-fill: "#315443"
  button-ink: "#8FA597"
  button-text-on-fill: "#D8DDD9"
  action-tint: "#26372D"
  action-tint-edge: "#668774"
  focus-surface: "#202720"
  evidence-cool: "#30383C"
  evidence-cool-edge: "#839199"
  evidence-warm: "#3A3430"
  evidence-warm-edge: "#A09185"
  rule: "#343834"
  rule-strong: "#4A504A"
  error: "#F0A79E"
typography:
  display:
    fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "clamp(2.4rem, 4vw, 4rem)"
    fontWeight: 500
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  headline:
    fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "1.7rem"
    fontWeight: 760
    lineHeight: 1
    letterSpacing: "-0.04em"
  title:
    fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "1.25rem"
    fontWeight: 500
    letterSpacing: "-0.025em"
  body:
    fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "clamp(1.17rem, 1.4vw, 1.36rem)"
    fontWeight: 400
    lineHeight: 1.78
    letterSpacing: "-0.008em"
  label:
    fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "0.75rem"
    fontWeight: 720
    lineHeight: 1
    letterSpacing: "0.06em"
rounded:
  mark: "2px"
  control: "3px"
  pill: "999px"
spacing:
  compact: "8px"
  control: "16px"
  pane: "24px"
  reading: "48px"
  wide: "88px"
components:
  button-primary:
    backgroundColor: "transparent"
    textColor: "{colors.mineral}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.mineral-dark}"
    textColor: "#FFFFFF"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "40px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.mineral}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "40px"
  button-secondary-hover:
    backgroundColor: "{colors.action-tint}"
    textColor: "{colors.mineral}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "40px"
  highlight-primary:
    backgroundColor: "{colors.evidence-cool}"
    textColor: "{colors.ink}"
    rounded: "{rounded.mark}"
    padding: "0 0.08em"
  highlight-secondary:
    backgroundColor: "{colors.evidence-warm}"
    textColor: "{colors.ink}"
    rounded: "{rounded.mark}"
    padding: "0 0.08em"
---

# Design System: PolAI

## Overview

**Creative North Star: "Condition Report"**

PolAI is a calm, exact writing instrument. The source text is the interface, not content placed inside an ornamental application shell. The visual system borrows the discipline of an archival condition report: matte inspection paper, compact labels, hairline rules, and source-linked observations that appear only where attention is required.

The interface stays neutral and nonpartisan. Mineral green carries actions and focus. Cool graphite and warm stone distinguish linked findings without implying success, warning, political side, confidence, or severity. Space, scale, and alignment create hierarchy before containers or decoration do.

**Key Characteristics:**

- Continuous, editor-first workspace with a narrow evidence rail.
- Matte paper surfaces separated by hairline rules, with no elevation.
- System sans typography that shifts from generous reading copy to compact inspection labels.
- Exact source spans linked to findings by matching cool graphite or warm stone treatments.
- Direct, neutral controls that keep every revision under the writer's control.

## Colors

The palette feels like warm paper and inspection ink: restrained neutrals, one mineral action color, and two evidence tones. Dark mode keeps the same material world with warm charcoal surfaces, off-white ink, a lighter mineral focus color, quieter action labels, and deeper graphite and stone evidence fills. System preference is the default; an explicit user choice persists.

### Primary

- **Mineral Green:** Carries primary actions, focus, summary measures, and neutral replacement text. Its darker companion is reserved for high-contrast hover states.

### Secondary

- **Cool Graphite:** Marks the first alternating evidence identity. Its pale gray fill and graphite edge connect a source span to its finding without signaling status.

### Tertiary

- **Warm Stone:** Marks the second alternating evidence identity. Its pale stone fill and taupe edge distinguish adjacent findings without signaling status.

### Neutral

- **Paper:** The primary page and editor ground.
- **Muted Paper:** A slight tonal shift for the analysis rail, never a floating card.
- **Inspection Ink:** Primary text and wordmark color.
- **Muted and Faint Ink:** Supporting copy, counts, labels, and metadata; faint text remains accessible rather than ornamental.
- **Rule and Strong Rule:** Hairline divisions between regions, summaries, and finding rows.
- **Error Red:** Functional error copy only; it is never part of political analysis or evidence encoding.

### Named Rules

**The Nonpartisan Color Rule.** Evidence colors only link passages to findings. They must not reuse action, success, warning, error, or partisan colors.

**The Matched Evidence Rule.** Every marked source span and its corresponding finding use the same fill and edge treatment, with the exact quoted phrase and explicit labels as non-color cues.

**The Paper Restraint Rule.** Large surfaces stay within the paper neutrals. Accent fills belong to compact evidence and state treatments.

## Typography

**Display Font:** System sans with native platform fallbacks

**Body Font:** System sans with native platform fallbacks

**Character:** One workhorse sans family keeps the product immediate and untheatrical. Weight, scale, tracking, and tabular numerals provide hierarchy without introducing a decorative display voice.

### Hierarchy

- **Display:** The analysis percentage is the only display-scale element. It is measured, tabular, and lower in weight than the wordmark.
- **Headline:** The PolAI wordmark is compact, heavy, and tightly tracked.
- **Title:** Quiet empty-state headings use moderate weight and close tracking.
- **Body:** The source editor uses the most generous size and leading in the system. Analysis prose is smaller and denser so it remains subordinate to the writing.
- **Label:** Region titles, section headings, category tags, and neutral-wording captions are compact, weighty, and set in sentence case. Reusable role sizes are 11px for tags, 12px for captions, 13px for controls, 14px for analysis prose, and 15px for quoted findings.

### Named Rules

**The Source Leads Rule.** Source prose receives the largest sustained reading treatment; analysis copy never competes with it.

**The Instrument Label Rule.** Use sentence case for interface labels. Reserve uppercase for established initialisms.

**The Intentional Selection Rule.** Source text, analysis prose, finding explanations, error details, and suggested wording remain selectable. Interface chrome, headings, counts, category tags, and button labels do not.

## Layout

Desktop uses a fixed-height, continuous workspace beneath a 64px masthead. The main grid is approximately 58/42 (`1.38fr 1fr`): the editor is dominant, while the analysis rail stays narrow but never below 360px. A single vertical hairline creates the seam; neither side becomes a card. Redundant region-title and word-count strips are omitted; the editor and analysis content begin directly below the masthead.

The editor uses fluid insets, from 28px up to 64px vertically and from 24px up to 48px horizontally. The source footer is 78px high and keeps compact actions right.

At 900px and below, the workspace becomes sequential: source first, analysis second. The masthead becomes sticky, the editor keeps at least 420px of working height, and the analysis region scrolls with the page. At 620px, the masthead grows to 84px so its description can wrap without crowding the theme selector; pane insets tighten to 22px, editor type reduces slightly, and footer actions take equal width. At 410px, actions stack.

**The Continuous Workspace Rule.** Desktop editor and analysis regions share one viewport-height field, one seam, and aligned headers.

**The Task-Order Rule.** Compact layouts preserve the workflow order: write, act, then review.

## Elevation & Depth

The system has no elevation shadows. Depth comes from tonal layering between Paper and Muted Paper, plus hairline boundaries. Box shadows are permitted only for active-evidence outlines; they must not imply floating containers.

**The Flat Inspection Rule.** Surfaces are flat at rest. Use rules, tone, and active outlines—not drop shadows—to establish structure.

## Shapes

The form language is rectilinear and exact. Text marks and phrase bands use gently eased 2px corners; action controls use 3px corners. Large panes, summaries, and finding rows have square edges. Pills are reserved for short category tags, and circles are reserved for loading indicators.

**The Exception Shape Rule.** Rounded silhouettes must explain status or compact interaction; they are not decorative containers.

## Components

### Masthead

- **Character:** Quiet identification, not navigation chrome.
- **Structure:** A compact matte bar with the wordmark, a direct one-sentence product description, an icon-led System/Light/Dark menu, and one lower hairline.
- **Theme:** System, Light, and Dark are available. System is the default, and an explicit choice persists without a flash of the wrong theme.
- **Menu behavior:** Opening the menu focuses the selected option. Arrow keys, Home, End, Escape, outside click, and focus return follow native menu expectations.
- **Responsive:** It becomes sticky on sequential layouts; compact screens move the description below the wordmark and selector.

### Source Editor

- **Character:** The dominant reading and writing surface.
- **Field:** A borderless textarea and synchronized semantic overlay occupy the same full pane.
- **Reading treatment:** Large system-sans prose, generous leading, moderate insets, visible caret, and native wrapping.
- **Focus:** A quiet mineral-tinted surface shift and a short 2px mineral rule above the writing line signal focus without drawing a perimeter or touching the viewport edge.
- **Evidence:** Inline marks use pale graphite or stone fill, a matching lower edge, and a one-pixel active outline.

### Buttons

- **Shape:** Compact outlined rectangles with 3px corners and a 40px minimum height; mobile controls grow to 44px.
- **Primary:** Mineral text and border on a transparent paper ground; hover fills with dark mineral and reverses to white text.
- **Secondary:** Mineral text with a strong neutral border; hover adds a pale mineral action tint.
- **Dark mode:** Action labels use a quieter mineral tone than focus and measurement accents; filled hover labels use softened off-white instead of pure white.
- **Focus / Disabled:** Visible 2px mineral focus outline with 3px offset. Disabled controls use quiet neutral fill, border, and text without relying on opacity alone.

### Analysis Summary

- **Character:** A compact measurement and one plain-language conclusion, not a scorecard.
- **Structure:** A tabular percentage, small descriptor, sentence-case Summary label, and readable explanatory sentence separated from findings by one hairline.
- **Constraint:** Never add gauges, charts, verdict colors, or oversized card framing.

### Findings

- **Character:** Inspection notes linked directly to exact source spans.
- **Structure:** Each row contains the highlighted phrase, a reason, and a separately labeled neutral replacement. Supporting content aligns directly with the phrase instead of sitting in a decorative index column.
- **State:** Hovering a finding row activates its matching source phrase. Hovering a marked source phrase smoothly reveals and activates its matching row, with an instant reduced-motion fallback. The quoted phrase band has no separate hover treatment because it is selectable content, not a control.
- **Separation:** Rows use hairlines and spacing rather than individual cards.

### Empty, Loading, and Error States

- **Empty:** One short instruction and one 42px mineral rule; no illustration.
- **Loading:** Plain-language status followed by three quiet skeleton rules. Motion is subtle and removed under reduced-motion preference.
- **Error:** A compact inline band preserves the user's text, names the failure, and offers a retry in direct language.

## Do's and Don'ts

### Do:

- **Do** keep source text visually dominant and editable throughout review.
- **Do** connect every finding to its exact phrase with matched tone, edge, quoted text, and label.
- **Do** use paper tone, hairline rules, and spacing to organize the workspace.
- **Do** keep explanations and suggested neutral wording compact, direct, and scannable.
- **Do** preserve visible focus, sufficient contrast, semantic regions, and reduced-motion-safe behavior.

### Don't:

- **Don't** introduce giant cards, floating dashboard panels, gradients, gauges, or decorative imagery.
- **Don't** use red/blue, left/right, or any partisan color code for findings.
- **Don't** apply excessive rounding; square regions and compact 2-3px controls are the default.
- **Don't** add shadows for elevation or decoration.
- **Don't** let analysis chrome, percentages, or status treatments compete with the source text.
