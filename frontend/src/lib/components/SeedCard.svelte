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

	let copied  = $state(false);
	let voted   = $state(false);
	let flagged = $state(false);

	const versionLabel = $derived(
		VERSIONS.find((v) => v.value === seed.version)?.label ?? seed.version
	);

	const createdLabel = $derived.by(() => {
		const d = new Date(seed.created);
		return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString();
	});

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

<div class="rounded-sm p-5 flex flex-col gap-3"
	style="background:#0f0618; border:1px solid #2a1a3e; box-shadow: 0 2px 8px rgba(0,0,0,0.4);">

	<!-- Top row: seed code + copy label + upvote -->
	<div class="flex items-start gap-3">
		<button
			class="font-mono text-2xl font-bold tracking-[0.2em] transition-colors cursor-pointer flex-shrink-0"
			style="color:#c9a227;"
			onmouseenter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#f0c84a')}
			onmouseleave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#c9a227')}
			onclick={copyToClipboard}
			title="Click to copy"
		>
			{seed.seed}
		</button>

		{#if copied}
			<span class="text-sm mt-2" style="color:#5ab85a; font-family:'Cormorant Garamond',serif;">Copied!</span>
		{/if}

		<div class="flex-1"></div>

		<!-- Upvote -->
		<button
			class="flex items-center gap-1 text-base cursor-pointer transition-colors"
			style="color: {voted ? '#c9a227' : '#4a3a5a'};"
			onmouseenter={(e) => { if (!voted) (e.currentTarget as HTMLButtonElement).style.color = '#c9a227'; }}
			onmouseleave={(e) => { if (!voted) (e.currentTarget as HTMLButtonElement).style.color = '#4a3a5a'; }}
			onclick={handleUpvote}
			disabled={voted}
			title="Upvote"
		>
			<span class="text-lg">▲</span>
			<span style="font-family:'Cinzel',serif; font-size:0.85rem;">{seed.upvotes + (voted ? 1 : 0)}</span>
		</button>
	</div>

	<!-- Difficulty stars + version -->
	<div class="flex items-center gap-3">
		<div class="flex items-center gap-0.5">
			{#each [1, 2, 3, 4, 5] as star}
				<span style="font-size:1rem; color:{star <= seed.difficulty ? '#c9a227' : '#2a1a3e'};">★</span>
			{/each}
		</div>
		<span style="font-family:'Cinzel',serif; font-size:0.75rem; color:#b0a2c0; text-transform:uppercase; letter-spacing:0.06em;">{versionLabel}</span>
	</div>

	<!-- Description -->
	{#if seed.description}
		<p class="text-base leading-relaxed" style="color:#d8d0e0; font-family:'Cormorant Garamond',serif;">{seed.description}</p>
	{/if}

	<!-- Notable items -->
	{#if seed.notable_items}
		<p class="text-sm italic" style="color:#8f7ea3; font-family:'Cormorant Garamond',serif;">Notable: {seed.notable_items}</p>
	{/if}

	<!-- Tags -->
	{#if seed.tags?.length > 0}
		<div class="flex flex-wrap gap-1.5">
			{#each seed.tags as tagId}
				{@const tag = getTag(tagId)}
				{#if tag}
					<span
						class="px-2 py-0.5 rounded-sm text-xs uppercase tracking-wider"
						style="font-family:'Cinzel',serif; background:{tag.color}18; border:1px solid {tag.color}66; color:{tag.color}dd;"
					>
						{tag.label}
					</span>
				{/if}
			{/each}
		</div>
	{/if}

	<!-- Footer: date + flag -->
	<div class="flex items-center gap-2 pt-2" style="border-top: 1px solid #1e0f2e;">
		<span class="text-xs flex-1" style="color:#5e4e72; font-family:'Cormorant Garamond',serif;">
			{createdLabel}
		</span>
		<button
			class="text-xs cursor-pointer transition-colors"
			style="color:{flagged ? '#c23b3b' : '#4a3a5a'}; font-family:'Cormorant Garamond',serif;"
			onmouseenter={(e) => { if (!flagged) (e.currentTarget as HTMLButtonElement).style.color = '#c23b3b'; }}
			onmouseleave={(e) => { if (!flagged) (e.currentTarget as HTMLButtonElement).style.color = '#4a3a5a'; }}
			onclick={handleFlag}
			disabled={flagged}
			title="Flag as inappropriate"
		>
			{flagged ? 'Flagged' : 'Flag'}
		</button>
	</div>
</div>
