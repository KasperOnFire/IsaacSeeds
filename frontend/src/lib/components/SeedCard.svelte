<script lang="ts">
	import type { Seed } from '$lib/types';
	import { getTag } from '$lib/tags';
	import { VERSIONS } from '$lib/types';

	let {
		seed,
		sessionToken,
		onvote
	}: {
		seed: Seed;
		sessionToken: string;
		onvote: (seedId: string, type: 'upvote' | 'flag') => void;
	} = $props();

	let copied = $state(false);
	let voted = $state(false);
	let flagged = $state(false);

	const versionLabel = $derived(
		VERSIONS.find((v) => v.value === seed.version)?.label ?? seed.version
	);

	async function copyToClipboard() {
		await navigator.clipboard.writeText(seed.seed);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}

	function handleUpvote() {
		if (voted) return;
		voted = true;
		onvote(seed.id, 'upvote');
	}

	function handleFlag() {
		if (flagged) return;
		flagged = true;
		onvote(seed.id, 'flag');
	}
</script>

<div class="border border-[#2d1a4a] bg-[#1a0a2e] rounded-sm p-4 flex flex-col gap-3 hover:border-[#4a2a6a] transition-colors">
	<!-- Top row: seed + copy + upvote -->
	<div class="flex items-start gap-3">
		<!-- Seed code -->
		<button
			class="font-mono text-xl font-bold tracking-[0.2em] text-[#c9a227] hover:text-[#e8c44a] transition-colors cursor-pointer flex-shrink-0"
			onclick={copyToClipboard}
			title="Click to copy"
		>
			{seed.seed}
		</button>

		{#if copied}
			<span class="text-xs text-[#2d6b2d] mt-1.5 font-[Cinzel]">Copied!</span>
		{/if}

		<div class="flex-1"></div>

		<!-- Upvote -->
		<button
			class="flex items-center gap-1 text-sm cursor-pointer transition-colors
				{voted ? 'text-[#c9a227]' : 'text-[#4a3a5a] hover:text-[#c9a227]'}"
			onclick={handleUpvote}
			disabled={voted}
			title="Upvote"
		>
			<span class="text-base">▲</span>
			<span class="font-[Cinzel] text-xs">{seed.upvotes + (voted ? 1 : 0)}</span>
		</button>
	</div>

	<!-- Difficulty + version -->
	<div class="flex items-center gap-3 text-xs text-[#4a3a5a]">
		<div class="flex items-center gap-0.5">
			{#each [1, 2, 3, 4, 5] as star}
				<span class={star <= seed.difficulty ? 'text-[#c9a227]' : 'text-[#2d1a4a]'}>★</span>
			{/each}
		</div>
		<span class="font-[Cinzel] text-[10px] uppercase tracking-wider">{versionLabel}</span>
	</div>

	<!-- Description -->
	{#if seed.description}
		<p class="text-sm text-[#a09080] leading-relaxed">{seed.description}</p>
	{/if}

	<!-- Notable items -->
	{#if seed.notable_items}
		<p class="text-xs text-[#6a5a4a] italic">Notable: {seed.notable_items}</p>
	{/if}

	<!-- Tags -->
	{#if seed.tags?.length > 0}
		<div class="flex flex-wrap gap-1.5">
			{#each seed.tags as tagId}
				{@const tag = getTag(tagId)}
				{#if tag}
					<span
						class="px-2 py-0.5 rounded-sm text-[10px] font-[Cinzel] uppercase tracking-wider text-white"
						style="background: {tag.color}88; border: 1px solid {tag.color}66;"
					>
						{tag.label}
					</span>
				{/if}
			{/each}
		</div>
	{/if}

	<!-- Footer: date + flag -->
	<div class="flex items-center gap-2 pt-1 border-t border-[#2d1a4a]">
		<span class="text-[10px] text-[#3a2a4a] flex-1">
			{new Date(seed.created).toLocaleDateString()}
		</span>
		<button
			class="text-[10px] cursor-pointer transition-colors
				{flagged ? 'text-[#8b1a1a]' : 'text-[#3a2a4a] hover:text-[#8b1a1a]'}"
			onclick={handleFlag}
			disabled={flagged}
			title="Flag as inappropriate"
		>
			{flagged ? 'Flagged' : 'Flag'}
		</button>
	</div>
</div>
