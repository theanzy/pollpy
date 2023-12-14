import { fly, type FlyParams } from 'svelte/transition';

export function fadeFly(
	node: HTMLElement,
	options: FlyParams = {
		duration: 200
	}
) {
	const slideTrans = fly(node, options);
	return {
		duration: options.duration,
		css: (t: number) => `
				${slideTrans.css?.(t, 0)}
			`
	};
}
