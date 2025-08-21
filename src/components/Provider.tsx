'use client';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

export default function Providers({
	children,
	session,
}: {
	children: React.ReactNode;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	session?: any;
}) {
	return (
		<SessionProvider session={session}>
			<ThemeProvider attribute='class'>
				{children}
				<Toaster position='top-right' />
			</ThemeProvider>
		</SessionProvider>
	);
}
