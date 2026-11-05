import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpeg';

const defaultLinks = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Team', to: '/about#team' },
  { label: 'Contact', href: '#contact' }
];

const SiteHeader = ({ activePage, links = defaultLinks }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={closeMenu}>
          <img src={logo} alt="Global Coding Academy Logo" className="h-12 w-auto flex-none" />
          <span className="text-xl font-bold text-[#003366] hidden sm:inline whitespace-nowrap">
            Global Coding Academy Ltd
          </span>
          <span className="text-lg font-bold text-[#003366] sm:hidden whitespace-nowrap">
            GCA Ltd
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
          {links.map((link) => (
            link.href ? (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-[#003366] transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                className={
                  activePage === link.label.toLowerCase()
                    ? 'text-[#003366] font-bold'
                    : 'hover:text-[#003366] transition-colors'
                }
              >
                {link.label}
              </Link>
            )
          ))}
          <Link to="/login" className="bg-[#003366] text-white px-5 py-2 rounded-lg hover:bg-[#002244] transition-colors">
            Join Now
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg text-2xl text-[#003366] hover:bg-slate-100"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? '×' : '☰'}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pb-4 shadow-sm">
          <div className="flex flex-col gap-1 pt-3 font-medium text-slate-700">
            {links.map((link) => (
              link.href ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded-lg px-3 py-3 hover:bg-slate-100 hover:text-[#003366]"
                  onClick={closeMenu}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  className="rounded-lg px-3 py-3 hover:bg-slate-100 hover:text-[#003366]"
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              )
            ))}
            <Link
              to="/login"
              className="mt-2 rounded-lg bg-[#003366] px-3 py-3 text-center font-bold text-white hover:bg-[#002244]"
              onClick={closeMenu}
            >
              Join Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default SiteHeader;
