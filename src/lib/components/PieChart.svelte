<script lang="ts">
	import Chart from 'chart.js/auto';
	type Data = { label: string; value: number };
	type PiechartParam = { dataset: Data[] };

	export let dataset: Data[] = [];
	const colors = ['#1976D2', '#FFB74D', '#00E676', '#5E35B1', '#E53935', '#FF80AB'];
	function piechart(elem: HTMLCanvasElement, { dataset }: PiechartParam) {
		const chart = new Chart(elem, {
			type: 'pie',
			data: {
				labels: dataset.map((d) => d.label),
				datasets: [
					{
						data: dataset.map((d) => d.value),
						backgroundColor: colors,
						borderColor: 'rgba(0,0,0,0.5)'
					}
				]
			},
			options: {
				responsive: true,
				plugins: {
					legend: {
						display: false
					}
				}
			}
		});
		return {
			destroy() {
				chart.destroy();
			},
			update({ dataset }: PiechartParam) {
				chart.data.labels = dataset.map((d) => d.label);
				chart.data.datasets[0].data = dataset.map((d) => d.value);
				chart.update();
			}
		};
	}
</script>

<canvas use:piechart={{ dataset }} class="w-full h-full" />
