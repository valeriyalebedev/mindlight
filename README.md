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

Session state is kept in React memory only. Reloading the page starts a new session.

The **whole loop is walkable in the browser today**: welcoming, landing, brain dump,
processing, one next move, and After Done after accepting. The Creators screen is
available from the header. Two honest caveats:

- The next move is produced by a **local placeholder** (`src/lib/stubNextMove.ts`),
  not by a model. The LLM integration is **not built yet**.
- The **visual design is still in progress**, so the processing, next move and
  After Done screens are behaviour-first and deliberately plain.

Current implementation notes:

- The file input is present in the brain dump form, but file and photo uploads are
  not wired up yet.
- The current processing experience is rendered by `BrainDumpThinking.tsx`.
  `ProcessingScreen.tsx` is prepared for the flow but is not currently rendered.

Planned screens still to build: home, history, document view, and settings.

## Tech stack

- [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/) (strict mode)
- [Vite](https://vite.dev/) for dev server and building
- [ESLint](https://eslint.org/) (flat config) for linting
- [Sora](https://fonts.google.com/specimen/Sora) (UI, body and headlines),
  loaded from Google Fonts

Runtime dependencies are React and React DOM. Development tooling includes Vite,
TypeScript, ESLint, and the related React and TypeScript plugins. There is no UI
framework, state library, router, backend, or API. Styles are plain CSS and CSS
Modules.

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
|- .gitignore
|- README.md
|- package.json                      # Project metadata and npm scripts
|- package-lock.json                 # Locked dependency versions
|- index.html                         # Vite HTML entry point
|- src/
|  |- main.tsx                        # React entry point (mounts App)
|  |- App.tsx                         # Session state and current screen flow
|  |- App.module.css                  # App shell layout styles
|  |- index.css                       # Global styles, tokens and reset
|  |- components/                     # Shared UI components
|  |  |- AnimatedBackground.tsx       # Animated pastel background
|  |  |- Button.tsx                   # Reusable button
|  |  |- GlassNav.tsx                 # Glass navigation at the bottom of the page
|  |  |- GlowOrb.tsx                  # Decorative glow orb
|  |  |- Header.tsx                   # App header
|  |  |- Loader.tsx                   # Initial loading screen
|  |  +- PearlOrb.tsx                 # Iridescent orb component
|  |- constants/                      # Mock data and creator information
|  |  |- creators.tsx                 # Creators' data
|  |  +- mock.tsx                     # Mock next steps for local flow
|  |- features/                       # User-facing screens grouped by flow
|  |  |- welcoming/                   # Welcome screen
|  |  |  +- WelcomingScreen.tsx
|  |  |- landing/                     # Landing screen and entry actions
|  |  |  +- LandingScreen.tsx
|  |  |- brain-dump/                  # Brain dump input and processing states
|  |  |  |- BrainDumpScreen.tsx
|  |  |  |- BrainDumpForm.tsx
|  |  |  |- BrainDumpThinking.tsx
|  |  |  +- BrainDumpDone.tsx
|  |  |- next-move/                   # Processing and next move screens
|  |  |  |- ProcessingScreen.tsx
|  |  |  +- NextMoveScreen.tsx
|  |  |- after-done/                  # Screen shown after accepting a move
|  |  |  +- AfterDoneScreen.tsx
|  |  +- creators/                    # Creators information screen
|  |     +- Creators.tsx
|  |- lib/
|  |  +- stubNextMove.ts              # Placeholder next move before LLM integration
|  |- static/                         # Images used by the app
|  |  |- background.webp
|  |  |- Orb.png
|  |  |- qr-anna.png
|  |  |- qr-marina.png
|  |  +- qr-valeriya.png
|  +- types/
|     +- mindlight.ts                 # Brain dump, next move and session types
|- tsconfig.json                      # TypeScript solution config
|- tsconfig.app.json                  # TypeScript config for src/
|- tsconfig.node.json                 # TypeScript config for build tooling
|- eslint.config.js                   # ESLint flat config
+- vite.config.ts                     # Vite config
```

Each component and feature also has an adjacent `.module.css` file for
scoped styles. The tree lists the TypeScript and asset files explicitly.

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
