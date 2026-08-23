import { useRef, useState } from 'react'

import type { Highlight } from '../highlights'
import { Analysis } from './analysis'
import { Input } from './input'

export function Main() {
  const [text, setText] = useState('')
  const [summary, setSummary] = useState('')
  const [neutralText, setNeutralText] = useState('')
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeHighlight, setActiveHighlight] = useState<number | null>(null)
  const analysisRef = useRef<HTMLElement>(null)

  const showAnalysis = () => {
    if (!window.matchMedia('(max-width: 900px)').matches) return

    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth'
    analysisRef.current?.scrollIntoView({ behavior, block: 'start' })
  }

  const showFindingFromSource = (index: number | null) => {
    setActiveHighlight(index)
    if (index === null) return

    analysisRef.current
      ?.querySelector<HTMLElement>(`[data-finding-index="${index}"]`)
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }

  return (
    <div className="app-shell">
      <header className="masthead">
        <a className="wordmark" href="/" aria-label="PolAI home">
          PolAI
        </a>
      </header>

      <main className="workspace">
        <h1 className="sr-only">Review political bias in your writing</h1>
        <Input
          text={text}
          setText={setText}
          setSummary={setSummary}
          neutralText={neutralText}
          setNeutralText={setNeutralText}
          highlights={highlights}
          setHighlights={setHighlights}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          activeHighlight={activeHighlight}
          setActiveHighlight={setActiveHighlight}
          onSourceHighlightHover={showFindingFromSource}
          onAnalysisComplete={showAnalysis}
        />
        <Analysis
          ref={analysisRef}
          text={text}
          summary={summary}
          highlights={highlights}
          isProcessing={isProcessing}
          activeHighlight={activeHighlight}
        />
      </main>
    </div>
  )
}
