import PocketBase from 'pocketbase';
import { browser } from '$app/environment';

const PB_URL = browser
	? (import.meta.env.VITE_POCKETBASE_URL ?? 'http://localhost:8090')
	: (process.env.POCKETBASE_URL ?? 'http://localhost:8090');

export const pb = new PocketBase(PB_URL);

export async function getSeeds(character: string, page = 1, perPage = 20) {
	// Use plain fetch so the URL is 100% transparent (SDK v0.21 had hydration issues in Svelte 5)
	// Note: sort is appended raw because URLSearchParams encodes commas (%2C) which PocketBase rejects
	const url = new URL(`${PB_URL}/api/collections/seeds/records`);
	url.searchParams.set('filter', `character = "${character}" && status != "removed"`);
	url.searchParams.set('page',    String(page));
	url.searchParams.set('perPage', String(perPage));
	const finalUrl = url.toString() + '&sort=-upvotes';

	const res = await fetch(finalUrl);
	if (!res.ok) throw new Error(`PocketBase ${res.status}: ${await res.text()}`);
	return res.json() as Promise<{
		items:      Record<string, unknown>[];
		page:       number;
		perPage:    number;
		totalItems: number;
		totalPages: number;
	}>;
}

export async function upvoteSeed(seedId: string, sessionToken: string) {
	return fetch(`/api/vote`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ seedId, sessionToken, type: 'upvote' })
	});
}

export async function flagSeed(seedId: string, sessionToken: string) {
	return fetch(`/api/vote`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ seedId, sessionToken, type: 'flag' })
	});
}
