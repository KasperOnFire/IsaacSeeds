<script lang="ts">
	import type { Character } from '$lib/characters';

	let {
		characters,
		selectedIndex = $bindable(0),
		isTainted = false
	}: {
		characters: Character[];
		selectedIndex: number;
		isTainted: boolean;
	} = $props();

	const VISIBLE = 5; // slots shown on each side of center

	function charAtOffset(offset: number): { char: Character; idx: number } {
		const len = characters.length;
		const idx = ((selectedIndex + offset) % len + len) % len;
		return { char: characters[idx], idx };
	}

	function navigate(dir: -1 | 1) {
		selectedIndex = ((selectedIndex + dir) + characters.length) % characters.length;
	}

	function handleKey(e: KeyboardEvent) {
		if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
		if (e.key === 'ArrowLeft') { e.preventDefault(); navigate(-1); }
		if (e.key === 'ArrowRight') { e.preventDefault(); navigate(1); }
	}

	const SLOT_WIDTH = 80;
	const CENTER_SCALE = 1.5;
	const SCALE_DECAY = 0.12;
	const OPACITY_DECAY = 0.18;
</script>

<svelte:window onkeydown={handleKey} />

<div
	class="relative w-full overflow-hidden select-none"
	style="height: 180px; background: linear-gradient(to bottom, #0d0512, #1a0a2e, #0d0512);"
>
	<!-- Side fade masks -->
	<div class="absolute inset-y-0 left-0 w-32 z-10 pointer-events-none"
		style="background: linear-gradient(to right, #0d0512, transparent);">
	</div>
	<div class="absolute inset-y-0 right-0 w-32 z-10 pointer-events-none"
		style="background: linear-gradient(to left, #0d0512, transparent);">
	</div>

	<!-- Nav arrows -->
	<button
		class="absolute left-3 top-1/2 -translate-y-1/2 z-20 text-2xl cursor-pointer
			{isTainted ? 'text-[#c23b3b] hover:text-[#e85a5a]' : 'text-[#c9a227] hover:text-[#e8c44a]'}
			transition-colors opacity-70 hover:opacity-100"
		onclick={() => navigate(-1)}
		aria-label="Previous character"
	>
		‹
	</button>
	<button
		class="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-2xl cursor-pointer
			{isTainted ? 'text-[#c23b3b] hover:text-[#e85a5a]' : 'text-[#c9a227] hover:text-[#e8c44a]'}
			transition-colors opacity-70 hover:opacity-100"
		onclick={() => navigate(1)}
		aria-label="Next character"
	>
		›
	</button>

	<!-- Character slots -->
	<div class="absolute inset-0 flex items-center justify-center">
		{#each Array.from({ length: VISIBLE * 2 + 1 }, (_, i) => i - VISIBLE) as offset (offset)}
			{@const { char, idx } = charAtOffset(offset)}
			{@const abs = Math.abs(offset)}
			{@const scale = offset === 0 ? CENTER_SCALE : Math.max(0.4, 1 - abs * SCALE_DECAY)}
			{@const opacity = Math.max(0.15, 1 - abs * OPACITY_DECAY)}
			{@const isSelected = offset === 0}

			<button
				class="absolute flex flex-col items-center cursor-pointer transition-all duration-200 ease-out"
				style="
					transform: translateX({offset * SLOT_WIDTH}px) scale({scale});
					opacity: {opacity};
					z-index: {VISIBLE - abs};
					filter: {isSelected ? 'brightness(1.15) drop-shadow(0 0 8px #c9a22760)' : `brightness(${0.5 + (1 - abs * 0.12)})`};
				"
				onclick={() => (selectedIndex = idx)}
				aria-label={char.name}
				aria-pressed={isSelected}
			>
				<!-- Portrait frame -->
				<div
					class="relative flex items-center justify-center rounded-sm overflow-hidden"
					style="
						width: 64px;
						height: 64px;
						background: #0d0512;
						border: {isSelected
							? `2px solid ${isTainted ? '#c23b3b' : '#c9a227'}`
							: '1px solid #2d1a4a'};
						box-shadow: {isSelected
							? `0 0 16px ${isTainted ? '#c23b3b44' : '#c9a22744'}, inset 0 0 8px #00000088`
							: 'none'};
					"
				>
					<img
						src={char.spriteUrl}
						alt={char.name}
						class="w-full h-full object-contain"
						style="image-rendering: pixelated;"
						onerror="this.style.display='none'"
					/>
					<!-- Fallback initial if sprite missing -->
					<span
						class="absolute text-lg font-[Cinzel] font-bold pointer-events-none"
						style="color: {isTainted ? '#c23b3b' : '#c9a227'}; opacity: 0.4;"
					>
						{char.name[0]}
					</span>
				</div>

				<!-- Dot indicator for selected -->
				{#if isSelected}
					<div
						class="mt-1.5 w-1.5 h-1.5 rounded-full"
						style="background: {isTainted ? '#c23b3b' : '#c9a227'};"
					></div>
				{/if}
			</button>
		{/each}
	</div>
</div>
