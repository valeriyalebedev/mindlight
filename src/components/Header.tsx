import styles from './Header.module.css'

function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Main">
        <button type="button" className={`${styles.iconButton} ${styles.left}`} aria-label="who">
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none"><path d="M20 18V20H18M20 14H19L17 16M16 18H14V20M4 4H10V10H4V4ZM14 4H20V10H14V4ZM4 14H10V20H4V14ZM14 14V15H15V14H14Z" stroke="#7A2060" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path d="M17 7H17.001" stroke="#7A2060" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path d="M7 7H7.001" stroke="#7A2060" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path d="M7 17H7.001" stroke="#7A2060" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
        </button>

        <div className={styles.wordmark} aria-label="home">MindLight</div>

        <button type="button" className={`${styles.iconButton} ${styles.right}`} aria-label="profile">
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
<g clip-path="url(#clip0_433_243)">
<path d="M8.5893 10.5141C5.393 10.803 2.95787 13.5038 3.0003 16.7128V16.8756C3.0003 17.4969 3.50399 18.0006 4.1253 18.0006C4.74662 18.0006 5.2503 17.4969 5.2503 16.8756V16.6678C5.21648 14.6975 6.67054 13.0173 8.6253 12.7678C10.6887 12.5632 12.5274 14.0701 12.732 16.1335C12.7441 16.2555 12.7502 16.378 12.7503 16.5006V16.8756C12.7503 17.4969 13.254 18.0006 13.8753 18.0006C14.4966 18.0006 15.0003 17.4969 15.0003 16.8756V16.5006C14.9966 13.1831 12.3043 10.4968 8.98692 10.5004C8.85427 10.5006 8.72167 10.5051 8.5893 10.5141Z" fill="#7A2060"/>
<path d="M9.00024 9C11.4855 9 13.5002 6.98527 13.5002 4.5C13.5002 2.01473 11.4855 0 9.00024 0C6.51498 0 4.50024 2.01473 4.50024 4.5C4.50271 6.98425 6.516 8.9975 9.00024 9ZM9.00024 2.25C10.2429 2.25 11.2502 3.25737 11.2502 4.5C11.2502 5.74263 10.2429 6.75 9.00024 6.75C7.75761 6.75 6.75024 5.74263 6.75024 4.5C6.75024 3.25737 7.75761 2.25 9.00024 2.25Z" fill="#7A2060"/>
</g>
<defs>
<clipPath id="clip0_433_243">
<rect width="18" height="18" fill="white"/>
</clipPath>
</defs>
</svg>
        </button>
      </nav>
    </header>
  )
}

export default Header