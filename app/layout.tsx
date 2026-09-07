import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AnalizisMaster | High-End Core',
  description: 'Elite Developer Command Center by AnalizisEstudio',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='es'>
      <head>
        <meta name='theme-color' content='#0A0A0B' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='black-translucent' />
      </head>
      <body className={\\ bg-[#0A0A0B] text-white selection:bg-[#5E5CE6]/30\}>
        {children}
      </body>
    </html>
  );
}
