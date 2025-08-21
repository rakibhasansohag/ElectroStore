import ProductListClient from '@/components/ProductListClient';

export const metadata = {
	title: 'Products — ElectroStore',
};

export default function ProductsPage() {
	return (
		<section className='container mx-auto p-6'>
			<h1 className='text-2xl font-bold mb-4'>Products</h1>
			<ProductListClient />
		</section>
	);
}
