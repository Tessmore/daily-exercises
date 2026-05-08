# Daily exercises

A small SvelteKit app that picks a daily set of bodyweight exercises. The selection is deterministic per day — refreshing the page returns the same set, but a new day brings a new one.

Live at: https://tessmore.github.io/daily-exercises/

## How it works

- Exercises live in `src/lib/data/exercises.json` and are tagged with a `difficulty` (`light` / `medium` / `tough`) and one or more `body` parts (`arms` / `legs` / `core` / `back`).
- `DailyExerciseSelector` (`src/lib/services/DailyExerciseSelector.ts`) seeds a Mulberry32 PRNG from the current date plus the active filter, then greedily picks one exercise per selected difficulty, preferring candidates that cover body parts not yet covered that day.
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
yarn check          # type-check via svelte-check (the only quality gate today)
```

## Building

```sh
yarn build          # outputs to ./build
yarn preview        # serves the production build locally
```

## Deployment

`.github/workflows/deploy.yml` builds on every push to `main` and publishes `./build` to GitHub Pages. The base path `/daily-exercises` is set in `svelte.config.js` for production builds; in dev the app runs at the root so `yarn dev` works unchanged.

To deploy to a different repo or path, update `paths.base` in `svelte.config.js`.
