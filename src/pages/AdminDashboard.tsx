import React from 'react';
import { supabase } from '../lib/supabase';
import { Product, Inquiry } from '../types';
import { motion } from 'motion/react';
import { Plus, Trash2, Tag, Calendar, Mail, MessageSquare, Save, X, AlertCircle, CheckCircle2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const AdminDashboard: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [inquiries, setInquiries] = React.useState<Inquiry[]>([]);
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);
  const [offerConfig, setOfferConfig] = React.useState({ active: false, text: '', expiry: '', product_id: '' });
  const [loading, setLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'inventory' | 'inquiries' | 'subscribers' | 'system'>('inventory');
  const [subscribers, setSubscribers] = React.useState<{id: number, email: string, created_at: string}[]>([]);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  // Form states for new product
  const [newProduct, setNewProduct] = React.useState<Partial<Product>>({
    name: '',
    price: 0,
    category: 'Hoodies',
    image: '',
    description: '',
    details: [],
    material: '',
    sizes: [],
    reviews: []
  });
  const [detailInput, setDetailInput] = React.useState('');

  const addDetail = () => {
    if (detailInput.trim()) {
      setNewProduct(prev => ({
        ...prev,
        details: [...(prev.details || []), detailInput.trim()]
      }));
      setDetailInput('');
    }
  };

  const removeDetail = (index: number) => {
    setNewProduct(prev => ({
      ...prev,
      details: prev.details?.filter((_, i) => i !== index)
    }));
  };

  const toggleSize = (size: string) => {
    setNewProduct(prev => {
      const currentSizes = prev.sizes || [];
      const newSizes = currentSizes.includes(size)
        ? currentSizes.filter(s => s !== size)
        : [...currentSizes, size];
      return { ...prev, sizes: newSizes };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        toast.error('ASSET TOO HEAVY', { 
          description: 'Max size is 1MB. High-res images break system calibration.' 
        });
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
      const [
        { data: pList, error: pErr },
        { data: iList, error: iErr },
        { data: sList, error: sErr },
        { data: config }
      ] = await Promise.all([
        supabase.from('products').select('id, name, price, category, description, material, sizes, details, is_upcoming, promo_label').order('created_at', { ascending: false }),
        supabase.from('inquiries').select('*').order('timestamp', { ascending: false }),
        supabase.from('newsletter_subs').select('*').order('created_at', { ascending: false }),
        supabase.from('app_config').select('*').eq('id', 'main').single()
      ]);

      if (pErr) throw pErr;
      if (iErr) throw iErr;
      if (sErr) throw sErr;

      setProducts(pList as Product[]);
      setInquiries(iList as Inquiry[]);
      setSubscribers(sList || []);
      if (config) {
        setMaintenanceMode(config.maintenance_mode);
        setOfferConfig({
          active: config.offer_active || false,
          text: config.offer_text || '',
          expiry: config.offer_expiry || '',
          product_id: config.offer_product_id || ''
        });
      }
    } catch (error: any) {
      toast.error('FETCH FAILED', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.image) {
      toast.error('MISSING ASSET');
      return;
    }
    if ((newProduct.sizes?.length || 0) === 0) {
      toast.error('SIZE SELECTION REQUIRED');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        const { error } = await supabase.from('products').update(newProduct).eq('id', editingId);
        if (error) throw error;
        toast.success('PRODUCT UPDATED');
      } else {
        const { error } = await supabase.from('products').insert([newProduct]);
        if (error) throw error;
        toast.success('PRODUCT ADDED');
      }
      
      fetchData();
      setNewProduct({
        name: '', price: 0, category: 'Hoodies', image: '', description: '', details: [], material: '', sizes: [], reviews: [], is_upcoming: false, release_date: ''
      });
      setEditingId(null);
    } catch (error: any) {
      toast.error(editingId ? 'UPDATE FAILED' : 'CREATE FAILED', { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingId(product.id);
    setNewProduct({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      description: product.description,
      details: product.details,
      material: product.material,
      sizes: product.sizes,
      is_upcoming: product.is_upcoming,
      release_date: product.release_date,
      promo_label: product.promo_label
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id: string) => {
    const productToDelete = products.find(p => p.id === id);
    if (!productToDelete) return;

    if (!confirm(`ERASE ${productToDelete.name} FROM ARCHIVE?`)) return;
    
    // Optimistic Update
    const previousProducts = [...products];
    setProducts(prev => prev.filter(p => p.id !== id));

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast.success('ASSET ERASED', {
        description: `${productToDelete.name} has been purged from node 11.`,
        action: {
          label: 'RESTORE',
          onClick: async () => {
            try {
              const { id, ...rest } = productToDelete;
              const { error } = await supabase.from('products').insert([rest]);
              if (error) throw error;
              toast.success('ASSET RESTORED');
              fetchData();
            } catch (err: any) {
              toast.error('RESTORE FAILED', { description: err.message });
            }
          }
        }
      });
    } catch (error: any) {
      setProducts(previousProducts); // Rollback
      toast.error('PURGE FAILED', { description: error.message });
    }
  };

  const [promoEditing, setPromoEditing] = React.useState<string | null>(null);
  const [promoInput, setPromoInput] = React.useState('');
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);
  const [replyText, setReplyText] = React.useState('');

  const handleUpdatePromo = async (id: string, label: string) => {
    const previousProducts = [...products];
    setProducts(prev => prev.map(p => p.id === id ? { ...p, promo_label: label } : p));
    setPromoEditing(null);

    try {
      const { error } = await supabase.from('products').update({ promo_label: label }).eq('id', id);
      if (error) throw error;
      toast.success('PROMO UPDATED');
    } catch (error: any) {
      setProducts(previousProducts);
      toast.error('UPDATE FAILED', { description: error.message });
    }
  };

  const handleReplySubmit = async (id: string) => {
    if (!replyText.trim()) return;
    try {
      const { error } = await supabase.from('inquiries').update({ response: replyText }).eq('id', id);
      if (error) throw error;
      toast.success('RESPONSE TRANSMITTED');
      setReplyingTo(null);
      setReplyText('');
      fetchData();
    } catch (error: any) {
      toast.error('TRANSMISSION FAILED', { description: error.message });
    }
  };

  const handleToggleUpcoming = async (id: string, current: boolean) => {
    const previousProducts = [...products];
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_upcoming: !current } : p));

    try {
      const { error } = await supabase.from('products').update({ is_upcoming: !current }).eq('id', id);
      if (error) throw error;
      toast.success(current ? 'REMOVED FROM UPCOMING' : 'SET AS UPCOMING');
    } catch (error: any) {
      setProducts(previousProducts);
      toast.error('UPDATE FAILED', { description: error.message });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="pt-32 pb-24 min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div>
            <h1 className="text-6xl font-display font-black tracking-tighter uppercase leading-none">DASHBOARD <span className="text-brand-red italic">11</span></h1>
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/40 mt-4">Auth Level: Administrator // Studio Node 11</p>
          </div>
          
          <div className="flex gap-4">
            {(['inventory', 'inquiries', 'subscribers', 'system'] as const).map(tab => (
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
            <div className="lg:col-span-1 p-8 bg-dark-surface border border-dark-border h-fit lg:sticky lg:top-32">
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
                  <label className="text-[10px] font-black uppercase text-white/40 block mb-2">Fabric / Material</label>
                  <input 
                    type="text" required value={newProduct.material} onChange={e => setNewProduct({...newProduct, material: e.target.value})}
                    placeholder="E.G. 100% ORGANIC COTTON"
                    className="w-full bg-black border border-dark-border p-3 text-xs font-bold uppercase tracking-widest focus:border-brand-red outline-none placeholder:text-white/40"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-white/40 block mb-2">Size Run</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['S', 'M', 'L', 'XL', 'XXL', 'ONE SIZE'].map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`py-2 text-[10px] font-black border transition-all ${
                          newProduct.sizes?.includes(size) ? 'bg-brand-red border-brand-red text-white' : 'border-dark-border text-white/20'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-white/40 block mb-2">Product Specifications</label>
                  <div className="flex gap-2 mb-3">
                    <input 
                      type="text" value={detailInput} onChange={e => setDetailInput(e.target.value)}
                      placeholder="E.G. OVERSIZED FIT"
                      className="flex-1 bg-black border border-dark-border p-3 text-xs font-bold uppercase tracking-widest focus:border-brand-red outline-none placeholder:text-white/40"
                    />
                    <button type="button" onClick={addDetail} className="bg-dark-border px-4 hover:bg-brand-red transition-colors">
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {newProduct.details?.map((detail, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-black border border-dark-border p-2">
                        <span className="text-[9px] font-bold text-white/60 uppercase">{detail}</span>
                        <button type="button" onClick={() => removeDetail(idx)} className="text-white/20 hover:text-brand-red">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-white/40 block mb-2">Visual Asset</label>
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
                  <label className="text-[10px] font-black uppercase text-white/40 block mb-2">Description</label>
                  <textarea 
                    value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full bg-black border border-dark-border p-3 text-xs font-bold uppercase tracking-widest focus:border-brand-red outline-none min-h-[100px] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-white/40 block mb-2">Vault Status</label>
                    <button
                      type="button"
                      onClick={() => setNewProduct({ ...newProduct, is_upcoming: !newProduct.is_upcoming })}
                      className={`w-full py-3 text-[10px] font-black uppercase tracking-widest border transition-all ${
                        newProduct.is_upcoming ? 'bg-brand-red border-brand-red text-white' : 'border-dark-border text-white/40 hover:text-white'
                      }`}
                    >
                      {newProduct.is_upcoming ? 'LOCKED IN VAULT' : 'IMMEDIATE RELEASE'}
                    </button>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-white/40 block mb-2">Unlock Timestamp (Optional)</label>
                    <input 
                      type="datetime-local"
                      value={newProduct.release_date || ''}
                      onChange={e => setNewProduct({...newProduct, release_date: e.target.value})}
                      disabled={!newProduct.is_upcoming}
                      className="w-full bg-black border border-dark-border p-3 text-xs font-bold uppercase tracking-widest focus:border-brand-red outline-none disabled:opacity-30 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full py-4 text-[10px] font-black uppercase tracking-widest transition-all ${
                      isSubmitting 
                      ? 'bg-brand-red/50 text-white animate-pulse cursor-wait' 
                      : 'bg-brand-red text-white hover:bg-brand-red-hover'
                    }`}
                  >
                    {isSubmitting ? 'Loading ..... ' : (editingId ? 'Protocol: Update' : 'Initialize Drop')}
                  </button>
                  {editingId && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setEditingId(null);
                        setNewProduct({
                          name: '', price: 0, category: 'Hoodies', image: '', description: '', details: [], material: '', sizes: [], reviews: [], is_upcoming: false, release_date: ''
                        });
                      }}
                      className="w-full py-2 text-[8px] font-black uppercase tracking-widest text-white/20 hover:text-brand-red transition-all"
                    >
                      Cancel Modification
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Product List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map(p => (
                  <div key={p.id} className="p-6 bg-dark-surface border border-dark-border group hover:border-white/20 transition-all flex gap-4">
                    {p.image ? (
                      <img src={p.image} className="w-20 h-20 object-cover grayscale brightness-50 group-hover:grayscale-0 transition-all" />
                    ) : (
                      <div className="w-20 h-20 bg-black border border-dark-border flex items-center justify-center">
                        <span className="text-[6px] font-black opacity-20 uppercase">NULL_11</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-black uppercase tracking-widest">{p.name}</h4>
                        <button onClick={() => handleDeleteProduct(p.id)} className="text-white/10 hover:text-brand-red transition-colors"><Trash2 size={14}/></button>
                      </div>
                      <p className="text-xs font-bold text-white/20 uppercase mb-4">KES {p.price.toLocaleString()}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => handleToggleUpcoming(p.id, p.is_upcoming || false)}
                          className={`text-[8px] px-2 py-1 uppercase font-black tracking-widest border transition-all ${p.is_upcoming ? 'bg-brand-red text-white border-brand-red' : 'border-white/10 text-white/20'}`}
                        >
                          Upcoming
                        </button>
                        
                        {promoEditing === p.id ? (
                          <div className="flex flex-col gap-2 w-full mt-2 p-3 bg-black border border-brand-red/30">
                            <div className="flex flex-wrap gap-1">
                              {['HOT DROP', 'LIMITED', 'SOLD OUT', 'NEW'].map(tag => (
                                <button 
                                  key={tag}
                                  onClick={() => handleUpdatePromo(p.id, tag)}
                                  className="text-[7px] font-black px-2 py-1 bg-white/5 border border-white/10 hover:border-brand-red hover:text-brand-red transition-all"
                                >
                                  {tag}
                                </button>
                              ))}
                              <button 
                                onClick={() => handleUpdatePromo(p.id, '')}
                                className="text-[7px] font-black px-2 py-1 bg-brand-red/20 text-brand-red border border-brand-red/20"
                              >
                                CLEAR
                              </button>
                            </div>
                            <div className="flex gap-1 mt-1">
                              <input 
                                autoFocus
                                value={promoInput}
                                onChange={e => setPromoInput(e.target.value)}
                                placeholder="CUSTOM..."
                                className="bg-dark-surface border border-dark-border text-[8px] px-2 py-1 flex-1 outline-none focus:border-brand-red"
                                onKeyDown={e => e.key === 'Enter' && handleUpdatePromo(p.id, promoInput)}
                              />
                              <button onClick={() => setPromoEditing(null)} className="text-white/20 hover:text-white"><X size={12}/></button>
                            </div>
                          </div>
                        ) : (
                          <button 
                            onClick={() => {
                              setPromoEditing(p.id);
                              setPromoInput(p.promo_label || '');
                            }}
                            className="text-[8px] px-2 py-1 uppercase font-black tracking-widest border border-white/10 text-white/20 hover:text-white hover:border-white transition-all"
                          >
                            {p.promo_label || 'Add Promo'}
                          </button>
                        )}
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
                      <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{i.email}</p>
                    </div>
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-mono">{i.timestamp}</span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed italic mb-8">"{i.message}"</p>
                  
                  {i.response ? (
                    <div className="p-6 bg-black border border-brand-red/20 mt-4">
                      <p className="text-[8px] font-black uppercase tracking-widest text-brand-red mb-3 underline flex items-center gap-2">
                        <CheckCircle2 size={10} /> Your Response
                      </p>
                      <p className="text-xs text-white/80 italic leading-relaxed">{i.response}</p>
                    </div>
                  ) : (
                    <div className="mt-6">
                      {replyingTo === i.id ? (
                        <div className="space-y-4 p-4 bg-black border border-dark-border animate-in fade-in slide-in-from-top-2">
                          <textarea
                            autoFocus
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            placeholder="DRAFT YOUR RESPONSE..."
                            className="w-full bg-dark-surface border border-dark-border p-3 text-xs font-medium text-white placeholder:text-white/10 outline-none focus:border-brand-red min-h-[100px] resize-none"
                          />
                          <div className="flex justify-end gap-3">
                            <button 
                              onClick={() => setReplyingTo(null)}
                              className="text-[10px] font-black uppercase text-white/20 hover:text-white transition-colors"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => handleReplySubmit(i.id)}
                              className="px-6 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all flex items-center gap-2"
                            >
                              Transmit <Send size={12} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setReplyingTo(i.id);
                            setReplyText('');
                          }}
                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-brand-red transition-all"
                        >
                          <MessageSquare size={14} /> Respond to Inquiry
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'subscribers' && (
          <div className="max-w-4xl space-y-4">
            <h3 className="text-lg font-display font-black uppercase tracking-tight mb-8 flex items-center gap-2">
              <Mail size={20} className="text-brand-red" /> Marketing Collective ({subscribers.length})
            </h3>
            
            {subscribers.length === 0 ? (
              <div className="p-12 border border-dark-border text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20">No active subscribers in the archive.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-1">
                {subscribers.map((s) => (
                  <div key={s.id} className="flex justify-between items-center p-6 bg-dark-surface border border-dark-border group hover:border-brand-red/30 transition-all">
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight text-white mb-1">{s.email}</p>
                      <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Subscriber Node #{s.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{new Date(s.created_at).toLocaleDateString()}</p>
                      <p className="text-[8px] font-black text-brand-red uppercase tracking-widest mt-1">Status: Active</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'system' && (
          <div className="max-w-2xl bg-dark-surface border border-dark-border p-12">
             <h3 className="text-lg font-display font-black uppercase tracking-tight mb-12 flex items-center gap-2">
                <AlertCircle size={24} className="text-brand-red animate-pulse" /> System Protocols
              </h3>
              
              <div className="space-y-12">
                <div className="flex items-center justify-between pb-12 border-b border-white/5">
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight mb-2">Deployment Lockdown</h4>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Restrict citizen access during node updates</p>
                  </div>
                  <button 
                  onClick={async () => {
                    try {
                      const { error } = await supabase.from('app_config').update({ maintenance_mode: !maintenanceMode }).eq('id', 'main');
                      if (error) throw error;
                      setMaintenanceMode(!maintenanceMode);
                      toast.success(!maintenanceMode ? 'SYSTEM LOCKED' : 'SYSTEM ONLINE');
                    } catch (e: any) {
                      toast.error('PROTOCOL FAILED');
                    }
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

                <div className="space-y-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-tight mb-2">Offer Protocol</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">Launch site-wide promotional broadcasts</p>
                    </div>
                    <button 
                      onClick={async () => {
                        try {
                          const { error } = await supabase.from('app_config').update({ offer_active: !offerConfig.active }).eq('id', 'main');
                          if (error) throw error;
                          setOfferConfig(prev => ({ ...prev, active: !prev.active }));
                          toast.success(!offerConfig.active ? 'BROADCAST ACTIVE' : 'BROADCAST TERMINATED');
                        } catch (e: any) {
                          toast.error('PROTOCOL FAILED');
                        }
                      }}
                      className={`w-16 h-8 relative rounded-full transition-all border ${
                        offerConfig.active ? 'bg-brand-red border-brand-red' : 'bg-dark-border border-white/5'
                      }`}
                    >
                      <motion.div 
                        animate={{ x: offerConfig.active ? 32 : 4 }}
                        className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg"
                      />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/20 block mb-2">Offer Message</label>
                      <input 
                        type="text"
                        value={offerConfig.text}
                        onChange={(e) => setOfferConfig(prev => ({ ...prev, text: e.target.value.toUpperCase() }))}
                        className="w-full bg-black border border-white/10 p-4 text-xs font-bold uppercase tracking-widest focus:border-brand-red outline-none transition-all"
                        placeholder="E.G. FLASH DROP: 20% OFF ALL ONYX"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/20 block mb-2">Featured Product</label>
                      <select 
                        value={offerConfig.product_id}
                        onChange={(e) => setOfferConfig(prev => ({ ...prev, product_id: e.target.value }))}
                        className="w-full bg-black border border-white/10 p-4 text-xs font-bold uppercase tracking-widest focus:border-brand-red outline-none transition-all appearance-none"
                      >
                        <option value="">-- SELECT PRODUCT FOR POPUP --</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/20 block mb-2">Termination Timestamp</label>
                      <input 
                        type="datetime-local"
                        value={offerConfig.expiry}
                        onChange={(e) => setOfferConfig(prev => ({ ...prev, expiry: e.target.value }))}
                        className="w-full bg-black border border-white/10 p-4 text-xs font-bold uppercase tracking-widest focus:border-brand-red outline-none transition-all"
                      />
                    </div>

                    <button 
                      onClick={async () => {
                        try {
                          const { error } = await supabase.from('app_config').update({ 
                            offer_text: offerConfig.text,
                            offer_expiry: offerConfig.expiry,
                            offer_product_id: offerConfig.product_id
                          }).eq('id', 'main');
                          if (error) throw error;
                          toast.success('PARAMETERS SYNCED');
                        } catch (e: any) {
                          toast.error('SYNC FAILED', { description: e.message || 'Database rejected the configuration update.' });
                        }
                      }}
                      className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all"
                    >
                      Initialize Parameters
                    </button>
                  </div>
                </div>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};
