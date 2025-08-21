'use client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

type FormValues = { email: string; password: string };

const ERROR_MAP: Record<string, string> = {
	CredentialsSignin: 'Invalid email or password.',
	OAuthSignin: 'OAuth sign in failed.',
	Default: 'Sign in failed. Try again.',
};

export default function LoginPage() {
	const { register, handleSubmit, reset } = useForm<FormValues>();
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const search = useSearchParams();
	const rawCallback = (search?.get('callbackUrl') as string) ?? '/products';

	const makeAbsolute = (url: string) => {
		try {
			new URL(url);
			return url;
		} catch {
			return `${window.location.origin}${
				url.startsWith('/') ? url : `/${url}`
			}`;
		}
	};
	const callbackUrl = makeAbsolute(rawCallback);

	// inside client login page (onSubmit)
	const onSubmit = async (vals: FormValues) => {
		setLoading(true);
		try {
			const res = await signIn('credentials', {
				redirect: false,
				email: vals.email,
				password: vals.password,
			});

			// handle errors returned by signIn
			const errorCode = res?.error as string | undefined;
			if (errorCode) {
				toast.error(ERROR_MAP[errorCode] ?? ERROR_MAP.Default);
				return;
			}

			// Poll server session for a short time until cookie is active
			const waitForSession = async (retries = 10, delay = 200) => {
				for (let i = 0; i < retries; i++) {
					try {
						const r = await fetch('/api/auth/session');
						if (r.ok) {
							const json = await r.json();
							if (json?.user) return json;
						}
					} catch {}
					await new Promise((res) => setTimeout(res, delay));
				}
				return null;
			};

			const session = await waitForSession(12, 200);
			const redirectTo = makeAbsolute(rawCallback);

			if (session && session.user) {
				reset();
				toast.success('Signed in');

				router.replace(redirectTo);
				// small delay then refresh to ensure server components re-run
				setTimeout(() => router.refresh(), 80);
				return;
			}

			// If session never appeared, fallback to full reload (guarantees server render with cookie)
			window.location.href = redirectTo;
		} catch (err) {
			console.error('signIn threw', err);
			// as a last-ditch attempt check session once
			const r2 = await fetch('/api/auth/session').catch(() => null);
			const json2 = r2 && r2.ok ? await r2.json() : null;
			if (json2?.user) {
				reset();
				toast.success('Signed in');
				router.replace(makeAbsolute(rawCallback));
				setTimeout(() => router.refresh(), 80);
				return;
			}
			toast.error('Sign in failed (client error). Try again.');
		} finally {
			setLoading(false);
		}
	};

	const onGoogle = () => {
		// OAuth can use absolute callback
		signIn('google', { callbackUrl });
	};

	return (
		<div className='max-w-md mx-auto py-12'>
			<h1 className='text-2xl font-bold mb-4'>Sign in</h1>
			<div className='space-y-4'>
				<Button onClick={onGoogle}>Sign in with Google</Button>
				<div className='text-center'>OR</div>

				<form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
					<div>
						<Label>Email</Label>
						<Input {...register('email', { required: true })} />
					</div>

					<div>
						<Label>Password</Label>
						<Input
							{...register('password', { required: true })}
							type='password'
						/>
					</div>

					<p>
						Don&apos;t have an account?{' '}
						<Link href='/signup' className='hover:underline text-blue-500'>
							Sign up
						</Link>
					</p>

					<Button type='submit' disabled={loading}>
						{loading ? 'Signing in...' : 'Sign in'}
					</Button>
				</form>
			</div>
		</div>
	);
}
