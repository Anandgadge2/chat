import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PugArch FSM Support Assistant',
  description:
    'AI-powered support chatbot for PugArch FSM mobile app. Get instant solutions to common app issues.',
  robots: 'noindex, nofollow',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#eef2f1] min-h-screen">
        {children}
      </body>
    </html>
  );
}
