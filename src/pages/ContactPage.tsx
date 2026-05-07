import React from 'react';
import { motion } from 'motion/react';
import { Mail, MessageSquare, Send, MapPin, Phone, CheckCircle2, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Inquiry } from '../types';
import { toast } from 'sonner';

export const ContactPage: React.FC = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  React.useEffect(() => { document.title = 'Inquiry — FINALL 11'; }, []);
  const [myInquiries, setMyInquiries] = React.useState<Inquiry[]>([]);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: ''
  });

  const fetchMyInquiries = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false });
    
    if (!error && data) {
      setMyInquiries(data as Inquiry[]);
    }
  };

  React.useEffect(() => {
    fetchMyInquiries();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('inquiries').insert([{
        ...formData,
        user_id: user?.id || null,
        timestamp: new Date().toISOString()
      }]);

      if (error) throw error;
      
      toast.success('Message Sent', {
        description: 'We have received your message and will get back to you soon.',
      });
      setFormData({ name: '', email: '', message: '' });
      fetchMyInquiries();
    } catch (error: any) {
      toast.error('Error sending message', { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-24">
          {/* Left Side: Contact Information */}
          <div className="max-w-xl">
            <h1 className="text-6xl font-display font-black tracking-tighter uppercase leading-none mb-8">
              GET IN <br />
              <span className="text-brand-red italic">TOUCH</span>
            </h1>
            
            <p className="text-white/40 text-sm leading-relaxed mb-12 uppercase tracking-widest font-bold">
              HAVE A QUESTION ABOUT A DROP OR YOUR ORDER? OUR TEAM IS HERE TO HELP YOU.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 bg-dark-surface border border-dark-border flex items-center justify-center group-hover:border-brand-red transition-colors">
                  <MapPin size={20} className="text-brand-red" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Our Office</h4>
                  <p className="text-xs font-bold text-white uppercase tracking-widest">Nairobi, Kenya</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 bg-dark-surface border border-dark-border flex items-center justify-center group-hover:border-brand-red transition-colors">
                  <Mail size={20} className="text-brand-red" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Email Support</h4>
                  <p className="text-xs font-bold text-white uppercase tracking-widest">wickliff@finall11.com</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 bg-dark-surface border border-dark-border flex items-center justify-center group-hover:border-brand-red transition-colors">
                  <Phone size={20} className="text-brand-red" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Direct Line</h4>
                  <p className="text-xs font-bold text-white uppercase tracking-widest">+254 794 900 546</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="bg-dark-surface border border-dark-border p-8 md:p-12">
            <div className="flex items-center gap-3 mb-10">
              <MessageSquare size={16} className="text-brand-red" />
              <h3 className="text-xs font-black uppercase tracking-widest">Send us a message</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Full Name</label>
                <input 
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black border border-dark-border p-4 text-xs font-bold focus:outline-none focus:border-brand-red transition-colors placeholder:text-white/30 uppercase tracking-widest"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Email Address</label>
                <input 
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black border border-dark-border p-4 text-xs font-bold focus:outline-none focus:border-brand-red transition-colors placeholder:text-white/30 uppercase tracking-widest"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Your Message</label>
                <textarea 
                  placeholder="Tell us what you need..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-black border border-dark-border p-4 text-xs font-bold focus:outline-none focus:border-brand-red transition-colors placeholder:text-white/30 resize-none uppercase tracking-widest"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black py-4 font-black text-[10px] uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all flex items-center justify-center gap-3"
              >
                {isSubmitting ? 'Sending...' : 'Submit Message'}
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* Message History Section */}
        {user && myInquiries.length > 0 && (
          <div className="border-t border-dark-border pt-16">
            <h2 className="text-2xl font-display font-black tracking-tighter uppercase mb-12">Your <span className="text-brand-red">Recent</span> Messages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myInquiries.map((inquiry) => (
                <div key={inquiry.id} className="bg-dark-surface border border-dark-border p-8 relative group">
                   <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        {inquiry.response ? (
                          <CheckCircle2 size={16} className="text-brand-red" />
                        ) : (
                          <Clock size={16} className="text-white/20" />
                        )}
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {inquiry.response ? 'Response Received' : 'Pending Review'}
                        </span>
                      </div>
                      <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">
                        {new Date(inquiry.timestamp).toLocaleDateString()}
                      </span>
                   </div>

                   <div className="mb-6">
                      <h4 className="text-[8px] font-black uppercase text-white/40 tracking-widest mb-2">Your Inquiry:</h4>
                      <p className="text-xs text-white/60 italic leading-relaxed">"{inquiry.message}"</p>
                   </div>

                   {inquiry.response && (
                     <div className="p-6 bg-black border border-brand-red/20 mt-4">
                        <h4 className="text-[8px] font-black uppercase text-brand-red tracking-widest mb-3 underline">Our Reply:</h4>
                        <p className="text-xs text-white leading-relaxed font-medium">{inquiry.response}</p>
                     </div>
                   )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
