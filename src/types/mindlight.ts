/**
 * Mindlight domain model (MVP).
 *
 * State describes a single session and lives in memory only: there is no
 * persistence, backend, authentication or task management.
 */

export type ISODateTimeString = string

/** Where the brain dump -> next move flow currently stands. */
export type ProcessingState =
  | 'idle' // nothing captured yet
  | 'adding' // the user decided to add new task
  | 'capturing' // the user is writing the brain dump
  | 'details' // the user opened the creators screen
  | 'processing' // a next move is being derived from the brain dump
  | 'ready' // a next move is available
  | 'error' // processing failed

/** What the user did with the suggested next move. */
export type UserChoice =
  | 'accept' // accept this next move
  | 'not-now' // "Not now"
  | 'alternative' // ask for a different next move

export type BrainDump = {
  text: string
  createdAt: ISODateTimeString
}

/** The single next move Mindlight suggests for the session. */
export type NextMove = {
  id: string
  title: string
  /** Short explanation of why this is the next move. */
  rationale: string
  createdAt: ISODateTimeString
}

/** All state of the current session. */
export type MindlightSession = {
  id: string
  processingState: ProcessingState
  brainDump?: BrainDump
  nextMove?: NextMove
  userChoice?: UserChoice
  errorMessage?: string
}
