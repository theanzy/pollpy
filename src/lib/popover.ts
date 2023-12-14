import {
	createPopper,
	type Modifier,
	type Obj,
	type OptionsGeneric,
	type Instance
} from '@popperjs/core';

type PopperParams = Partial<OptionsGeneric<Partial<Modifier<unknown, Obj>>>> | undefined;
export default function createPopperAction() {
	let popperTrigger: HTMLElement | null = null;
	let popperContent: HTMLElement | null = null;
	let popperParams: PopperParams;
	let popper: Instance | null = null;

	function initialisePopper() {
		if (popperTrigger && popperContent) {
			popper = createPopper(popperTrigger, popperContent, popperParams);
		}
	}

	function destroyPopper() {
		if (popper) {
			popper.destroy();
			popper = null;
		}
	}

	function usePopperTrigger(
		element: HTMLElement,
		{
			onClick
		}: {
			onClick?: () => void;
		} = {}
	) {
		popperTrigger = element;
		if (onClick) {
			popperTrigger.addEventListener('click', onClick);
		}
		initialisePopper();
		return {
			destroy() {
				if (onClick) {
					popperTrigger?.removeEventListener('click', onClick);
				}
				popperTrigger = null;
				destroyPopper();
			}
		};
	}
	function usePopperContent(
		element: HTMLElement,
		{ params, onClickOutside }: { onClickOutside?: () => void; params?: PopperParams } = {}
	) {
		popperContent = element;
		popperParams = params;
		initialisePopper();
		function onClick(event: MouseEvent) {
			const target = event.target as HTMLElement;
			if (target === popperTrigger || popperTrigger?.contains(target)) {
				return;
			}
			if (!element.contains(target)) {
				onClickOutside?.();
			}
		}
		if (onClickOutside) {
			document.body.addEventListener('click', onClick, true);
		}
		return {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			update(newParams: Partial<OptionsGeneric<any>>) {
				popperParams = newParams;
				popper?.setOptions(newParams);
			},
			destroy() {
				if (onClickOutside) {
					document.body.removeEventListener('click', onClick, true);
				}
				popperContent = null;
				destroyPopper();
			}
		};
	}
	return [usePopperTrigger, usePopperContent];
}
