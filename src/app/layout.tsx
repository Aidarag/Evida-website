import type { Metadata } from 'next';
import { Syne, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { UserProvider } from '@/lib/context/UserContext';
import { EventProvider } from '@/lib/context/EventContext';

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-plus-jakarta-sans',
});

export const metadata: Metadata = {
  title: 'Evida — The Digital Home of Campus Life',
  description:
    'Discover, create, attend, and remember campus experiences in one place. Evida helps students discover campus events and helps schools manage engagement.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${plusJakartaSans.variable} antialiased bg-white text-gray-900 min-h-screen selection:bg-[var(--color-evida-lime)] selection:text-black`}>
        <UserProvider>
          <EventProvider>
            {children}
          </EventProvider>
        </UserProvider>
      </body>
    </html>
  );
}
