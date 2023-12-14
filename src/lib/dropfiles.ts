type DropParams = {
	onDragOver?: () => void;
	onDragEnter?: () => void;
	onDragLeave?: () => void;
	onDrop: (files: File[] | null, error?: Error) => void;
	acceptFileTypes: string[];
	fileSizeLimit: number;
};
export function dropfiles(
	elem: HTMLElement,
	{ onDragOver, onDragLeave, onDragEnter, onDrop, acceptFileTypes, fileSizeLimit }: DropParams
) {
	let dropCallback = onDrop;
	let fileTypes = acceptFileTypes;
	let maxFileSize = fileSizeLimit;

	elem.addEventListener('dragover', handleDragover);
	elem.addEventListener('dragenter', handleDragEnter);
	elem.addEventListener('dragleave', handleDragLeave);
	elem.addEventListener('drop', handleDrop);

	function handleDragover(e: DragEvent) {
		e.preventDefault();
		onDragOver?.();
	}
	function handleDragEnter() {
		onDragEnter?.();
	}

	function handleDragLeave() {
		onDragLeave?.();
	}
	async function handleDrop(e: DragEvent) {
		e.preventDefault();
		if (!e.dataTransfer?.items) {
			return;
		}

		let error: Error | undefined = undefined;
		let files: File[] | null = null;
		for (const item of e.dataTransfer.items) {
			if (item.kind === 'file') {
				const file = item.getAsFile();
				if (file && fileTypes.includes(file.type)) {
					if (file.size <= maxFileSize) {
						files = files || [];
						files.push(file);
					} else {
						error = new Error('Files are large');
						break;
					}
				} else {
					error = new Error('Files are invalid');
					break;
				}
			}
		}
		dropCallback(files, error);
	}

	return {
		destroy() {
			elem.removeEventListener('dragover', handleDragover);
			elem.removeEventListener('dragenter', handleDragEnter);
			elem.removeEventListener('dragleave', handleDragLeave);
			elem.removeEventListener('drop', handleDrop);
		},
		update({ acceptFileTypes, onDrop, fileSizeLimit }: DropParams) {
			dropCallback = onDrop;
			fileTypes = acceptFileTypes;
			maxFileSize = fileSizeLimit;
		}
	};
}
