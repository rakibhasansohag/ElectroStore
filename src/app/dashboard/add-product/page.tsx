import AddProductForm from '@/components/AddProductForm';

export default async function Page() {
	return (
		<main className=' px-2 md:p-6 max-w-7xl mx-auto'>
			<h1 className='text-2xl font-bold mb-4 '>Add Product</h1>
			{/* client form component */}

			<AddProductForm />
		</main>
	);
}
