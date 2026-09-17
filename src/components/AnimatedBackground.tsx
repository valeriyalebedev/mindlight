import styles from './AnimatedBackground.module.css'

/**
 * The dreamy pastel atmosphere, made subtly alive.
 *
 * A very slowly rotating aurora and a warm light bloom sit behind four huge,
 * heavily blurred pastel layers, plus a soft plum wash that deepens the area
 * behind the content so white type stays readable. Purely decorative, so it is
 * hidden from assistive technology.
 *
 * Every loop is long (30-90s) and only ever travels a few percent, so the
 * background reads as a still pastel sky that happens to breathe rather than as
 * motion competing with the content. In reduced-motion mode every animation is
 * switched off in the stylesheet.
 */
function AnimatedBackground() {
  return (
    <div className={styles.background} aria-hidden="true">
      <span className={styles.aurora} />
      <span className={`${styles.layer} ${styles.peach}`} />
      <span className={`${styles.layer} ${styles.pink}`} />
      <span className={`${styles.layer} ${styles.lavender}`} />
      <span className={`${styles.layer} ${styles.blue}`} />
      <span className={styles.glow} />
      <span className={styles.colorShift} />
      <span className={styles.shimmer} />
      <span className={styles.sparkleMist} />
      <span className={styles.haze} />
    </div>
  )
}

export default AnimatedBackground
