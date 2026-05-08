import type { Transport } from '@sveltejs/kit';
import { Exercise } from '$lib/domain/Exercise';

export const transport: Transport = {
	Exercise: {
		encode: (value) => value instanceof Exercise && value.toJSON(),
		decode: (raw) => Exercise.fromJSON(raw)
	}
};
