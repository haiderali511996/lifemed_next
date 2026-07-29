import AboutClient from './AboutClient';

export const metadata = {
  title: 'About Us — Pakistan\'s Trusted Pharmacy Since 2018',
  description: 'Learn about Lifemed Pharma, Lahore\'s trusted pharmaceutical company. Our mission, team, values and commitment to better health across Pakistan.',
  openGraph: {
    title: 'About Lifemed Pharma — Pakistan\'s Trusted Pharmacy',
    description: 'Learn about Lifemed Pharma, our mission, team and commitment to better health across Pakistan.',
    url: 'https://lifemedpharmaceutical.com/about',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
