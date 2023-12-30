import { writable } from 'svelte/store';

function createModalStore<ParamT>() {
	const { subscribe, set, update } = writable<{
		open: boolean;
		params?: ParamT;
	}>({
		open: false,
		params: undefined
	});
	return {
		subscribe,
		set,
		openModal(params: ParamT) {
			update(() => ({ params, open: true }));
		},
		closeModal() {
			update(() => ({ prev: undefined, open: false }));
		}
	};
}

export const sharePollModalStore = createModalStore<{ link: string }>();

export const deletePollModalStore = createModalStore<{ slug: string }>();

export const deleteMultipleModalStore = createModalStore<{ ids: string[] }>();
