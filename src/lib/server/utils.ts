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

export async function sha256(message: string) {
	// encode as UTF-8
	const msgBuffer = new TextEncoder().encode(message);

	// hash the message
	const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

	// convert ArrayBuffer to Array
	const hashArray = Array.from(new Uint8Array(hashBuffer));

	// convert bytes to hex string
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
	return hashHex;
}
