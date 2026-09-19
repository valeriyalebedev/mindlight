import { useEffect, useState } from 'react'
import { CREATORS } from '../../constants/creators'
import { HeaderLeftButton } from '../../components/Header'
import qrAnna from '../../static/qr-anna.png'
import qrMarina from '../../static/qr-marina.png'
import qrValeriya from '../../static/qr-valeriya.png'
import styles from './Creators.module.css'

type Creator = (typeof CREATORS)[number]

const qrImages: Record<string, string> = {
  'qr-anna.png': qrAnna,
  'qr-marina.png': qrMarina,
  'qr-valeriya.png': qrValeriya,
}

function Creators() {
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null)

  const closePopup = () => setSelectedCreator(null)

  useEffect(() => {
    if (!selectedCreator) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePopup()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedCreator])

  return (
    <section className={styles.screen} aria-labelledby="creators-title">
      <div className={styles.content}>
        <h1 id="creators-title" className={styles.title}>Creators:</h1>

        <ul className={styles.list}>
          {CREATORS.map((creator) => (
            <li key={creator.name} className={styles.creator}>
              <span>{creator.name}</span>
              <a
                className={styles.desktopQrLink}
                href={creator.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${creator.name}'s profile`}
              >
                <img
                  className={styles.desktopQr}
                  src={qrImages[creator.qr]}
                  alt={`QR code for ${creator.name}`}
                />
              </a>
              <HeaderLeftButton
                ariaLabel={`Open QR code for ${creator.name}`}
                onClick={() => setSelectedCreator(creator)}
              />
            </li>
          ))}
        </ul>
      </div>

      {selectedCreator && (
        <div className={styles.modalBackdrop} role="presentation" onClick={closePopup}>
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="qr-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={styles.closeButton}
              aria-label="Close QR code"
              onClick={closePopup}
            >
              &times;
            </button>
            <h2 id="qr-title" className={styles.modalTitle}>{selectedCreator.name}</h2>
            <a
              className={styles.popupQrLink}
              href={selectedCreator.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${selectedCreator.name}'s profile`}
            >
              <img
                className={styles.qr}
                src={qrImages[selectedCreator.qr]}
                alt={`QR code for ${selectedCreator.name}`}
              />
            </a>
          </div>
        </div>
      )}
    </section>
  )
}

export default Creators
