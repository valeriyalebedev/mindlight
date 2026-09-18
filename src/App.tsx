import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Loader from './components/Loader';
import { STEPTS } from './constants/mock';
import { createStubNextMove } from './lib/stubNextMove';
import type { BrainDump, MindlightSession, UserChoice } from './types/mindlight';
import backgroundImage from './static/baclground.webp';
import styles from './App.module.css';
import Header from './components/Header';
import GlassNav from './components/GlassNav';

const MIN_INITIAL_LOADING_TIME = 5000

const loadAfterDoneScreen = () => import('./features/after-done/AfterDoneScreen')
const loadBrainDumpScreen = () => import('./features/brain-dump/BrainDumpScreen')
const loadLandingScreen = () => import('./features/landing/LandingScreen')
const loadWelcomingScreen = () => import('./features/welcoming/WelcomingScreen')
const loadNextMoveScreen = () => import('./features/next-move/NextMoveScreen')
const loadProcessingScreen = () => import('./features/next-move/ProcessingScreen')

const AfterDoneScreen = lazy(loadAfterDoneScreen)
const BrainDumpScreen = lazy(loadBrainDumpScreen)
const LandingScreen = lazy(loadLandingScreen)
const Welcoming = lazy(loadWelcomingScreen)
const NextMoveScreen = lazy(loadNextMoveScreen)

const preloadScreens = [
  loadAfterDoneScreen,
  loadBrainDumpScreen,
  loadLandingScreen,
  loadWelcomingScreen,
  loadNextMoveScreen,
  loadProcessingScreen,
]

/**
 * Which step of the flow is on screen.
 *
 * This is never stored. It is always derived from the session, so the session
 * stays the single source of truth and no screen can drift out of sync with it.
 */
type ScreenName = 'welcoming' | 'landing' |'brain-dump' | 'next-move' | 'after-done'

/**
 * How long the processing beat lasts before the next move appears.
 *
 * The pause is deliberate: it is what makes processing a real step in the flow
 * rather than a flicker. When the LLM integration lands, this timer is replaced
 * by the actual work and nothing else in the flow has to change.
 */

function createSession(): MindlightSession {
  return {
    id: crypto.randomUUID(),
    processingState: 'idle',
  }
}

/** Derives the current step of the flow from the session alone. */
function resolveScreen(session: MindlightSession): ScreenName {
  // Accepting a move is what leads to After Done, so the choice outranks the
  // processing state: the move stays "ready", the screen moves on.
  if (session.userChoice === 'accept') {
    return 'after-done'
  }

  switch (session.processingState) {
    case 'adding':
      return 'brain-dump'
    case 'capturing':
      return 'landing'
    case 'ready':
      // "ready" without a move should not happen; treat it as still working.
      return 'next-move'
    case 'error':
      // Processing failed: put the user back at their dump so they can retry.
      // A dedicated error step arrives with the LLM integration.
      return 'landing'
    default:
      return 'welcoming'
  }
}

/**
 * Mindlight.
 *
 * The app owns the session state and derives which step is showing; the screens
 * stay presentational and hold nothing but their own input. The glass
 * navigation and the animated pastel background are app-level so every step
 * shares the same atmosphere.
 *
 * Nothing is persisted: a reload starts over.
 */
