import {
  useEffect,
  useRef,
  useState,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'

import type { Highlight } from '../highlights'
import { Analysis } from './analysis'
import { Input } from './input'

type ThemePreference = 'system' | 'light' | 'dark'

const THEME_STORAGE_KEY = 'polai-theme'
const THEME_PREFERENCES: ThemePreference[] = ['system', 'light', 'dark']
const THEME_LABELS: Record<ThemePreference, string> = {
  system: 'System',
  light: 'Light',
  dark: 'Dark',
}

const getInitialTheme = (): ThemePreference => {
  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    return THEME_PREFERENCES.includes(storedTheme as ThemePreference)
      ? storedTheme as ThemePreference
      : 'system'
  } catch {
    return 'system'
  }
}

function ThemeChevron() {
  return (
    <svg aria-hidden="true" className="theme-menu__chevron" viewBox="0 0 16 16">
      <path d="m5 6.5 3 3 3-3" />
    </svg>
  )
}

function ThemeIcon({ preference }: { preference: ThemePreference }) {
  if (preference === 'system') {
    return (
      <svg aria-hidden="true" className="theme-menu__icon" viewBox="0 0 20 20">
        <rect height="9.25" rx="1.75" width="13.5" x="3.25" y="3.75" />
        <path d="M10 13v3.25M7.25 16.25h5.5" />
      </svg>
    )
  }

  if (preference === 'light') {
    return (
      <svg aria-hidden="true" className="theme-menu__icon" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="3.25" />
        <path d="M10 2.25v1.5M10 16.25v1.5M2.25 10h1.5M16.25 10h1.5M4.52 4.52l1.06 1.06M14.42 14.42l1.06 1.06M15.48 4.52l-1.06 1.06M5.58 14.42l-1.06 1.06" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" className="theme-menu__icon" viewBox="0 0 20 20">
      <path d="M16.35 12.52A7 7 0 0 1 7.48 3.65a7 7 0 1 0 8.87 8.87Z" />
    </svg>
  )
}

function ThemeCheck() {
  return (
    <svg aria-hidden="true" className="theme-menu__check-icon" viewBox="0 0 16 16">
      <path d="m3.75 8.25 2.5 2.5 6-6" />
    </svg>
  )
}

export function Main() {
  const [text, setText] = useState('')
  const [summary, setSummary] = useState('')
  const [neutralText, setNeutralText] = useState('')
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeHighlight, setActiveHighlight] = useState<number | null>(null)
  const [themePreference, setThemePreference] = useState<ThemePreference>(getInitialTheme)
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  const analysisRef = useRef<HTMLElement>(null)
  const themeMenuRef = useRef<HTMLDivElement>(null)
  const themeMenuTriggerRef = useRef<HTMLButtonElement>(null)

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

  useEffect(() => {
    if (!isThemeMenuOpen) return

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!themeMenuRef.current?.contains(event.target as Node)) setIsThemeMenuOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setIsThemeMenuOpen(false)
      themeMenuTriggerRef.current?.focus()
    }
    const focusFrame = window.requestAnimationFrame(() => {
      themeMenuRef.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus()
    })

    document.addEventListener('pointerdown', closeOnOutsidePointer)
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.removeEventListener('pointerdown', closeOnOutsidePointer)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isThemeMenuOpen])

  const chooseThemePreference = (preference: ThemePreference) => {
    setThemePreference(preference)
    setIsThemeMenuOpen(false)
    window.requestAnimationFrame(() => themeMenuTriggerRef.current?.focus())
  }

  const navigateThemeMenu = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return

    const options = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]'),
    )
    const currentIndex = options.indexOf(document.activeElement as HTMLButtonElement)
    let nextIndex = currentIndex

    if (event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % options.length
    if (event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + options.length) % options.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = options.length - 1

    event.preventDefault()
    options[nextIndex]?.focus()
  }

  const closeThemeMenuOnBlur = (event: ReactFocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) setIsThemeMenuOpen(false)
  }

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
        <div className="theme-menu" onBlur={closeThemeMenuOnBlur} ref={themeMenuRef}>
          <button
            aria-controls="theme-options"
            aria-expanded={isThemeMenuOpen}
            aria-haspopup="menu"
            aria-label={`Theme preference: ${THEME_LABELS[themePreference]}`}
            className="theme-menu__trigger"
            onClick={() => setIsThemeMenuOpen(open => !open)}
            ref={themeMenuTriggerRef}
            type="button"
          >
            <ThemeIcon preference={themePreference} />
            <span>{THEME_LABELS[themePreference]}</span>
            <ThemeChevron />
          </button>
          {isThemeMenuOpen ? (
            <div
              aria-label="Theme preference"
              className="theme-menu__options"
              id="theme-options"
              onKeyDown={navigateThemeMenu}
              role="menu"
            >
              {THEME_PREFERENCES.map(preference => {
                const isSelected = preference === themePreference

                return (
                  <button
                    aria-checked={isSelected}
                    className="theme-menu__option"
                    data-selected={isSelected}
                    key={preference}
                    onClick={() => chooseThemePreference(preference)}
                    role="menuitemradio"
                    type="button"
                  >
                    <ThemeIcon preference={preference} />
                    <span>{THEME_LABELS[preference]}</span>
                    <span aria-hidden="true" className="theme-menu__check">
                      {isSelected ? <ThemeCheck /> : null}
                    </span>
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>
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
