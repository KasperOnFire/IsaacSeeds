<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { BASE_CHARACTERS, TAINTED_CHARACTERS } from '$lib/characters';
	import CharacterCarousel from '$lib/components/CharacterCarousel.svelte';
	import SeedList from '$lib/components/SeedList.svelte';
	import SubmitModal from '$lib/components/SubmitModal.svelte';

	let isTainted = $state(false);

	const baseIndex = $derived(
		Math.max(0, BASE_CHARACTERS.findIndex((c) => c.id === $page.url.searchParams.get('character')))
	);
	const taintedIndex = $derived(
		Math.max(
			0,
			TAINTED_CHARACTERS.findIndex((c) => c.id === $page.url.searchParams.get('character'))
		)
	);

	let localBaseIndex = $state(baseIndex);
	let localTaintedIndex = $state(taintedIndex);

	const selectedCharacter = $derived(
		isTainted ? TAINTED_CHARACTERS[localTaintedIndex] : BASE_CHARACTERS[localBaseIndex]
	);

	let showSubmit = $state(false);

	function handleKeydown(e: KeyboardEvent) {
		if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
		if (e.key === 'Tab') {
			e.preventDefault();
			isTainted = !isTainted;
		}
	}

	function onCharacterSelect(id: string) {
		goto(`?character=${id}`, { replaceState: true, noScroll: true, keepFocus: true });
	}

	$effect(() => {
		onCharacterSelect(selectedCharacter.id);
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="flex flex-col items-center gap-0 pb-12">
	<!-- Tab toggle -->
	<div class="flex w-full border-b border-[#2d1a4a]">
		<button
			class="flex-1 py-2 text-sm font-[Cinzel] tracking-widest uppercase transition-colors cursor-pointer
				{!isTainted
				? 'text-[#c9a227] border-b-2 border-[#c9a227] -mb-px bg-[#1a0a2e]'
				: 'text-[#4a3a5a] hover:text-[#8a7a9a]'}"
			onclick={() => (isTainted = false)}
		>
			Normal
		</button>
		<button
			class="flex-1 py-2 text-sm font-[Cinzel] tracking-widest uppercase transition-colors cursor-pointer
				{isTainted
				? 'text-[#c23b3b] border-b-2 border-[#c23b3b] -mb-px bg-[#1a0a2e]'
				: 'text-[#4a3a5a] hover:text-[#8a7a9a]'}"
			onclick={() => (isTainted = true)}
		>
			Tainted
		</button>
	</div>

	<div class="w-full bg-[#1a0a2e] py-2">
		<p class="text-center text-[10px] text-[#3a2a4a] font-[Cinzel] tracking-widest uppercase">
			← → Arrow keys · Tab to switch
		</p>
	</div>

	<!-- Character carousel -->
	{#if !isTainted}
		<CharacterCarousel
			characters={BASE_CHARACTERS}
			bind:selectedIndex={localBaseIndex}
			{isTainted}
		/>
	{:else}
		<CharacterCarousel
			characters={TAINTED_CHARACTERS}
			bind:selectedIndex={localTaintedIndex}
			{isTainted}
		/>
	{/if}

	<!-- Selected character name -->
	<div class="py-4 text-center">
		<h2
			class="font-[Cinzel] text-2xl font-bold tracking-widest uppercase
			{isTainted ? 'text-[#c23b3b]' : 'text-[#c9a227]'}"
		>
			{selectedCharacter.name}
		</h2>
	</div>

	<!-- Divider -->
	<div class="w-full max-w-3xl px-6">
		<div class="border-t border-[#2d1a4a] mb-6"></div>
	</div>

	<!-- Seed list + submit button -->
	<div class="w-full max-w-3xl px-6">
		<div class="flex items-center justify-between mb-4">
			<h3 class="font-[Cinzel] text-sm text-[#6a5a7a] tracking-widest uppercase">
				Seeds for {selectedCharacter.name}
			</h3>
			<button
				class="px-4 py-1.5 text-sm font-[Cinzel] tracking-wider uppercase border cursor-pointer
					{isTainted
					? 'border-[#c23b3b] text-[#c23b3b] hover:bg-[#3d0a0a]'
					: 'border-[#c9a227] text-[#c9a227] hover:bg-[#2a1a00]'}
					transition-colors"
				onclick={() => (showSubmit = true)}
			>
				+ Submit Seed
			</button>
		</div>

		<SeedList characterId={selectedCharacter.id} />
	</div>
</div>

{#if showSubmit}
	<SubmitModal
		character={selectedCharacter}
		onclose={() => (showSubmit = false)}
	/>
{/if}
