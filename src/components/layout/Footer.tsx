import React from 'react';
import { Mail, Phone, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const QUICK_LINKS = [
  { name: 'Track Consignment', url: 'https://www.indiapost.gov.in/' },
  { name: 'Calculate Postage', url: 'https://www.indiapost.gov.in/calculate-postage' },
  { name: 'Internet Banking', url: 'https://ebanking.indiapost.gov.in/corp/AuthenticationController?FORMSGROUP_ID__=AuthenticationFG&__START_TRAN_FLAG__=Y&__FG_BUTTONS__=LOAD&ACTION.LOAD=Y&AuthenticationFG.LOGIN_FLAG=1&BANK_ID=DOP' },
  { name: 'IPPB', url: 'https://ippbonline.bank.in/en/web/ippb' },
  { name: 'Office Directory', url: 'https://office-directory.vercel.app/' },
  { name: 'Find Your Digipin', url: 'https://dac.indiapost.gov.in/mydigipin/home' },
];

export default function Footer() {
  return (
    <footer className="bg-ip-maroon text-white pt-12 pb-24 md:pb-8 border-t-4 border-ip-amber">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Branding & Contact */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/3/32/India_Post.svg" 
              alt="India Post" 
              className="h-10 w-auto brightness-0 invert opacity-50 grayscale"
              referrerPolicy="no-referrer"
            />
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">Dhenkanal RS SO</h2>
              <p className="text-[10px] uppercase font-bold text-ip-amber opacity-90 tracking-widest">Odisha Postal Circle</p>
            </div>
          </div>
          <div className="space-y-4 text-[11px] font-medium opacity-80 uppercase tracking-wider">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="shrink-0 text-ip-amber" />
              <p>Dhenkanal RS SO, Dhenkanal-759013, Odisha</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="shrink-0 text-ip-amber" />
              <p>06762-234234 (Service Desk)</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="shrink-0 text-ip-amber" />
              <a href="mailto:dhenkanalrsso@indiapost.gov.in" className="lowercase underline">dhenkanalrsso@indiapost.gov.in</a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xs font-black mb-6 border-l-4 border-ip-amber pl-3 uppercase tracking-widest text-ip-amber">Quick Links</h3>
          <ul className="grid grid-cols-1 gap-3 text-[11px] font-bold uppercase tracking-wide opacity-80">
            {QUICK_LINKS.map(link => (
              <li key={link.name}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-ip-amber transition-all">
                  <ExternalLink size={10} />
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-xs font-black mb-6 border-l-4 border-ip-amber pl-3 uppercase tracking-widest text-ip-amber">Digital Banking</h3>
          <ul className="space-y-3 text-[11px] font-bold uppercase tracking-wide opacity-80">
            <li><a href="#" className="hover:text-ip-amber">Post Office Savings Bank</a></li>
            <li><a href="https://ippbonline.bank.in/en/web/ippb" className="hover:text-ip-amber">IPPB Online Banking</a></li>
            <li><a href="https://dac.indiapost.gov.in/mydigipin/home" className="hover:text-ip-amber">DigiPin Registration</a></li>
            <li><a href="https://app.indiapost.gov.in/customer-selfservice/login" className="hover:text-ip-amber">Customer Login</a></li>
            <li><a href="https://epost-indiapost.gov.in/Home.aspx" target="_blank" rel="noopener noreferrer" className="hover:text-ip-amber">ePost Services</a></li>
          </ul>
        </div>

        {/* Admin & Logo */}
        <div className="space-y-8 flex flex-col items-end text-right">

          <div className="flex flex-col items-end gap-2 pr-2">
             <img 
              src="https://upload.wikimedia.org/wikipedia/en/3/32/India_Post.svg" 
              alt="India Post" 
              className="h-10 w-auto brightness-0 invert opacity-40 grayscale"
              referrerPolicy="no-referrer"
            />
            <p className="text-[10px] font-medium opacity-40 italic">Serving the Nation Since 1854</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest opacity-60 gap-4">
        <p>© 2026 Dhenkanal RS SO. All rights reserved.</p>
        <p className="text-right">Prepared by <span className="font-black text-ip-amber">Kalandi Charan Sahoo</span>, Postal Assistant</p>
      </div>
    </footer>
  );
}
