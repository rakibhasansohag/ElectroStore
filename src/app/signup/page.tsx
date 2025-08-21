'use client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

type FormValues = {
	name: string;
	email: string;
	password: string;
	passwordConfirm: string;
};

export default function SignUpPage() {
	const { register, handleSubmit, watch, reset } = useForm<FormValues>({
		mode: 'onTouched',
	});
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const pwd = watch('password', '');

	const onSubmit = async (vals: FormValues) => {
		if (vals.password !== vals.passwordConfirm) {
			toast.error('Passwords do not match');
			return;
		}
		setLoading(true);
		try {
			const res = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: vals.name,
					email: vals.email,
					password: vals.password,
				}),
			});

			if (!res.ok) {
				const json = await res.json().catch(() => ({}));
				toast.error(json?.error || 'Signup failed');
				setLoading(false);
				return;
			}

			// sign in after register (make callback absolute)
			const callback = `${window.location.origin}/products`;
			const signInRes = await signIn('credentials', {
				redirect: false,
				email: vals.email,
				password: vals.password,
				callbackUrl: callback,
			});

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const errorCode = (signInRes as any)?.error as string | undefined;
			if (errorCode) {
				// map or show generic
				toast.error(
					errorCode === 'CredentialsSignin'
						? 'Invalid credentials'
						: 'Sign-in failed after signup',
				);
				setLoading(false);
				return;
			}

			// success
			reset();
			router.push(callback);
		} catch (err) {
			console.error('signup error', err);
			toast.error('Server error');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='max-w-md mx-auto py-12'>
			<h1 className='text-2xl font-bold mb-4'>Create account</h1>
			<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
				<div>
					<Label>Name</Label>
					<Input {...register('name', { required: 'Name required' })} />
				</div>
				<div>
					<Label>Email</Label>
					<Input {...register('email', { required: 'Email required' })} />
				</div>
				<div>
					<Label>Password</Label>
					<Input
						{...register('password', {
							required: 'Password required',
							minLength: 6,
						})}
						type='password'
					/>
				</div>
				<div>
					<Label>Confirm Password</Label>
					<Input
						{...register('passwordConfirm', {
							required: 'Confirm',
							validate: (v) => v === pwd || 'Passwords do not match',
						})}
						type='password'
					/>
				</div>

				<p className='text-sm text-muted-foreground'>
					By creating an account, you agree to our{' '}
					<span className='underline'>Terms of Service</span> and{' '}
					<span className='underline'>Privacy Policy</span>.
				</p>

				<p className='text-sm text-muted-foreground'>
					Already have an account?{' '}
					<Link href='/login' className='hover:underline text-blue-500 '>
						Sign in
					</Link>
				</p>

				<Button type='submit' disabled={loading}>
					{loading ? 'Signing up...' : 'Create account'}
				</Button>
			</form>
		</div>
	);
}