function App() {
  const [session, setSession] = useState<MindlightSession>(createSession)
  const [nextStepIndex, setNextStepIndex] = useState(0)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    let minimumLoadingTimer: ReturnType<typeof setTimeout> | undefined

    const finishInitialLoading = () => {
      const elapsed = performance.now() - startedAt
      const remaining = Math.max(0, MIN_INITIAL_LOADING_TIME - elapsed)

      minimumLoadingTimer = setTimeout(() => {
        if (mounted) {
          setIsInitialLoading(false)
        }
      }, remaining)
    }

    const startedAt = performance.now()

    Promise.all(preloadScreens.map((loadScreen) => loadScreen())).then(
      finishInitialLoading,
      finishInitialLoading,
    )

    return () => {
      mounted = false
      if (minimumLoadingTimer) {
        clearTimeout(minimumLoadingTimer)
      }
    }
  }, [])

  /*
   * The processing beat, owned here rather than inside the screen so the screens
   * stay presentational. It moves the flow from processing to the next move once
   * the pause has passed.
   */

  /** Leave the entry screen and start writing. */
  const handleGetStarted = useCallback(() => {
    setSession((current) => ({ ...current, processingState: 'capturing' }))
  }, [])

  /** Landing -> open the free-form brain dump screen. */
  const handleTyping = useCallback(() => {
    setSession((current) => ({
      ...current,
      processingState: 'adding',
      nextMove: undefined,
      userChoice: undefined,
      errorMessage: undefined,
    }))
  }, [])

  /** Landing -> open a next move directly until the real assistant is connected. */
  const handleAsking = useCallback(() => {
    setSession((current) => {
      const brainDump = current.brainDump ?? {
        text: '',
        createdAt: new Date().toISOString(),
      }

      return {
        ...current,
        brainDump,
        nextMove: createStubNextMove(brainDump, current.nextMove?.title),
        userChoice: undefined,
        processingState: 'ready',
        errorMessage: undefined,
      }
    })
  }, [])

  /** The dump is in: processing begins. */
  const handleBrainDumpSubmit = useCallback((brainDump: BrainDump) => {
    setSession((current) => ({
      ...current,
      brainDump,
      nextMove: undefined,
      userChoice: undefined,
      errorMessage: undefined,
    }))
  }, [])

  /** Brain dump processing finished: show the generated next move. */
  const handleBrainDumpFallback = useCallback(() => {
    setSession((current) => {
      const brainDump = current.brainDump ?? {
        text: '',
        createdAt: new Date().toISOString(),
      }

      return {
        ...current,
        brainDump,
        nextMove: createStubNextMove(brainDump, current.nextMove?.title),
        userChoice: undefined,
        processingState: 'ready',
        errorMessage: undefined,
      }
    })
  }, [])

  /** What the user decided about the next move. */
  const handleChoose = useCallback((choice: UserChoice) => {
    if (choice === 'alternative') {
      const nextStep = STEPTS[nextStepIndex]

      setNextStepIndex((currentIndex) => (currentIndex + 1) % STEPTS.length)
      setSession((current) => ({
        ...current,
        nextMove: nextStep,
        userChoice: 'alternative',
        processingState: 'ready',
      }))
      return
    }

    setSession((current) => {
      if (choice === 'not-now') {
        // "Not now" is not a failure. The dump is kept and the user is put back
        // where they can write, so nothing has to be retyped from scratch.
        return { ...current, userChoice: 'not-now', processingState: 'capturing' }
      }

      return { ...current, userChoice: 'accept' }
    })
  }, [nextStepIndex])

  /** After Done -> start a fresh session. */
  const handleStartAgain = useCallback(() => {
    const nextStep = STEPTS[nextStepIndex]

    setSession((current) => ({
      ...current,
      processingState: 'ready',
      brainDump: undefined,
      nextMove: nextStep,
      userChoice: undefined,
      errorMessage: undefined,
    }))

    setNextStepIndex((current) => (current + 1) % STEPTS.length)
  }, [nextStepIndex])

  let content: ReactNode

  switch (resolveScreen(session)) {
    case 'brain-dump':
      content = (
        <Shell>
          <BrainDumpScreen
            onSubmit={handleBrainDumpSubmit}
            onFallback={handleBrainDumpFallback}
            submittedBrainDump={session.brainDump ?? null}
          />
        </Shell>
      )
      break

    case 'next-move':
      content = (
        <Shell>
          <NextMoveScreen nextMove={session.nextMove} onChoose={handleChoose} />
        </Shell>
      )
      break
    case 'after-done':
      content = (
        <Shell>
          <AfterDoneScreen nextMove={session.nextMove} onStartAgain={handleStartAgain} />
        </Shell>
      )
      break
    case 'landing': 
      content = (
        <Shell>
          <LandingScreen onClickTyping={handleTyping}  onClickAsking={handleAsking} />
        </Shell>
      )
      break
    default:
      content = (
        <Shell>
          <Welcoming onGetStarted={handleGetStarted} />
        </Shell>
      )
  }

  return (
    <Suspense
      fallback={<div className={styles.app} style={{ backgroundImage: `url(${backgroundImage})` }} />}
    >
      {isInitialLoading ? <Loader /> : content}
    </Suspense>
  )
}

/**
 * The chrome every step shares: the living background, the glass navigation and
 * the centred content column.
 */
function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <div className={styles.app} style={{ backgroundImage: `url(${backgroundImage})` }}>
        <Header />
        <main className={styles.main}>{children}</main>
        
        <GlassNav />
      </div>
    </>
  )
}

export default App
