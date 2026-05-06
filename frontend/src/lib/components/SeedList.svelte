<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
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
		if (!browser) return;
		loading = true;
		error = '';
		try {
			const result = await getSeeds(charId, p, 20);
			seeds = result.items as unknown as Seed[];
			totalPages = result.totalPages;
			page = result.page;
		} catch (e) {
			error = 'Could not load seeds. Is PocketBase running?';
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
			<div class="flex gap-1">
				{#each [0, 1, 2] as i}
					<div
						class="w-2 h-2 rounded-full bg-[#4a2a6a] animate-pulse"
						style="animation-delay: {i * 150}ms"
					></div>
				{/each}
			</div>
		</div>
	{:else if error}
		<p class="text-center text-[#8b1a1a] text-sm py-8 font-[Cinzel]">{error}</p>
	{:else if seeds.length === 0}
		<div class="text-center py-12 border border-dashed border-[#2d1a4a] rounded-sm">
			<p class="text-[#4a3a5a] text-sm font-[Cinzel] tracking-wider">No seeds yet</p>
			<p class="text-[#3a2a4a] text-xs mt-1">Be the first to submit a seed for this character</p>
		</div>
	{:else}
		{#each seeds as seed (seed.id)}
			<SeedCard {seed} {sessionToken} onvote={handleVote} />
		{/each}

		{#if totalPages > 1}
			<div class="flex justify-center gap-2 pt-2">
				<button
					class="px-3 py-1 text-xs font-[Cinzel] border border-[#2d1a4a] text-[#6a5a7a] hover:text-[#c9a227] hover:border-[#c9a227] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default"
					onclick={() => load(characterId, page - 1)}
					disabled={page <= 1}
				>
					← Prev
				</button>
				<span class="px-3 py-1 text-xs text-[#4a3a5a] font-[Cinzel]">
					{page} / {totalPages}
				</span>
				<button
					class="px-3 py-1 text-xs font-[Cinzel] border border-[#2d1a4a] text-[#6a5a7a] hover:text-[#c9a227] hover:border-[#c9a227] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default"
					onclick={() => load(characterId, page + 1)}
					disabled={page >= totalPages}
				>
					Next →
				</button>
			</div>
		{/if}
	{/if}
</div>
