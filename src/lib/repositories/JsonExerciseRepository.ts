import data from '$lib/data/exercises.json';
import { Exercise } from '../domain/Exercise';
import type { ExerciseRepository } from './ExerciseRepository';

export class JsonExerciseRepository implements ExerciseRepository {
	async getAll(): Promise<Exercise[]> {
		return (data as unknown[]).map((raw) => Exercise.fromJSON(raw));
	}
}
