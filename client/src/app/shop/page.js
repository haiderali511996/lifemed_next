import ShopClient from './ShopClient';

export const metadata = {
  title: 'Shop — Medicines, Supplements & Skincare',
  description: 'Browse our full range of pharmaceutical products including medicines, syrups, creams, serums, supplements and skincare. Authentic products delivered across Pakistan.',
  openGraph: {
    title: 'Shop — Medicines, Supplements & Skincare | Lifemed Pharma',
    description: 'Browse our full range of pharmaceutical products. Authentic products delivered across Pakistan.',
    url: 'https://lifemedpharmaceutical.com/shop',
  },
};

export default function ShopPage() {
  return <ShopClient />;
}
