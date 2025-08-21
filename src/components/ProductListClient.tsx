/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import { useEffect, useState, useRef } from 'react';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';

type Product = any;

export default function ProductListClient() {
	const [search, setSearch] = useState('');
	const [sort, setSort] = useState<
		'newest' | 'oldest' | 'price_asc' | 'price_desc'
	>('newest');
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [limit] = useState(12);
	const timer = useRef<number | null>(null);

	const fetchProducts = async (p = page, s = search, so = sort) => {
		setLoading(true);
		try {
			const q = new URLSearchParams();
			if (s) q.set('search', s);
			if (so) q.set('sort', so);
			q.set('page', String(p));
			q.set('limit', String(limit));
			const res = await fetch(`/api/products?${q.toString()}`);
			const json = await res.json();
			setProducts(json.products || []);
			setTotal(json.total || 0);
			setPage(json.page || 1);
		} catch (err) {
			console.error('fetch products', err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		// initial load
		fetchProducts(1, '', 'newest');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// debounce search & reset to first page
	useEffect(() => {
		if (timer.current) window.clearTimeout(timer.current);
		timer.current = window.setTimeout(() => {
			fetchProducts(1, search, sort);
		}, 400);
		return () => {
			if (timer.current) window.clearTimeout(timer.current);
		};
	}, [search, sort]);

	const onNext = () => {
		const next = page + 1;
		fetchProducts(next, search, sort);
	};
	const onPrev = () => {
		if (page <= 1) return;
		const prev = page - 1;
		fetchProducts(prev, search, sort);
	};

	return (
		<div>
			{/* Controls row */}
			<div className='mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
				<div className='flex-1'>
					<Label className='sr-only'>Search products</Label>
					<Input
						placeholder='Search by name, brand, category, tag...'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				<div className='flex items-center gap-3'>
					<Label className='sr-only'>Sort</Label>
					<Select
						value={sort}
						onValueChange={(v: any) => {
							setSort(v as any);
							setPage(1);
						}}
					>
						<SelectTrigger className='w-48'>
							<SelectValue placeholder='Sort' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='newest'>Newest</SelectItem>
							<SelectItem value='oldest'>Oldest</SelectItem>
							<SelectItem value='price_asc'>Price: Low → High</SelectItem>
							<SelectItem value='price_desc'>Price: High → Low</SelectItem>
						</SelectContent>
					</Select>

					<Button onClick={() => fetchProducts(1, search, sort)}>Apply</Button>
				</div>
			</div>

			{/* Grid */}
			{loading ? (
				<div className='text-center py-12'>Loading products…</div>
			) : products.length === 0 ? (
				<div className='text-center py-12'>No products found.</div>
			) : (
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
					{products.map((p) => (
						<ProductCard key={String(p._id)} product={p} />
					))}
				</div>
			)}

			{/* Pagination */}
			<div className='mt-6 flex items-center justify-between'>
				<div className='text-sm text-muted-foreground'>
					Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of{' '}
					{total}
				</div>
				<div className='flex items-center gap-2'>
					<Button variant='outline' disabled={page <= 1} onClick={onPrev}>
						Previous
					</Button>
					<div className='px-2'>{page}</div>
					<Button
						variant='outline'
						disabled={page * limit >= total}
						onClick={onNext}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
