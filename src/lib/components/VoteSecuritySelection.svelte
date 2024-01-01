<script lang="ts">
	import Select from './Select.svelte';
	export let name: string;
	export let id: string;
</script>

<Select
	{id}
	{name}
	items={[
		{
			label: 'One vote per browser session',
			value: 'cookie session'
		},
		{
			label: 'One vote per IP address',
			value: 'ip'
		},
		{
			label: 'One vote per pollpy account',
			value: 'free user'
		}
	]}
/>
