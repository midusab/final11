import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, ArrowRight, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface SignInProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignIn: React.FC<SignInProps> = ({ isOpen, onClose }) => {
  const { loginWithGoogle, loginWithEmail, registerWithEmail, resetPassword } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isRegistering) {
        if (!name) throw new Error('Name is required');
        await registerWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
      onClose();
    } catch (error) {
      // Errors are handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error('EMAIL REQUIRED', { description: 'Please enter your email first.' });
      return;
    }
    await resetPassword(email);
  };

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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-dark-bg border border-dark-border p-12 z-[201] shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-display font-black tracking-tighter uppercase mb-2">
                FINALL <span className="text-brand-red">11</span> {isRegistering ? 'JOIN' : 'ACCESS'}
              </h2>
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                {isRegistering ? 'Register your account to join the collective' : 'Enter your credentials to enter the collective'}
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <button 
                onClick={async () => {
                  try {
                    await loginWithGoogle();
                    onClose();
                  } catch (e) {}
                }}
                className="w-full bg-white text-black py-4 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-brand-red hover:text-white transition-all border border-white/10"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isRegistering ? 'Sign up with Google' : 'Sign in with Google'}
              </button>

              <div className="flex items-center gap-4 my-2">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">or member id</span>
                <div className="h-px flex-1 bg-white/5" />
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {isRegistering && (
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/60 ml-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Wickliff Miles"
                        className="w-full bg-dark-surface border border-dark-border py-4 pl-12 pr-4 text-xs font-medium focus:outline-none focus:border-brand-red transition-colors"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/60 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full bg-dark-surface border border-dark-border py-4 pl-12 pr-4 text-xs font-medium focus:outline-none focus:border-brand-red transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/60">Password</label>
                    {!isRegistering && (
                      <button 
                        type="button"
                        onClick={handleResetPassword}
                        className="text-[8px] font-bold text-white/20 hover:text-brand-red uppercase tracking-widest"
                      >
                        Forgot Key?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-dark-surface border border-dark-border py-4 pl-12 pr-4 text-xs font-medium focus:outline-none focus:border-brand-red transition-colors"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="bg-brand-red hover:bg-brand-red-hover text-white py-5 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'PROCESSING...' : (isRegistering ? 'CREATE ACCOUNT' : 'AUTHENTICATE')}
                  {!isLoading && <ArrowRight size={16} />}
                </button>
              </form>

              <div className="text-center mt-4">
                <button 
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                >
                  {isRegistering ? 'Already have access? Sign In' : 'Need access? Sign Up'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
