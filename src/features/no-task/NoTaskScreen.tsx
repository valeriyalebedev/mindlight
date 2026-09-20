import MainButton from '../../components/Button'
import PearlOrb from '../../components/PearlOrb'
import styles from './NoTaskScreen.module.css'

type NoTaskScreenProps = {
  onAddNew: () => void
}

function NoTaskScreen({ onAddNew }: NoTaskScreenProps) {
  return (
    <section className={styles.screen}>
      <div className={styles.content}>
        <div className={styles.orbSlot}>
          <PearlOrb className={styles.orb} />
        </div>
        <h1 className={styles.title}>There are no tasks right now</h1>
        <MainButton type="button" onClick={onAddNew}>
          Add new one
        </MainButton>
      </div>
    </section>
  )
}

export default NoTaskScreen
