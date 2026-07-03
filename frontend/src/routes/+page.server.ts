import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

const PB_URL = process.env.POCKETBASE_URL ?? 'http://localhost:8090';
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY ?? '';

// Isaac seeds: 8 chars from the game's allowed set (no O, I to avoid confusion)
const SEED_REGEX = /^[A-Z0-9]{8}$/;

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
	if (!TURNSTILE_SECRET) return true; // skip in dev if not configured
	const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ secret: TURNSTILE_SECRET, response: token, remoteip: ip })
	});
	const data = await res.json();
	return data.success === true;
}

export const actions: Actions = {
	submit: async ({ request, getClientAddress }) => {
		const data = await request.formData();

		const rawSeed = (data.get('seed') as string ?? '').toUpperCase().replace(/\s|-/g, '');
		const character = data.get('character') as string;
		const version = data.get('version') as string;
		const description = (data.get('description') as string ?? '').trim().slice(0, 500);
		const difficulty = parseInt(data.get('difficulty') as string ?? '3');
		const tags = JSON.parse(data.get('tags') as string ?? '[]') as string[];
		const notable_items = (data.get('notable_items') as string ?? '').trim().slice(0, 200);
		const turnstileToken = data.get('cf-turnstile-response') as string;

		if (!SEED_REGEX.test(rawSeed)) {
			return fail(400, { error: 'Invalid seed format. Seeds must be 8 characters (A–Z, 0–9).' });
		}
		if (!character) {
			return fail(400, { error: 'Character is required.' });
		}
		if (!['repentance', 'repentance_plus'].includes(version)) {
			return fail(400, { error: 'Invalid version.' });
		}
		if (difficulty < 1 || difficulty > 5 || isNaN(difficulty)) {
			return fail(400, { error: 'Difficulty must be 1–5.' });
		}

		const ip = getClientAddress();
		const captchaOk = await verifyTurnstile(turnstileToken, ip);
		if (!captchaOk) {
			return fail(400, { error: 'CAPTCHA verification failed. Please try again.' });
		}

		const formattedSeed = `${rawSeed.slice(0, 4)} ${rawSeed.slice(4)}`;

		// Reject duplicate seed code for the same character
		const dupRes = await fetch(`${PB_URL}/api/collections/seeds/records?filter=seed%3D%22${encodeURIComponent(formattedSeed)}%22%26%26character%3D%22${encodeURIComponent(character)}%22&perPage=1`);
		if (dupRes.ok) {
			const dup = await dupRes.json();
			if (dup.totalItems > 0) {
				return fail(400, { error: 'This seed has already been submitted for this character.' });
			}
		}

		const res = await fetch(`${PB_URL}/api/collections/seeds/records`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				seed: formattedSeed,
				character,
				version,
				description,
				difficulty,
				tags,
				notable_items,
				upvotes: 0,
				flags: 0,
				status: 'active'
			})
		});

		if (!res.ok) {
			const body = await res.json().catch(() => ({}));
			console.error('PocketBase error:', body);
			return fail(500, { error: 'Failed to submit seed. Please try again.' });
		}

		return { success: true };
	},

	vote: async ({ request, getClientAddress }) => {
		const data = await request.formData();
		const seedId = data.get('seedId') as string;
		const type = data.get('type') as 'upvote' | 'flag';
		const sessionToken = data.get('sessionToken') as string;

		if (!seedId || !['upvote', 'flag'].includes(type)) {
			return fail(400, { error: 'Invalid vote request.' });
		}

		const ip = getClientAddress();
		const ipHash = await hashIp(ip);

		// Check for existing vote
		const existing = await fetch(
			`${PB_URL}/api/collections/votes/records?filter=seed_id="${seedId}"&&session_token="${sessionToken}"&&type="${type}"`,
			{ headers: { 'Content-Type': 'application/json' } }
		);
		const existingData = await existing.json();
		if (existingData.totalItems > 0) {
			return fail(400, { error: 'Already voted.' });
		}

		// Record the vote
		await fetch(`${PB_URL}/api/collections/votes/records`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ seed_id: seedId, session_token: sessionToken, ip_hash: ipHash, type })
		});

		// Increment the counter on the seed
		const field = type === 'upvote' ? 'upvotes' : 'flags';
		const seed = await fetch(`${PB_URL}/api/collections/seeds/records/${seedId}`);
		const seedData = await seed.json();

		await fetch(`${PB_URL}/api/collections/seeds/records/${seedId}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ [field]: (seedData[field] ?? 0) + 1 })
		});

		return { success: true };
	}
};

async function hashIp(ip: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(ip + (process.env.IP_HASH_SALT ?? 'isaac-seeds-salt'));
	const hash = await crypto.subtle.digest('SHA-256', data);
	return Array.from(new Uint8Array(hash))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('')
		.slice(0, 16);
}
