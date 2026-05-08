export type Difficulty = 'light' | 'medium' | 'tough';

export const difficultyOrder: Record<Difficulty, number> = {
	light: 0,
	medium: 1,
	tough: 2
};

export function isDifficulty(value: unknown): value is Difficulty {
	return typeof value === 'string' && value in difficultyOrder;
}
