<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { BASE_CHARACTERS, TAINTED_CHARACTERS } from '$lib/characters';
	import type { HeartSlot } from '$lib/characters';
	import CharacterCarousel from '$lib/components/CharacterCarousel.svelte';
	import SeedList from '$lib/components/SeedList.svelte';
	import SubmitModal from '$lib/components/SubmitModal.svelte';

	let isTainted = $state(false);

	let selectedIndex = $state(
		Math.max(0, BASE_CHARACTERS.findIndex((c) => c.id === $page.url.searchParams.get('character')))
	);

	const selectedCharacter = $derived(
		isTainted ? TAINTED_CHARACTERS[selectedIndex] : BASE_CHARACTERS[selectedIndex]
	);

	let showSubmit = $state(false);
	let seedRefreshTick = $state(0);

	function handleSubmitSuccess() {
		seedRefreshTick++;
		// Keep modal open to show success state; user closes manually
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
		if (e.key === 'Tab' || e.key === 'w' || e.key === 'W' || e.key === 's' || e.key === 'S') {
			e.preventDefault();
			isTainted = !isTainted;
		}
	}

	$effect(() => {
		goto(`?character=${selectedCharacter.id}`, { replaceState: true, noScroll: true, keepFocus: true });
	});

	const accentColor = $derived(isTainted ? '#c23b3b' : '#c9a227');

	// ── Hearts ───────────────────────────────────────────────────────────────
	const heartFill: Record<string, string> = {
		red:     '#cc1111',
		soul:    '#6699ff',
		black:   '#1a1025',
		bone:    '#d4c89a',
		coin:    '#d4aa00',
		eternal: '#ffffff',
	};
	const heartStroke: Record<string, string> = {
		red:     '#880000',
		soul:    '#2244bb',
		black:   '#443355',
		bone:    '#a0905a',
		coin:    '#998800',
		eternal: '#aaaaaa',
	};

	function heartSvg(slot: HeartSlot): string {
		const fill   = slot.half ? 'none' : heartFill[slot.color];
		const stroke = heartStroke[slot.color];
		return `<svg viewBox="0 0 10 9" width="16" height="14" xmlns="http://www.w3.org/2000/svg">
			<path d="M5 8.5 L1 4.5 C0 3.5 0 2 1 1 C2 0 3.5 0.5 5 2 C6.5 0.5 8 0 9 1 C10 2 10 3.5 9 4.5 Z"
				fill="${fill}" stroke="${stroke}" stroke-width="1"/>
			${slot.half ? `<path d="M5 2 L5 8.5 L1 4.5 C0 3.5 0 2 1 1 C2 0 3.5 0.5 5 2 Z" fill="${heartFill[slot.color]}"/>` : ''}
		</svg>`;
	}

	// ── Damage icon (red teardrop / Isaac tear) ──────────────────────────────
	function damageSvg(): string {
		return `<svg viewBox="0 0 8 11" width="12" height="15" xmlns="http://www.w3.org/2000/svg">
			<path d="M4 0 C4 0 0 5 0 7.5 A4 3.5 0 0 0 8 7.5 C8 5 4 0 4 0Z"
				fill="#cc1111" stroke="#880000" stroke-width="0.7"/>
		</svg>`;
	}

	// ── Speed icon (shoe silhouette) ─────────────────────────────────────────
	function speedSvg(): string {
		return `<svg viewBox="0 0 13 9" width="16" height="11" xmlns="http://www.w3.org/2000/svg">
			<path d="M0 8 L0 4 C0 4 2 1 5 1 L7 1 L7 4 L10 4 L12 6 L12 8 Z"
				fill="#c9a227" stroke="#805500" stroke-width="0.7"/>
		</svg>`;
	}
</script>

<svelte:window onkeydown={handleKeydown} />
<svelte:head>
	<title>{selectedCharacter.name} Seeds — Isaac Seeds</title>
</svelte:head>

<!--
  Two-section layout:
    1. Hero — fills viewport, character card centered
    2. Seeds — natural scroll below
-->

