import React from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy, getDoc, setDoc } from 'firebase/firestore';
import { Product, Inquiry } from '../types';
import { motion } from 'motion/react';
import { Plus, Trash2, Tag, Calendar, Mail, MessageSquare, Save, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const AdminDashboard: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [inquiries, setInquiries] = React.useState<Inquiry[]>([]);
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'inventory' | 'inquiries' | 'system'>('inventory');

  // Form states for new product
  const [newProduct, setNewProduct] = React.useState<Partial<Product>>({
    name: '',
    price: 0,
    category: 'Hoodies',
    image: '',
    description: '',
    details: [],
    material: '',
    sizes: ['S', 'M', 'L', 'XL'],
    reviews: []
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit for Firestore strings
        toast.error('FILE TOO LARGE', { description: 'Max size is 2MB' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const pSnap = await getDocs(collection(db, 'products'));
      const pList = pSnap.docs.map(d => ({ ...d.data(), id: d.id } as Product));
      setProducts(pList);

      const iSnap = await getDocs(query(collection(db, 'inquiries'), orderBy('timestamp', 'desc')));
      const iList = iSnap.docs.map(d => ({ ...d.data(), id: d.id } as Inquiry));
      setInquiries(iList);

      const cSnap = await getDoc(doc(db, 'app_config', 'main'));
      if (cSnap.exists()) {
        setMaintenanceMode(cSnap.data().maintenanceMode);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'admin_data');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'products'), {
        ...newProduct,
        createdAt: serverTimestamp()
      });
      toast.success('PRODUCT ADDED');
      fetchData();
      setNewProduct({
        name: '', price: 0, category: 'Hoodies', image: '', description: '', details: [], material: '', sizes: ['S', 'M', 'L', 'XL'], reviews: []
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'products');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('EXTERMINATE PRODUCT?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      toast.success('PRODUCT REMOVED');
      fetchData();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  const handleUpdatePromo = async (id: string, label: string) => {
    try {
      await updateDoc(doc(db, 'products', id), { promoLabel: label });
      toast.success('PROMO UPDATED');
      fetchData();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
    }
  };

  const handleToggleUpcoming = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'products', id), { isUpcoming: !current });
      toast.success(current ? 'REMOVED FROM UPCOMING' : 'SET AS UPCOMING');
      fetchData();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="text-brand-red font-display font-black text-4xl animate-pulse">11_SYSTEM_LOADING</div>
    </div>
  );

  return (
    <div className="pt-32 pb-24 min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div>
            <h1 className="text-6xl font-display font-black tracking-tighter uppercase leading-none">COMMAND <span className="text-brand-red italic">CENTER</span></h1>
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/40 mt-4">Auth Level: Administrator // Studio Node 11</p>
          </div>
          
          <div className="flex gap-4">
            {(['inventory', 'inquiries', 'system'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest border transition-all ${
                  activeTab === tab ? 'bg-brand-red border-brand-red text-white' : 'border-dark-border text-white/20 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Add Product Form */}
            <div className="lg:col-span-1 p-8 bg-dark-surface border border-dark-border">
              <h3 className="text-lg font-display font-black uppercase tracking-tight mb-8 flex items-center gap-2">
                <Plus size={20} className="text-brand-red" /> New Inventory
              </h3>
              <form onSubmit={handleAddProduct} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-white/40 block mb-2">Item Name</label>
                  <input 
                    type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full bg-black border border-dark-border p-3 text-xs font-bold uppercase tracking-widest focus:border-brand-red outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-white/40 block mb-2">Price (KES)</label>
                    <input 
                      type="number" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                      className="w-full bg-black border border-dark-border p-3 text-xs font-bold uppercase tracking-widest focus:border-brand-red outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-white/40 block mb-2">Category</label>
                    <select 
                      value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full bg-black border border-dark-border p-3 text-xs font-bold uppercase tracking-widest focus:border-brand-red outline-none appearance-none"
                    >
                      <option>Hoodies</option>
                      <option>T-Shirts</option>
                      <option>Bottoms</option>
                      <option>Accessories</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-white/40 block mb-2">Product Image (Upload or URL)</label>
                  <div className="flex flex-col gap-4">
                    {newProduct.image && (
                      <div className="w-full aspect-square border border-dark-border overflow-hidden bg-black">
                        <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <label className="w-full bg-dark-border border border-dashed border-white/10 p-6 text-center cursor-pointer hover:border-brand-red transition-colors group">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white">Upload Asset</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="OR PASTE URL..."
                      value={newProduct.image} 
                      onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                      className="w-full bg-black border border-dark-border p-3 text-xs font-bold uppercase tracking-widest focus:border-brand-red outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-white/40 block mb-2">Brief Intel</label>
                  <textarea 
                    value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full bg-black border border-dark-border p-3 text-xs font-bold uppercase tracking-widest focus:border-brand-red outline-none min-h-[100px] resize-none"
                  />
                </div>
                <button type="submit" className="w-full bg-white text-black py-4 text-[10px] font-black uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all">
                  Initialize Drop
                </button>
              </form>
            </div>

            {/* Product List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map(p => (
                  <div key={p.id} className="p-6 bg-dark-surface border border-dark-border group hover:border-white/20 transition-all flex gap-4">
                    <img src={p.image} className="w-20 h-20 object-cover grayscale brightness-50 group-hover:grayscale-0 transition-all" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-xs font-black uppercase tracking-widest">{p.name}</h4>
                        <button onClick={() => handleDeleteProduct(p.id)} className="text-white/10 hover:text-brand-red transition-colors"><Trash2 size={14}/></button>
                      </div>
                      <p className="text-[10px] font-bold text-white/20 uppercase mb-4">KES {p.price.toLocaleString()}</p>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleToggleUpcoming(p.id, p.isUpcoming || false)}
                          className={`text-[8px] px-2 py-1 uppercase font-black tracking-widest border ${p.isUpcoming ? 'bg-brand-red text-white border-brand-red' : 'border-white/10 text-white/20'}`}
                        >
                          Upcoming
                        </button>
                        <button 
                          onClick={() => {
                            const l = prompt('PROMO LABEL:', p.promoLabel || '');
                            if (l !== null) handleUpdatePromo(p.id, l);
                          }}
                          className="text-[8px] px-2 py-1 uppercase font-black tracking-widest border border-white/10 text-white/20 hover:text-white hover:border-white"
                        >
                          Promo
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            {inquiries.length === 0 ? (
              <div className="py-24 text-center border border-dashed border-dark-border">
                <p className="text-[10px] uppercase font-black text-white/20 tracking-widest italic">Silent Communications</p>
              </div>
            ) : (
              inquiries.map(i => (
                <div key={i.id} className="p-8 bg-dark-surface border border-dark-border">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-tight text-brand-red mb-1">{i.name}</h4>
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{i.email}</p>
                    </div>
                    <span className="text-[10px] font-bold text-white/10 uppercase tracking-widest font-mono">{i.timestamp}</span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed italic mb-8">"{i.message}"</p>
                  
                  {i.response ? (
                    <div className="p-4 bg-black border border-brand-red/20">
                      <p className="text-[8px] font-black uppercase tracking-widest text-brand-red mb-2 underline">Your Intel</p>
                      <p className="text-xs text-white/80">{i.response}</p>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        const r = prompt('YOUR RESPONSE:');
                        if (r) {
                             updateDoc(doc(db, 'inquiries', i.id!), { response: r });
                             toast.success('RESPONSE TRANSMITTED');
                             fetchData();
                        }
                      }}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                    >
                      <MessageSquare size={12} /> Respond to Inquiry
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'system' && (
          <div className="max-w-2xl bg-dark-surface border border-dark-border p-12">
             <h3 className="text-lg font-display font-black uppercase tracking-tight mb-12 flex items-center gap-2">
                <AlertCircle size={24} className="text-brand-red animate-pulse" /> System Protocols
              </h3>
              
              <div className="space-y-12">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight mb-2">Deployment Lockdown</h4>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Restrict citizen access during node updates</p>
                  </div>
                  <button 
                  onClick={async () => {
                    const snap = await getDoc(doc(db, 'app_config', 'main'));
                    const current = snap.exists() ? snap.data().maintenanceMode : false;
                    await setDoc(doc(db, 'app_config', 'main'), { maintenanceMode: !current }, { merge: true });
                    setMaintenanceMode(!current);
                    toast.success(!current ? 'SYSTEM LOCKED' : 'SYSTEM ONLINE');
                  }}
                  className={`w-16 h-8 relative rounded-full transition-all border ${
                    maintenanceMode ? 'bg-brand-red border-brand-red' : 'bg-dark-border border-white/5'
                  }`}
                  >
                    <motion.div 
                      animate={{ x: maintenanceMode ? 32 : 4 }}
                      className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg"
                    />
                  </button>
                </div>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};
