import type { BrainDump, NextMove } from '../types/mindlight'

/**
 * Placeholder next move.
 *
 * Mindlight has no LLM integration yet (see README), so the processing step has
 * nothing real to derive a suggestion from. This produces a plausible next move
 * instead, so the flow after "Let it out" can be exercised end to end.
 *
 * It is deliberately not pretending to understand the brain dump: the text is
 * only used to record where the move came from. When the real derivation lands,
 * this file is the only thing that has to change.
 */

const NEXT_MOVES: ReadonlyArray<{ title: string; rationale: string }> = [
  {
    title: 'Answer the one message that is actually waiting on you',
    rationale: 'Someone else is blocked on it, so replying clears more than it costs.',
  },
  {
    title: 'Write the first three lines of the thing you keep avoiding',
    rationale: 'Starting is the part that is stuck. Three lines is small enough to begin.',
  },
  {
    title: 'Put the rest on a list and close it',
    rationale: 'You are holding everything at once. Writing it down frees the space without deciding anything.',
  },
  {
    title: 'Do the five-minute version of the biggest item',
    rationale: 'The biggest item takes up the most room, and five minutes is enough to shrink it.',
  },
  {
    title: 'Say no to the thing you already know you will not do',
    rationale: 'It is quietly costing you something every time you think about it. Deciding ends that.',
  },
  {
    title: 'Step away for ten minutes before choosing anything',
    rationale: 'Nothing here is urgent enough that ten minutes will hurt, and you will choose better after.',
  },
]

/**
 * Builds a single next move for the current session.
 *
 * `previousTitle` is the move the user just rejected with "another one", and is
 * excluded so asking for an alternative visibly changes the suggestion.
 */
export function createStubNextMove(brainDump: BrainDump, previousTitle?: string): NextMove {
  const candidates = NEXT_MOVES.filter((move) => move.title !== previousTitle)
  const pool = candidates.length > 0 ? candidates : NEXT_MOVES
  const picked = pool[Math.floor(Math.random() * pool.length)]

  return {
    id: crypto.randomUUID(),
    title: picked.title,
    rationale: picked.rationale,
    createdAt: brainDump.createdAt,
  }
}
