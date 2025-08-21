/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

function parseNumber(value: FormDataEntryValue | null, fallback = 0) {
	if (value === null) return fallback;
	const n = Number(String(value));
	return Number.isFinite(n) ? n : fallback;
}

export async function GET(req: Request) {
	try {
		const url = new URL(req.url);
		const search = url.searchParams.get('search') || '';
		const sort = url.searchParams.get('sort') || 'newest';
		const page = Math.max(1, Number(url.searchParams.get('page') || '1'));
		const limit = Math.min(
			100,
			Math.max(1, Number(url.searchParams.get('limit') || '12')),
		);

		const db = await getDb();

		const filter: any = {};
		if (search) {
			const q = search.trim();
			const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
			filter.$or = [
				{ name: regex },
				{ brand: regex },
				{ category: regex },
				{ description: regex },
				{ tags: regex },
				{ sku: regex },
			];
		}

		let sortObj: any = { createdAt: -1 }; // newest default
		if (sort === 'price_asc') sortObj = { price: 1 };
		else if (sort === 'price_desc') sortObj = { price: -1 };
		else if (sort === 'oldest') sortObj = { createdAt: 1 };

		const skip = (page - 1) * limit;

		const cursor = db
			.collection('products')
			.find(filter)
			.sort(sortObj)
			.skip(skip)
			.limit(limit);
		const products = await cursor.toArray();
		const total = await db.collection('products').countDocuments(filter);

		return NextResponse.json({ products, total, page, limit });
	} catch (err) {
		console.error('GET /api/products error', err);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}

export async function POST(req: Request) {
	try {
		const form = await req.formData();

		// required fields
		const name = String(form.get('name') || '').trim();
		const description = String(form.get('description') || '').trim();
		const imageFile = form.get('image') as File | null;
		// numeric fields (strings in form)
		const price = parseNumber(form.get('price'), NaN);
		const discountPriceRaw = form.get('discountPrice');
		const discountPrice = discountPriceRaw
			? parseNumber(discountPriceRaw, NaN)
			: undefined;
		const stockRaw = form.get('stock');
		const stock = stockRaw ? parseNumber(stockRaw, 0) : 0;

		// other optional string fields
		const brand = String(form.get('brand') || '').trim();
		const category = String(form.get('category') || '').trim();
		const sku = String(form.get('sku') || '').trim();
		const color = String(form.get('color') || '').trim();
		const size = String(form.get('size') || '').trim();
		const material = String(form.get('material') || '').trim();
		const tagsRaw = String(form.get('tags') || '').trim();
		const featuresRaw = String(form.get('features') || '').trim();
		const warranty = String(form.get('warranty') || '').trim();
		const shippingInfo = String(form.get('shippingInfo') || '').trim();

		// basic validation
		if (!name)
			return NextResponse.json(
				{ error: 'Missing product name' },
				{ status: 400 },
			);
		if (!description)
			return NextResponse.json(
				{ error: 'Missing description' },
				{ status: 400 },
			);
		if (!imageFile)
			return NextResponse.json(
				{ error: 'Missing image file' },
				{ status: 400 },
			);
		if (Number.isNaN(price))
			return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
		if (discountPrice !== undefined && Number.isNaN(discountPrice))
			return NextResponse.json(
				{ error: 'Invalid discountPrice' },
				{ status: 400 },
			);

		// prepare tags array and features array
		const tags = tagsRaw
			? tagsRaw
					.split(',')
					.map((t) => t.trim())
					.filter(Boolean)
			: [];
		const features = featuresRaw
			? featuresRaw
					.split(/\r?\n/)
					.map((f) => f.trim())
					.filter(Boolean)
			: [];

		// Convert image file to data URI and upload to Cloudinary
		const arrayBuffer = await imageFile.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const base64 = buffer.toString('base64');
		const dataUri = `data:${imageFile.type};base64,${base64}`;

		const uploadResp = await cloudinary.uploader.upload(dataUri, {
			folder: 'electrostore/products',
			resource_type: 'image',
			use_filename: true,
			unique_filename: true,
			overwrite: false,
		});

		const imageUrl = uploadResp.secure_url;
		const imagePublicId = uploadResp.public_id;

		// build document
		const now = new Date();

		const productDoc: any = {
			name,
			brand: brand || null,
			category: category || null,
			sku: sku || null,
			stock: Number(stock || 0),
			price: Number(price),
			discountPrice:
				typeof discountPrice === 'number' && !Number.isNaN(discountPrice)
					? Number(discountPrice)
					: null,
			color: color || null,
			size: size || null,
			material: material || null,
			tags,
			features,
			warranty: warranty || null,
			shippingInfo: shippingInfo || null,
			description,
			imageUrl,
			imagePublicId,
			createdAt: now,
			updatedAt: now,
		};

		const db = await getDb();
		const result = await db.collection('products').insertOne(productDoc);

		// return created product (with _id)
		return NextResponse.json(
			{ ...productDoc, _id: result.insertedId },
			{ status: 201 },
		);
	} catch (err: any) {
		console.error('POST /api/products error', err);
		// Cloudinary error or others
		return NextResponse.json(
			{ error: err?.message || 'Server error' },
			{ status: 500 },
		);
	}
}
