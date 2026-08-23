import { useRef, useState, type CSSProperties, type ReactNode } from 'react'

import {
  applyNeutralRewrite,
  createHighlights,
  HIGHLIGHT_EDGES,
  isBiasCategory,
  mergeHighlights,
  type AnalysisResponse,
  type Highlight,
} from '../highlights'

const isAnalysisResponse = (value: unknown): value is AnalysisResponse => {
  if (!value || typeof value !== 'object') return false

  const response = value as Partial<AnalysisResponse>
  return typeof response.summary === 'string'
    && Array.isArray(response.biases)
    && response.biases.every(finding => Boolean(finding)
      && typeof finding === 'object'
      && Array.isArray(finding.categories)
      && finding.categories.length > 0
      && finding.categories.every(isBiasCategory)
      && typeof finding.line === 'string'
      && typeof finding.reason === 'string'
      && typeof finding.fixed === 'string')
    && typeof response.neutralText === 'string'
}

const analyzeText = async (content: string) => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')
  if (!apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL is not configured.')
  }

  const response = await fetch(`${apiBaseUrl}/submission`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const message = payload && typeof payload === 'object' && 'error' in payload
      ? String(payload.error)
      : 'The text analysis failed.'
    throw new Error(message)
  }

  if (!isAnalysisResponse(payload)) {
    throw new Error('The API returned an invalid analysis.')
  }

  return {
    summary: payload.summary,
    highlights: createHighlights(content, payload.biases),
    neutralText: payload.neutralText,
  }
}

const getHighlightedText = (
  text: string,
  highlights: Highlight[],
  activeHighlight: number | null,
) => {
  const parts: ReactNode[] = []
  let lastIndex = 0

  mergeHighlights(highlights).forEach(({ start: rawStart, end: rawEnd, color }) => {
    const start = Math.max(0, rawStart)
    const end = Math.min(text.length, rawEnd)

    if (start > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}-${start}`}>{text.slice(lastIndex, start)}</span>,
      )
    }

    if (end > start) {
      const sourceIndex = highlights.findIndex(
        highlight => highlight.start < end && highlight.end > start,
      )
      const style = {
        '--highlight-color': color,
        '--highlight-edge': HIGHLIGHT_EDGES[sourceIndex % HIGHLIGHT_EDGES.length],
      } as CSSProperties

      parts.push(
        <mark
          className={sourceIndex === activeHighlight ? 'text-mark is-active' : 'text-mark'}
          data-highlight-index={sourceIndex}
          key={`highlight-${start}-${end}`}
          style={style}
        >
          {text.slice(start, end)}
        </mark>,
      )
      lastIndex = end
    }
  })

  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-${lastIndex}-${text.length}`}>{text.slice(lastIndex)}</span>,
    )
  }

  return parts
}

interface InputProps {
  text: string
  setText: (text: string) => void
  highlights: Highlight[]
  setHighlights: (highlights: Highlight[]) => void
  isProcessing: boolean
  setIsProcessing: (isProcessing: boolean) => void
  setSummary: (summary: string) => void
  neutralText: string
  setNeutralText: (text: string) => void
  activeHighlight: number | null
  setActiveHighlight: (index: number | null) => void
  onSourceHighlightHover: (index: number | null) => void
  onAnalysisComplete: () => void
}

