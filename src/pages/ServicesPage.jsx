import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpeg';
import SiteHeader from '../components/SiteHeader';

const currentYear = new Date().getFullYear();

const serviceAreas = [
  {
    title: 'Programming Education',
    description:
      'Practical, market-oriented coding education for students, professionals, schools, businesses, and organizations.',
    items: ['Programming fundamentals', 'Web development', 'Mobile application development', 'Databases']
  },
  {
    title: 'Advanced Digital Skills',
    description:
      'Training programs that prepare learners for current and emerging technology opportunities.',
    items: ['Artificial intelligence', 'Data science', 'Cybersecurity', 'Networking and cloud technologies']
  },
  {
    title: 'Software Development',
    description:
      'Custom digital products and information systems built for individuals, businesses, schools, and organizations.',
    items: ['Websites', 'Web applications', 'Mobile applications', 'Educational technology platforms']
  },
  {
    title: 'ICT Products and Support',
    description:
      'Technology supply, implementation support, and consulting for reliable digital operations.',
    items: ['Computers and digital devices', 'Networking equipment', 'Technical support', 'Technology consulting']
  }
];

const audiences = ['Students', 'Professionals', 'Businesses', 'Schools', 'Organizations'];

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <SiteHeader activePage="services" />

      <header className="bg-[#003366] text-white px-6 py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
          <div className="text-center lg:text-left">
            <p className="text-[#FFD700] font-bold uppercase tracking-[0.18em] text-sm mb-4">
              Technology and Digital Skills
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Services for learning, building, and growing with technology
            </h1>
            <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-3xl">
              Global Coding Academy Ltd provides programming education, software development,
              ICT training, technology consulting, and digital solutions for Rwanda and the
              international market.
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-lg p-8 text-left">
            <h2 className="text-2xl font-bold mb-4">Learn to code. Build a Shining Future.</h2>
            <p className="text-blue-100 leading-relaxed">
              We promote innovation, entrepreneurship, digital transformation, and
              employment-oriented technology skills through physical and online learning
              programs, software products, partnerships, and technology services.
            </p>
          </div>
        </div>
      </header>

      <main>
        <section className="px-6 py-16 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">What We Offer</h2>
              <p className="text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Our services combine hands-on training with practical technology delivery, helping
                people and organizations gain the skills and systems needed for the digital economy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {serviceAreas.map((service) => (
                <article
                  key={service.title}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-7 text-left shadow-sm"
                >
                  <h3 className="text-2xl font-bold text-[#003366] mb-3">{service.title}</h3>
                  <p className="text-slate-600 leading-relaxed mb-5">{service.description}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-slate-700">
                        <span className="mt-2 h-2 w-2 flex-none rounded-full bg-[#FFD700]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 items-start">
            <div className="text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-5">Who We Serve</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Global Coding Academy Ltd equips learners, teams, and institutions with practical
                technology skills and digital tools that support real-world progress.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {audiences.map((audience) => (
                <div
                  key={audience}
                  className="bg-white border border-slate-200 rounded-lg px-4 py-5 text-center font-bold text-[#003366] shadow-sm"
                >
                  {audience}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16 bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <article className="bg-[#003366] text-white rounded-lg p-8 text-left">
              <p className="text-[#FFD700] font-bold mb-3">Vision</p>
              <h2 className="text-2xl font-bold leading-snug">
                To become a globally recognized technology and coding education company.
              </h2>
              <p className="text-blue-100 mt-5 leading-relaxed">
                We aim to empower people and organizations through programming, innovation, and
                digital technology.
              </p>
            </article>

            <article className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-left">
              <p className="text-[#0055aa] font-bold mb-3">Mission</p>
              <h2 className="text-2xl font-bold text-[#003366] leading-snug">
                Accessible, practical, and high-quality coding education and digital services.
              </h2>
              <p className="text-slate-600 mt-5 leading-relaxed">
                We provide coding education, software solutions, and digital technology services
                that equip individuals and organizations for the digital economy.
              </p>
            </article>
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

export default ServicesPage;
