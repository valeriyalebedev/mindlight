import { useState } from 'react'
import AnimatedBackground from './components/AnimatedBackground'
import GlassNav from './components/GlassNav'
import BrainDumpScreen from './features/brain-dump/BrainDumpScreen'
import LandingScreen from './features/landing/LandingScreen'
import type { BrainDump } from './types/mindlight'
import styles from './App.module.css'

type View = 'landing' | 'brain-dump'

/**
 * Mindlight.
 *
 * The app owns the session state and which screen is showing; the screens stay
 * presentational. The glass navigation and the animated pastel background are
 * app-level so every screen shares the same atmosphere.
 *
 * Nothing is persisted: a reload starts over.
 */
function App() {
  const [view, setView] = useState<View>('landing')
  const [submittedBrainDump, setSubmittedBrainDump] = useState<BrainDump | null>(null)

  return (
    <>
      <AnimatedBackground />

      <div className={styles.app}>
        <GlassNav />

        <main className={styles.main}>
          {view === 'landing' ? (
            <LandingScreen onGetStarted={() => setView('brain-dump')} />
          ) : (
            <BrainDumpScreen
              onSubmit={setSubmittedBrainDump}
              submittedBrainDump={submittedBrainDump}
            />
          )}
        </main>
      </div>
    </>
  )
}

export default App
