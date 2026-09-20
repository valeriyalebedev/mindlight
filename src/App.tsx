import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Loader from './components/Loader';
import { STEPTS, TIME_MARKER_PHRASES, TRIGGER_WORDS } from './constants/mock';
import { createStubNextMove } from './lib/stubNextMove';
import type { BrainDump, MindlightSession, NextMove, UserChoice } from './types/mindlight';
import backgroundImage from './static/background.webp';
import styles from './App.module.css';
import Header from './components/Header';
import GlassNav from './components/GlassNav';

const MIN_INITIAL_LOADING_TIME = 3000;

function createStepsFromBrainDump(brainDump: BrainDump): NextMove[] {
  const text = brainDump.text.trim()
  const triggerWord = TRIGGER_WORDS.find((trigger) =>
    new RegExp(`\\b${trigger}\\b`, 'i').test(text),
  )
  const timeMarker = triggerWord ?? 'default'
  const description = TIME_MARKER_PHRASES[timeMarker]
  const titles = (text.match(/[^.!?]+(?:[.!?]+|$)/g) ?? [text])
    .map((sentence) => sentence.replace(/[.!?]+$/, '').replace(/\s+/g, ' ').trim())
    .filter(Boolean)

  return titles.map((title) => ({
    id: crypto.randomUUID(),
    title,
    rationale: description,
    createdAt: brainDump.createdAt,
  }))
}

function insertStepsWithSpacing(newSteps: NextMove[], currentSteps: NextMove[]): NextMove[] {
  const mergedSteps: NextMove[] = []

  newSteps.forEach((step, index) => {
    mergedSteps.push(step)

    const existingStep = currentSteps[index]
    if (existingStep) {
      mergedSteps.push(existingStep)
    }
  })

  mergedSteps.push(...currentSteps.slice(newSteps.length))
  return mergedSteps
}

const loadAfterDoneScreen = () => import('./features/after-done/AfterDoneScreen');
const loadBrainDumpScreen = () => import('./features/brain-dump/BrainDumpScreen');
const loadLandingScreen = () => import('./features/landing/LandingScreen');
const loadWelcomingScreen = () => import('./features/welcoming/WelcomingScreen');
const loadNextMoveScreen = () => import('./features/next-move/NextMoveScreen');
const loadProcessingScreen = () => import('./features/next-move/ProcessingScreen');
const loadCreatorsScreen = () => import('./features/creators/Creators');
const loadNoTaskScreen = () => import('./features/no-task/NoTaskScreen');

const AfterDoneScreen = lazy(loadAfterDoneScreen);
const BrainDumpScreen = lazy(loadBrainDumpScreen);
const LandingScreen = lazy(loadLandingScreen);
const Welcoming = lazy(loadWelcomingScreen);
const NextMoveScreen = lazy(loadNextMoveScreen);
const CreatorsScreen = lazy(loadCreatorsScreen);
const NoTaskScreen = lazy(loadNoTaskScreen);

const preloadScreens = [
  loadAfterDoneScreen,
  loadBrainDumpScreen,
  loadLandingScreen,
  loadWelcomingScreen,
  loadNextMoveScreen,
  loadProcessingScreen,
  loadCreatorsScreen,
  loadNoTaskScreen,
]

/**
 * Which step of the flow is on screen.
 *
 * This is never stored. It is always derived from the session, so the session
 * stays the single source of truth and no screen can drift out of sync with it.
 */
