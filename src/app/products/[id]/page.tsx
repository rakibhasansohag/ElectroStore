/* eslint-disable @typescript-eslint/no-explicit-any */

import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Props = { params: { id: string } };

function formatCurrency(n: number) {
	return `$${Number(n).toFixed(2)}`;
}

export default async function ProductPage({ params }: Props) {
	const { id } = params;
	let product: any = null;

	try {
		const db = await getDb();
		product = await db
			.collection('products')
			.findOne({ _id: new ObjectId(id) });
	} catch (err) {
		console.error('fetch product error', err);
		product = null;
	}

	if (!product) return notFound();

	return (
		<section className='container mx-auto p-6'>
			<div className='mb-4 flex items-center justify-between'>
				<h1 className='text-2xl font-bold'>{product.name}</h1>
				<div className='flex items-center gap-2'>
					<Link href='/products'>
						<Button variant='ghost'>Back to products</Button>
					</Link>
					<Button>Edit</Button>
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				{/* Left: image (col-span 2 on md) */}
				<div className='md:col-span-2'>
					<Card className='p-0'>
						<div className='relative w-full h-[480px] bg-gray-100'>
							{product.imageUrl ? (
								<Image
									src={product.imageUrl}
									alt={product.name}
									fill
									style={{ objectFit: 'cover' }}
									sizes='(min-width: 768px) 70vw, 100vw'
								/>
							) : (
								<div className='h-full w-full flex items-center justify-center text-muted-foreground'>
									No image
								</div>
							)}
						</div>
					</Card>

					<div className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4'>
						{product.tags?.length > 0 && (
							<Card className='p-4'>
								<h3 className='font-semibold mb-2'>Tags</h3>
								<div className='flex flex-wrap gap-2'>
									{product.tags.map((t: string) => (
										<span
											key={t}
											className='text-sm px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded'
										>
											{t}
										</span>
									))}
								</div>
							</Card>
						)}

						{product.features?.length > 0 && (
							<Card className='p-4'>
								<h3 className='font-semibold mb-2'>Features</h3>
								<ul className='list-disc pl-5 space-y-1 text-sm'>
									{product.features.map((f: string, idx: number) => (
										<li key={idx}>{f}</li>
									))}
								</ul>
							</Card>
						)}
					</div>
				</div>

				{/* Right: details box */}
				<aside className='space-y-4'>
					<Card className='p-4'>
						<div className='flex items-center justify-between'>
							<div>
								<div className='text-xl font-bold'>
									{formatCurrency(product.discountPrice ?? product.price)}
								</div>
								{product.discountPrice && (
									<div className='text-sm text-muted-foreground line-through'>
										{formatCurrency(product.price)}
									</div>
								)}
							</div>
							<div className='text-sm text-muted-foreground'>
								SKU: {product.sku || '—'}
							</div>
						</div>

						<div className='mt-3 space-y-2 text-sm'>
							<div>
								<strong>Brand:</strong> {product.brand || '—'}
							</div>
							<div>
								<strong>Category:</strong> {product.category || '—'}
							</div>
							<div>
								<strong>Stock:</strong>{' '}
								{typeof product.stock === 'number' ? product.stock : '—'}
							</div>
							<div>
								<strong>Color:</strong> {product.color || '—'}
							</div>
							<div>
								<strong>Size:</strong> {product.size || '—'}
							</div>
							<div>
								<strong>Material:</strong> {product.material || '—'}
							</div>
						</div>

						<div className='mt-4 flex gap-2'>
							<Button>Add to cart</Button>
							<Button variant='outline'>Wishlist</Button>
						</div>
					</Card>

					<Card className='p-4'>
						<h4 className='font-semibold mb-2'>Shipping & Warranty</h4>
						<div className='text-sm space-y-1'>
							<div>
								<strong>Shipping:</strong> {product.shippingInfo || '—'}
							</div>
							<div>
								<strong>Warranty:</strong> {product.warranty || '—'}
							</div>
							<div>
								<strong>Added:</strong>{' '}
								{new Date(product.createdAt).toLocaleString()}
							</div>
							<div>
								<strong>Updated:</strong>{' '}
								{new Date(product.updatedAt).toLocaleString()}
							</div>
						</div>
					</Card>

					<Card className='p-4'>
						<h4 className='font-semibold mb-2'>Seller info</h4>
						<div className='text-sm text-muted-foreground'>
							Vendor: ElectroStore
						</div>
						<div className='text-sm text-muted-foreground'>
							Location: Dhaka, Bangladesh
						</div>
					</Card>
				</aside>
			</div>

			{/* Full description below */}
			<div className='mt-6'>
				<Card className='p-6'>
					<h3 className='text-lg font-semibold mb-3'>Product Description</h3>
					<div className='prose max-w-none'>
						<p>{product.description}</p>
					</div>
				</Card>
			</div>
		</section>
	);
}
