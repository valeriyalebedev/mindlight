import { useId } from 'react'
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
        </div>

        

        <div className={styles.actions}>
          <MainButton type="button" onClick={() => onChoose('accept')}>
            Done
          </MainButton>
          <MainButton type="button" onClick={() => onChoose('alternative')}>
            Skip
          </MainButton>
          <MainButton type="button" onClick={() => onChoose('not-now')}>
            Not now
          </MainButton>
        </div>
      </article>
    </section>
  )
}

export default NextMoveScreen
