import type { NextMove } from '../../types/mindlight';
import MainButton from '../../components/Button';
import PearlOrb from '../../components/PearlOrb';
import styles from './AfterDoneScreen.module.css';

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
function AfterDoneScreen({ onStartAgain }: AfterDoneScreenProps) {
  return (
    <section className={styles.screen}>
      <div className={styles.column}>
        <h2 className={styles.headline}>Nice! One thing down</h2>
        <div className={styles.orbSlot}>
          <PearlOrb className={styles.orb} />
        </div>
        <h1 className={styles.headline}>Ready for the next one?</h1>
        <MainButton type="button" onClick={onStartAgain}>
          Show next step
        </MainButton>
      </div>
    </section>
  )
}

export default AfterDoneScreen
