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
 * First Mindlight screen: "I don't need to organize my thoughts first."
 *
 * The copy asks the question, the form is the only interaction, and nothing is
 * required of the user beyond writing.
 */
function BrainDumpScreen({ onSubmit, submittedBrainDump }: BrainDumpScreenProps) {
  function handleSubmit(text: string) {
    onSubmit?.({
      text,
      createdAt: new Date().toISOString(),
    })
  }

  return (
    <section className={styles.screen}>
      <div className={styles.column}>
        <PearlOrb />

        <h1 className={styles.headline}>What&rsquo;s taking up space in your head?</h1>
        <p className={styles.support}>Put it here. It doesn&rsquo;t need to make sense yet.</p>

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
