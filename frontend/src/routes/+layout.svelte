<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col">
	<header class="border-b border-[#2d1a4a] px-6 py-3 flex items-center gap-4">
		<h1 class="font-[Cinzel] text-xl font-bold text-[#c9a227] tracking-widest uppercase">
			Isaac Seeds
		</h1>
		<span class="text-xs text-[#6a5a7a] font-[Crimson_Text] italic">
			Community seed finder · Repentance+
		</span>
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="border-t border-[#2d1a4a] px-6 py-3 text-center text-xs text-[#4a3a5a]">
		Fan project · Not affiliated with Nicalis or Edmund McMillen
	</footer>
</div>
