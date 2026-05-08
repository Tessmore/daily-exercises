import type { Exercise } from '../domain/Exercise';
import { ExerciseFilter } from '../domain/ExerciseFilter';
import { JsonExerciseRepository } from '../repositories/JsonExerciseRepository';
import { SystemClock } from './Clock';
import { DailyExerciseSelector } from './DailyExerciseSelector';

export async function getDailyExercises(filter: ExerciseFilter): Promise<Exercise[]> {
	const repo = new JsonExerciseRepository();
	const selector = new DailyExerciseSelector(new SystemClock());
	const [allExercises, allRequired] = await Promise.all([repo.getAll(), repo.getRequired()]);
	const pool = allExercises.filter((e) => filter.matches(e));
	const required = allRequired.filter((e) => filter.matches(e));
	const distribution = filter.distribution();
	const salt = filter.toSearchParams().toString();
	const selected = hasEnoughCandidates(pool, distribution)
		? selector.select(pool, distribution, salt)
		: [];
	return selector.arrange([...required, ...selected], salt);
}

function hasEnoughCandidates(
	pool: Exercise[],
	distribution: ReturnType<ExerciseFilter['distribution']>
): boolean {
	for (const [difficulty, count] of Object.entries(distribution)) {
		if (count === undefined || count === 0) continue;
		const available = pool.filter((e) => e.difficulty === difficulty).length;
		if (available < count) return false;
	}
	return true;
}
