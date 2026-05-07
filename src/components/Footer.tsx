import React from 'react';
import { Instagram, Twitter, MessageSquare, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-bg border-t border-dark-border pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-24 mb-16">
          <div className="space-y-6">
            <h3 className="text-3xl font-display font-black tracking-tighter text-white">
              FINALL <span className="text-brand-red italic">11</span>
            </h3>
            <p className="text-xs font-medium text-white/60 leading-relaxed max-w-xs uppercase tracking-widest">
              An architectural approach to streetwear. <br/>
              Founded by <span className="text-brand-red">Wickliff Miles</span>.
            </p>
            <div className="flex items-center gap-6">
              <a href="https://instagram.com/finall11" target="_blank" rel="noreferrer" className="text-white/60 hover:text-brand-red transition-colors" aria-label="Follow FINALL 11 on Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://twitter.com/finall11" target="_blank" rel="noreferrer" className="text-white/60 hover:text-brand-red transition-colors" aria-label="Follow FINALL 11 on Twitter">
                <Twitter size={18} />
              </a>
              <a href="https://wa.me/254794900546" target="_blank" rel="noreferrer" className="text-white/60 hover:text-brand-red transition-colors" aria-label="Contact FINALL 11 on WhatsApp">
                <MessageSquare size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-red mb-6">Navigation</h4>
            <ul className="grid grid-cols-2 gap-4">
              <li>
                <Link to="/" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/collections" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                  Archive
                </Link>
              </li>
              <li>
                <Link to="/contact" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:text-right">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-red mb-8">Newsletter</h4>
            <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-6 lg:ml-auto">Sign up for early access to our next drop.</p>
            <div className="max-w-md lg:ml-auto">
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  const email = (e.currentTarget.elements.namedItem('newsletter_email') as HTMLInputElement).value;
                  if (!email) return;
                  try {
                    const { error } = await supabase.from('newsletter_subs').insert([{ email }]);
                    if (error) {
                      if (error.code === '23505') {
                        toast.info('Already subscribed', { description: 'You are already on our list.' });
                      } else throw error;
                    } else {
                      toast.success('Subscribed!', { description: 'You will receive early access notifications.' });
                      (e.target as HTMLFormElement).reset();
                    }
                  } catch (err: any) {
                    toast.error('Subscription failed', { description: err.message });
                  }
                }}
                className="flex flex-col sm:flex-row gap-2"
              >
                <input 
                  name="newsletter_email"
                  type="email" 
                  required
                  placeholder="ENTER YOUR EMAIL"
                  className="flex-1 bg-white/5 border border-white/10 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-brand-red transition-all placeholder:text-white/20 text-white"
                />
                <button 
                  type="submit"
                  className="bg-white text-black px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-red hover:text-white transition-all whitespace-nowrap"
                >
                  SUBSCRIBE
                </button>
              </form>
              <p className="mt-3 text-[8px] font-bold text-white/60 uppercase tracking-widest text-left lg:text-right">
                BY JOINING, YOU AGREE TO OUR PRIVACY POLICY
              </p>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-dark-border flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">
            &copy; 2026 Finall 11 Studio © All Rights Reserved
          </p>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">System Status: Optimal</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
