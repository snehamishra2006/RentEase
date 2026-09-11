import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Building2, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-16 bg-[#F4F0E8] dark:bg-[#181715] border-t border-[#E2DACD] dark:border-stone-800 text-[#1C1917] dark:text-stone-300 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-[#E2DACD] dark:border-stone-800">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1B3B2B] dark:bg-emerald-600 flex items-center justify-center text-white font-serif font-extrabold text-base shadow-xs">
                R
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#1C1917] dark:text-stone-100">
                Rent<span className="text-[#1B3B2B] dark:text-emerald-400">Ease</span>
              </span>
            </Link>
            <p className="text-xs text-[#605A52] dark:text-stone-400 leading-relaxed">
              India's first Property Ledger platform. Verified rental deed records, zero brokerage surprises, and automated lease tracking for Tenants and Landlords.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-stone-900 border border-[#E2DACD] dark:border-stone-700 text-[11px] font-bold text-[#1B3B2B] dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> 100% Admin Verified Records
            </div>
          </div>

          {/* Col 2: Popular Cities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#B8860B] dark:text-amber-400">
              Popular Rental Hubs
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/properties?city=Ghaziabad" className="hover:text-[#1B3B2B] dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                  <MapPin className="w-3.5 h-3.5 text-[#1B3B2B] dark:text-emerald-400" /> Ghaziabad (Indirapuram & Vaishali)
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Gurgaon" className="hover:text-[#1B3B2B] dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                  <MapPin className="w-3.5 h-3.5 text-[#1B3B2B] dark:text-emerald-400" /> Gurgaon (Golf Course Road)
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Noida" className="hover:text-[#1B3B2B] dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                  <MapPin className="w-3.5 h-3.5 text-[#1B3B2B] dark:text-emerald-400" /> Noida (Sector 62 & Expressway)
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Delhi" className="hover:text-[#1B3B2B] dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                  <MapPin className="w-3.5 h-3.5 text-[#1B3B2B] dark:text-emerald-400" /> Delhi (Lajpat Nagar & South Delhi)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Property Searches */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#B8860B] dark:text-amber-400">
              Popular Searches
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/properties?type=flat_apartment&bedrooms=3" className="hover:text-[#1B3B2B] dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                  <Building2 className="w-3.5 h-3.5 text-[#1B3B2B] dark:text-emerald-400" /> 3 BHK Flats in Indirapuram
                </Link>
              </li>
              <li>
                <Link to="/properties?type=builder_floor&bedrooms=1" className="hover:text-[#1B3B2B] dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                  <Building2 className="w-3.5 h-3.5 text-[#1B3B2B] dark:text-emerald-400" /> 1 BHK Builder Floors in Delhi
                </Link>
              </li>
              <li>
                <Link to="/properties?type=independent_house&bedrooms=3" className="hover:text-[#1B3B2B] dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                  <Building2 className="w-3.5 h-3.5 text-[#1B3B2B] dark:text-emerald-400" /> Independent House in Vaishali
                </Link>
              </li>
              <li>
                <Link to="/properties?type=villa&bedrooms=4" className="hover:text-[#1B3B2B] dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                  <Building2 className="w-3.5 h-3.5 text-[#1B3B2B] dark:text-emerald-400" /> 4 BHK Luxury Villa in Noida
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#B8860B] dark:text-amber-400">
              Platform Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/properties" className="hover:text-[#1B3B2B] dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5 text-[#1B3B2B] dark:text-emerald-400" /> All Properties Registry
                </Link>
              </li>
              <li>
                <Link to="/tenant/applications" className="hover:text-[#1B3B2B] dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5 text-[#1B3B2B] dark:text-emerald-400" /> My Rental Applications
                </Link>
              </li>
              <li>
                <Link to="/tenant/rental" className="hover:text-[#1B3B2B] dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5 text-[#1B3B2B] dark:text-emerald-400" /> Active Lease Deed Tracker
                </Link>
              </li>
              <li>
                <Link to="/owner/dashboard" className="hover:text-[#1B3B2B] dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5 text-[#1B3B2B] dark:text-emerald-400" /> Landlord Host Console
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#605A52] dark:text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} RentEase Real Estate Ledger. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <span>Verified Deeds Protocol</span>
            <span>•</span>
            <span>Indian Rental Standards</span>
            <span>•</span>
            <span>ISO 27001 Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
