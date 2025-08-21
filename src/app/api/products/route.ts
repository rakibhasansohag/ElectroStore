import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
	const db = await getDb();
	const products = await db
		.collection('products')
		.find()
		.sort({ createdAt: -1 })
		.toArray();
	return NextResponse.json(products);
}

export async function POST(req: Request) {
	const form = await req.formData();
	const name = String(form.get('name') || '');
	const description = String(form.get('description') || '');
	const price = Number(form.get('price') || 0);
	const imageFile = form.get('image') as File | null;

	if (!name || !description || !imageFile) {
		return NextResponse.json({ error: 'missing fields' }, { status: 400 });
	}

	// Convert file to base64 Data URI
	const arrayBuffer = await imageFile.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	const base64 = buffer.toString('base64');
	const dataUri = `data:${imageFile.type};base64,${base64}`;

	// Upload to Cloudinary
	const uploadResp = await cloudinary.uploader.upload(dataUri, {
		folder: 'electrostore/products',
		resource_type: 'image',
	});

	const db = await getDb();
	const now = new Date();
	const doc = {
		name,
		description,
		price,
		imageUrl: uploadResp.secure_url,
		createdAt: now,
		updatedAt: now,
	};

	const result = await db.collection('products').insertOne(doc);
	return NextResponse.json({ ...doc, _id: result.insertedId }, { status: 201 });
}
