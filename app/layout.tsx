import type { Metadata } from 'next';
import { Roboto_Serif } from 'next/font/google';
import './globals.css';
import Container from '@/components/global/Container';
import Navbar from '@/components/Navbar/Navbar';

const robotoSerif = Roboto_Serif({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mineboard Demo Web',
  description: 'A customizable board tailored to your preferences.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${robotoSerif.className} antialiased`}>
        <main className='bg-background min-h-screen'>
          <Navbar />
          <Container>{children}</Container>
        </main>
      </body>
    </html>
  );
}
