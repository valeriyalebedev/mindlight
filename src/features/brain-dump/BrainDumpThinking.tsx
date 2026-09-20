import { useEffect, useState } from 'react'
import styles from './BrainDumpThinking.module.css';

const STEPS = ['taking', 'sorting', 'release'] as const

type Step = (typeof STEPS)[number]

type BrainDumpThinkingProps = {
  fallback: () => void
}

const STEP_LABELS: Record<Step, string> = {
  taking: 'Taking this off your mind…',
  sorting: 'Sorting through what matters.',
  release: 'You don’t need to keep track of everything right now.',
}

/** How long each line holds before the next one lights up. */
const STEP_MS = 800
/** A short beat with every line finished, before the next move appears. */
const HOLD_MS = 500

function BrainDumpThinking({ fallback }: BrainDumpThinkingProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const completed = STEPS.slice(0, stepIndex)

  useEffect(() => {
    const isFinished = stepIndex >= STEPS.length

    const timer = setTimeout(() => {
      if (isFinished) {
        fallback()
        return
      }

      setStepIndex((current) => current + 1)
    }, isFinished ? HOLD_MS : STEP_MS)

    return () => clearTimeout(timer)
  }, [stepIndex, fallback])

  return (
    <div className={styles.brainDumpThinking}>
      <ul>
        {STEPS.map((step) => (
          <li key={step} data-completed={completed.includes(step)}>
            {STEP_LABELS[step]}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BrainDumpThinking
