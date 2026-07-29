import HomeClient from './HomeClient';

export const metadata = {
  title: 'Lifemed Pharma — Pakistan\'s Trusted Online Pharmacy',
  description: 'Buy quality medicines, supplements, skincare serums and health products online in Pakistan. Fast delivery in Lahore. Free shipping above PKR 5,000.',
  openGraph: {
    title: 'Lifemed Pharma — Pakistan\'s Trusted Online Pharmacy',
    description: 'Buy quality medicines, supplements, skincare serums and health products online in Pakistan.',
    url: 'https://lifemedpharmaceutical.com',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
