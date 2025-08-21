/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(_req: any, context: any) {
	try {
		const id = context?.params?.id;
		if (!id) {
			return NextResponse.json({ error: 'Missing id' }, { status: 400 });
		}

		const db = await getDb();

		let product;
		try {
			product = await db
				.collection('products')
				.findOne({ _id: new ObjectId(id) });
		} catch (e) {
			// invalid ObjectId or other error
			return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
		}

		if (!product) {
			return NextResponse.json({ error: 'Product not found' }, { status: 404 });
		}

		return NextResponse.json(product, { status: 200 });
	} catch (err) {
		console.error('GET /api/products/[id] error', err);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}
