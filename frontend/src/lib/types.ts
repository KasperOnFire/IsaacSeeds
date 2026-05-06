export interface Seed {
	id: string;
	seed: string;
	character: string;
	version: 'repentance' | 'repentance_plus';
	description: string;
	difficulty: 1 | 2 | 3 | 4 | 5;
	tags: string[];
	notable_items: string;
	upvotes: number;
	flags: number;
	status: 'active' | 'flagged' | 'removed';
	created: string;
}

export interface SeedSubmission {
	seed: string;
	character: string;
	version: string;
	description: string;
	difficulty: number;
	tags: string[];
	notable_items: string;
}

export const VERSIONS = [
	{ value: 'repentance_plus', label: 'Repentance+ (current)' },
	{ value: 'repentance', label: 'Repentance' },
] as const;
