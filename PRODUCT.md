# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People reviewing prose for United States political bias before they publish,
share, or revise it.

## Product Purpose

PolAI analyzes pasted text, identifies politically biased passages, explains
why they were flagged, and suggests neutral wording. Success means a user can
see the exact language at issue and revise it without losing the surrounding
context.

## Positioning

The product connects each finding to an exact source range, so analysis and
one-click neutral rewrites remain anchored to the user's original text even
when phrases repeat.

## Operating Context

The primary workflow is a focused writing task: paste or type text, run an
analysis, review in-place highlights alongside their explanations, then apply
the suggested neutral wording when useful.

## Capabilities and Constraints

- Preserve the source-text highlight overlay as the core interaction.
- Preserve the existing `/submission` API response contract: a summary plus
  exact source findings, explanations, and neutral replacements.
- Preserve responsive web behavior and the current React, TypeScript, Vite,
  and Emotion stack.
- The interface must remain modern, elegant, and very simple.
- Whether raw submissions should continue to be stored is an open product
  decision; the current redesign does not change persistence behavior.

## Brand Commitments

The product name is PolAI. The voice is direct, neutral, and nonpartisan.

## Evidence on Hand

- Working client and server implementations in this repository.
- Automated highlight-range, replacement, client, and server tests.
- No testimonials, customer logos, benchmarks, or other marketing proof are
  available and none should be fabricated.

## Product Principles

- Keep the source text central.
- Make every finding traceable to the words that caused it.
- Prefer calm clarity over decorative complexity.
- Keep revision reversible and under the user's control.
- Communicate analysis without partisan visual cues.

## Accessibility & Inclusion

Use semantic regions, visible keyboard focus, sufficient contrast, responsive
layouts, and reduced-motion-safe behavior. Do not rely on color alone to
communicate a finding.
