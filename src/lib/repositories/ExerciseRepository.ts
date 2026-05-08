import type { Exercise } from '../domain/Exercise';

export interface ExerciseRepository {
	getAll(): Promise<Exercise[]>;
	getRequired(): Promise<Exercise[]>;
}
