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
  mint: "#E4EEE5"
  mint-edge: "#8EAA96"
  amber: "#FDF2DF"
  amber-edge: "#E7BF79"
  rule: "#E2E2E0"
  rule-strong: "#CCCECA"
  error: "#A33B31"
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
    fontSize: "1.35rem"
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
    backgroundColor: "{colors.mint}"
    textColor: "{colors.mineral}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "40px"
  status-ready:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.pill}"
    padding: "0 8px"
    height: "24px"
  status-reviewing:
    backgroundColor: "{colors.amber}"
    textColor: "#755417"
    rounded: "{rounded.pill}"
    padding: "0 8px"
    height: "24px"
  status-complete:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.mineral}"
    rounded: "{rounded.pill}"
    padding: "0 8px"
    height: "24px"
  highlight-primary:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.mark}"
    padding: "0 0.08em"
  highlight-secondary:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.ink}"
    rounded: "{rounded.mark}"
    padding: "0 0.08em"
---

# Design System: PolAI

## Overview

**Creative North Star: "Condition Report"**

PolAI is a calm, exact writing instrument. The source text is the interface, not content placed inside an ornamental application shell. The visual system borrows the discipline of an archival condition report: matte inspection paper, compact labels, hairline rules, and numbered observations that appear only where attention is required.

The interface stays neutral and nonpartisan. Mineral green carries actions and completion; mint and amber distinguish linked findings without implying political sides or severity. Space, scale, and alignment create hierarchy before containers or decoration do.

**Key Characteristics:**

- Continuous, editor-first workspace with a narrow evidence rail.
- Matte paper surfaces separated by hairline rules, with no elevation.
- System sans typography that shifts from generous reading copy to compact inspection labels.
- Exact source spans linked to numbered findings by matching mint or amber treatments.
- Direct, neutral controls that keep every revision under the writer's control.

## Colors

The palette feels like warm paper and inspection ink: restrained neutrals, one mineral action color, and two pale evidence tones.

### Primary

- **Mineral Green:** Carries primary actions, focus, completion, summary measures, and neutral replacement text. Its darker companion is reserved for high-contrast hover states.

### Secondary

- **Inspection Mint:** Marks the first alternating evidence state. The pale fill and firmer edge must appear together so a source span and its finding read as one linked object.

### Tertiary

- **Annotation Amber:** Marks the second alternating evidence state. It distinguishes adjacent findings without communicating ideology, confidence, or severity.

### Neutral

- **Paper:** The primary page and editor ground.
- **Muted Paper:** A slight tonal shift for the analysis rail, never a floating card.
- **Inspection Ink:** Primary text and wordmark color.
- **Muted and Faint Ink:** Supporting copy, counts, labels, and metadata; faint text remains accessible rather than ornamental.
- **Rule and Strong Rule:** Hairline divisions between regions, summaries, and finding rows.
- **Error Red:** Functional error copy only; it is never part of political analysis or evidence encoding.

### Named Rules

**The Nonpartisan Color Rule.** Color may link evidence, signal interaction state, or report system status; it must never encode a political side.

**The Matched Evidence Rule.** Every marked source span and its corresponding finding use the same fill and edge treatment, with explicit numbering and labels as non-color cues.

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
- **Label:** Region titles, status labels, section headings, and neutral-wording captions are compact, weighty, and usually uppercase with open tracking.

### Named Rules

**The Source Leads Rule.** Source prose receives the largest sustained reading treatment; analysis copy never competes with it.

**The Instrument Label Rule.** Uppercase labels identify regions and states, not marketing messages or long sentences.

## Layout

Desktop uses a fixed-height, continuous workspace beneath a 64px masthead. The main grid is approximately 58/42 (`1.38fr 1fr`): the editor is dominant, while the analysis rail stays narrow but never below 360px. A single vertical hairline creates the seam; neither side becomes a card.

The editor uses generous fluid insets, from 28px up to 64px vertically and from 28px up to 88px horizontally. Pane headers are 58px high. The source footer is 78px high and keeps support text left with compact actions right.

At 900px and below, the workspace becomes sequential: source first, analysis second. The masthead becomes a sticky 56px bar, the editor keeps at least 420px of working height, and the analysis region scrolls with the page. At 620px, pane insets tighten to 22px, editor type reduces slightly, and footer actions take equal width; at 410px, actions stack.

