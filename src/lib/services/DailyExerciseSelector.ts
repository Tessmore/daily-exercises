import type { BodyPart } from '../domain/BodyPart';
import { difficultyOrder, type Difficulty } from '../domain/Difficulty';
import type { Exercise } from '../domain/Exercise';
import type { Clock } from './Clock';
import type { DifficultyDistribution, ExerciseSelector } from './ExerciseSelector';

export class DailyExerciseSelector implements ExerciseSelector {
	constructor(private readonly clock: Clock) {}

	select(pool: Exercise[], distribution: DifficultyDistribution, salt: string): Exercise[] {
		const rng = mulberry32(seedFromString(`${this.clock.today()}|${salt}`));
		const covered = new Set<BodyPart>();
		const picked: Exercise[] = [];

		for (const difficulty of orderedDifficulties(distribution)) {
			const count = distribution[difficulty] ?? 0;
			const candidates = pool.filter((e) => e.difficulty === difficulty);
			if (candidates.length < count) {
				throw new Error(
					`DailyExerciseSelector: requested ${count} "${difficulty}" exercise(s) but only ${candidates.length} available`
				);
			}
			picked.push(...pickBalanced(shuffle(candidates, rng), count, covered));
		}
		return picked;
	}

	arrange(items: readonly Exercise[], salt: string): Exercise[] {
		const rng = mulberry32(seedFromString(`${this.clock.today()}|${salt}|arrange`));
		return shuffle(items, rng);
	}
}

function orderedDifficulties(distribution: DifficultyDistribution): Difficulty[] {
	return (Object.keys(distribution) as Difficulty[])
		.filter((d) => (distribution[d] ?? 0) > 0)
		.sort((a, b) => difficultyOrder[a] - difficultyOrder[b]);
}

function pickBalanced(
	shuffled: Exercise[],
	count: number,
	covered: Set<BodyPart>
): Exercise[] {
	const remaining = [...shuffled];
	const picked: Exercise[] = [];
	for (let i = 0; i < count; i++) {
		const index = indexOfMostNewCoverage(remaining, covered);
		const [chosen] = remaining.splice(index, 1);
		for (const part of chosen.body) covered.add(part);
		picked.push(chosen);
	}
	return picked;
}

function indexOfMostNewCoverage(candidates: Exercise[], covered: Set<BodyPart>): number {
	let bestIndex = 0;
	let bestScore = -1;
	for (let i = 0; i < candidates.length; i++) {
		const score = newCoverageCount(candidates[i], covered);
		if (score > bestScore) {
			bestScore = score;
			bestIndex = i;
		}
	}
	return bestIndex;
}

function newCoverageCount(exercise: Exercise, covered: Set<BodyPart>): number {
	let count = 0;
	for (const part of exercise.body) {
		if (!covered.has(part)) count++;
	}
	return count;
}

function shuffle<T>(items: readonly T[], rng: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function seedFromString(input: string): number {
	let h = 2166136261;
	for (let i = 0; i < input.length; i++) {
		h ^= input.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}

function mulberry32(seed: number): () => number {
	let s = seed;
	return () => {
		s = (s + 0x6d2b79f5) | 0;
		let t = Math.imul(s ^ (s >>> 15), 1 | s);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
