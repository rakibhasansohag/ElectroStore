'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Hero() {
	return (
		<section className='bg-gradient-to-r from-sky-600 to-indigo-600 text-white py-20 w-full'>
			<div className='container mx-auto px-6 md:px-0 flex flex-col md:flex-row items-center gap-8'>
				<div className='md:w-1/2'>
					<h1 className='text-4xl md:text-5xl font-extrabold leading-tight'>
						ElectroStore — electronics for modern life
					</h1>
					<p className='mt-4 text-lg text-sky-100 max-w-xl'>
						Discover curated electronics — headphones, keyboards, accessories
						and more. Fast shipping, trusted sellers, and products that actually
						last.
					</p>

					<div className='mt-6 flex gap-3'>
						<Link href='/products'>
							<Button size='lg'>Shop Products</Button>
						</Link>
						<Link href='/login'>
							<Button variant='ghost'>Sign in</Button>
						</Link>
					</div>
				</div>

				<div className='md:w-1/2 flex justify-center'>
					{/* simple promotional card */}
					<div className='bg-white/10 border border-white/20 rounded-xl p-6 w-full max-w-md backdrop-blur'>
						<div className='text-sm uppercase text-sky-100'>Featured</div>
						<h3 className='mt-2 text-2xl font-semibold'>
							Wireless Headphones — Top pick
						</h3>
						<p className='mt-2 text-sky-100 text-sm'>
							Noise cancellation, long battery life, and a comfortable fit.
							Check out the latest deals.
						</p>
						<div className='mt-4'>
							<Link href='/products'>
								<Button size='sm'>See collection</Button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
