import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { OfferBanner } from './components/OfferBanner';
import { PRODUCTS, Product, CartItem, Review } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';

// High-Priority / Above-the-fold components are imported directly above.
// Non-critical or below-the-fold components are lazy-loaded below.
const Cart = lazy(() => import('./components/Cart').then(m => ({ default: m.Cart })));
const SignIn = lazy(() => import('./components/SignIn').then(m => ({ default: m.SignIn })));
const Footer = lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));
const ProductDetailsModal = lazy(() => import('./components/ProductDetailsModal').then(m => ({ default: m.ProductDetailsModal })));
const LandingOfferPopup = lazy(() => import('./components/LandingOfferPopup').then(m => ({ default: m.LandingOfferPopup })));
const ContactWidgets = lazy(() => import('./components/ContactWidgets').then(m => ({ default: m.ContactWidgets })));
const CookieConsent = lazy(() => import('./components/CookieConsent').then(m => ({ default: m.CookieConsent })));
// Lazy Loaded Pages
const ProductList = lazy(() => import('./pages/ProductsPage').then(m => ({ default: m.ProductsPage })));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage').then(m => ({ default: m.CollectionsPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));

export default function App() {
  const { user, isAdmin, loading: isAuthLoading } = useAuth();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [cartItems, setCartItems] = React.useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('f11_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isSignInOpen, setIsSignInOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [isProductsLoading, setIsProductsLoading] = React.useState(true);
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);
  const [offerConfig, setOfferConfig] = React.useState({ active: false, text: '', expiry: '', product_id: '' });
  const [isOfferPopupOpen, setIsOfferPopupOpen] = React.useState(true);
  const location = useLocation();

  const offerProduct = React.useMemo(() => 
    products.find(p => p.id === offerConfig.product_id), 
  [products, offerConfig.product_id]);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [
          { data: productData, error: productError },
          { data: configData }
        ] = await Promise.all([
          supabase.from('products')
            .select('id, name, category, price, image, description, details, material, sizes, is_upcoming, release_date, promo_label, stock, created_at, reviews')
            .order('created_at', { ascending: false }),
          supabase.from('app_config').select('*').eq('id', 'main').single()
        ]);

        if (productError) {
          console.error("Error fetching products:", productError);
        } else if (productData) {
          // Sanitise: filter out any product where JSON fields are corrupted
          const safeProducts = productData.filter(p => {
            try {
              // If reviews is a string (returned as raw JSON), parse it to validate
              if (typeof p.reviews === 'string') JSON.parse(p.reviews);
              return true;
            } catch {
              console.warn('Skipping product with corrupted data:', p.id, p.name);
              return false;
            }
          });
          if (productData.length === 0 && PRODUCTS.length > 0 && isAdmin) {
            const seedData = PRODUCTS.map(({ id, ...rest }) => ({ ...rest }));
            await supabase.from('products').insert(seedData);
            const { data: refetched } = await supabase.from('products')
              .select('id, name, category, price, image, description, details, material, sizes, is_upcoming, release_date, promo_label, stock, created_at, reviews')
              .order('created_at', { ascending: false });
            if (refetched) setProducts(refetched as Product[]);
          } else {
            setProducts(safeProducts as Product[]);
          }
        }

        if (configData) {
          setMaintenanceMode(configData.maintenance_mode);
          setOfferConfig({
            active: configData.offer_active || false,
            text: configData.offer_text || '',
            expiry: configData.offer_expiry || '',
            product_id: configData.offer_product_id || ''
          });
        } else if (isAdmin) {
          // Initialize system config if missing
          const defaultConfig = {
            id: 'main',
            maintenance_mode: false,
            offer_active: false,
            offer_text: 'WELCOME TO FINALL 11',
            offer_expiry: '',
            offer_product_id: null
          };
          await supabase.from('app_config').insert([defaultConfig]);
          setMaintenanceMode(false);
        }
      } catch (e) {
        console.warn('System data fetch failed:', e);
      } finally {
        setIsProductsLoading(false);
      }
    };

    loadData();

    const channelName = `system-realtime-${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'app_config' }, (payload: any) => {
        if (payload.new && payload.new.id === 'main') {
          setMaintenanceMode(payload.new.maintenance_mode);
          setOfferConfig({
            active: payload.new.offer_active || false,
            text: payload.new.offer_text || '',
            expiry: payload.new.offer_expiry || '',
            product_id: payload.new.offer_product_id || ''
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  const handleReviewSubmit = async (productId: string, rating: number, comment: string) => {
    if (!user) {
      setIsSignInOpen(true);
      toast.error('AUTH REQUIRED');
      return;
    }

    const newReview = {
      id: `r-${Date.now()}`,
      user: user.user_metadata?.full_name || 'Member',
      user_id: user.id,
      rating,
      comment,
      date: new Date().toLocaleDateString(),
    };

    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;
      
      const updatedReviews = [...(product.reviews || []), newReview];
      
      // Optimistic Update
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, reviews: updatedReviews } : p));
      // Update selected product if modal is open
      if (selectedProduct?.id === productId) {
        setSelectedProduct({ ...selectedProduct, reviews: updatedReviews });
      }

      const { error } = await supabase.from('products').update({ reviews: updatedReviews }).eq('id', productId);
      if (error) throw error;
      toast.success('REVIEW POSTED');
    } catch (error: any) {
      // Rollback on error
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (data) setProducts(data as Product[]);
      toast.error('SUBMISSION FAILED', { description: error.message });
    }
  };

  // Persist cart to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('f11_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, selectedSize: string = '') => {
    const cartKey = `${product.id}-${selectedSize}`;
    setCartItems((prev) => {
      const existing = prev.find((item) => `${item.id}-${item.selectedSize}` === cartKey);
      if (existing) {
        return prev.map((item) =>
          `${item.id}-${item.selectedSize}` === cartKey ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize }];
    });
    setIsCartOpen(true);
    toast.success('ADDED TO BAG', { description: product.name });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  if (isAuthLoading || isProductsLoading) return <LoadingSpinner />;

  if (maintenanceMode && !isAdmin && location.pathname !== '/admin') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Background Noise/Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-red/10 to-transparent pointer-events-none" />
        
        <div className="max-w-xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1 border border-brand-red/30 bg-brand-red/5 mb-12"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-red animate-pulse">System Lockdown</p>
          </motion.div>
          
          <h1 className="text-7xl md:text-9xl font-display font-black text-white mb-8 tracking-tighter uppercase leading-[0.8]">
            11<span className="text-brand-red italic">_</span>OFFLINE
          </h1>
          
          <h2 className="text-xl font-black uppercase tracking-widest mb-6 text-white/80">Calibration in Progress</h2>
          
          <p className="text-white/30 uppercase text-[10px] tracking-[0.2em] leading-relaxed mb-16 max-w-sm mx-auto font-bold">
            The archive is currently undergoing tactical reconfiguration. Normal operations will resume shortly.
          </p>
          
          <div className="flex flex-col items-center gap-8">
            <div className="w-48 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <Link 
              to="/admin" 
              className="group flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-brand-red transition-all"
            >
              <div className="w-2 h-2 rounded-full bg-white/10 group-hover:bg-brand-red animate-pulse" />
              Staff Portal Access
            </Link>
          </div>
        </div>
        
        {/* Decorative corner elements */}
        <div className="absolute top-12 left-12 w-24 h-24 border-t border-l border-white/5" />
        <div className="absolute bottom-12 right-12 w-24 h-24 border-b border-r border-white/5" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg selection:bg-brand-red selection:text-white">
      <Toaster 
        position="top-right" 
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
      <OfferBanner 
        active={offerConfig.active} 
        text={offerConfig.text} 
        expiryDate={offerConfig.expiry}
      />
      <Navbar 
        cartCount={cartItems.reduce((s, i) => s + i.quantity, 0)} 
        onCartClick={() => setIsCartOpen(true)} 
        onSignInClick={() => setIsSignInOpen(true)}
      />
      
      <main>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={
              <>
                <LandingOfferPopup 
                  active={offerConfig.active && isOfferPopupOpen}
                  text={offerConfig.text}
                  expiryDate={offerConfig.expiry}
                  product={offerProduct}
                  onClose={() => setIsOfferPopupOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Hero />
                </motion.div>
                <section id="shop" className="py-24 border-y border-dark-border">
                  <div className="max-w-7xl mx-auto px-6">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8"
                    >
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-red mb-4">Featured Drops</p>
                        <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase">THE <span className="italic">ESSENTIALS</span></h2>
                      </div>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                      {products.slice(0, 3).map((product, i) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                        >
                          <ProductCard 
                            product={product} 
                            onAddToCart={addToCart} 
                            onViewDetails={setSelectedProduct}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>
                
                {/* Manifesto Piece */}
                <section className="py-32 bg-dark-surface overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-red/50 to-transparent" />
                  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-brand-red/20 blur-[100px] rounded-full scale-75 group-hover:scale-100 transition-transform duration-1000" />
                      <div className="relative z-10 p-2 md:p-8 overflow-hidden aspect-square flex items-center justify-center">
                        <img 
                          src="/finall_11_logo_manifesto_1778100289332.png"
                          alt="Finall 11 Manifesto"
                          className="w-full h-full object-contain mix-blend-screen brightness-150 contrast-125"
                        />
                      </div>
                    </div>
                    <div>
                       <h3 className="text-4xl md:text-6xl font-display font-black tracking-tighter uppercase mb-8">BEYOND <br/><span className="text-brand-red">THE FABRIC</span></h3>
                       <p className="text-white/60 text-sm leading-relaxed mb-12 uppercase tracking-widest font-bold">
                         FINALL 11 is more than a label. It's a high-performance archive built for those who move through the urban landscape with tactical intent.
                       </p>
                    </div>
                  </div>
                </section>
              </>
            } />
            <Route path="/products" element={<ProductList onAddToCart={addToCart} onViewDetails={setSelectedProduct} products={products} />} />
            <Route path="/collections" element={<CollectionsPage products={products} />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer />
        <ContactWidgets />
        <CookieConsent />
        
        <Cart 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          items={cartItems}
          onUpdateQuantity={(id, size, q) => {
            const cartKey = `${id}-${size}`;
            setCartItems(prev => prev.map(item => 
              `${item.id}-${item.selectedSize}` === cartKey ? { ...item, quantity: q } : item
            ));
          }}
          onRemove={(id, size) => {
            const cartKey = `${id}-${size}`;
            setCartItems(prev => prev.filter(item => `${item.id}-${item.selectedSize}` !== cartKey));
          }}
          isAuthenticated={!!user}
          onCheckout={async () => {
            if (!user) {
              setIsSignInOpen(true);
              toast.error('SIGN IN REQUIRED', { description: 'Please sign in to complete your order.' });
            } else {
              try {
                // Deduct stock
                for (const item of cartItems) {
                  const currentStock = item.stock || 0;
                  const newStock = Math.max(0, currentStock - item.quantity);
                  await supabase.from('products').update({ stock: newStock }).eq('id', item.id);
                }
                // Build WhatsApp order message
                const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
                const lines = cartItems.map(i => `• ${i.name} (Size: ${i.selectedSize || 'N/A'}) x${i.quantity} — KES ${(i.price * i.quantity).toLocaleString()}`).join('%0A');
                const msg = `Hello FINALL 11!%0A%0AI'd like to place an order:%0A%0A${lines}%0A%0A*TOTAL: KES ${total.toLocaleString()}*%0A%0AName: ${user.user_metadata?.full_name || ''}%0AEmail: ${user.email}`;
                setCartItems([]);
                setIsCartOpen(false);
                window.open(`https://wa.me/254794900546?text=${msg}`, '_blank');
                toast.success('ORDER SENT TO WHATSAPP', { description: 'Complete your order in the chat.' });
              } catch (err: any) {
                toast.error('CHECKOUT FAILED', { description: err.message });
              }
            }
          }}
        />

        <SignIn 
          isOpen={isSignInOpen} 
          onClose={() => setIsSignInOpen(false)} 
        />

        <ProductDetailsModal 
          product={selectedProduct}
          allProducts={products}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
          onAddReview={handleReviewSubmit}
          isAuthenticated={!!user}
          onViewDetails={setSelectedProduct}
        />
      </Suspense>
    </div>
  );
}
