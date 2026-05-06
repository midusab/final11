import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullScreen = true, className }) => {
  return (
    <div className={cn(
      "flex items-center justify-center bg-dark-bg",
      fullScreen ? "fixed inset-0 z-[1000]" : "w-full h-full min-h-[200px]",
      className
    )}>
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          {/* Animated border segments */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-t-2 border-brand-red rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 border-b-2 border-white/10 rounded-full"
          />
          
          {/* Central 11 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-display font-black tracking-tighter text-white">11</span>
          </div>
        </div>
        
        {/* Terminal loading text */}
        <motion.p
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30"
        >
          LOADING ..... 
        </motion.p>
      </div>
    </div>
  );
};
