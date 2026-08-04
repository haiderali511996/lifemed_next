import Link from 'next/link';
import Image from 'next/image';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-col">
          <div className="logo footer-logo">
            <Image src="/logo.jpeg" alt="Lifemed Pharma" width={240} height={120} className="logo-img footer-logo-img" />
          </div>
          <p>Pakistan&apos;s trusted online pharmacy — quality medicines, supplements and skincare delivered to your door.</p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link href="/shop">Shop</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Categories</h4>
          <ul className="footer-links">
            <li><Link href="/shop?category=medicines">Medicines</Link></li>
            <li><Link href="/shop?category=supplements">Supplements</Link></li>
            <li><Link href="/shop?category=skincare">Skin Care</Link></li>
            <li><Link href="/shop?category=serums">Serums</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact Us</h4>
          <ul className="footer-contact">
            <li><FiMapPin /> 182-D Khayban-e-Ameen, Lahore, Pakistan</li>
            <li><FiPhone /> <a href="tel:+923205342942">+92 320 5342942</a></li>
            <li><FiMail /> <a href="mailto:info@lifemedpharma.com">info@lifemedpharma.com</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {year} Lifemed Pharma. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
