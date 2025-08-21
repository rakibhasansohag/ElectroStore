import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
	req: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const id = params.id;
		const db = await getDb();
		const product = await db
			.collection('products')
			.findOne({ _id: new ObjectId(id) });
		if (!product)
			return NextResponse.json({ error: 'Not found' }, { status: 404 });
		return NextResponse.json(product);
	} catch (err) {
		return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
	}
}
