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

	function usePopperTrigger(element: HTMLElement) {
		popperTrigger = element;
		initialisePopper();
		return {
			destroy() {
				popperTrigger = null;
				destroyPopper();
			}
		};
	}
	function usePopperContent(element: HTMLElement, params?: PopperParams) {
		popperContent = element;
		popperParams = params;
		initialisePopper();
		return {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			update(newParams: Partial<OptionsGeneric<any>>) {
				popperParams = newParams;
				popper?.setOptions(newParams);
			},
			destroy() {
				popperContent = null;
				destroyPopper();
			}
		};
	}
	return [usePopperTrigger, usePopperContent];
}
