import PearlOrb from '../../components/PearlOrb'
import styles from './LandingScreen.module.css'

type LandingScreenProps = {
  /** Leaves the entry screen and opens the brain dump flow. */
  onGetStarted: () => void
}

function LandingScreen({ onGetStarted }: LandingScreenProps) {
  return (
    <section className={styles.hero}>
      <h1 className={styles.headline}>
        Less in your head.
        More in your life.
      </h1>

      <PearlOrb className={styles.orb} size="min(78vw, 40svh, 32rem)">
        <span className={styles.orbTitle}>What&rsquo;s on your mind?</span>
        <span className={styles.orbText}>
          Drop your thoughts.
          <br />
          I&rsquo;ll help you find the next step.
        </span>
      </PearlOrb>

      <button type="button" className={styles.cta} onClick={onGetStarted}>
        Get started
      </button>
    </section>
  )
}

export default LandingScreen
