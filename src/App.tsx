import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { SignIn } from './components/SignIn';
import { Footer } from './components/Footer';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import { PRODUCTS, Product, CartItem, Review } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';

// Lazy Loaded Pages
const ProductList = lazy(() => import('./pages/ProductsPage').then(m => ({ default: m.ProductsPage })));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage').then(m => ({ default: m.CollectionsPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

export default function App() {
  const { user, isAdmin, loading: isAuthLoading } = useAuth();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isSignInOpen, setIsSignInOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [isProductsLoading, setIsProductsLoading] = React.useState(true);
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [
          { data: productData, error: productError },
          { data: configData }
        ] = await Promise.all([
          supabase.from('products').select('*').order('created_at', { ascending: false }),
          supabase.from('app_config').select('*').eq('id', 'main').single()
        ]);

        if (productError) {
          console.error("Error fetching products:", productError);
        } else if (productData) {
          if (productData.length === 0 && PRODUCTS.length > 0 && isAdmin) {
            const seedData = PRODUCTS.map(({ id, ...rest }) => ({ ...rest }));
            await supabase.from('products').insert(seedData);
            const { data: refetched } = await supabase.from('products').select('*').order('created_at', { ascending: false });
            if (refetched) setProducts(refetched as Product[]);
          } else {
            setProducts(productData as Product[]);
          }
        }

        if (configData) setMaintenanceMode(configData.maintenance_mode);
      } catch (e) {
        console.warn('System data fetch failed:', e);
      } finally {
        setIsProductsLoading(false);
      }
    };

    loadData();

    const channelName = `products-realtime-${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => loadData()
      )
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
      const updatedReviews = [...(product?.reviews || []), newReview];
      const { error } = await supabase.from('products').update({ reviews: updatedReviews }).eq('id', productId);
      if (error) throw error;
      toast.success('REVIEW POSTED');
    } catch (error: any) {
      toast.error('SUBMISSION FAILED', { description: error.message });
    }
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
    toast.success('ADDED TO BAG', { description: product.name });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  if (isAuthLoading || isProductsLoading) return <LoadingSpinner />;

  if (maintenanceMode && !isAdmin && location.pathname !== '/admin') {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-12 text-center">
        <div className="max-w-md">
          <div className="text-6xl font-display font-black text-brand-red mb-8 animate-pulse">11_LOCKDOWN</div>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-white">System Calibration</h2>
          <p className="text-white/40 uppercase text-[10px] tracking-widest leading-loose">
            The node is currently undergoing updates. Access is restricted.
          </p>
        </div>
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
            <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onUpdateQuantity={(id, q) => setCartItems(prev => prev.map(i => i.id === id ? {...i, quantity: q} : i))}
        onRemove={removeFromCart}
        isAuthenticated={!!user}
        onCheckout={() => {
          if (!user) {
            setIsSignInOpen(true);
            toast.error('SIGN IN REQUIRED', { description: 'Please sign in to complete your order.' });
          } else {
            toast.success('PROCEEDING TO CHECKOUT', { description: 'Redirecting to payment gateway...' });
          }
        }}
      />

      <SignIn 
        isOpen={isSignInOpen} 
        onClose={() => setIsSignInOpen(false)} 
      />

      <ProductDetailsModal 
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
        onAddReview={handleReviewSubmit}
        isAuthenticated={!!user}
      />
    </div>
  );
}
