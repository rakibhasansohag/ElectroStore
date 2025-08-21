/* eslint-disable @typescript-eslint/no-explicit-any */

import { getDb } from '@/lib/mongodb';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default async function ProductHighlights() {
	const db = await getDb();

	// top 6 newest products
	const products = await db
		.collection('products')
		.find({})
		.sort({ createdAt: -1 })
		.limit(6)
		.toArray();

	// distinct categories (filter out null/empty)
	const rawCategories = await db.collection('products').distinct('category');
	const categories = (rawCategories || []).filter(Boolean).slice(0, 8);

	return (
		<section className='container mx-auto px-6 py-16'>
			<div className='mb-6 flex items-center justify-between'>
				<h2 className='text-2xl font-bold'>Product Highlights</h2>
				<div className='flex gap-3 items-center'>
					<Link
						href='/products'
						className='text-sm text-muted-foreground hover:underline'
					>
						View all
					</Link>
				</div>
			</div>

			{/* categories row */}
			{categories.length > 0 && (
				<div className='mb-6 flex flex-wrap gap-3'>
					{categories.map((c: string) => (
						<Link
							key={c}
							href={`/products?search=${encodeURIComponent(String(c))}`}
							className='text-sm px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:opacity-90'
						>
							{c}
						</Link>
					))}
				</div>
			)}

			{/* product grid */}
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
				{products.map((p: any) => (
					<ProductCard key={String(p._id)} product={p} />
				))}
			</div>
		</section>
	);
}
