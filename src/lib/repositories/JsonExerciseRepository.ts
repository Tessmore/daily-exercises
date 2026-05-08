import exercisesData from '$lib/data/exercises.json';
import requiredData from '$lib/data/required.json';
import { Exercise } from '../domain/Exercise';
import type { ExerciseRepository } from './ExerciseRepository';

export class JsonExerciseRepository implements ExerciseRepository {
	async getAll(): Promise<Exercise[]> {
		return (exercisesData as unknown[]).map((raw) => Exercise.fromJSON(raw));
	}

	async getRequired(): Promise<Exercise[]> {
		return (requiredData as unknown[]).map((raw) => Exercise.fromJSON(raw));
	}
}
