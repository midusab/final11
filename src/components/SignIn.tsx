import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, ArrowRight } from 'lucide-react';

interface SignInProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleSignIn: () => void;
}

export const SignIn: React.FC<SignInProps> = ({ isOpen, onClose, onGoogleSignIn }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-dark-bg border border-dark-border p-12 z-[201] shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-display font-black tracking-tighter uppercase mb-2">
                FINALL <span className="text-brand-red">11</span> ACCESS
              </h2>
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                Enter your credentials to enter the collective
              </p>
            </div>

            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              <button 
                onClick={onGoogleSignIn}
                className="w-full bg-white text-black py-4 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-brand-red hover:text-white transition-all border border-white/10"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/wait.gif" className="hidden" alt="" />
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>

              <div className="flex items-center gap-4 my-2">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">or member id</span>
                <div className="h-px flex-1 bg-white/5" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/60 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                  <input 
                    type="email" 
                    placeholder="email@example.com"
                    className="w-full bg-dark-surface border border-dark-border py-4 pl-12 pr-4 text-xs font-medium focus:outline-none focus:border-brand-red transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/60 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-dark-surface border border-dark-border py-4 pl-12 pr-4 text-xs font-medium focus:outline-none focus:border-brand-red transition-colors"
                  />
                </div>
              </div>

              <button className="bg-brand-red hover:bg-brand-red-hover text-white py-5 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all mt-4">
                AUTHENTICATE
                <ArrowRight size={16} />
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