export function Input({
  text,
  setText,
  highlights,
  setHighlights,
  isProcessing,
  setIsProcessing,
  setSummary,
  neutralText,
  setNeutralText,
  activeHighlight,
  setActiveHighlight,
  onSourceHighlightHover,
  onAnalysisComplete,
}: InputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const hoveredHighlightRef = useRef<number | null>(null)
  const [lastAnalyzed, setLastAnalyzed] = useState('')
  const [error, setError] = useState('')

  const resetAnalysis = () => {
    setHighlights([])
    setSummary('')
    setNeutralText('')
    setLastAnalyzed('')
    setError('')
    setActiveHighlight(null)
  }

  const updateHoveredHighlight = (index: number | null) => {
    if (hoveredHighlightRef.current === index) return

    hoveredHighlightRef.current = index
    onSourceHighlightHover(index)
  }

  const handleSourceHover = (clientX: number, clientY: number, buttons: number) => {
    if (!overlayRef.current || buttons !== 0) {
      updateHoveredHighlight(null)
      return
    }

    const hoveredMark = Array.from(
      overlayRef.current.querySelectorAll<HTMLElement>('[data-highlight-index]'),
    ).find(mark => Array.from(mark.getClientRects()).some(rect => (
      clientX >= rect.left
      && clientX <= rect.right
      && clientY >= rect.top
      && clientY <= rect.bottom
    )))

    const hoveredIndex = hoveredMark
      ? Number(hoveredMark.dataset.highlightIndex)
      : null
    updateHoveredHighlight(Number.isInteger(hoveredIndex) ? hoveredIndex : null)
  }

  const handleAnalyze = async () => {
    setIsProcessing(true)
    setError('')

    try {
      const result = await analyzeText(text)
      setHighlights(result.highlights)
      setSummary(result.summary)
      setNeutralText(result.neutralText)
      setLastAnalyzed(text)
      setActiveHighlight(null)
      onAnalysisComplete()
    } catch (analysisError) {
      const message = analysisError instanceof Error
        ? analysisError.message
        : 'The text analysis failed.'
      setError(message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleApplySuggestions = () => {
    try {
      setText(applyNeutralRewrite(text, neutralText))
      setLastAnalyzed('')
      setHighlights([])
      setActiveHighlight(null)
      setNeutralText('')
      setSummary('Suggested neutral wording was applied.')
    } catch {
      setError('The suggested rewrite could not be applied safely. Run the analysis again.')
    }
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
  const analysisIsCurrent = lastAnalyzed === text

  return (
    <section className="source-pane" aria-labelledby="source-title">
      <header className="pane-header source-header">
        <h2 id="source-title">Source text</h2>
        <span className="word-count" aria-live="polite">
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </span>
      </header>

      <div className="editor-shell">
        <div ref={overlayRef} className="editor-overlay" aria-hidden="true">
          {getHighlightedText(text, highlights, activeHighlight)}
        </div>
        <textarea
          ref={textareaRef}
          className="source-editor"
          value={text}
          onChange={event => {
            resetAnalysis()
            setText(event.target.value)
          }}
          onScroll={() => {
            if (!overlayRef.current || !textareaRef.current) return
            overlayRef.current.scrollTop = textareaRef.current.scrollTop
            overlayRef.current.scrollLeft = textareaRef.current.scrollLeft
          }}
          onMouseMove={event => {
            handleSourceHover(event.clientX, event.clientY, event.buttons)
          }}
          onMouseLeave={() => updateHoveredHighlight(null)}
          placeholder="Paste an article, post, speech, or draft to review for political bias."
          aria-label="Text to review"
          spellCheck
        />
      </div>

      {error ? (
        <p className="editor-error" role="alert">
          <strong>Analysis unavailable.</strong> {error} Your text is still here—try again.
        </p>
      ) : null}

      <footer className="source-footer">
        <div className="editor-actions">
          {highlights.length > 0 && neutralText ? (
            <button
              className="button button-secondary"
              type="button"
              onClick={handleApplySuggestions}
              disabled={isProcessing}
            >
              Apply all suggestions
            </button>
          ) : null}
          <button
            className="button button-primary"
            type="button"
            onClick={handleAnalyze}
            disabled={isProcessing || !text.trim() || analysisIsCurrent}
          >
            {isProcessing ? (
              <>
                <span className="button-loader" aria-hidden="true" />
                Analyzing
              </>
            ) : 'Analyze text'}
          </button>
        </div>
      </footer>
    </section>
  )
}
