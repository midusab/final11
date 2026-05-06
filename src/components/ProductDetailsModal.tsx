import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, ShoppingBag, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onAddReview: (productId: string, rating: number, comment: string) => Promise<void>;
  isAuthenticated: boolean;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ 
  product, 
  onClose, 
  onAddToCart,
  onAddReview,
  isAuthenticated
}) => {
  const [newRating, setNewRating] = React.useState(5);
  const [newComment, setNewComment] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!product) return null;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onAddReview(product.id, newRating, newComment);
      setNewComment('');
      setNewRating(5);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[300]"
          />
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            className="fixed inset-0 sm:inset-6 lg:inset-12 bg-dark-bg border-t sm:border border-dark-border z-[301] flex flex-col lg:flex-row overflow-hidden shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/40 hover:text-white z-[302] p-2 bg-black/50 backdrop-blur-md rounded-full transition-all"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>

            {/* Left side: Hero Image */}
            <div className="lg:w-1/2 h-[40vh] lg:h-full bg-dark-surface relative overflow-hidden group">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8">
                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.5em] text-brand-red mb-1 sm:mb-2 block">Premium Collective</span>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black tracking-tighter uppercase">{product.name}</h2>
              </div>
            </div>

            {/* Right side: Info */}
            <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 sm:py-12 lg:p-16 custom-scrollbar">
              <div className="max-w-2xl mx-auto lg:mx-0">
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < 4 ? "fill-brand-red text-brand-red" : "text-white/10"} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-white/60 uppercase tracking-widest">{product.reviews.length} Customer Reviews</span>
                </div>

                <p className="text-2xl font-display font-black mb-8">KES {product.price.toLocaleString()}</p>

                <div className="space-y-8 mb-12">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Product Description</h4>
                    <p className="text-white/80 text-sm leading-relaxed italic">{product.description}</p>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Product Specifications</h4>
                    <ul className="space-y-3">
                      {product.details.map((detail, idx) => (
                        <li key={idx} className="flex gap-3 text-xs text-white/80 font-medium">
                          <span className="text-brand-red font-black mt-0.5">•</span>
                          {detail}
                        </li>
                      ))}
                      <li className="flex gap-3 text-xs text-white/80 font-medium">
                        <span className="text-brand-red font-black mt-0.5">•</span>
                        Fabric: {product.material}
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                  <div className="p-4 border border-dark-border bg-dark-surface/50 text-center">
                    <Truck size={18} className="mx-auto mb-2 text-brand-red" />
                    <p className="text-[9px] font-black uppercase tracking-widest">Global Express</p>
                  </div>
                  <div className="p-4 border border-dark-border bg-dark-surface/50 text-center">
                    <RotateCcw size={18} className="mx-auto mb-2 text-brand-red" />
                    <p className="text-[9px] font-black uppercase tracking-widest">Free Returns</p>
                  </div>
                  <div className="p-4 border border-dark-border bg-dark-surface/50 text-center">
                    <ShieldCheck size={18} className="mx-auto mb-2 text-brand-red" />
                    <p className="text-[9px] font-black uppercase tracking-widest">Encrypted Checkout</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 mb-16">
                  <button 
                    onClick={() => onAddToCart(product)}
                    className="w-full bg-brand-red text-white py-5 font-black uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3"
                  >
                    <ShoppingBag size={18} />
                    Add To Bag
                  </button>
                  <a 
                    href={`https://wa.me/1234567890?text=${encodeURIComponent(`Hi, I'm interested in the ${product.name} (KES ${product.price.toLocaleString()}). Is it available?`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-[#25D366] text-white py-5 font-black uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-[#25D366] transition-all flex items-center justify-center gap-3"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M12.031 6.172c-2.203 0-4.007 1.796-4.007 3.991 0 .64.153 1.259.432 1.815l-.461 1.685 1.726-.452c.524.285 1.113.435 1.721.435h.001c2.203 0 4.008-1.797 4.008-3.991 0-2.194-1.805-3.983-4.008-3.983zm2.746 5.859c-.117.33-.675.568-.934.606-.258.038-.507.031-1.31-.284-.667-.26-1.554-1.01-1.928-1.396-.374-.386-.665-.831-.665-1.33 0-.499.261-.744.354-.843.094-.099.205-.123.272-.123s.135.004.194.01c.061.006.143-.024.223.169.08.194.275.671.299.721.025.05.04.109.006.177-.033.067-.05.109-.1.168-.05.059-.105.132-.15.177-.049.049-.1.103-.043.2.057.097.253.418.544.677.375.334.69.438.788.487.098.049.155.04.212-.025.057-.066.241-.281.306-.377.064-.097.129-.081.217-.049s.562.264.658.312c.097.048.161.073.185.113.025.04.025.233-.092.563z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.55 4.117 1.514 5.845L0 24l6.337-1.663C7.935 23.406 9.904 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm.017 19.392h-.001c-1.341 0-2.651-.362-3.791-1.048l-.271-.161-2.82.74.753-2.748-.176-.28A7.361 7.361 0 0 1 4.619 12.01c0-4.062 3.303-7.365 7.366-7.365 1.968 0 3.82.766 5.211 2.157s2.157 3.242 2.157 5.211c0 4.062-3.303 7.365-7.366 7.365z"/>
                    </svg>
                    Book via WhatsApp
                  </a>
                </div>

                {/* Reviews Section */}
                <div className="border-t border-dark-border pt-12">
                  <div className="flex justify-between items-end mb-8">
                    <h4 className="text-xl font-display font-black tracking-tighter uppercase">Collective Feedback</h4>
                  </div>

                  {/* Add Review Form */}
                  <div className="mb-16 p-8 bg-dark-bg border border-dark-border relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                      <Star size={64} className="text-brand-red" />
                    </div>
                    
                    <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-red mb-6">Write a Review</h5>
                    
                    <form onSubmit={handleSubmitReview} className="relative z-10">
                      <div className="flex items-center gap-4 mb-6">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Rating:</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewRating(star)}
                              className="focus:outline-none transition-transform active:scale-90"
                            >
                              <Star 
                                size={20} 
                                className={star <= newRating ? "fill-brand-red text-brand-red" : "text-white/10 hover:text-white/30"} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <textarea
                          placeholder="Your review here..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="w-full bg-dark-surface border border-dark-border p-4 text-xs font-medium text-white placeholder:text-white/20 focus:outline-none focus:border-brand-red transition-all min-h-[100px] resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || !newComment.trim()}
                        className="bg-white text-black px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Transmitting...' : 'Post Feedback'}
                      </button>

                      {!isAuthenticated && (
                        <p className="mt-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">
                          * You must be signed in to contribute.
                        </p>
                      )}
                    </form>
                  </div>
                  
                  {product.reviews.length > 0 ? (
                    <div className="space-y-8">
                      {product.reviews.map(review => (
                        <div key={review.id} className="bg-dark-surface/30 p-6 border border-dark-border/50">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-xs font-black uppercase tracking-widest text-white mb-1">{review.user}</p>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={10} className={i < review.rating ? "fill-brand-red text-brand-red" : "text-white/10"} />
                                ))}
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{review.date}</span>
                          </div>
                          <p className="text-xs text-white/60 leading-relaxed italic">"{review.comment}"</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-white/20 uppercase tracking-widest font-black italic">Be the first to leave feedback for this drop.</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
