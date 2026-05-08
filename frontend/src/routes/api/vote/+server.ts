import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const PB_URL = process.env.POCKETBASE_URL ?? 'http://localhost:8090';

async function hashIp(ip: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(ip + (process.env.IP_HASH_SALT ?? 'isaac-seeds-salt'));
	const hash = await crypto.subtle.digest('SHA-256', data);
	return Array.from(new Uint8Array(hash))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('')
		.slice(0, 16);
}

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	const body = await request.json().catch(() => null);
	if (!body) return json({ error: 'Invalid request body' }, { status: 400 });

	const { seedId, sessionToken, type } = body as {
		seedId: string;
		sessionToken: string;
		type: string;
	};

	if (!seedId || !['upvote', 'flag'].includes(type)) {
		return json({ error: 'Invalid vote request.' }, { status: 400 });
	}

	const ip = getClientAddress();
	const ipHash = await hashIp(ip);

	// Check for existing vote (uses admin-only collection — skip if votes collection is locked)
	// We do a best-effort check; the real dedup is handled by the session token client-side
	try {
		const existingRes = await fetch(
			`${PB_URL}/api/collections/votes/records?filter=seed_id%3D"${seedId}"%26%26session_token%3D"${sessionToken}"%26%26type%3D"${type}"`
		);
		if (existingRes.ok) {
			const existingData = await existingRes.json();
			if (existingData.totalItems > 0) {
				return json({ error: 'Already voted.' }, { status: 409 });
			}
		}
	} catch {
		// If votes collection is not publicly readable, skip the duplicate check
	}

	// Increment counter on the seed
	const seedRes = await fetch(`${PB_URL}/api/collections/seeds/records/${seedId}`);
	if (!seedRes.ok) return json({ error: 'Seed not found.' }, { status: 404 });
	const seedData = await seedRes.json();

	const field = type === 'upvote' ? 'upvotes' : 'flags';
	const patchRes = await fetch(`${PB_URL}/api/collections/seeds/records/${seedId}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ [field]: (seedData[field] ?? 0) + 1 })
	});

	if (!patchRes.ok) {
		return json({ error: 'Failed to record vote.' }, { status: 500 });
	}

	// Record vote for dedup (best effort — collection may be admin-only)
	await fetch(`${PB_URL}/api/collections/votes/records`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ seed_id: seedId, session_token: sessionToken, ip_hash: ipHash, type })
	}).catch(() => {});

	return json({ success: true });
};
