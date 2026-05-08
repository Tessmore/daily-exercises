import type { Exercise } from './Exercise';
import { isBodyPart, type BodyPart } from './BodyPart';
import { isDifficulty, type Difficulty } from './Difficulty';
import type { DifficultyDistribution } from '../services/ExerciseSelector';

const ALL_BODY_PARTS: readonly BodyPart[] = ['arms', 'legs', 'core', 'back'];
const ALL_DIFFICULTIES: readonly Difficulty[] = ['light', 'medium', 'tough'];

export class ExerciseFilter {
	constructor(
		readonly bodyParts: ReadonlySet<BodyPart>,
		readonly difficulties: ReadonlySet<Difficulty>
	) {}

	static all(): ExerciseFilter {
		return new ExerciseFilter(new Set(ALL_BODY_PARTS), new Set(ALL_DIFFICULTIES));
	}

	static fromSearchParams(params: URLSearchParams): ExerciseFilter {
		const bodyParts = parseSet(params.get('body'), isBodyPart, ALL_BODY_PARTS);
		const difficulties = parseSet(params.get('difficulty'), isDifficulty, ALL_DIFFICULTIES);
		return new ExerciseFilter(bodyParts, difficulties);
	}

	toSearchParams(): URLSearchParams {
		const params = new URLSearchParams();
		if (this.bodyParts.size !== ALL_BODY_PARTS.length) {
			params.set('body', ALL_BODY_PARTS.filter((p) => this.bodyParts.has(p)).join(','));
		}
		if (this.difficulties.size !== ALL_DIFFICULTIES.length) {
			params.set(
				'difficulty',
				ALL_DIFFICULTIES.filter((d) => this.difficulties.has(d)).join(',')
			);
		}
		return params;
	}

	matches(exercise: Exercise): boolean {
		if (!this.difficulties.has(exercise.difficulty)) return false;
		return exercise.body.some((part) => this.bodyParts.has(part));
	}

	distribution(): DifficultyDistribution {
		const dist: DifficultyDistribution = {};
		for (const d of this.difficulties) dist[d] = 1;
		return dist;
	}

	withBodyPart(part: BodyPart, checked: boolean): ExerciseFilter {
		return new ExerciseFilter(toggle(this.bodyParts, part, checked), this.difficulties);
	}

	withDifficulty(difficulty: Difficulty, checked: boolean): ExerciseFilter {
		return new ExerciseFilter(this.bodyParts, toggle(this.difficulties, difficulty, checked));
	}
}

function parseSet<T extends string>(
	raw: string | null,
	guard: (value: unknown) => value is T,
	all: readonly T[]
): ReadonlySet<T> {
	if (raw === null) return new Set(all);
	const parsed = raw
		.split(',')
		.map((s) => s.trim())
		.filter((s) => s.length > 0)
		.filter(guard);
	return new Set(parsed);
}

function toggle<T>(set: ReadonlySet<T>, value: T, checked: boolean): Set<T> {
	const next = new Set(set);
	if (checked) next.add(value);
	else next.delete(value);
	return next;
}
