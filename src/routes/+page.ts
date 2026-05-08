import { ExerciseFilter } from '$lib/domain/ExerciseFilter';
import { SystemClock } from '$lib/services/Clock';
import { getDailyExercises } from '$lib/services/getDailyExercises';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	const filter = ExerciseFilter.fromSearchParams(url.searchParams);
	const exercises = await getDailyExercises(filter);
	const date = new SystemClock().today();
	return { exercises, filter, date };
};
