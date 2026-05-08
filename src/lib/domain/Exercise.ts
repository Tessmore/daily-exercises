import { isDifficulty, type Difficulty } from './Difficulty';
import { isBodyPart, type BodyPart } from './BodyPart';

export interface ExerciseData {
	name: string;
	description: string;
	number: number;
	difficulty: Difficulty;
	body: BodyPart[];
}

export class Exercise {
	constructor(
		public readonly name: string,
		public readonly description: string,
		public readonly number: number,
		public readonly difficulty: Difficulty,
		public readonly body: readonly BodyPart[]
	) {}

	static fromJSON(raw: unknown): Exercise {
		if (!raw || typeof raw !== 'object') {
			throw new Error(`Exercise.fromJSON: expected object, got ${typeof raw}`);
		}
		const r = raw as Record<string, unknown>;
		if (typeof r.name !== 'string') throw new Error('Exercise.fromJSON: "name" must be string');
		if (typeof r.description !== 'string')
			throw new Error('Exercise.fromJSON: "description" must be string');
		if (typeof r.number !== 'number')
			throw new Error('Exercise.fromJSON: "number" must be number');
		if (!isDifficulty(r.difficulty))
			throw new Error(`Exercise.fromJSON: invalid difficulty "${String(r.difficulty)}"`);
		if (!Array.isArray(r.body) || !r.body.every(isBodyPart))
			throw new Error(`Exercise.fromJSON: "body" must be an array of BodyPart`);
		return new Exercise(r.name, r.description, r.number, r.difficulty, r.body);
	}

	format(): string {
		return `${this.number} ${this.name}`;
	}

	toJSON(): ExerciseData {
		return {
			name: this.name,
			description: this.description,
			number: this.number,
			difficulty: this.difficulty,
			body: [...this.body]
		};
	}
}
