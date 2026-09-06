import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bantay-Gamot PH',
  description: 'Libreng gamot sa pampublikong ospital at health centers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tl">
      <body className="bg-slate-50 antialiased min-h-screen text-slate-900">
        {children}
      </body>
    </html>
  );
}
