'use client';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { toast } from 'sonner';

type FormValues = {
	name: string;
	description: string;
	price: string;
	image: File | null;
};

export default function AddProductForm() {
	const { register, handleSubmit, control, reset } = useForm<FormValues>({
		defaultValues: { name: '', description: '', price: '', image: null },
	});
	const [loading, setLoading] = useState(false);

	const onSubmit = async (data: FormValues) => {
		setLoading(true);
		try {
			const fd = new FormData();
			fd.append('name', data.name);
			fd.append('description', data.description);
			fd.append('price', data.price);
			if (data.image) fd.append('image', data.image);

			const res = await fetch('/api/products', { method: 'POST', body: fd });
			if (!res.ok) throw new Error('Failed to add product');
			toast('Product added');
			reset();
		} catch (e) {
			console.error(e);
			toast('Error adding product');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='space-y-4 max-w-md'>
			<input
				{...register('name', { required: true })}
				placeholder='Name'
				className='input'
			/>
			<textarea
				{...register('description', { required: true })}
				placeholder='Description'
				className='textarea'
			/>
			<input
				{...register('price', { required: true })}
				placeholder='Price'
				type='number'
				className='input'
			/>
			<Controller
				control={control}
				name='image'
				render={({ field: { onChange } }) => (
					<input
						type='file'
						accept='image/*'
						onChange={(e) => {
							const file = e.target.files?.[0] ?? null;
							onChange(file);
						}}
						className='input'
					/>
				)}
			/>
			<button className='btn' type='submit' disabled={loading}>
				{loading ? 'Adding...' : 'Add Product'}
			</button>
		</form>
	);
}