type ScreenName = 'welcoming' | 'landing' | 'brain-dump' | 'next-move' | 'after-done' | 'creators' | 'no-task';

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
function resolveScreen(session: MindlightSession, hasSteps: boolean): ScreenName {
  // Accepting a move is what leads to After Done, so the choice outranks the
  // processing state: the move stays "ready", the screen moves on.
  if (session.userChoice === 'accept') {
    return 'after-done'
  }

  if (!hasSteps && session.processingState !== 'adding' && session.processingState !== 'details') {
    return 'no-task'
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
    case 'details':
      return 'creators'
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
  const [session, setSession] = useState<MindlightSession>(createSession);
  const [steps, setSteps] = useState<NextMove[]>(() => [...STEPTS]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let minimumLoadingTimer: ReturnType<typeof setTimeout> | undefined;

    const finishInitialLoading = () => {
      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(0, MIN_INITIAL_LOADING_TIME - elapsed);

      minimumLoadingTimer = setTimeout(() => {
        if (mounted) {
          setIsInitialLoading(false);
        }
      }, remaining)
    }

    const startedAt = performance.now();

    Promise.all(preloadScreens.map((loadScreen) => loadScreen())).then(
      finishInitialLoading,
      finishInitialLoading,
    )

    return () => {
      mounted = false
      if (minimumLoadingTimer) {
        clearTimeout(minimumLoadingTimer);
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
    setSession((current) => ({ ...current, processingState: 'capturing' }));
  }, [])

  const handleOpenCreators = useCallback(() => {
    setSession((current) => ({
      ...current,
      processingState: 'details',
      userChoice: undefined,
    }));
  }, [])

  /** Glass navigation -> return to the landing screen. */
  const handleOpenLanding = useCallback(() => {
    setSession((current) => ({
      ...current,
      processingState: 'capturing',
      userChoice: undefined,
    }))
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
        nextMove: steps[0] ?? createStubNextMove(brainDump, current.nextMove?.title),
        userChoice: undefined,
        processingState: 'ready',
        errorMessage: undefined,
      }
    })
  }, [steps])

  /** The dump is in: processing begins. */
  const handleBrainDumpSubmit = useCallback((brainDump: BrainDump) => {
    const nextSteps = createStepsFromBrainDump(brainDump)

    setSteps((currentSteps) => insertStepsWithSpacing(nextSteps, currentSteps))
    setSession((current) => ({
      ...current,
      brainDump,
      nextMove: nextSteps[0],
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
        nextMove: current.nextMove ?? steps[0] ?? createStubNextMove(brainDump),
        userChoice: undefined,
        processingState: 'ready',
        errorMessage: undefined,
      }
    })
  }, [steps])

  /** What the user decided about the next move. */
  const handleChoose = useCallback((choice: UserChoice) => {
    if (choice === 'alternative') {
      setSession((current) => {
        if (steps.length === 0) {
          return current
        }

        const currentIndex = current.nextMove
          ? steps.findIndex((step) => step.id === current.nextMove?.id)
          : -1
        const nextStep = steps[(currentIndex + 1 + steps.length) % steps.length]

        return {
          ...current,
          nextMove: nextStep,
          userChoice: 'alternative',
          processingState: 'ready',
        }
      })
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

    if (choice === 'accept') {
      setSteps((currentSteps) => currentSteps.filter((step) => step.id !== session.nextMove?.id))
    }
  }, [session.nextMove?.id, steps])

  /** After Done -> start a fresh session. */
  const handleStartAgain = useCallback(() => {
    const nextStep = steps[0]

    setSession((current) => ({
      ...current,
      processingState: nextStep ? 'ready' : 'capturing',
      brainDump: undefined,
      nextMove: nextStep,
      userChoice: undefined,
      errorMessage: undefined,
    }))
  }, [steps])

  let content: ReactNode

  switch (resolveScreen(session, steps.length > 0)) {
    case 'brain-dump':
      content = (
        <Shell onCreatorsClick={handleOpenCreators} onLandingClick={handleOpenLanding}>
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
        <Shell onCreatorsClick={handleOpenCreators} onLandingClick={handleOpenLanding}>
          <NextMoveScreen nextMove={session.nextMove} onChoose={handleChoose} />
        </Shell>
      )
      break
    case 'after-done':
      content = (
        <Shell onCreatorsClick={handleOpenCreators} onLandingClick={handleOpenLanding}>
          <AfterDoneScreen nextMove={session.nextMove} onStartAgain={handleStartAgain} />
        </Shell>
      )
      break
    case 'landing': 
      content = (
        <Shell onCreatorsClick={handleOpenCreators} onLandingClick={handleOpenLanding}>
          <LandingScreen onClickTyping={handleTyping}  onClickAsking={handleAsking} />
        </Shell>
      )
      break
    case 'creators':
      content = (
        <Shell onCreatorsClick={handleOpenCreators} onLandingClick={handleOpenLanding}>
          <CreatorsScreen />
        </Shell>
      )
      break
    case 'no-task':
      content = (
        <Shell onCreatorsClick={handleOpenCreators} onLandingClick={handleOpenLanding}>
          <NoTaskScreen onAddNew={handleTyping} />
        </Shell>
      )
      break
    default:
      content = (
        <Shell onCreatorsClick={handleOpenCreators} onLandingClick={handleOpenLanding}>
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
function Shell({
  children,
  onCreatorsClick,
  onLandingClick,
}: {
  children: ReactNode
  onCreatorsClick: () => void
  onLandingClick: () => void
}) {
  return (
    <>
      <div className={styles.app} style={{ backgroundImage: `url(${backgroundImage})` }}>
        <Header onCreatorsClick={onCreatorsClick} />
        <main className={styles.main}>{children}</main>
        
        <GlassNav onLandingClick={onLandingClick} />
      </div>
    </>
  )
}

export default App
