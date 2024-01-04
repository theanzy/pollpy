<script>
	export let open = false;
	function toggle() {
		open = !open;
	}
</script>

<slot isOpen={open} name="trigger" {open} {toggle} />
<div class={open ? '' : 'hidden'}>
	<slot name="content" isOpen={open} />
</div>
