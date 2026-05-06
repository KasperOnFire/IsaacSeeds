<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Character } from '$lib/characters';
	import { TAGS } from '$lib/tags';
	import { VERSIONS } from '$lib/types';

	let {
		character,
		onclose
	}: {
		character: Character;
		onclose: () => void;
	} = $props();

	let seedInput = $state('');
	let version = $state('repentance_plus');
	let description = $state('');
	let difficulty = $state(3);
	let selectedTags = $state<string[]>([]);
	let notableItems = $state('');
	let submitting = $state(false);
	let serverError = $state('');
	let success = $state(false);

	const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? '';

	// Format seed input as user types: XXXX XXXX
	function handleSeedInput(e: Event) {
		const raw = (e.target as HTMLInputElement).value
			.toUpperCase()
			.replace(/[^A-Z0-9]/g, '')
			.slice(0, 8);
		seedInput = raw.length > 4 ? `${raw.slice(0, 4)} ${raw.slice(4)}` : raw;
	}

	function toggleTag(tagId: string) {
		if (selectedTags.includes(tagId)) {
			selectedTags = selectedTags.filter((t) => t !== tagId);
		} else {
			selectedTags = [...selectedTags, tagId];
		}
	}

	function handleBackdrop(e: MouseEvent) {
		if (e.target === e.currentTarget) onclose();
	}

	function handleEsc(e: KeyboardEvent) {
		if (e.key === 'Escape') onclose();
	}
</script>

<svelte:window onkeydown={handleEsc} />

<!-- Backdrop -->
<div
	class="fixed inset-0 z-50 flex items-center justify-center p-4"
	style="background: rgba(0,0,0,0.75);"
	onclick={handleBackdrop}
	role="dialog"
	aria-modal="true"
	aria-label="Submit seed"
