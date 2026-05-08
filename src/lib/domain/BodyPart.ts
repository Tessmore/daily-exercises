export type BodyPart = 'arms' | 'legs' | 'core' | 'back';

const bodyParts: Record<BodyPart, true> = {
	arms: true,
	legs: true,
	core: true,
	back: true
};

export function isBodyPart(value: unknown): value is BodyPart {
	return typeof value === 'string' && value in bodyParts;
}
