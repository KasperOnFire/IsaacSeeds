<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<!--
  Layer order (bottom → top):
    0  body background image (bg.png tiled)
    1  darkening overlay  (semi-transparent black, fixed)
    2  vignette overlay   (radial gradient to black at edges, fixed)
    3  page content       (z-10, relative)
    99 modals / popovers
-->

<!-- Darkening overlay — makes the game texture slightly darker -->
<div class="fixed inset-0 pointer-events-none"
	style="background: rgba(4,1,10,0.52); z-index: 1;"></div>

<!-- Vignette — hard fade to black at screen edges -->
<div class="fixed inset-0 pointer-events-none"
	style="background: radial-gradient(ellipse at 50% 45%, transparent 32%, rgba(0,0,0,0.72) 68%, rgba(0,0,0,0.97) 100%); z-index: 2;"></div>

<!-- Page content sits above both overlays -->
<div class="relative flex flex-col min-h-screen" style="z-index: 3;">
	<main class="flex-1">
		{@render children()}
	</main>

	<p class="text-center py-3"
		style="font-family:'Kalam',cursive; font-size:0.68rem; color:#5a5060; letter-spacing:0.06em; opacity:0.6;">
		Fan project · Not affiliated with Nicalis or Edmund McMillen
	</p>
</div>
