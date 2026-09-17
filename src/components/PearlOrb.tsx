import type { CSSProperties, ReactNode } from 'react'
import styles from './PearlOrb.module.css'

type PearlOrbProps = {
  children?: ReactNode
  className?: string
  size?: string
}

/**
 * Iridescent Mindlight orb.
 *
 * Decorative by default: the layered gradients create the pearly depth without
 * adding semantic noise for screen readers.
 */
function PearlOrb({ children, className, size }: PearlOrbProps) {
  const style = size ? ({ '--pearl-orb-size': size } as CSSProperties) : undefined
  const classNames = className ? `${styles.wrap} ${className}` : styles.wrap

  return (
    <div className={classNames} style={style} aria-hidden={children ? undefined : true}>
      <span className={styles.halo} />
      <span className={styles.orb}>
        <span className={styles.base} />
        <span className={styles.spiral} />
        <span className={styles.spiralAlt} />
        <span className={styles.core} />
        <span className={styles.sparkles} />
      </span>
      <span className={styles.gloss} />
      <span className={styles.fresnel} />
      <span className={styles.glint} />
      <span className={styles.rim} />
      {children ? <div className={styles.content}>{children}</div> : null}
    </div>
  )
}

export default PearlOrb
