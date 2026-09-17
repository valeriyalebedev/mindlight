import PearlOrb from '../../components/PearlOrb'
import type { BrainDump } from '../../types/mindlight'
import BrainDumpForm from './BrainDumpForm'
import styles from './BrainDumpScreen.module.css'

type BrainDumpScreenProps = {
  /** Receives the brain dump of the current session, trimmed. */
  onSubmit?: (brainDump: BrainDump) => void
  /** The brain dump submitted most recently, if any. */
  submittedBrainDump?: BrainDump | null
}

/**
 * Step 3 of the flow: "I don't need to organize my thoughts first."
 *
 * The question and the prompt sit inside the ball, so it stays the centre of the
 * screen. The form stays outside the ball and below it, where it can be typed
 * in - the orb's content layer is not interactive.
 */
function BrainDumpScreen({ onSubmit, submittedBrainDump }: BrainDumpScreenProps) {
  function handleSubmit(text: string) {
    onSubmit?.({
      text,
      createdAt: new Date().toISOString(),
    })
  }

  return (
    <section className={styles.hero}>
      <PearlOrb className={styles.orb} size="clamp(600px, 85vw, 400px)">
        <h1 className={styles.orbTitle}>What&rsquo;s taking up space in your head?</h1>
        <span className={styles.orbText}>
          Put it here. It doesn&rsquo;t need to make sense yet.
        </span>
      </PearlOrb>

      <div className={styles.column}>
        <BrainDumpForm onSubmit={handleSubmit} />

        {submittedBrainDump ? (
          <p className={styles.acknowledgement} role="status">
            It&rsquo;s out of your head. For now, that&rsquo;s enough.
          </p>
        ) : null}
      </div>
    </section>
  )
}

export default BrainDumpScreen
