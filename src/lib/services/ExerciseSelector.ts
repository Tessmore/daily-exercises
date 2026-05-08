import type { Difficulty } from '../domain/Difficulty';
import type { Exercise } from '../domain/Exercise';

export type DifficultyDistribution = Partial<Record<Difficulty, number>>;

export interface ExerciseSelector {
	select(pool: Exercise[], distribution: DifficultyDistribution, salt: string): Exercise[];
}
