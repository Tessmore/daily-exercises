import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'completedExercises:v1';
const MAX_DAYS_KEPT = 7;

type CompletedByDate = Record<string, string[]>;

function isValidShape(value: unknown): value is CompletedByDate {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
	for (const [key, names] of Object.entries(value)) {
		if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return false;
		if (!Array.isArray(names) || !names.every((n) => typeof n === 'string')) return false;
	}
	return true;
}

function pruneOldDates(value: CompletedByDate): CompletedByDate {
	const dates = Object.keys(value).sort();
	if (dates.length <= MAX_DAYS_KEPT) return value;
	const kept = dates.slice(-MAX_DAYS_KEPT);
	const next: CompletedByDate = {};
	for (const d of kept) next[d] = value[d];
	return next;
}

function loadInitial(): CompletedByDate {
	if (!browser) return {};
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return {};
		const parsed: unknown = JSON.parse(raw);
		if (!isValidShape(parsed)) return {};
		return pruneOldDates(parsed);
	} catch {
		return {};
	}
}

const store = writable<CompletedByDate>(loadInitial());

if (browser) {
	store.subscribe((value) => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
		} catch {
			// quota exceeded or storage disabled — completion still works in-memory
		}
	});
}

export const completedExercises = { subscribe: store.subscribe };

export function markCompleted(date: string, name: string): void {
	store.update((current) => {
		const forDay = current[date] ?? [];
		if (forDay.includes(name)) return current;
		return { ...current, [date]: [...forDay, name] };
	});
}
