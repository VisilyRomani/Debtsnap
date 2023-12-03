<script>
	export let size = 24;
	$: sizePx = `${size}px`;
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	preserveAspectRatio="xMidYMid"
	style:width={sizePx}
	style:height={sizePx}
	viewBox="0 0 300 300"
>
	<defs>
		<style>
			.cls-1,
			.cls-2 {
				font-size: 375px;
			}

			.cls-2 {
				fill: #568259;
				font-family: 'Cherolina';
			}
		</style>
	</defs>
	<text x="30" y="290" class="cls-1"><tspan class="cls-2">D</tspan></text>
</svg>
