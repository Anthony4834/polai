import { forwardRef, type CSSProperties } from 'react'

import {
  BIAS_CATEGORY_LABELS,
  calculateBiasPercent,
  type Highlight,
} from '../highlights'

interface AnalysisProps {
  text: string
  summary: string
  highlights: Highlight[]
  isProcessing: boolean
  activeHighlight: number | null
  onHighlightFocus: (index: number | null) => void
}

export const Analysis = forwardRef<HTMLElement, AnalysisProps>(function Analysis(
  {
    text,
    summary,
    highlights,
    isProcessing,
    activeHighlight,
    onHighlightFocus,
  },
  ref,
) {
  const hasAnalysis = Boolean(summary) || highlights.length > 0
  const status = isProcessing ? 'Reviewing' : hasAnalysis ? 'Complete' : 'Ready'
  const percentage = calculateBiasPercent(text, highlights)

  return (
    <aside ref={ref} className="analysis-pane" aria-labelledby="analysis-title">
      <header className="pane-header analysis-header">
        <h2 id="analysis-title">Analysis</h2>
        <span className={`status-chip status-${status.toLowerCase()}`}>{status}</span>
      </header>

      {isProcessing ? (
        <div className="analysis-loading" aria-live="polite" aria-busy="true">
          <p>Reviewing language and context…</p>
          <span />
          <span />
          <span />
        </div>
      ) : !hasAnalysis ? (
        <div className="analysis-empty">
          <span className="empty-rule" aria-hidden="true" />
          <h3>Ready when you are.</h3>
          <p>Run an analysis to connect each finding to its exact phrase in the source.</p>
        </div>
      ) : (
        <div className="analysis-content" aria-live="polite">
          <section className="analysis-summary" aria-labelledby="summary-title">
            <p className="summary-measure">
              <strong>{percentage}%</strong>
              <span>of source text flagged — coverage, not severity</span>
            </p>
            <h3 id="summary-title">Summary</h3>
            <p>{summary}</p>
            {highlights.length === 0 ? (
              <p className="no-findings">No biased passages were marked.</p>
            ) : null}
          </section>

          {highlights.length > 0 ? (
            <section className="findings" aria-labelledby="findings-title">
              <div className="findings-heading">
                <h3 id="findings-title">Findings</h3>
                <span>{highlights.length}</span>
              </div>
              <ol className="finding-list">
                {highlights.map((highlight, index) => {
                  const tone = index % 2 === 0 ? 'mint' : 'amber'
                  const style = {
                    '--finding-fill': highlight.color,
                    '--finding-edge': tone === 'mint' ? '#8EAA96' : '#E7BF79',
                  } as CSSProperties

                  return (
                    <li
                      className={activeHighlight === index ? 'finding is-active' : 'finding'}
                      key={`${highlight.start}-${highlight.end}-${highlight.line}`}
                      style={style}
                      onMouseEnter={() => onHighlightFocus(index)}
                    >
                      <button
                        className="finding-phrase"
                        type="button"
                        onFocus={() => onHighlightFocus(index)}
                        onClick={() => onHighlightFocus(index)}
                        aria-label={`Finding ${index + 1}: ${highlight.line}`}
                      >
                        <span className="finding-number" aria-hidden="true">
                          {index + 1}
                        </span>
                        <span>“{highlight.line}”</span>
                      </button>
                      <ul className="finding-categories" aria-label="Bias categories">
                        {highlight.categories.map(category => (
                          <li key={category}>{BIAS_CATEGORY_LABELS[category]}</li>
                        ))}
                      </ul>
                      <p className="finding-reason">{highlight.reason}</p>
                      <div className="neutral-wording">
                        <span>Neutral wording</span>
                        <p>{highlight.fixed}</p>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </section>
          ) : null}
        </div>
      )}
    </aside>
  )
})
