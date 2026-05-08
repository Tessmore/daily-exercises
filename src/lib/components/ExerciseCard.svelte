<script lang="ts">
	import type { Exercise } from '$lib/domain/Exercise';
	import { completedExercises, markCompleted } from '$lib/stores/completedExercises';
	import DifficultyBadge from './DifficultyBadge.svelte';

	let { exercise, date }: { exercise: Exercise; date: string } = $props();

	let completed = $derived(($completedExercises[date] ?? []).includes(exercise.name));

	function complete() {
		if (!completed) markCompleted(date, exercise.name);
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			complete();
		}
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<article
	class="card"
	class:completed
	role="button"
	tabindex={completed ? -1 : 0}
	aria-pressed={completed}
	onclick={complete}
	onkeydown={onKey}
>
	<header>
		<h2>{exercise.format()}</h2>
		<DifficultyBadge difficulty={exercise.difficulty} />
	</header>
	<p>{exercise.description}</p>
	<footer class="body-parts">
		{#each exercise.body as part}
			<span class="part">{part}</span>
		{/each}
	</footer>
</article>

<style>
	.card {
		padding: 1rem 1.25rem;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		background: white;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
		cursor: pointer;
		transition:
			border-color 120ms,
			color 120ms;
	}
	.card:focus-visible {
		outline: 2px solid #2563eb;
		outline-offset: 2px;
	}
	.card.completed {
		border-color: #16a34a;
		cursor: default;
	}
	.card.completed h2,
	.card.completed p {
		color: #166534;
	}
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		margin: 0 0 0.5rem 0;
	}
	h2 {
		font-size: 1.125rem;
		margin: 0;
	}
	p {
		color: #4b5563;
		margin: 0;
	}
	.body-parts {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		margin-top: 0.5rem;
	}
	.part {
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #6b7280;
		background: #f3f4f6;
		border-radius: 0.25rem;
		padding: 0.0625rem 0.375rem;
	}
</style>
