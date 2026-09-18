import { useEffect, useState } from 'react'
import styles from './BrainDumpThinking.module.css';

const STEPS = ['reading', 'defining', 'prioritising', 'finishing'] as const

type Step = (typeof STEPS)[number]

type BrainDumpThinkingProps = {
  fallback: () => void
}

const STEP_LABELS: Record<Step, string> = {
  reading: 'Reading your input',
  defining: 'Defining tasks and due dates',
  prioritising: 'Prioritising',
  finishing: 'Almost there...',
}

function BrainDumpThinking({ fallback }: BrainDumpThinkingProps) {
  const [completed, setCompleted] = useState<Step[]>([])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    let nextStepIndex = 0

    function scheduleNextStep() {
      if (nextStepIndex > STEPS.length) {
        fallback()
        return
      }

      const delay = nextStepIndex === 0 ? 1000 : 2000

      timer = setTimeout(() => {
        const step = STEPS[nextStepIndex]
        nextStepIndex += 1
        setCompleted((previous) => [...previous, step])

        if (nextStepIndex > STEPS.length) {
          fallback()
          return
        }

        scheduleNextStep()
      }, delay)
    }

    scheduleNextStep()

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [fallback])

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
