import React from 'react';
import { motion } from 'motion/react';
import { Phone, MessageCircle } from 'lucide-react';

export const ContactWidgets: React.FC = () => {
  return (
    <div className="fixed bottom-8 right-8 z-[150] flex flex-col gap-4">
      <motion.a
        href="tel:0794900546"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-2xl border border-dark-border"
        title="Call Us"
      >
        <Phone size={24} />
      </motion.a>
      
      <motion.a
        href="https://wa.me/254794900546"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1, rotate: 12 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl"
        title="WhatsApp Us"
      >
        <MessageCircle size={28} />
      </motion.a>
    </div>
  );
};
