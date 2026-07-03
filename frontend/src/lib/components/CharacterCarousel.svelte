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

	// Ring geometry — scaled up ~20% from previous version (pixel art holds up fine at larger sizes)
	const SLOTS     = 10;
	const H_RADIUS  = 240;  // px from centre to character position
	const V_RADIUS  = 34;   // vertical depth tilt
	const SCALE_MAX = 1.5;
	const SCALE_MIN = 0.28;
	const VISIBLE   = 3;    // show 3 each side = 7 total
	const IMG_SIZE  = 78;   // base sprite render size in px

	function ringPos(offset: number) {
		const angle = (offset / SLOTS) * 2 * Math.PI;
		const sin   = Math.sin(angle);
		const cos   = Math.cos(angle); // 1 = front, -1 = back
		const t     = (cos + 1) / 2;  // 0..1 where 1 = front
		return {
			x:       sin * H_RADIUS,
			y:       cos * V_RADIUS,
			scale:   SCALE_MIN + t * (SCALE_MAX - SCALE_MIN),
			opacity: 0.15 + t * 0.85,
			z:       Math.round(t * 40),
		};
	}

	function charAt(offset: number) {
		const len = characters.length;
		const idx = ((selectedIndex + offset) % len + len) % len;
		return { char: characters[idx], idx };
	}

	function navigate(dir: -1 | 1) {
		selectedIndex = ((selectedIndex + dir) + characters.length) % characters.length;
	}

	function handleKey(e: KeyboardEvent) {
		if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
		if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') { e.preventDefault(); navigate(-1); }
		if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { e.preventDefault(); navigate(1);  }
	}

	const glowColor = $derived(isTainted ? '#c23b3b' : '#e8a020');
</script>

<svelte:window onkeydown={handleKey} />

<!-- overflow:hidden keeps all characters within the note boundary -->
<div class="relative w-full select-none" style="height:224px; overflow:hidden;">
	<div class="absolute inset-0 flex items-center justify-center">
		{#each Array.from({ length: VISIBLE * 2 + 1 }, (_, i) => i - VISIBLE) as offset (offset)}
			{@const { char, idx } = charAt(offset)}
			{@const { x, y, scale, opacity, z } = ringPos(offset)}
			{@const isFront = offset === 0}

			<button
				class="absolute transition-all duration-200 ease-out cursor-pointer flex items-center justify-center"
				style="
					transform: translate({x}px, {y}px) scale({scale});
					opacity: {opacity};
					z-index: {z};
					width: {IMG_SIZE}px; height: {IMG_SIZE}px;
					filter: {isFront
						? `drop-shadow(0 0 10px ${glowColor}99) brightness(1.1)`
						: `brightness(0.55) saturate(0.5)`};
				"
				onclick={() => { selectedIndex = idx; }}
				aria-label={char.name}
				aria-pressed={isFront}
			>
				<img
					src={char.spriteUrl}
					alt={char.name}
					style="width:{IMG_SIZE}px; height:{IMG_SIZE}px; object-fit:contain; image-rendering:pixelated;"
					onerror={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = '0')}
				/>
			</button>
		{/each}
	</div>
</div>
