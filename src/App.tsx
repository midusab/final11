import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { SignIn } from './components/SignIn';
import { Footer } from './components/Footer';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ProductsPage } from './pages/ProductsPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ContactWidgets } from './components/ContactWidgets';
import { PRODUCTS, Product, CartItem, Review } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from './lib/firebase';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, arrayUnion, setDoc, getDoc, addDoc } from 'firebase/firestore';

export default function App() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isSignInOpen, setIsSignInOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isAppLoading, setIsAppLoading] = React.useState(true);
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);
  const location = useLocation();

  // Firebase Auth Listener
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check if admin doc exists OR if this is the bootstrapped admin email
        const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
        const isAuthAdmin = adminDoc.exists() || (currentUser.email === "midusab@gmail.com" && currentUser.emailVerified);
        setIsAdmin(isAuthAdmin);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Firestore Data Listeners
  React.useEffect(() => {
    // Listen to products
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubProducts = onSnapshot(q, (snapshot) => {
      const pList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
      
      if (pList.length === 0 && PRODUCTS.length > 0) {
        // Seeding logic moved to a check that involves isAdmin
        if (isAdmin) {
          PRODUCTS.forEach(async (p) => {
            const { id, ...rest } = p;
            try {
              await setDoc(doc(db, 'products', id), { ...rest, createdAt: new Date() });
            } catch (e) {
              console.error("Seeding failed", e);
            }
          });
        }
      } else {
        setProducts(pList);
      }
      setIsAppLoading(false);
    }, (err) => {
      // Don't throw if it's just a permission error on the list (though products should be public read)
      console.error("Products listener error:", err);
      setIsAppLoading(false);
    });

    // Listen to config
    const unsubConfig = onSnapshot(doc(db, 'app_config', 'main'), (doc) => {
      if (doc.exists()) {
        setMaintenanceMode(doc.data().maintenanceMode);
      }
    });

    return () => {
      unsubProducts();
      unsubConfig();
    };
  }, []);

  const handleReviewSubmit = async (productId: string, rating: number, comment: string) => {
    if (!user) {
      setIsSignInOpen(true);
      toast.error('AUTH REQUIRED');
      return;
    }

    const newReview: Review = {
      id: `r-${Date.now()}`,
      user: user.displayName || 'Anonymous',
      userId: user.uid,
      rating,
      comment,
      date: new Date().toLocaleDateString(),
    };

    try {
      await updateDoc(doc(db, 'products', productId), {
        reviews: arrayUnion(newReview)
      });
      
      toast.success('REVIEW SUBMITTED');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${productId}`);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setIsSignInOpen(false);
      toast.success('AUTHENTICATED');
    } catch (error) {
      toast.error('AUTH FAILED');
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    toast.success('SIGNED OUT');
  };

  const handleCheckout = () => {
    if (!user) {
      setIsCartOpen(false);
      setIsSignInOpen(true);
      toast.error('AUTH REQUIRED', {
        description: 'You must be authenticated to place an order.',
      });
      return;
    }
    
    // Redirect to WhatsApp with order details
    const message = `NODE 11 ORDER:\n${cartItems.map(i => `- ${i.name} (${i.quantity})`).join('\n')}\nTotal: KES ${cartItems.reduce((s, i) => s + i.price * i.quantity, 0).toLocaleString()}`;
    window.open(`https://wa.me/254700000000?text=${encodeURIComponent(message)}`, '_blank');
  };

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
    toast.success('ITEM ADDED', {
      description: `${product.name} has been added to your bag.`,
      className: 'bg-dark-surface border-dark-border text-white',
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  if (isAppLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-dark-bg selection:bg-brand-red selection:text-white">
      <AnimatePresence>
        {maintenanceMode && !isAdmin && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-dark-bg flex items-center justify-center p-12 text-center"
          >
            <div className="max-w-md">
              <div className="text-6xl font-display font-black text-brand-red mb-8 animate-pulse">11_LOCKDOWN</div>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-white">System Calibration in Progress</h2>
              <p className="text-white/40 uppercase text-[10px] tracking-widest leading-loose">
                The node is currently undergoing architectural updates. Access to the matrix is temporary restricted for non-administrators. Retransmitting soon.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster 
        position="top-right" 
        expand={false} 
        richColors 
        theme="dark"
        toastOptions={{
          style: {
            background: '#0a0a0a',
            border: '1px solid #1a1a1a',
            color: '#fff',
            borderRadius: '0px',
            fontFamily: 'Inter, sans-serif'
          },
          className: 'uppercase tracking-widest text-[10px] font-black'
        }}
      />
      <Navbar 
        cartCount={cartItems.reduce((s, i) => s + i.quantity, 0)} 
        onCartClick={() => setIsCartOpen(true)} 
        onSignInClick={() => setIsSignInOpen(true)}
        user={user}
        isAdmin={isAdmin}
        onSignOut={handleSignOut}
      />
      
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Hero />

              {/* Featured Section */}
              <section id="shop" className="py-24 border-y border-dark-border">
                <div className="max-w-7xl mx-auto px-6">
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-red mb-4">Featured Drops</p>
                      <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase">THE <span className="italic">ESSENTIALS</span></h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {products.slice(0, 3).map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onAddToCart={addToCart} 
                        onViewDetails={setSelectedProduct}
                      />
                    ))}
                  </div>
                </div>
              </section>

              {/* Manifesto & Story */}
              <section className="py-32 bg-dark-surface overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-red/50 to-transparent" />
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-brand-red/20 blur-[100px] rounded-full scale-75 group-hover:scale-100 transition-transform duration-1000" />
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      className="relative z-10 glass-module p-2 md:p-8 overflow-hidden aspect-square flex items-center justify-center p-8"
                    >
                      <div className="absolute inset-0 specular-highlight" />
                      <img 
                        src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1200"
                        alt="Alpha Prime Hoodie"
                        className="w-full h-full object-contain mix-blend-screen grayscale brightness-125 contrast-125"
                      />
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-red">Manifesto Piece</p>
                          <h4 className="text-xl font-display font-black uppercase tracking-tighter">Alpha Prime 01</h4>
                        </div>
                        <div className="h-12 w-px bg-white/20" />
                      </div>
                    </motion.div>
                    
                    {/* Floating Tech Detail Tag */}
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-4 -right-4 z-20 bg-white text-black p-4 shadow-2xl"
                    >
                      <p className="text-[8px] font-black uppercase tracking-widest leading-none">Material Code</p>
                      <p className="text-xs font-mono font-bold">F11-H01-GR-01</p>
                    </motion.div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] font-bold text-brand-red mb-6">The Founder: Wickliff Miles</p>
                    <h3 className="text-4xl md:text-6xl font-display font-black tracking-tighter uppercase mb-8 leading-[0.9]">
                      GHETTO CULTURE. <br />
                      <span className="text-white/20">GLOBAL SPORT style.</span>
                    </h3>
                    <p className="text-white/40 text-lg leading-relaxed mb-12 max-w-lg italic font-light">
                      "Finall 11 was born from the intersection of raw ghetto culture and the discipline of international sports. We design for those who move between these worlds with silent confidence."
                    </p>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="p-4 border border-dark-border">
                          <p className="text-xs font-black text-brand-red uppercase mb-1">Pillar I</p>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Urban Authenticity</p>
                       </div>
                       <div className="p-4 border border-dark-border">
                          <p className="text-xs font-black text-brand-red uppercase mb-1">Pillar II</p>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Sport Excellence</p>
                       </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          } />
          
          <Route path="/products" element={<ProductsPage products={products} onAddToCart={addToCart} onViewDetails={setSelectedProduct} />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <ProductsPage products={products} onAddToCart={addToCart} onViewDetails={setSelectedProduct} />} />
        </Routes>

        {/* Newsletter Section - Keep on both */}
        <section className="py-32 border-t border-dark-border">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h4 className="text-4xl font-display font-black tracking-tighter uppercase mb-6">Join the Collective</h4>
            <p className="text-white/40 mb-10 text-sm tracking-wide">Be the first to know about Drop 02 and exclusive access keys.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                id="newsletter-email"
                type="email" 
                placeholder="YOUR EMAIL" 
                className="flex-1 bg-dark-surface border border-dark-border px-6 py-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-brand-red transition-colors"
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    if (user) {
                        try {
                            await addDoc(collection(db, 'inquiries'), {
                                userId: user.uid,
                                name: user.displayName,
                                email: user.email,
                                message: 'Newsletter Subscription Request',
                                timestamp: new Date().toISOString()
                            });
                        } catch (error) {
                            console.error(error);
                        }
                    }
                    toast.success('ACCESS GRANTED', {
                      description: 'Member Key has been sent to your email.',
                    });
                  }
                }}
              />
              <button 
                onClick={async () => {
                   if (user) {
                        try {
                            await addDoc(collection(db, 'inquiries'), {
                                userId: user.uid,
                                name: user.displayName,
                                email: user.email,
                                message: 'Newsletter Subscription Request',
                                timestamp: new Date().toISOString()
                            });
                        } catch (error) {
                            console.error(error);
                        }
                    }
                  toast.success('ACCESS GRANTED', {
                    description: 'Member Key has been sent to your email.',
                  });
                }}
                className="bg-white text-black px-10 py-4 font-black text-xs uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all whitespace-nowrap"
              >
                Submit Key
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        isAuthenticated={!!user}
        onCheckout={handleCheckout}
      />

      <SignIn 
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onGoogleSignIn={handleGoogleSignIn}
      />

      <ProductDetailsModal 
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
        onAddReview={handleReviewSubmit}
        isAuthenticated={!!user}
      />

      <ContactWidgets />
    </div>
  );
}

