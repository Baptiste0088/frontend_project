import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpeg';
import SiteHeader from './SiteHeader';

const currentYear = new Date().getFullYear();

const homeLinks = [
  { label: 'Services', to: '/services' },
  { label: 'Projects', href: '#about' },
  { label: 'About', to: '/about' },
  { label: 'Team', to: '/about#team' },
  { label: 'Contact', href: '#contact' }
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <SiteHeader links={homeLinks} />

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#003366] via-[#0055aa] to-[#0088ff] text-white py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Learn to Code. <br />
              <span className="text-[#FFD700]">Build a Shining Future.</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl">
              Empowering the next generation of developers in Rwanda and beyond. Join the Global Coding Academy and master the skills needed for the digital age.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/login" className="bg-[#FFD700] text-[#003366] font-bold px-8 py-4 rounded-full text-lg hover:bg-[#ffcc00] transition-all transform hover:scale-105 shadow-lg">
                Start Learning Now
              </Link>
              <Link to="/services" className="bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-white hover:text-[#003366] transition-all">
                Explore Services
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FFD700] to-[#0088ff] rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <img
                src={logo}
                alt="Global Coding Academy"
                className="relative rounded-full w-64 h-64 md:w-80 md:h-80 object-cover shadow-2xl border-4 border-white"
              />
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-yellow-400 rounded-full blur-3xl opacity-10"></div>
      </header>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <img
              src={logo}
              alt="Academy Mission"
              className="rounded-2xl shadow-xl w-full max-w-md mx-auto"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-6">Our Mission</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              At Global Coding Academy LTD, we believe that coding is the new literacy. Our mission is to democratize access to high-quality technical education, specifically focusing on empowering the youth in Rwanda.
            </p>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              We don't just teach syntax; we teach problem-solving, critical thinking, and the architectural mindset required to build the software of tomorrow.
            </p>
            <Link to="/about" className="text-[#003366] font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Read our full story <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#003366] text-white py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="Logo" className="h-12 w-auto rounded-full" />
              <span className="text-xl font-bold">Global Coding Academy Ltd</span>
            </div>
            <p className="text-blue-200 max-w-sm">
              Building the future of technology through education, innovation, and community.
              Proudly based in Rwanda.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-blue-200">
              <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6">Connect</h4>
            <ul className="space-y-4 text-blue-200">
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter / X</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Email Us</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-blue-900 text-center text-blue-300 text-sm">
          © {currentYear} Global Coding Academy LTD. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
