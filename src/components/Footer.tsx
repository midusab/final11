import React from 'react';
import { Instagram, Twitter, MessageSquare, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-bg border-t border-dark-border pt-24 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-24">
          <div className="space-y-8">
            <h3 className="text-3xl font-display font-black tracking-tighter text-white">
              FINALL <span className="text-brand-red italic">11</span>
            </h3>
            <p className="text-xs font-medium text-white/40 leading-relaxed max-w-xs uppercase tracking-widest">
              Founded by <span className="text-brand-red">Wickliff Miles</span>. <br/>
              An architectural approach to streetwear bridging urban culture and elite sports.
            </p>
            <div className="flex items-center gap-6">
              {[Instagram, Twitter, MessageSquare].map((Icon, i) => (
                <a key={i} href="#" className="text-white/20 hover:text-brand-red transition-colors">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-red mb-8">Access</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/products" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                  The Shop
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/collections" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                  The Archive
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-red mb-8">The Studio</h4>
            <ul className="space-y-4">
              {['Inventory Archive', 'Our Manifesto', 'Sustainability', 'Global Collective'].map((item) => (
                <li key={item}>
                  <a href="#" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                    {item}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:text-right">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-red mb-8">Newsletter</h4>
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6 lg:ml-auto">Secure early access keys for Drop 02.</p>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="MEMBER_ID@GMAIL.COM"
                className="w-full bg-dark-surface border-b border-white/10 py-4 text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-brand-red transition-colors placeholder:text-white/10"
              />
              <button className="absolute right-0 bottom-4 text-brand-red opacity-0 group-hover:opacity-100 transition-opacity">
                JOIN
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-dark-border flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">
            &copy; 2026 Finall 11 Studio © All Rights Reserved
          </p>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">System Status: Optimal</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
