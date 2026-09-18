import type { NextMove } from '../../types/mindlight'
import styles from './AfterDoneScreen.module.css'

type AfterDoneScreenProps = {
  /** The next move the user just accepted, if there is one. */
  nextMove?: NextMove
  /** Clears the session and returns to the brain dump. */
  onStartAgain: () => void
}

/**
 * Step 6 of the flow: what the user sees right after accepting a next move.
 *
 * This is a minimal stub. Its only job right now is to give "Accept" somewhere
 * to land, and to offer the way back into the flow. The real After Done screen
 * (and its visual design) replaces this.
 */
function AfterDoneScreen({ nextMove, onStartAgain }: AfterDoneScreenProps) {
  return (
    <section className={styles.screen}>
      <div className={styles.column}>
        <p className={styles.eyebrow}>Done</p>

        {nextMove ? <p className={styles.recap}>{nextMove.title}</p> : null}

        <h1 className={styles.headline}>That&rsquo;s the one. Go do it.</h1>

        <button type="button" className={styles.action} onClick={onStartAgain}>
          Something else on my mind
        </button>
      </div>
    </section>
  )
}

export default AfterDoneScreen
