import styles from './GlowOrb.module.css'

/**
 * The Mindlight light: a small warm orb with a soft halo.
 *
 * This is the product's recurring visual language (mental fog -> a small light
 * -> clarity). It is purely decorative, so it is hidden from assistive tech.
 */
function GlowOrb() {
  return <span className={styles.orb} aria-hidden="true" />
}

export default GlowOrb