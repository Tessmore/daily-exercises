<script lang="ts">
	import type { Exercise } from '$lib/domain/Exercise';
	import ExerciseCard from './ExerciseCard.svelte';

	let { exercises, date }: { exercises: Exercise[]; date: string } = $props();
</script>

{#if exercises.length === 0}
	<p class="empty">No exercises match these filters. Try checking more boxes.</p>
{:else}
	<ul>
		{#each exercises as exercise (exercise.id)}
			<li><ExerciseCard {exercise} {date} /></li>
		{/each}
	</ul>
{/if}

<style>
	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.empty {
		color: #6b7280;
		font-style: italic;
		margin: 0;
		padding: 1rem 1.25rem;
		border: 1px dashed #e5e7eb;
		border-radius: 0.5rem;
		background: white;
	}
</style>
