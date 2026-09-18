import { useId, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react'
import  MainButton from '../../components/Button'
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
        aria-keyshortcuts="Meta+Enter Control+Enter"
        placeholder="Start typing your thoughts..."
      />
      <input
        ref={fileInputRef}
        className={styles.fileInput}
        type="file"
        multiple
        tabIndex={-1}
      />
      <MainButton type="submit" disabled={!canSubmit}>
        Let it out
      </MainButton>
    </form>
  )
}

export default BrainDumpForm
