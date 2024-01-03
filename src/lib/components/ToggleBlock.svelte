<script>
	let open = false;
	function toggle() {
		open = !open;
	}
</script>

<slot {open} />
<slot name="trigger" {open} {toggle} />
{#if open}
	<slot name="content" />
{/if}
