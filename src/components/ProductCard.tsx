'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductCard({ product }: { product: any }) {
	const shortDesc =
		product.description?.slice(0, 120) +
		(product.description?.length > 120 ? '…' : '');
	const price = product.discountPrice ?? product.price;

	return (
		<Card className='overflow-hidden hover:shadow-lg transition pt-0'>
			<div className='relative h-48 w-full bg-gray-100'>
				{product.imageUrl ? (
					<Image
						src={product.imageUrl}
						alt={product.name}
						fill
						style={{ objectFit: 'cover' }}
					/>
				) : (
					<div className='h-full w-full flex items-center justify-center text-muted-foreground'>
						No image
					</div>
				)}
			</div>

			<div className='p-4'>
				<h3 className='text-lg font-semibold'>{product.name}</h3>
				{product.brand && (
					<div className='text-sm text-muted-foreground'>{product.brand}</div>
				)}
				<p className='text-sm text-muted-foreground mt-2'>{shortDesc}</p>

				<div className='mt-3 flex items-center justify-between'>
					<div>
						<div className='text-lg font-bold'>${Number(price).toFixed(2)}</div>
						{product.stock !== undefined && (
							<div className='text-xs text-muted-foreground'>
								Stock: {product.stock}
							</div>
						)}
					</div>
					<Link href={`/products/${product._id}`} className='ml-4'>
						<Button variant='outline'>Details</Button>
					</Link>
				</div>
			</div>
		</Card>
	);
}