**The Continuous Workspace Rule.** Desktop editor and analysis regions share one viewport-height field, one seam, and aligned headers.

**The Task-Order Rule.** Compact layouts preserve the workflow order: write, act, then review.

## Elevation & Depth

The system has no elevation shadows. Depth comes from tonal layering between Paper and Muted Paper, plus hairline boundaries. Box shadows are permitted only as inset focus or active-evidence outlines; they must not imply floating containers.

**The Flat Inspection Rule.** Surfaces are flat at rest. Use rules, tone, and active outlines—not drop shadows—to establish structure.

## Shapes

The form language is rectilinear and exact. Text marks and phrase controls use gently eased 2px corners; action controls use 3px corners. Large panes, summaries, and finding rows have square edges. The only pills are compact status labels, and the only circles are numbered finding indices and loading indicators.

**The Exception Shape Rule.** Rounded silhouettes must explain status, index, or compact interaction; they are not decorative containers.

## Components

### Masthead

- **Character:** Quiet identification, not navigation chrome.
- **Structure:** A 64px matte bar with the wordmark left, task context right, and one lower hairline.
- **Responsive:** It becomes sticky and 56px high on sequential layouts.

### Source Editor

- **Character:** The dominant reading and writing surface.
- **Field:** A borderless textarea and synchronized semantic overlay occupy the same full pane.
- **Reading treatment:** Large system-sans prose, generous leading, wide insets, visible caret, and native wrapping.
- **Focus:** A 2px inset mineral outline preserves the workspace geometry.
- **Evidence:** Inline marks use pale mint or amber fill, a matching lower edge, and a one-pixel active outline.

### Buttons

- **Shape:** Compact outlined rectangles with 3px corners and a 40px minimum height; mobile controls grow to 44px.
- **Primary:** Mineral text and border on a transparent paper ground; hover fills with dark mineral and reverses to white text.
- **Secondary:** Mineral text with a strong neutral border; hover adds mint fill and a mint edge.
- **Focus / Disabled:** Visible 2px mineral focus outline with 3px offset. Disabled controls use quiet neutral fill, border, and text without relying on opacity alone.

### Status Chips

- **Style:** The single pill exception: a 24px-high uppercase label with a one-pixel border.
- **State:** Ready is neutral, Reviewing uses amber, and Complete uses mint with mineral text.

### Analysis Summary

- **Character:** A compact measurement and one plain-language conclusion, not a scorecard.
- **Structure:** A tabular percentage, small descriptor, uppercase Summary label, and readable explanatory sentence separated from findings by one hairline.
- **Constraint:** Never add gauges, charts, verdict colors, or oversized card framing.

### Findings

- **Character:** Numbered inspection notes linked directly to exact source spans.
- **Structure:** Each row contains a highlighted phrase control, a reason, and a separately labeled neutral replacement.
- **State:** Hover or keyboard focus strengthens the phrase edge; the active row receives the same edge color as its source mark.
- **Separation:** Rows use hairlines and spacing rather than individual cards.

### Empty, Loading, and Error States

- **Empty:** One short instruction and one 42px mineral rule; no illustration.
- **Loading:** Plain-language status followed by three quiet skeleton rules. Motion is subtle and removed under reduced-motion preference.
- **Error:** A compact inline band preserves the user's text, names the failure, and offers a retry in direct language.

## Do's and Don'ts

### Do:

- **Do** keep source text visually dominant and editable throughout review.
- **Do** connect every finding to its exact phrase with matched tone, edge, number, and label.
- **Do** use paper tone, hairline rules, and spacing to organize the workspace.
- **Do** keep explanations and suggested neutral wording compact, direct, and scannable.
- **Do** preserve visible focus, sufficient contrast, semantic regions, and reduced-motion-safe behavior.

### Don't:

- **Don't** introduce giant cards, floating dashboard panels, gradients, gauges, or decorative imagery.
- **Don't** use red/blue, left/right, or any partisan color code for findings.
- **Don't** apply excessive rounding; square regions and compact 2-3px controls are the default.
- **Don't** add shadows for elevation or decoration.
- **Don't** let analysis chrome, percentages, or status treatments compete with the source text.
