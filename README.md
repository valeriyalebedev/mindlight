# Mindlight

Mindlight turns mental overload into one clear next move.

You write down everything that is on your mind (a brain dump). Mindlight reads it,
works out the single most useful thing to do next, and explains in one short
sentence why that is the next move. You can accept it, say "Not now", or ask for an
alternative.

## Current MVP goal

Ship the smallest end-to-end loop, entirely in the browser:

1. **Brain dump** - the user types whatever is on their mind.
2. **Processing** - Mindlight derives one next move from that text.
3. **One next move** - a single suggestion, never a list.
4. **Short rationale** - one or two sentences of "why this".
5. **User decides** - accept it, choose "Not now", or ask for an alternative.

Session state lives in memory for the current browser session only.

The product UI and the LLM integration are **not built yet**; the repository is
currently a minimal foundation that this flow will be built on.

## Tech stack

- [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/) (strict mode)
- [Vite](https://vite.dev/) for dev server and building
- [ESLint](https://eslint.org/) (flat config) for linting

No UI framework, state library, router, or backend. No additional dependencies
beyond the ones above.

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Then open the URL printed by Vite (http://localhost:5173 by default).

## Build

```bash
npm run build
```

Type-checks the project (`tsc -b`) and produces a production bundle in `dist/`.

To preview the built output:

```bash
npm run preview
```

To lint:

```bash
npm run lint
```

## Project structure

```
mindlight/
├── index.html                  # Vite HTML entry point
├── src/
│   ├── main.tsx                # React entry point (mounts App)
│   ├── App.tsx                 # Placeholder shell (product UI not built yet)
│   ├── index.css               # Global styles: design tokens + reset
│   ├── types/
│   │   └── mindlight.ts        # Domain model (brain dump, next move, session)
│   ├── app/                    # App-level composition (empty)
│   ├── components/             # Shared presentational components (empty)
│   ├── features/
│   │   ├── brain-dump/         # Brain dump capture feature (empty)
│   │   └── next-move/          # Next move feature (empty)
│   ├── lib/                    # Non-React helpers (empty)
│   ├── mocks/                  # Fixtures for local development (empty)
│   └── styles/                 # Extracted CSS, if needed (empty)
├── tsconfig.json               # TS solution config
├── tsconfig.app.json           # TS config for src/
├── tsconfig.node.json          # TS config for build tooling
├── eslint.config.js            # ESLint flat config
└── vite.config.ts              # Vite config
```

## Not included in the MVP

Deliberately out of scope, now and for the MVP:

- No LLM / AI integration yet
- No persistence - session state is in memory only, and a reload starts over
- No authentication or user accounts
- No payments or subscriptions
- No task management (no task lists, projects, due dates or statuses)
- No reminders or notifications
- No dashboard, history or analytics
- No gamification (no streaks, points or badges)
- No backend, database or API
- No routing and no multi-page navigation
- No UI component library or theme system
