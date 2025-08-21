import Link from 'next/link';

export default function Footer() {
	return (
		<footer className='border-t bg-muted/50 dark:bg-slate-900/60 mt-12'>
			<div className='container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-start gap-6'>
				<div className='max-w-sm'>
					<h3 className='font-bold text-lg'>ElectroStore</h3>
					<p className='text-sm text-muted-foreground mt-2'>
						Small demo electronics store built with Next.js, shadcn UI and
						Cloudinary.
					</p>
				</div>

				<div className='flex gap-8'>
					<div>
						<h4 className='font-medium mb-2'>Shop</h4>
						<ul className='space-y-2 text-sm'>
							<li>
								<Link href='/products'>Products</Link>
							</li>
							<li>
								<Link href='/products?search=Headphones'>Headphones</Link>
							</li>
							<li>
								<Link href='/products?search=Accessories'>Accessories</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className='text-sm text-muted-foreground'>
					© {new Date().getFullYear()} ElectroStore
				</div>
			</div>
		</footer>
	);
}
