# Daily exercises

Picks a daily set of exercises. The selection is deterministic per day — refreshing the page returns the same set. Each day brings a new one.

<img width="1837" height="1102" alt="image" src="https://github.com/user-attachments/assets/85404b85-aa4d-47ed-89b9-d2af298594d0" />

## How it works

- Exercises live in `src/lib/data/exercises.json` and are tagged with a `difficulty` (`light` / `medium` / `tough`) and one or more `body` parts (`arms` / `legs` / `core` / `back`).
- `DailyExerciseSelector` (`src/lib/services/DailyExerciseSelector.ts`) seeds a Mulberry32 PRNG from the current date plus the active filter, then picks one exercise per selected difficulty, preferring candidates that cover body parts not yet covered that day.
- `ExerciseFilter` (`src/lib/domain/ExerciseFilter.ts`) is mirrored into the URL via `?body=…&difficulty=…`, so any filter combination is shareable and bookmarkable.

## Project layout

```
src/
├── lib/
│   ├── components/    # Svelte 5 UI (FilterToolbar, ExerciseList, …)
│   ├── domain/        # Exercise, ExerciseFilter, BodyPart, Difficulty
│   ├── repositories/  # JsonExerciseRepository (loads the bundled JSON)
│   ├── services/      # Clock, DailyExerciseSelector, getDailyExercises
│   └── stores/        # completedExercises (localStorage-backed)
└── routes/            # SvelteKit filesystem routing
```

## Tech stack

- **SvelteKit 2** + **Svelte 5** in runes mode (forced project-wide in `svelte.config.js`)
- **TypeScript** with `strict` and `checkJs` on
- **Vite** for dev/build
- **`@sveltejs/adapter-static`** — the app builds to a fully static SPA

## Developing

```sh
yarn install
yarn dev            # http://localhost:5173
yarn check          # type-check via svelte-check
```

## Building

```sh
yarn build          # outputs to ./build
yarn preview        # serves the production build locally
```
