import { useState } from 'react';
import PearlOrb from '../../components/PearlOrb';
import type { BrainDump } from '../../types/mindlight';
import BrainDumpForm from './BrainDumpForm';
import BrainDumpThinking from './BrainDumpThinking';
import styles from './BrainDumpScreen.module.css';

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
function BrainDumpScreen({ onSubmit }: BrainDumpScreenProps) {
  const [brainProcess, setBrainProcess] = useState<'await' | 'thinking' | 'done'>('await')
  function handleSubmit(text: string) {
    onSubmit?.({
      text,
      createdAt: new Date().toISOString(),
    })
    setBrainProcess('thinking')
  }

  function handleFallback() {
    setBrainProcess('done')
    setTimeout(() => setBrainProcess('await'), 5500)
  }

  return (
    <section className={styles.screen}>
      <div className={styles.column}>
        <div className={styles.orbSlot}>
          <PearlOrb className={styles.orb} isTurning={brainProcess === 'thinking'} />
        </div>

        {
          brainProcess === 'await' && (
            <div>
              <h1 className={styles.headline}>What&rsquo;s taking up space in your head?</h1>
              <p className={styles.support}>Put it here. It doesn&rsquo;t need to make sense yet.</p>

              <BrainDumpForm onSubmit={handleSubmit} />
            </div>
        )}
        {
          brainProcess === 'thinking' && (<BrainDumpThinking fallback={handleFallback}/>)
        }
      </div>
    </section>
  )
}

export default BrainDumpScreen
