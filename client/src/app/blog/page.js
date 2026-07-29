import BlogClient from './BlogClient';

export const metadata = {
  title: 'Health Blog — Expert Tips & Medical Advice',
  description: 'Read the latest health tips, medical advice, skincare guides and nutrition articles from Lifemed Pharma\'s team of pharmaceutical experts.',
  openGraph: {
    title: 'Health Blog | Lifemed Pharma',
    description: 'Expert health tips, medical advice, skincare guides and nutrition articles.',
    url: 'https://lifemedpharmaceutical.com/blog',
  },
};

export default function BlogPage() {
  return <BlogClient />;
}
