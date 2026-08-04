import { Inter, Playfair_Display } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata = {
  metadataBase: new URL('https://lifemedpharmaceutical.com'),
  title: {
    default: 'Lifemed Pharma — Better Health. Better Life.',
    template: '%s | Lifemed Pharma',
  },
  description: 'Pakistan\'s trusted online pharmacy. Quality medicines, supplements, skincare serums and health products delivered to your door. Based in Lahore, Pakistan.',
  keywords: ['pharmacy pakistan', 'online pharmacy lahore', 'medicines online pakistan', 'health products pakistan', 'supplements pakistan', 'skincare pakistan'],
  authors: [{ name: 'Lifemed Pharma' }],
  creator: 'Lifemed Pharma',
  publisher: 'Lifemed Pharma',
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://lifemedpharmaceutical.com',
    siteName: 'Lifemed Pharma',
    title: 'Lifemed Pharma — Better Health. Better Life.',
    description: 'Pakistan\'s trusted online pharmacy. Quality medicines and health products delivered to your door.',
    images: [{ url: '/logo.jpeg', width: 1200, height: 630, alt: 'Lifemed Pharma' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lifemed Pharma — Better Health. Better Life.',
    description: 'Pakistan\'s trusted online pharmacy. Quality medicines and health products delivered to your door.',
    images: ['/logo.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-PK" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <ToastContainer position="bottom-right" autoClose={2500} hideProgressBar={false} closeOnClick pauseOnHover theme="colored" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
