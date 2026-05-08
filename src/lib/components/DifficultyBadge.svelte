<script lang="ts">
	import type { Difficulty } from '$lib/domain/Difficulty';

	let { difficulty }: { difficulty: Difficulty } = $props();
</script>

<span class="badge {difficulty}">{difficulty}</span>

<style>
	.badge {
		display: inline-block;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	.light {
		background: #d1fae5;
		color: #065f46;
	}
	.medium {
		background: #fef3c7;
		color: #92400e;
	}
	.tough {
		background: #fee2e2;
		color: #991b1b;
	}
</style>
