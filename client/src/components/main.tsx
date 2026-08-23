import { useEffect, useRef, useState } from 'react'

import type { Highlight } from '../highlights'
import { Analysis } from './analysis'
import { Input } from './input'

type ThemePreference = 'system' | 'light' | 'dark'

const THEME_STORAGE_KEY = 'polai-theme'

const getInitialTheme = (): ThemePreference => {
  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'system'
  } catch {
    return 'system'
  }
}

export function Main() {
  const [text, setText] = useState('')
  const [summary, setSummary] = useState('')
  const [neutralText, setNeutralText] = useState('')
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeHighlight, setActiveHighlight] = useState<number | null>(null)
  const [themePreference, setThemePreference] = useState<ThemePreference>(getInitialTheme)
  const analysisRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (themePreference === 'system') {
      delete document.documentElement.dataset.theme
    } else {
      document.documentElement.dataset.theme = themePreference
    }

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, themePreference)
    } catch {
      // Theme selection still works when browser storage is unavailable.
    }
  }, [themePreference])

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

    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth'

    analysisRef.current
      ?.querySelector<HTMLElement>(`[data-finding-index="${index}"]`)
      ?.scrollIntoView({ behavior, block: 'nearest', inline: 'nearest' })
  }

  return (
    <div className="app-shell">
      <header className="masthead">
        <div className="masthead-copy">
          <a className="wordmark" href="/" aria-label="PolAI home">
            PolAI
          </a>
          <p>Find politically biased passages and revise them in neutral language.</p>
        </div>
        <label className="theme-picker">
          <span>Theme</span>
          <select
            value={themePreference}
            onChange={event => setThemePreference(event.target.value as ThemePreference)}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
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
          onHighlightFocus={setActiveHighlight}
        />
      </main>
    </div>
  )
}
