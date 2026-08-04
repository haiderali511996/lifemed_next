'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiShoppingCart, FiMenu, FiX, FiUser, FiSearch } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/shop?search=${encodeURIComponent(search.trim())}`);
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="logo" onClick={() => setMenuOpen(false)}>
          <Image src="/logo.jpeg" alt="Lifemed Pharma" width={240} height={120} className="logo-img" priority />
        </Link>

        <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link" onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}

          <form className="header-search" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" aria-label="Search">
              <FiSearch />
            </button>
          </form>

          <div className="nav-auth">
            {user ? (
              <>
                <span className="nav-user">Hi, {user.name?.split(' ')[0]}</span>
                {user.role === 'admin' && (
                  <Link href="/admin" className="nav-link" onClick={() => setMenuOpen(false)}>
                    Admin
                  </Link>
                )}
                <button
                  className="btn-link"
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
                  <FiUser style={{ marginRight: 4 }} />
                  Login
                </Link>
                <Link href="/register" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>

        <div className="header-actions">
          <Link href="/cart" className="cart-icon" aria-label="Cart">
            <FiShoppingCart size={22} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          <button className="menu-toggle" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu">
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