>
	<div
		class="w-full max-w-lg bg-[#1a0a2e] border border-[#2d1a4a] rounded-sm shadow-2xl max-h-[90vh] overflow-y-auto"
		onclick={(e) => e.stopPropagation()}
	>
		<!-- Header -->
		<div class="flex items-center justify-between px-6 py-4 border-b border-[#2d1a4a]">
			<h2 class="font-[Cinzel] text-[#c9a227] tracking-widest uppercase text-sm">
				Submit Seed · {character.name}
			</h2>
			<button
				class="text-[#4a3a5a] hover:text-[#c9a227] transition-colors cursor-pointer text-xl leading-none"
				onclick={onclose}
				aria-label="Close"
			>
				×
			</button>
		</div>

		{#if success}
			<div class="px-6 py-12 text-center">
				<p class="font-[Cinzel] text-[#c9a227] text-lg tracking-wider">Seed submitted!</p>
				<p class="text-[#6a5a7a] text-sm mt-2">Thank you for contributing.</p>
				<button
					class="mt-6 px-6 py-2 border border-[#c9a227] text-[#c9a227] text-sm font-[Cinzel] tracking-wider uppercase hover:bg-[#2a1a00] transition-colors cursor-pointer"
					onclick={onclose}
				>
					Close
				</button>
			</div>
		{:else}
			<form
				method="POST"
				action="?/submit"
				use:enhance={() => {
					submitting = true;
					serverError = '';
					return async ({ result, update }) => {
						submitting = false;
						if (result.type === 'success') {
							success = true;
						} else if (result.type === 'failure') {
							serverError = (result.data as { error?: string })?.error ?? 'Submission failed.';
						}
						await update({ reset: false });
					};
				}}
				class="px-6 py-5 flex flex-col gap-4"
			>
				<input type="hidden" name="character" value={character.id} />
				<input type="hidden" name="tags" value={JSON.stringify(selectedTags)} />

				<!-- Seed input -->
				<div class="flex flex-col gap-1.5">
					<label class="text-xs font-[Cinzel] text-[#6a5a7a] uppercase tracking-wider" for="seed">
						Seed <span class="text-[#8b1a1a]">*</span>
					</label>
					<input
						id="seed"
						name="seed"
						type="text"
						value={seedInput}
						oninput={handleSeedInput}
						placeholder="XXXX XXXX"
						maxlength="9"
						required
						class="bg-[#0d0512] border border-[#2d1a4a] px-3 py-2 font-mono text-lg tracking-[0.2em] text-[#c9a227] placeholder-[#3a2a4a] focus:outline-none focus:border-[#c9a227] transition-colors"
					/>
				</div>

				<!-- Version -->
				<div class="flex flex-col gap-1.5">
					<label class="text-xs font-[Cinzel] text-[#6a5a7a] uppercase tracking-wider" for="version">
						Version <span class="text-[#8b1a1a]">*</span>
					</label>
					<select
						id="version"
						name="version"
						bind:value={version}
						class="bg-[#0d0512] border border-[#2d1a4a] px-3 py-2 text-sm text-[#a09080] focus:outline-none focus:border-[#c9a227] transition-colors cursor-pointer"
					>
						{#each VERSIONS as v}
							<option value={v.value}>{v.label}</option>
						{/each}
					</select>
				</div>

				<!-- Difficulty -->
				<div class="flex flex-col gap-1.5">
					<span class="text-xs font-[Cinzel] text-[#6a5a7a] uppercase tracking-wider">
						Difficulty
					</span>
					<div class="flex gap-2">
						{#each [1, 2, 3, 4, 5] as star}
							<button
								type="button"
								class="text-2xl transition-colors cursor-pointer"
								style="color: {star <= difficulty ? '#c9a227' : '#2d1a4a'};"
								onclick={() => (difficulty = star)}
								aria-label="Difficulty {star}"
							>
								★
							</button>
						{/each}
					</div>
					<input type="hidden" name="difficulty" value={difficulty} />
				</div>

				<!-- Description -->
				<div class="flex flex-col gap-1.5">
					<label class="text-xs font-[Cinzel] text-[#6a5a7a] uppercase tracking-wider" for="desc">
						Description
					</label>
					<textarea
						id="desc"
						name="description"
						bind:value={description}
						placeholder="What makes this seed special?"
						maxlength="500"
						rows="3"
						class="bg-[#0d0512] border border-[#2d1a4a] px-3 py-2 text-sm text-[#a09080] placeholder-[#3a2a4a] focus:outline-none focus:border-[#c9a227] transition-colors resize-none"
					></textarea>
					<span class="text-[10px] text-[#3a2a4a] text-right">{description.length}/500</span>
				</div>

				<!-- Notable items -->
				<div class="flex flex-col gap-1.5">
					<label class="text-xs font-[Cinzel] text-[#6a5a7a] uppercase tracking-wider" for="items">
						Notable Items
					</label>
					<input
						id="items"
						name="notable_items"
						type="text"
						bind:value={notableItems}
						placeholder="e.g. Brimstone, Mom's Knife, 20/20"
						maxlength="200"
						class="bg-[#0d0512] border border-[#2d1a4a] px-3 py-2 text-sm text-[#a09080] placeholder-[#3a2a4a] focus:outline-none focus:border-[#c9a227] transition-colors"
					/>
				</div>

				<!-- Tags -->
				<div class="flex flex-col gap-2">
					<span class="text-xs font-[Cinzel] text-[#6a5a7a] uppercase tracking-wider">Tags</span>
					<div class="flex flex-wrap gap-1.5">
						{#each TAGS as tag}
							<button
								type="button"
								class="px-2 py-0.5 rounded-sm text-[10px] font-[Cinzel] uppercase tracking-wider transition-all cursor-pointer"
								style="
									background: {selectedTags.includes(tag.id) ? tag.color + 'cc' : 'transparent'};
									border: 1px solid {selectedTags.includes(tag.id) ? tag.color : '#2d1a4a'};
									color: {selectedTags.includes(tag.id) ? '#fff' : '#6a5a7a'};
								"
								onclick={() => toggleTag(tag.id)}
							>
								{tag.label}
							</button>
						{/each}
					</div>
				</div>

				<!-- Turnstile CAPTCHA -->
				{#if SITE_KEY}
					<div class="cf-turnstile" data-sitekey={SITE_KEY} data-theme="dark"></div>
				{:else}
					<p class="text-[10px] text-[#4a2a2a] font-[Cinzel]">
						⚠ CAPTCHA not configured (dev mode)
					</p>
				{/if}

				<!-- Error -->
				{#if serverError}
					<p class="text-sm text-[#c23b3b] font-[Cinzel]">{serverError}</p>
				{/if}

				<!-- Submit -->
				<button
					type="submit"
					disabled={submitting}
					class="w-full py-2.5 border border-[#c9a227] text-[#c9a227] font-[Cinzel] tracking-widest uppercase text-sm
						hover:bg-[#2a1a00] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-default"
				>
					{submitting ? 'Submitting…' : 'Submit Seed'}
				</button>
			</form>
		{/if}
	</div>
</div>
