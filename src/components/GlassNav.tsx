import styles from './GlassNav.module.css'

/**
 * Translucent glass pill navigation from the landing screen: profile icon,
 * centered wordmark, menu icon.
 *
 * The two icon buttons are placeholders: the profile and the menu have no
 * destinations yet, so they expose an accessible name and no action.
 */
function GlassNav() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Main">
        <button type="button" className={`${styles.iconButton} ${styles.left}`} aria-label="Profile">
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="8.5" r="3.75" />
            <path d="M5 19.25c1.35-3 4.05-4.75 7-4.75s5.65 1.75 7 4.75" />
          </svg>
        </button>

        <span className={styles.wordmark}>MindLight</span>

        <button type="button" className={`${styles.iconButton} ${styles.right}`} aria-label="Menu">
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 7.5h16" />
            <path d="M4 12h16" />
            <path d="M4 16.5h16" />
          </svg>
        </button>
      </nav>
    </header>
  )
}

export default GlassNav