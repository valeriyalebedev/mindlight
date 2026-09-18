import backgroundImage from '../static/baclground.webp'
import orbImage from '../static/Orb.png'
import styles from './Loader.module.css'

function Loader() {
  return (
    <main
      className={styles.loader}
      style={{ backgroundImage: `url(${backgroundImage})` }}
      aria-busy="true"
      aria-live="polite"
      role="status"
    >
      <div className={styles.content}>
        <h1 className={styles.text}>
          Less in your head
          <br />
          More in your life
        </h1>

        <img className={styles.orb} width="628" height="628" src={orbImage} alt="" aria-hidden="true" />
      </div>
    </main>
  )
}

export default Loader
