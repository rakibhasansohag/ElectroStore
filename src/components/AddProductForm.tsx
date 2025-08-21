'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

type FormValues = {
	name: string;
	brand: string;
	category: string;
	sku: string;
	stock: string;
	price: string;
	discountPrice?: string;
	color: string;
	size: string;
	material: string;
	tags: string;
	features: string;
	warranty: string;
	shippingInfo: string;
	description: string;
	image: File | null;
};

const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // 3 MB

export default function AddProductForm() {
	const {
		register,
		handleSubmit,
		control,
		reset,
		watch,
		setValue,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			name: '',
			brand: '',
			category: '',
			sku: '',
			stock: '0',
			price: '',
			discountPrice: '',
			color: '',
			size: '',
			material: '',
			tags: '',
			features: '',
			warranty: '',
			shippingInfo: '',
			description: '',
			image: null,
		},
	});

	const watchedFile = watch('image');
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (!watchedFile) {
			setPreviewUrl(null);
			return;
		}
		const url = URL.createObjectURL(watchedFile);
		setPreviewUrl(url);
		return () => URL.revokeObjectURL(url);
	}, [watchedFile]);

	function removeImage() {
		setValue('image', null);
		setPreviewUrl(null);
	}

	async function onSubmit(data: FormValues) {
		if (!data.image) {
			toast.error('Please choose an image for the product.');
			return;
		}
		const file = data.image;
		if (!file.type.startsWith('image/')) {
			toast.error('Selected file must be an image.');
			return;
		}
		if (file.size > MAX_IMAGE_BYTES) {
			toast.error('Image is too large. Max 3 MB.');
			return;
		}

		setUploading(true);

		try {
			const fd = new FormData();
			// append all fields (strings)
			fd.append('name', data.name);
			fd.append('brand', data.brand);
			fd.append('category', data.category);
			fd.append('sku', data.sku);
			fd.append('stock', data.stock);
			fd.append('price', data.price);
			if (data.discountPrice) fd.append('discountPrice', data.discountPrice);
			fd.append('color', data.color);
			fd.append('size', data.size);
			fd.append('material', data.material);
			fd.append('tags', data.tags);
			fd.append('features', data.features);
			fd.append('warranty', data.warranty);
			fd.append('shippingInfo', data.shippingInfo);
			fd.append('description', data.description);
			fd.append('image', file);

			const res = await fetch('/api/products', {
				method: 'POST',
				body: fd,
			});

			if (!res.ok) {
				const json = await res.json().catch(() => ({}));
				throw new Error(json?.error || 'Failed to add product');
			}

			const created = await res.json();
			toast.success('Product added');
			reset();
			setPreviewUrl(null);
			router.refresh();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			console.error('upload error', err);
			toast.error(err?.message || 'Error adding product');
		} finally {
			setUploading(false);
		}
	}

	return (
		<Card className='max-w-7xl mx-auto'>
			<form onSubmit={handleSubmit(onSubmit)} className='p-6'>
				{/* Grid: 1 column on small, 2 columns on md+ */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					{/* Row 1: Name (col 1) | Price (col 2) */}
					<div>
						<Label>Name</Label>
						<Input
							{...register('name', { required: 'Name is required' })}
							placeholder='Wireless Headphones'
						/>
						{errors.name && (
							<p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>
						)}
					</div>

					<div>
						<Label>Price (USD)</Label>
						<Input
							{...register('price', {
								required: 'Price required',
								validate: (v) => {
									const n = Number(v);
									if (isNaN(n) || n < 0)
										return 'Enter a valid non-negative number';
									return true;
								},
							})}
							type='number'
							step='0.01'
							placeholder='49.99'
						/>
						{errors.price && (
							<p className='text-red-500 text-sm mt-1'>
								{errors.price.message}
							</p>
						)}
					</div>

					{/* Row 2: Brand | Category */}
					<div>
						<Label>Brand</Label>
						<Input
							{...register('brand', { required: 'Brand is required' })}
							placeholder='Sony'
						/>
						{errors.brand && (
							<p className='text-red-500 text-sm mt-1'>
								{errors.brand.message}
							</p>
						)}
					</div>

					<div>
						<Label>Category</Label>
						<Input
							{...register('category', { required: 'Category is required' })}
							placeholder='Electronics'
						/>
						{errors.category && (
							<p className='text-red-500 text-sm mt-1'>
								{errors.category.message}
							</p>
						)}
					</div>

					{/* Row 3: SKU | Stock */}
					<div>
						<Label>SKU</Label>
						<Input {...register('sku')} placeholder='ABC123' />
					</div>

					<div>
						<Label>Stock</Label>
						<Input
							type='number'
							{...register('stock', { required: 'Stock is required' })}
							placeholder='100'
						/>
						{errors.stock && (
							<p className='text-red-500 text-sm mt-1'>
								{errors.stock.message}
							</p>
						)}
					</div>

					{/* Row 4: Discount | Color */}
					<div>
						<Label>Discount Price</Label>
						<Input
							type='number'
							step='0.01'
							{...register('discountPrice')}
							placeholder='39.99'
						/>
					</div>

					<div>
						<Label>Color</Label>
						<Input {...register('color')} placeholder='Black' />
					</div>

					{/* Row 5: Size | Material */}
					<div>
						<Label>Size</Label>
						<Input {...register('size')} placeholder='Medium' />
					</div>

					<div>
						<Label>Material</Label>
						<Input {...register('material')} placeholder='Plastic, Steel' />
					</div>

					{/* Row 6: Tags | Warranty */}
					<div>
						<Label>Tags (comma separated)</Label>
						<Input
							{...register('tags')}
							placeholder='headphones, wireless, bluetooth'
						/>
					</div>

					<div>
						<Label>Warranty</Label>
						<Input {...register('warranty')} placeholder='1 year warranty' />
					</div>

					{/* Row 7: Shipping | Features (features we put full width maybe) */}
					<div>
						<Label>Shipping Info</Label>
						<Input
							{...register('shippingInfo')}
							placeholder='Free shipping worldwide'
						/>
					</div>

					<div>
						<Label>Features (short bullets)</Label>
						<textarea
							{...register('features')}
							rows={3}
							className='w-full border rounded-md px-3 py-2'
							placeholder='Noise cancellation, 30h battery, fast charge...'
						/>
					</div>

					{/* Description: full width */}
					<div className='md:col-span-2'>
						<Label>Description</Label>
						<textarea
							{...register('description', {
								required: 'Description is required',
								minLength: { value: 20, message: 'Minimum 20 characters' },
							})}
							className='w-full rounded-md border px-3 py-2'
							rows={5}
							placeholder='Longer product description, specs, use-cases...'
						/>
						{errors.description && (
							<p className='text-red-500 text-sm mt-1'>
								{errors.description.message}
							</p>
						)}
					</div>

					{/* Image: full width */}
					<div className='md:col-span-2'>
						<Label htmlFor='image'>Image</Label>

						<Controller
							control={control}
							name='image'
							render={({ field: { onChange, value } }) => (
								<div className='space-y-3'>
									<input
										id='image'
										type='file'
										accept='image/*'
										className='sr-only'
										onChange={(e) => {
											const f = e.target.files?.[0] ?? null;
											onChange(f);
										}}
									/>
									<label
										htmlFor='image'
										className='inline-flex items-center gap-2 cursor-pointer text-sm bg-white border border-muted-foreground rounded-md px-3 py-2 text-black hover:bg-accent hover:text-accent-foreground'
									>
										Choose image
										{value && (
											<span className='text-sm text-muted-foreground ml-2'>
												{(value as File).name}
											</span>
										)}
									</label>

									{previewUrl ? (
										<div className='mt-3 flex items-start gap-4'>
											<div className='w-48 h-32 rounded overflow-hidden border'>
												<Image
													src={previewUrl}
													alt='preview'
													className='w-full h-full object-cover'
													width={96}
													height={96}
												/>
											</div>
											<div className='flex-1'>
												<div className='text-sm font-medium'>
													{(value as File).name}
												</div>
												<div className='text-sm text-muted-foreground'>
													{Math.round(((value as File).size / 1024) * 10) / 10}{' '}
													KB
												</div>
												<div className='mt-2 flex gap-2'>
													<Button onClick={() => removeImage()} type='button'>
														Remove
													</Button>
												</div>
											</div>
										</div>
									) : (
										<div className='mt-2 text-sm text-muted-foreground'>
											No image selected
										</div>
									)}
								</div>
							)}
						/>
					</div>
				</div>

				{/* Submit row */}
				<div className='mt-6 flex justify-end'>
					<Button type='submit' disabled={uploading}>
						{uploading ? 'Uploading...' : 'Add Product'}
					</Button>
				</div>
			</form>
		</Card>
	);
}
