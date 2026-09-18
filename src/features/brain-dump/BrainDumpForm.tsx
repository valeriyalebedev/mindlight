import { useId, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react'
import styles from './BrainDumpForm.module.css'

type BrainDumpFormProps = {
  /** Called with the text the user dumped, trimmed. */
  onSubmit: (text: string) => void
}

/**
 * The brain dump input.
 *
 * Owns the textarea value and nothing else: the text is trimmed and handed to
 * the caller, who decides what it means. Nothing is persisted.
 */
function BrainDumpForm({ onSubmit }: BrainDumpFormProps) {
  const [text, setText] = useState('')
  const textareaId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const trimmedText = text.trim()
  const canSubmit = trimmedText.length > 0

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canSubmit) {
      return
    }

    onSubmit(trimmedText)
    setText('')
  }

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setText(event.target.value)
  }

  /** Cmd/Ctrl + Enter submits; plain Enter keeps adding line breaks. */
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  function handleAddFilesClick() {
    fileInputRef.current?.click()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label} htmlFor={textareaId}>
        Your brain dump
      </label>
      <textarea
        id={textareaId}
        className={styles.textarea}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={7}
        placeholder="Start anywhere. Messy is fine."
        aria-keyshortcuts="Meta+Enter Control+Enter"
      />
      <input
        ref={fileInputRef}
        className={styles.fileInput}
        type="file"
        multiple
        tabIndex={-1}
      />
      <button
        className={styles.addFilesBtn}
        type="button"
        aria-label="Add files"
        onClick={handleAddFilesClick}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M7.12026 16C5.50237 16.0021 3.94814 15.3697 2.79135 14.2386C0.370786 11.7232 0.418052 7.73043 2.8975 5.27306L6.78707 1.38415C8.37631 -0.250815 10.9278 -0.463526 12.7658 0.885733C14.724 2.3891 15.0927 5.19522 13.5893 7.15339C13.4719 7.30633 13.3447 7.45153 13.2086 7.58804L9.13826 11.6583C8.68019 12.1373 8.07225 12.4453 7.41516 12.5316C6.52448 12.6292 5.64275 12.2829 5.05657 11.6052C4.15789 10.454 4.25397 8.81449 5.28093 7.77609L8.38387 4.67586C8.77736 4.2825 9.41521 4.2825 9.8087 4.67586C10.2021 5.06936 10.2021 5.70721 9.8087 6.1007L6.61039 9.29971C6.32896 9.58132 6.32912 10.0377 6.61073 10.3191C6.89234 10.6005 7.34875 10.6004 7.63014 10.3188L11.7374 6.21223C12.5806 5.39234 12.7365 4.09488 12.1116 3.09856C11.3736 1.96179 9.8538 1.63849 8.71703 2.37647C8.5747 2.46886 8.44235 2.57577 8.32206 2.69549L4.26858 6.75234C2.73646 8.24003 2.53742 10.6303 3.80238 12.3509C5.20936 14.1833 7.83545 14.5282 9.66785 13.1212C9.81103 13.0113 9.94694 12.8922 10.0747 12.7647L13.2737 9.56639C13.6672 9.17303 14.305 9.17303 14.6985 9.56639C15.0919 9.95988 15.0919 10.5977 14.6985 10.9912L11.4996 14.1895C10.3388 15.3517 8.76278 16.0032 7.12026 16Z" fill="white"/>
        </svg>
      </button>
      <button className={styles.button} type="submit" disabled={!canSubmit}>
        Let it out
      </button>
    </form>
  )
}

export default BrainDumpForm
