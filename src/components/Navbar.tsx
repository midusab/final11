import React from 'react';
import { ShoppingBag, Search, Menu, X, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onSignInClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartClick, onSignInClick }) => {
  const { user, isAdmin, logout } = useAuth();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      console.log('Navbar - User:', user.email, 'isAdmin:', isAdmin);
    }
  }, [user, isAdmin]);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "bg-dark-bg/90 backdrop-blur-md border-b border-dark-border" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <Link to="/" className="text-2xl font-display font-bold tracking-tighter text-white">
            FINALL <span className="text-brand-red">11</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/products" className="text-xs uppercase tracking-widest font-medium text-white/60 hover:text-brand-red transition-colors">
              Shop
            </Link>
            <Link to="/collections" className="text-xs uppercase tracking-widest font-medium text-white/60 hover:text-brand-red transition-colors">
              Archive
            </Link>
            <Link to="/contact" className="text-xs uppercase tracking-widest font-medium text-white/60 hover:text-brand-red transition-colors">
              Inquiry
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-xs uppercase tracking-widest font-black text-brand-red animate-pulse">
                Admin
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-white/60 hover:text-white transition-colors hidden sm:block">
            <Search size={20} />
          </button>
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex flex-col items-end">
                 <span className="text-[10px] font-black uppercase text-white tracking-widest leading-none mb-1">
                   {user.user_metadata?.full_name?.split(' ')[0] || 'Member'}
                 </span>
              </div>
              <div className="w-8 h-8 rounded-full border border-dark-border overflow-hidden">
                 <img src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.user_metadata?.full_name || 'U'}&background=000&color=fff`} alt="User" className="w-full h-full object-cover" />
              </div>
              <button 
                onClick={logout} 
                title="Logout"
                className="text-white/40 hover:text-brand-red transition-all p-1"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={onSignInClick}
              className="text-white/60 hover:text-brand-red transition-colors flex items-center gap-2"
            >
              <User size={20} />
              <span className="text-[10px] font-bold tracking-widest hidden lg:block uppercase">Account</span>
            </button>
          )}
          <button 
            className="relative text-white hover:text-brand-green transition-colors"
            onClick={onCartClick}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-green text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-dark-bg z-[60] flex flex-col p-8"
          >
            <button 
              className="self-end text-white/60 hover:text-white mb-12"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={32} />
            </button>
            <div className="flex flex-col gap-8">
              <Link 
                to="/products"
                className="text-4xl font-display font-bold uppercase tracking-tighter text-white hover:text-brand-red transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link 
                to="/collections"
                className="text-4xl font-display font-bold uppercase tracking-tighter text-white hover:text-brand-red transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Archive
              </Link>
              <Link 
                to="/contact"
                className="text-4xl font-display font-bold uppercase tracking-tighter text-white hover:text-brand-red transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Inquiry
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin"
                  className="text-4xl font-display font-bold uppercase tracking-tighter text-brand-red transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              {user && (
                <button 
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-4xl font-display font-bold uppercase tracking-tighter text-white/40 hover:text-brand-red transition-colors flex items-center gap-4"
                >
                  Logout <LogOut size={32} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
