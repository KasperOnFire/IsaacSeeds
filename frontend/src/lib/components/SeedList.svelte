<script lang="ts">
	import { onMount } from 'svelte';
	import type { Seed } from '$lib/types';
	import { getSeeds } from '$lib/pocketbase';
	import SeedCard from './SeedCard.svelte';

	let { characterId }: { characterId: string } = $props();

	let seeds = $state<Seed[]>([]);
	let loading = $state(true);
	let error = $state('');
	let page = $state(1);
	let totalPages = $state(1);

	// Stable session token for vote deduplication (not stored on server, just session memory)
	let sessionToken = $state('');

	onMount(() => {
		sessionToken = sessionStorage.getItem('isaac-session') ?? crypto.randomUUID();
		sessionStorage.setItem('isaac-session', sessionToken);
	});

	async function load(charId: string, p = 1) {
		loading = true;
		error = '';
		try {
			const result = await getSeeds(charId, p, 20);
			seeds = result.items as unknown as Seed[];
			totalPages = result.totalPages;
			page = result.page;
		} catch (e: unknown) {
			console.error('PocketBase error:', e);
			const msg = e instanceof Error ? e.message : String(e);
			error = msg.includes('Failed to fetch') || msg.includes('NetworkError')
				? 'Cannot reach PocketBase at ' + (import.meta.env.VITE_POCKETBASE_URL ?? 'http://localhost:8090')
				: `PocketBase error: ${msg}`;
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		load(characterId, 1);
	});

	async function handleVote(seedId: string, type: 'upvote' | 'flag') {
		await fetch('/api/vote', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ seedId, sessionToken, type })
		});
	}
</script>

<div class="flex flex-col gap-3">
	{#if loading}
		<div class="flex justify-center py-12">
			<div class="flex gap-1.5">
				{#each [0, 1, 2] as i}
					<div
						class="w-2 h-2 rounded-full animate-pulse"
						style="background:#c9a227; opacity:0.6; animation-delay: {i * 150}ms"
					></div>
				{/each}
			</div>
		</div>
	{:else if error}
		<p class="text-center text-sm py-8" style="color:#8b1a1a; font-family:'Cinzel',serif;">{error}</p>
	{:else if seeds.length === 0}
		<div class="text-center py-12 rounded-sm" style="border: 1px dashed #3a2a4a;">
			<p class="text-sm tracking-wider" style="color:#8a7888; font-family:'Cinzel',serif;">No seeds yet</p>
			<p class="text-xs mt-1" style="color:#5a4a68; font-family:'Kalam',cursive;">Be the first to submit a seed for this character</p>
		</div>
	{:else}
		{#each seeds as seed (seed.id)}
			<SeedCard {seed} {sessionToken} onvote={handleVote} />
		{/each}

		{#if totalPages > 1}
			<div class="flex justify-center gap-2 pt-2">
				<button
					class="px-3 py-1 text-xs cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-default"
					style="font-family:'Cinzel',serif; border:1px solid #3a2a4a; color:#6a5878;"
					onmouseenter={(e) => { const b = e.currentTarget as HTMLButtonElement; if (!b.disabled) { b.style.color='#c9a227'; b.style.borderColor='#c9a227'; } }}
					onmouseleave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.color='#6a5878'; b.style.borderColor='#3a2a4a'; }}
					onclick={() => load(characterId, page - 1)}
					disabled={page <= 1}
				>← Prev</button>
				<span class="px-3 py-1 text-xs" style="font-family:'Cinzel',serif; color:#6a5878;">{page} / {totalPages}</span>
				<button
					class="px-3 py-1 text-xs cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-default"
					style="font-family:'Cinzel',serif; border:1px solid #3a2a4a; color:#6a5878;"
					onmouseenter={(e) => { const b = e.currentTarget as HTMLButtonElement; if (!b.disabled) { b.style.color='#c9a227'; b.style.borderColor='#c9a227'; } }}
					onmouseleave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.color='#6a5878'; b.style.borderColor='#3a2a4a'; }}
					onclick={() => load(characterId, page + 1)}
					disabled={page >= totalPages}
				>Next →</button>
			</div>
		{/if}
	{/if}
</div>
