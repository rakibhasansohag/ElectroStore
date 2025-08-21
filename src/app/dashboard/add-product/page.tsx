import AddProductForm from '@/components/AddProductForm'; // client
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function Page() {
	const session = await getServerSession(authOptions);
	if (!session) {
		// server redirect -> user will never see the protected UI
		redirect('/login');
	}

	return (
		<main className=' px-2 md:p-6 max-w-7xl mx-auto'>
			<h1 className='text-2xl font-bold mb-4 '>Add Product</h1>
			{/* client form component */}

			<AddProductForm />
		</main>
	);
}
