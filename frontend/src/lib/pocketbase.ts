import PocketBase from 'pocketbase';
import { browser } from '$app/environment';

const PB_URL = browser
	? (import.meta.env.VITE_POCKETBASE_URL ?? 'http://localhost:8090')
	: (process.env.POCKETBASE_URL ?? 'http://localhost:8090');

export const pb = new PocketBase(PB_URL);

export async function getSeeds(character: string, page = 1, perPage = 20) {
	return pb.collection('seeds').getList(page, perPage, {
		// show everything that isn't explicitly removed (handles manually-added entries too)
		filter: `character = "${character}" && status != "removed"`,
		sort: '-upvotes,-created'
	});
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
