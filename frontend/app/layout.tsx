import type { Metadata } from 'next';
import './globals.css';
import { WalletProvider } from '@/context/WalletContext';

export const metadata: Metadata = {
  title: 'Daily Check-in | Stacks Blockchain',
  description:
    'Check in every day, build your streak, earn NFT badges and STX rewards on the Stacks blockchain.',
  openGraph: {
    title: 'Daily Check-in | Stacks Blockchain',
    description: 'Build your streak, earn NFT badges and STX rewards.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Check-in | Stacks Blockchain',
    description: 'Build your streak, earn NFT badges and STX rewards.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="bg-glow" aria-hidden="true" />
        <WalletProvider>
          <div className="relative z-10">{children}</div>
        </WalletProvider>
      </body>
    </html>
  );
}
