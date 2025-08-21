export default function Loading() {
	return (
		<div className='container mx-auto p-6'>
			<div className='animate-pulse'>
				<div className='h-8 w-1/3 bg-gray-300 dark:bg-slate-700 mb-6 rounded' />
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					<div className='md:col-span-2'>
						<div className='h-[420px] bg-gray-200 dark:bg-slate-800 rounded' />
						<div className='mt-3 grid grid-cols-2 gap-4'>
							<div className='h-24 bg-gray-200 dark:bg-slate-800 rounded' />
							<div className='h-24 bg-gray-200 dark:bg-slate-800 rounded' />
						</div>
					</div>
					<aside>
						<div className='h-40 bg-gray-200 dark:bg-slate-800 rounded mb-4' />
						<div className='h-24 bg-gray-200 dark:bg-slate-800 rounded mb-4' />
						<div className='h-20 bg-gray-200 dark:bg-slate-800 rounded' />
					</aside>
				</div>
				<div className='mt-6 h-40 bg-gray-200 dark:bg-slate-800 rounded' />
			</div>
		</div>
	);
}
