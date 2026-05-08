<script lang="ts">
	import { goto } from '$app/navigation';
	import ExerciseList from '$lib/components/ExerciseList.svelte';
	import FilterToolbar from '$lib/components/FilterToolbar.svelte';
	import type { ExerciseFilter } from '$lib/domain/ExerciseFilter';

	let { data } = $props();

	function applyFilter(next: ExerciseFilter) {
		const params = next.toSearchParams().toString();
		goto(params ? `?${params}` : '?', { keepFocus: true, noScroll: true });
	}
</script>

<main>
	<h1>Today's exercises</h1>
	<FilterToolbar filter={data.filter} onChange={applyFilter} />
	<ExerciseList exercises={data.exercises} date={data.date} />
</main>

<style>
	main {
		max-width: 36rem;
		margin: 2rem auto;
		padding: 0 1rem;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
	}
	h1 {
		font-size: 1.5rem;
		margin: 0 0 1rem 0;
	}
</style>
