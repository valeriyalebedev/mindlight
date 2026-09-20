import { useState } from 'react';
import { createPortal } from 'react-dom';
import PearlOrb from '../../components/PearlOrb';
import orbImage from '../../static/Orb.png';
import type { BrainDump } from '../../types/mindlight';
import BrainDumpForm from './BrainDumpForm';
import BrainDumpThinking from './BrainDumpThinking';
import BrainDumpDone from './BrainDumpDone';
import styles from './BrainDumpScreen.module.css';

type BrainDumpScreenProps = {
  /** Receives the brain dump of the current session, trimmed. */
  onSubmit?: (brainDump: BrainDump) => void
  /** The brain dump submitted most recently, if any. */
  submittedBrainDump?: BrainDump | null
  /** Called when processing finishes and the next move should be shown. */
  onFallback?: () => void
}

/**
 * Step 3 of the flow: "I don't need to organize my thoughts first."
 *
 * The question and the prompt sit inside the ball, so it stays the centre of the
 * screen. The form stays outside the ball and below it, where it can be typed
 * in - the orb's content layer is not interactive.
 */
function BrainDumpScreen({ onSubmit, onFallback }: BrainDumpScreenProps) {
  const [brainProcess, setBrainProcess] = useState<'await' | 'processing' | 'done'>('await')
  function handleSubmit(text: string) {
    onSubmit?.({
      text,
      createdAt: new Date().toISOString(),
    })
    setBrainProcess('processing')
  }

  function handleFallback() {
    setBrainProcess('done')
    setTimeout(() => onFallback?.(), 1000)
  }

  return (
    <section className={styles.hero}>
      <div className={styles.column}>
        {brainProcess === 'await' && (
          <div className={styles.awaiting}>
            {createPortal(
              <div className={styles.orbPortal} aria-hidden="true">
                <img className={styles.portalOrb} src={orbImage} alt="" />
              </div>,
              document.body,
            )}
            <h1 className={styles.headline}>Add your thoughts</h1>
            <p className={styles.support}>You can write, paste, upload files or take a photo</p>
            <BrainDumpForm onSubmit={handleSubmit} />
          </div>
          )}
        {brainProcess === 'processing' && (
          <>
            <div className={styles.orbSlot}>
              <PearlOrb className={styles.orb} isTurning={brainProcess === 'processing'} />
            </div>
            <BrainDumpThinking fallback={handleFallback}/>
          </>)
        }
        {brainProcess === 'done' && (<BrainDumpDone />)}
      </div>
    </section>
  )
}

export default BrainDumpScreen
