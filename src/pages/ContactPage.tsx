import React from 'react';
import { motion } from 'motion/react';
import { Mail, MessageSquare, Send, MapPin, Phone } from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'sonner';

export const ContactPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('INCOMPLETE INTEL', { description: 'All fields are required.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'inquiries'), {
        ...formData,
        userId: auth.currentUser?.uid || 'guest',
        timestamp: new Date().toISOString(),
        status: 'pending'
      });
      
      toast.success('TRANSMISSION SENT', {
        description: 'Your inquiry has been logged in our collective vault.',
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'inquiries');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Left Side: Editorial Content */}
          <div className="max-w-xl">
            <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[0.8] mb-12">
              ESTABLISH <br />
              <span className="text-brand-red italic text-5xl md:text-7xl">CONTACT</span>
            </h1>
            
            <p className="text-white/40 text-lg leading-relaxed mb-16 uppercase tracking-widest font-medium">
              WHETHER YOU ARE SEEKING ARCHIVE ACCESS, COLLABORATION PROTOCOLS, OR GENERAL INTEL, OUR TRANSMSISSION LINES ARE OPEN.
            </p>

            <div className="grid grid-cols-1 gap-12">
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 bg-dark-surface border border-dark-border flex items-center justify-center group-hover:border-brand-red transition-colors">
                  <MapPin size={20} className="text-brand-red" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-red mb-2">Tactical Hub</h4>
                  <p className="text-xs font-bold text-white uppercase tracking-widest">Nairobi, Kenya // Node 11</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 bg-dark-surface border border-dark-border flex items-center justify-center group-hover:border-brand-red transition-colors">
                  <Mail size={20} className="text-brand-red" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-red mb-2">Comms Channel</h4>
                  <p className="text-xs font-bold text-white uppercase tracking-widest">WICKLIFF@FINALL11.COM</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 bg-dark-surface border border-dark-border flex items-center justify-center group-hover:border-brand-red transition-colors">
                  <Phone size={20} className="text-brand-red" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-red mb-2">Direct Signal</h4>
                  <p className="text-xs font-bold text-white uppercase tracking-widest">+254 794 900 546</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="bg-dark-surface border border-dark-border p-8 md:p-12 relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-1 bg-brand-red/20" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-10">
                <MessageSquare size={16} className="text-brand-red" />
                <h3 className="text-xs font-black uppercase tracking-[0.4em]">Inquiry Protocol</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Identity</label>
                    <input 
                      type="text"
                      placeholder="NAME / SURNAME"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-black border border-dark-border p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-brand-red transition-colors placeholder:text-white/5"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Signal (Email)</label>
                    <input 
                      type="email"
                      placeholder="YOUR@MAIL.COM"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-black border border-dark-border p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-brand-red transition-colors placeholder:text-white/5"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Transmission Intel</label>
                  <textarea 
                    placeholder="DESCRIBE YOUR REQUEST..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-black border border-dark-border p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-brand-red transition-colors placeholder:text-white/5 resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-black py-5 font-black text-xs uppercase tracking-[0.3em] hover:bg-brand-red hover:text-white transition-all flex items-center justify-center gap-4 group"
                >
                  {isSubmitting ? 'TRANSMITTING...' : 'SEND TRANSMISSION'}
                  <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
              
              <p className="mt-8 text-[8px] font-bold text-white/20 uppercase tracking-[0.3em] leading-relaxed">
                By submitting this form, you acknowledge that your data will be stored securely in the Node 11 Collective database for protocol resolution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