<!-- ── Character section ─────────────────────────────────────────────────── -->
<div class="flex flex-col items-center pt-8 pb-4 gap-3">

	<!-- Normal / Tainted tabs -->
	<div class="flex" style="gap:0;">
		<button onclick={() => (isTainted = false)} class="cursor-pointer px-6 py-1.5 transition-all"
			style="font-family:'Cormorant Garamond',serif; font-weight:700; font-size:0.9rem;
				color:{!isTainted ? accentColor : '#5a4858'};
				border-bottom: 2px solid {!isTainted ? accentColor : 'transparent'};
				letter-spacing:0.06em;">
			Normal
		</button>
		<button onclick={() => (isTainted = true)} class="cursor-pointer px-6 py-1.5 transition-all"
			style="font-family:'Cormorant Garamond',serif; font-weight:700; font-size:0.9rem;
				color:{isTainted ? accentColor : '#5a4858'};
				border-bottom: 2px solid {isTainted ? accentColor : 'transparent'};
				letter-spacing:0.06em;">
			Tainted
		</button>
	</div>

	<!-- Character selection paper note -->
	<!-- Note is 520 px wide; carousel uses H_RADIUS=200, outermost char at ~213 px from centre,
	     leaving ~47 px of clear paper on each side before the note edge -->
	<div class="paper relative flex flex-col items-center"
		style="width: min(520px, calc(100vw - 1rem)); padding: 1.4rem 1.2rem 1.2rem;">

		<!-- WHO AM I? -->
		<h2 class="relative z-10 mb-1" style="
			font-family: 'Cormorant Garamond', serif;
			font-weight: 700;
			font-size: 1.5rem;
			color: #0d0810;
			-webkit-text-stroke: 1.5px #990000;
			letter-spacing: 0.12em;
		">WHO AM I?</h2>

		<!-- 3-D ring carousel (overflow:hidden — characters stay within note) -->
		<div class="relative z-10 w-full">
			{#if !isTainted}
				<CharacterCarousel characters={BASE_CHARACTERS} bind:selectedIndex {isTainted} />
			{:else}
				<CharacterCarousel characters={TAINTED_CHARACTERS} bind:selectedIndex {isTainted} />
			{/if}
		</div>

		<!-- ← NAME → -->
		<div class="relative z-10 flex items-center gap-3 mt-1 w-full justify-center">
			<button
				class="cursor-pointer transition-all hover:scale-125 active:scale-95 select-none"
				style="font-family:'Cormorant Garamond',serif; font-weight:700; font-size:1.6rem; color:{accentColor}; line-height:1; text-shadow:0 0 8px {accentColor}44;"
				onclick={() => { selectedIndex = ((selectedIndex - 1) + (isTainted ? TAINTED_CHARACTERS.length : BASE_CHARACTERS.length)) % (isTainted ? TAINTED_CHARACTERS.length : BASE_CHARACTERS.length); }}
				aria-label="Previous"
			>←</button>

			<h3 style="
				font-family: 'Cormorant Garamond', serif;
				font-weight: 700;
				font-size: 1.35rem;
				color: {accentColor};
				text-shadow: 0 1px 3px rgba(0,0,0,0.15);
				letter-spacing: 0.06em;
				min-width: 160px;
				text-align: center;
			">{selectedCharacter.name}</h3>

			<button
				class="cursor-pointer transition-all hover:scale-125 active:scale-95 select-none"
				style="font-family:'Cormorant Garamond',serif; font-weight:700; font-size:1.6rem; color:{accentColor}; line-height:1; text-shadow:0 0 8px {accentColor}44;"
				onclick={() => { selectedIndex = (selectedIndex + 1) % (isTainted ? TAINTED_CHARACTERS.length : BASE_CHARACTERS.length); }}
				aria-label="Next"
			>→</button>
		</div>

		<!-- Hearts -->
		<div class="relative z-10 flex items-center justify-center gap-0.5 mt-2 min-h-[18px]">
			{#if selectedCharacter.hearts.length === 0}
				<span style="font-family:'Cormorant Garamond',serif; font-size:0.7rem; color:#7a6068; letter-spacing:0.15em;">Holy Mantle</span>
			{:else}
				{#each selectedCharacter.hearts as slot}
					{@html heartSvg(slot)}
				{/each}
			{/if}
		</div>

		<!-- Damage + Speed -->
		<div class="relative z-10 flex items-center justify-center gap-5 mt-2">
			<div class="flex items-center gap-1.5">
				{@html damageSvg()}
				<span style="font-family:'Cormorant Garamond',serif; font-weight:700; font-size:0.9rem; color:#3a2020; letter-spacing:0.04em;">
					{selectedCharacter.damage ?? '?'}
				</span>
			</div>
			<div class="flex items-center gap-1.5">
				{@html speedSvg()}
				<span style="font-family:'Cormorant Garamond',serif; font-weight:700; font-size:0.9rem; color:#3a2020; letter-spacing:0.04em;">
					{selectedCharacter.speed ?? '?'}
				</span>
			</div>
		</div>
	</div>
</div>

<!-- ── Seeds section (scrolls below hero) ───────────────────────────────── -->
<div class="w-full max-w-2xl mx-auto px-4 pb-10">

	<div class="flex items-center justify-between mb-3 px-1">
		<span style="font-family:'Cormorant Garamond',serif; font-weight:700; font-size:1rem; color:#d0c8c0;">
			{selectedCharacter.name}'s seeds
		</span>
		<button
			class="cursor-pointer transition-all px-3 py-1"
			style="font-family:'Cormorant Garamond',serif; font-weight:700; font-size:0.8rem; color:{accentColor}; border:1.5px solid {accentColor}; background:transparent; box-shadow:1px 1px 0 rgba(0,0,0,0.3);"
			onmouseenter={(e) => (e.currentTarget.style.background = accentColor + '22')}
			onmouseleave={(e) => (e.currentTarget.style.background = 'transparent')}
			onclick={() => (showSubmit = true)}
		>+ submit seed</button>
	</div>

	<SeedList characterId={selectedCharacter.id} refreshTick={seedRefreshTick} />
</div>

{#if showSubmit}
	<SubmitModal character={selectedCharacter} onclose={() => (showSubmit = false)} onsuccess={handleSubmitSuccess} />
{/if}
