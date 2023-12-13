export function clickOutside(element: HTMLElement, callbackFunction: () => void) {
	function onClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!element.contains(target)) {
			callbackFunction();
		}
	}

	document.body.addEventListener('click', onClick, true);

	return {
		update(cb: () => void) {
			callbackFunction = cb;
		},
		destroy() {
			document.body.removeEventListener('click', onClick, true);
		}
	};
}
