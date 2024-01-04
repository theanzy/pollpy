<script>
	let open = false;
	function toggle() {
		open = !open;
	}
</script>

<slot {open} />
<slot name="trigger" {open} {toggle} />
<div class={open ? '' : 'hidden'}>
	<slot name="content" isOpen={open} />
</div>
