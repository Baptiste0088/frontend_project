import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpeg';
import founderImage from '../assets/founder.png';
import ctoImage from '../assets/cto.jpg';

const currentYear = new Date().getFullYear();

const teamMembers = [
  {
    name: 'Founder',
    role: 'Founder',
    image: founderImage,
    description: 'Leading the academy vision and building pathways for learners to access world-class technology education.'
  },
  {
    name: 'CTO',
    role: 'Chief Technology Officer',
    image: ctoImage,
    description: 'Guiding the technical direction of the academy and helping students build with modern engineering practices.'
  }
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Global Coding Academy Logo" className="h-12 w-auto" />
          <span className="text-xl font-bold text-[#003366]">Global Coding Academy Ltd</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
          <Link to="/" className="hover:text-[#003366] transition-colors">Home</Link>
          <Link to="/services" className="hover:text-[#003366] transition-colors">Services</Link>
          <Link to="/about" className="hover:text-[#003366] transition-colors">About</Link>
          <a href="#team" className="hover:text-[#003366] transition-colors">Team</a>
          <a href="#contact" className="hover:text-[#003366] transition-colors">Contact</a>
          <Link to="/login" className="bg-[#003366] text-white px-5 py-2 rounded-lg hover:bg-[#002244] transition-colors">
            Join Now
          </Link>
        </div>

        <div className="md:hidden text-2xl">☰</div>
      </nav>

      <header className="bg-[#003366] text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">About Global Coding Academy</h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            We are building a stronger technology future by helping learners gain practical coding,
            problem-solving, and product-building skills.
          </p>
        </div>
      </header>

      <main>
        <section className="py-20 px-6 bg-white">
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
              <p className="text-lg text-slate-600 leading-relaxed">
                We don't just teach syntax; we teach problem-solving, critical thinking, and the architectural mindset required to build the software of tomorrow.
              </p>
            </div>
          </div>
        </section>

        <section id="team" className="py-20 px-6 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">Meet Our Team</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                The people shaping Global Coding Academy's learning experience and technical vision.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {teamMembers.map((member) => (
                <article
                  key={member.role}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[3/4] bg-slate-100">
                    <img
                      src={member.image}
                      alt={`${member.role} of Global Coding Academy`}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <div className="p-8 text-center">
                    <h3 className="text-2xl font-bold text-[#003366] mb-2">{member.name}</h3>
                    <p className="font-semibold text-[#0055aa] mb-4">{member.role}</p>
                    <p className="text-slate-600 leading-relaxed">{member.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

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
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
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

export default AboutPage;
