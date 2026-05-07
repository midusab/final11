import React from 'react';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS, Product } from '../types';
import { motion } from 'motion/react';
import { Filter, SlidersHorizontal, ChevronDown, Search, X } from 'lucide-react';

interface ProductsPageProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ products, onAddToCart, onViewDetails }) => {
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [maxPrice, setMaxPrice] = React.useState(20000);
  const [selectedSizes, setSelectedSizes] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const filteredProducts = products.filter(p => {
    if (p.is_upcoming) return false;
    const categoryMatch = activeCategory === 'All' || p.category === activeCategory;
    const priceMatch = p.price <= maxPrice;
    const sizeMatch = selectedSizes.length === 0 || p.sizes.some(s => selectedSizes.includes(s));
    const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && priceMatch && sizeMatch && searchMatch;
  });

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase leading-none">
              11 - <span className="text-brand-red italic">SHOP</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/40 mt-4">
              Finall 11 Studio // Inventory v1.0
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-dark-surface border border-dark-border px-4 py-3 rounded-sm">
            <SlidersHorizontal size={16} className="text-brand-red" />
            <span className="text-[10px] font-black uppercase tracking-widest">Filters</span>
            <div className="h-4 w-px bg-white/10 mx-2" />
            <div className="flex items-center gap-2 cursor-pointer hover:text-brand-red transition-colors">
              <span className="text-[10px] font-black uppercase tracking-widest">Price Low-High</span>
              <ChevronDown size={12} />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters - Jumia Inspired */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-10">
            <div>
              <h4 className="text-[10px] uppercase font-black tracking-[0.2em] text-brand-red mb-6 flex items-center gap-2">
                <Search size={12} />
                Search Vault
              </h4>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="ID: HOODIE_01..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-dark-surface border border-dark-border px-4 py-3 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-brand-red transition-colors placeholder:text-white/10"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] uppercase font-black tracking-[0.2em] text-brand-red mb-6 flex items-center gap-2">
                <Filter size={12} />
                Categories
              </h4>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {['All', 'Hoodies', 'T-Shirts', 'Bottoms', 'Intimates (Men)', 'Intimates (Women)', 'Accessories'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-xs uppercase font-bold tracking-widest px-4 py-3 text-left border transition-all ${
                      activeCategory === cat 
                      ? 'bg-brand-red border-brand-red text-white' 
                      : 'bg-dark-surface border-dark-border text-white/40 hover:border-white/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] uppercase font-black tracking-[0.2em] text-brand-red mb-6 flex items-center gap-2">
                <Filter size={12} />
                Price Range
              </h4>
              <div className="px-2">
                <input 
                  type="range" 
                  min="0" 
                  max="20000" 
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full accent-brand-red mb-4"
                />
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40 font-mono">
                  <span>KES 0</span>
                  <span className="text-white text-xs">KES {maxPrice.toLocaleString()}</span>
                  <span>KES 20K</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] uppercase font-black tracking-[0.2em] text-brand-red mb-6 flex items-center gap-2">
                <Filter size={12} />
                Size
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {['S', 'M', 'L', 'XL', 'XXL', 'ONE SIZE'].map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`text-[10px] font-black uppercase tracking-widest p-3 border transition-all ${
                      selectedSizes.includes(size)
                      ? 'bg-brand-red border-brand-red text-white'
                      : 'bg-dark-surface border-dark-border text-white/40 hover:border-white/20'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={onAddToCart} 
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="py-24 text-center border border-dashed border-dark-border">
                <p className="text-[10px] uppercase font-black tracking-[0.3em] text-white/20">No items found in this vault</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
