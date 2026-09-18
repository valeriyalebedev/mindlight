import { useId } from 'react'
import type { NextMove, UserChoice } from '../../types/mindlight'
import styles from './NextMoveScreen.module.css'

type NextMoveScreenProps = {
  /** The single next move for this session. */
  nextMove: NextMove
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

  return (
    <section className={styles.screen}>
      <article className={styles.card} aria-labelledby={titleId}>
        <p className={styles.eyebrow}>Your next move</p>

        <h1 id={titleId} className={styles.title}>
          {nextMove.title}
        </h1>

        <p className={styles.rationale}>{nextMove.rationale}</p>

        <div className={styles.actions}>
          <button type="button" className={styles.primary} onClick={() => onChoose('accept')}>
            Accept
          </button>
          <button type="button" className={styles.secondary} onClick={() => onChoose('alternative')}>
            Show me another
          </button>
          <button type="button" className={styles.secondary} onClick={() => onChoose('not-now')}>
            Not now
          </button>
        </div>
      </article>
    </section>
  )
}

export default NextMoveScreen
