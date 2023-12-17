import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const formdata = await request.formData();
	const file = formdata.get('file') as File;
	if (!file) {
		return json({ error: 'File is required' }, { status: 400 });
	}
	if (file.size > 4 * 1024 * 1024) {
		return json({ error: 'File size must be less than 4MB' }, { status: 400 });
	}

	try {
		const formToUpload = new FormData();
		formToUpload.append('file', file);
		formToUpload.append('folder', 'pollpy');
		formToUpload.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

		const uploadURL = `${CLOUDINARY_URL}/image/upload`;
		const res = await fetch(uploadURL, {
			body: formToUpload,
			method: 'POST'
		});
		const data: { secure_url: string } = await res.json();
		return json({
			url: data.secure_url
		});
	} catch (error) {
		console.log('fail to upload', error);
		return json({ error: 'Fail to upload' }, { status: 400 });
	}
}
