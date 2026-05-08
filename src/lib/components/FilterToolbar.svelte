<script lang="ts">
	import type { BodyPart } from '$lib/domain/BodyPart';
	import type { Difficulty } from '$lib/domain/Difficulty';
	import { ExerciseFilter } from '$lib/domain/ExerciseFilter';

	const BODY_PARTS: BodyPart[] = ['arms', 'legs', 'core', 'back'];
	const DIFFICULTIES: Difficulty[] = ['light', 'medium', 'tough'];

	let {
		filter,
		onChange
	}: { filter: ExerciseFilter; onChange: (next: ExerciseFilter) => void } = $props();

	function toggleBody(part: BodyPart, checked: boolean) {
		onChange(filter.withBodyPart(part, checked));
	}
	function toggleDifficulty(difficulty: Difficulty, checked: boolean) {
		onChange(filter.withDifficulty(difficulty, checked));
	}
</script>

<section class="toolbar" aria-label="Exercise filters">
	<fieldset>
		<legend>Body</legend>
		{#each BODY_PARTS as part}
			<label>
				<input
					type="checkbox"
					checked={filter.bodyParts.has(part)}
					onchange={(e) => toggleBody(part, e.currentTarget.checked)}
				/>
				{part}
			</label>
		{/each}
	</fieldset>
	<fieldset>
		<legend>Difficulty</legend>
		{#each DIFFICULTIES as difficulty}
			<label>
				<input
					type="checkbox"
					checked={filter.difficulties.has(difficulty)}
					onchange={(e) => toggleDifficulty(difficulty, e.currentTarget.checked)}
				/>
				{difficulty}
			</label>
		{/each}
	</fieldset>
</section>

<style>
	.toolbar {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin: 0 0 1rem 0;
	}
	fieldset {
		flex: 1 1 auto;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: white;
	}
	legend {
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #6b7280;
		padding: 0 0.25rem;
	}
	label {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.875rem;
		margin-right: 0.5rem;
		cursor: pointer;
		user-select: none;
	}
	input[type='checkbox'] {
		margin: 0;
	}
</style>
