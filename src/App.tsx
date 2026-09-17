import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import AnimatedBackground from './components/AnimatedBackground'
import GlassNav from './components/GlassNav'
import AfterDoneScreen from './features/after-done/AfterDoneScreen'
import BrainDumpScreen from './features/brain-dump/BrainDumpScreen'
import LandingScreen from './features/landing/LandingScreen'
import NextMoveScreen from './features/next-move/NextMoveScreen'
import ProcessingScreen from './features/next-move/ProcessingScreen'
import { createStubNextMove } from './lib/stubNextMove'
import type { BrainDump, MindlightSession, UserChoice } from './types/mindlight'
import styles from './App.module.css'

/**
 * Which step of the flow is on screen.
 *
 * This is never stored. It is always derived from the session, so the session
 * stays the single source of truth and no screen can drift out of sync with it.
 */
type ScreenName = 'landing' | 'brain-dump' | 'processing' | 'next-move' | 'after-done'

/**
 * How long the processing beat lasts before the next move appears.
 *
 * The pause is deliberate: it is what makes processing a real step in the flow
 * rather than a flicker. When the LLM integration lands, this timer is replaced
 * by the actual work and nothing else in the flow has to change.
 */
const PROCESSING_MS = 2200

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
    case 'capturing':
      return 'brain-dump'
    case 'processing':
      return 'processing'
    case 'ready':
      // "ready" without a move should not happen; treat it as still working.
      return session.nextMove ? 'next-move' : 'processing'
    case 'error':
      // Processing failed: put the user back at their dump so they can retry.
      // A dedicated error step arrives with the LLM integration.
      return 'brain-dump'
    default:
      return 'landing'
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

  /*
   * The processing beat, owned here rather than inside the screen so the screens
   * stay presentational. It moves the flow from processing to the next move once
   * the pause has passed.
   */
  useEffect(() => {
    if (session.processingState !== 'processing') {
      return
    }

    const timer = window.setTimeout(() => {
      setSession((current) => {
        // The user may have moved on while we were "thinking".
        if (current.processingState !== 'processing' || !current.brainDump) {
          return current
        }

        return {
          ...current,
          processingState: 'ready',
          nextMove: createStubNextMove(current.brainDump, current.nextMove?.title),
        }
      })
    }, PROCESSING_MS)

    return () => window.clearTimeout(timer)
  }, [session.processingState, session.brainDump])

  /** Leave the entry screen and start writing. */
  const handleGetStarted = useCallback(() => {
    setSession((current) => ({ ...current, processingState: 'capturing' }))
  }, [])

  /** The dump is in: processing begins. */
  const handleBrainDumpSubmit = useCallback((brainDump: BrainDump) => {
    setSession((current) => ({
      ...current,
      brainDump,
      nextMove: undefined,
      userChoice: undefined,
      errorMessage: undefined,
      processingState: 'processing',
    }))
  }, [])

  /** What the user decided about the next move. */
  const handleChoose = useCallback((choice: UserChoice) => {
    setSession((current) => {
      if (choice === 'not-now') {
        // "Not now" is not a failure. The dump is kept and the user is put back
        // where they can write, so nothing has to be retyped from scratch.
        return { ...current, userChoice: 'not-now', processingState: 'capturing' }
      }

      if (choice === 'alternative') {
        // Asking for another move keeps the current one, so the replacement is
        // guaranteed to differ, and runs the processing beat again.
        return { ...current, userChoice: 'alternative', processingState: 'processing' }
      }

      return { ...current, userChoice: 'accept' }
    })
  }, [])

  /** After Done -> start a fresh session. */
  const handleStartAgain = useCallback(() => {
    setSession((current) => ({
      ...current,
      processingState: 'capturing',
      brainDump: undefined,
      nextMove: undefined,
      userChoice: undefined,
      errorMessage: undefined,
    }))
  }, [])

  switch (resolveScreen(session)) {
    case 'brain-dump':
      return (
        <Shell>
          <BrainDumpScreen
            onSubmit={handleBrainDumpSubmit}
            submittedBrainDump={session.brainDump ?? null}
          />
        </Shell>
      )
    case 'processing':
      return (
        <Shell>
          <ProcessingScreen />
        </Shell>
      )
    case 'next-move':
      return (
        <Shell>
          {session.nextMove ? (
            <NextMoveScreen nextMove={session.nextMove} onChoose={handleChoose} />
          ) : (
            <ProcessingScreen />
          )}
        </Shell>
      )
    case 'after-done':
      return (
        <Shell>
          <AfterDoneScreen nextMove={session.nextMove} onStartAgain={handleStartAgain} />
        </Shell>
      )
    default:
      return (
        <Shell>
          <LandingScreen onGetStarted={handleGetStarted} />
        </Shell>
      )
  }
}

/**
 * The chrome every step shares: the living background, the glass navigation and
 * the centred content column.
 */
function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <AnimatedBackground />

      <div className={styles.app}>
        <GlassNav />

        <main className={styles.main}>{children}</main>
      </div>
    </>
  )
}

export default App
