import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};

export function focus(el: HTMLInputElement, isfocused: boolean) {
	if (isfocused) {
		el.focus();
	}
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
	year: 'numeric',
	month: 'numeric',
	day: 'numeric',
	hour: '2-digit',
	minute: '2-digit'
});

export function dateMoment(start: Date, end: Date) {
	const diff = end.getTime() - start.getTime();
	if (diff < 1000 * 60) {
		return diff / 1000 < 1 ? '1 second ago' : `${Math.floor(diff / 1000)} seconds ago`;
	} else if (diff <= 1000 * 60 * 20) {
		const m = Math.floor(diff / 1000 / 60);

		return m === 1 ? '1 minute' : `${m} minutes ago`;
	}
	return dateFormatter.format(start);
}

export function uuidToBase64(uuid: string): string {
	return Buffer.from(uuid.replace(/-/g, ''), 'hex').toString('base64url');
}

export function base64toUUID(base64: string): string {
	const hex = Buffer.from(base64, 'base64url').toString('hex');

	return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(
		16,
		20
	)}-${hex.substring(20)}`;
}
