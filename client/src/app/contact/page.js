import ContactClient from './ContactClient';

export const metadata = {
  title: 'Contact Us — Lifemed Pharma Lahore',
  description: 'Contact Lifemed Pharma. Call +92 320 5342942, email info@lifemedpharma.com or visit us at 182-D Khayban-e-Ameen, Lahore, Pakistan.',
  openGraph: {
    title: 'Contact Lifemed Pharma',
    description: 'Get in touch with Lifemed Pharma Lahore. Phone, email, WhatsApp and store location.',
    url: 'https://lifemedpharmaceutical.com/contact',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
