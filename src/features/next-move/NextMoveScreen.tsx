import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { NextMove, UserChoice } from '../../types/mindlight'
import  MainButton from '../../components/Button';
import orbImage from '../../static/Orb.png'
import styles from './NextMoveScreen.module.css'

type NextMoveScreenProps = {
  /** The single next move for this session. */
  nextMove?: NextMove
  /** What the user did with it: accept, "Not now", or ask for another. */
  onChoose: (choice: UserChoice) => void
}

/**
 * Steps 5 and 7 of the flow: one next move, one short rationale, and the three
 * decisions the user can make about it.
 *
 * It never shows a list - the whole point of Mindlight is that there is exactly
 * one suggestion on screen. Layout is minimal and awaits the visual design.
 */
function NextMoveScreen({ nextMove, onChoose }: NextMoveScreenProps) {
  const titleId = useId()
  const [pendingChoice, setPendingChoice] = useState<UserChoice | null>(null)
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current)
      }
    }
  }, [])

  function handleChoice(choice: UserChoice) {
    if (choice !== 'accept') {
      onChoose(choice)
      return
    }

    if (feedbackTimeoutRef.current || pendingChoice) {
      return
    }

    setPendingChoice(choice)
    feedbackTimeoutRef.current = setTimeout(() => {
      feedbackTimeoutRef.current = null
      onChoose(choice)
    }, 300)
  }

  if (!nextMove) {
    return null
  }

  return (
    <section className={styles.screen}>
      {createPortal(
        <div className={styles.orbPortal} aria-hidden="true">
          <img className={styles.portalOrb} src={orbImage} alt="" />
        </div>,
        document.body,
      )}
      <div className={styles.headingWrapper}>
        <h1 className={styles.heading}>Don’t think about everything</h1>
        <p className={styles.eyebrow}>Your next move</p>
      </div>
      <article className={styles.card} aria-labelledby={titleId}>

        <div className={styles.content}>
          <h1 id={titleId} className={styles.title}>
            {nextMove.title}
          </h1>
          <p className={styles.rationale}>{nextMove.rationale}</p>
          <p className={styles.reassurance}>The rest is off your mind for now.</p>
        </div>

        

        <div className={styles.actions} data-feedback={pendingChoice ?? undefined}>
          <MainButton type="button" onClick={() => handleChoice('accept')}>
            <span className={styles.doneLabel}>
              {pendingChoice === 'accept' && (
                <svg
                  className={styles.checkIcon}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M22.3189 4.43101L8.49988 18.249C8.40697 18.3423 8.29655 18.4163 8.17497 18.4668C8.05339 18.5173 7.92303 18.5433 7.79138 18.5433C7.65972 18.5433 7.52937 18.5173 7.40778 18.4668C7.2862 18.4163 7.17579 18.3423 7.08288 18.249L1.73888 12.9C1.64597 12.8067 1.53555 12.7327 1.41397 12.6822C1.29239 12.6317 1.16203 12.6057 1.03038 12.6057C0.898723 12.6057 0.768365 12.6317 0.646783 12.6822C0.5252 12.7327 0.414787 12.8067 0.321877 12.9C0.2286 12.9929 0.154588 13.1033 0.104086 13.2249C0.0535845 13.3465 0.0275879 13.4769 0.0275879 13.6085C0.0275879 13.7402 0.0535845 13.8705 0.104086 13.9921C0.154588 14.1137 0.2286 14.2241 0.321877 14.317L5.66788 19.662C6.23182 20.2249 6.99607 20.5411 7.79288 20.5411C8.58968 20.5411 9.35393 20.2249 9.91788 19.662L23.7359 5.84701C23.829 5.75412 23.9029 5.64377 23.9533 5.52228C24.0037 5.40079 24.0297 5.27054 24.0297 5.13901C24.0297 5.00747 24.0037 4.87723 23.9533 4.75574C23.9029 4.63425 23.829 4.5239 23.7359 4.43101C23.643 4.33773 23.5326 4.26372 23.411 4.21322C23.2894 4.16272 23.159 4.13672 23.0274 4.13672C22.8957 4.13672 22.7654 4.16272 22.6438 4.21322C22.5222 4.26372 22.4118 4.33773 22.3189 4.43101Z"
                    fill="#F9B2DD"
                  />
                </svg>
              )}
              Done
            </span>
          </MainButton>
          <MainButton type="button" onClick={() => handleChoice('alternative')}>
            Skip
          </MainButton>
          <MainButton type="button" onClick={() => handleChoice('not-now')}>
            Not now
          </MainButton>
        </div>
      </article>
    </section>
  )
}

export default NextMoveScreen
