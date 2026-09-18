import styles from './ProcessingScreen.module.css'

/**
 * Step 4 of the flow: the beat between handing over a brain dump and being shown
 * one next move.
 *
 * Presentational only - the app owns the timing and the state change. The copy
 * and layout here are deliberately minimal; the visual design for this screen
 * arrives separately, so nothing here should be treated as final styling.
 */
function ProcessingScreen() {
  return (
    <section className={styles.screen}>
      <p className={styles.status} role="status">
        Reading what you wrote, looking for the one thing to do next.
      </p>
    </section>
  )
}

export default ProcessingScreen
