export interface Review {
  id: string;
  user: string;
  userId?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  details: string[];
  material: string;
  reviews: Review[];
  sizes: string[];
  isUpcoming?: boolean;
  promoLabel?: string;
  createdAt?: any;
}

export interface Inquiry {
  id?: string;
  userId: string;
  name: string;
  email: string;
  message: string;
  timestamp: any;
  response?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export const PRODUCTS: Product[] = [
  {
    id: 'h1',
    name: 'F 11 ONYX HOODIE',
    category: 'Hoodies',
    price: 11500,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
    description: 'Ultra-heavy 450gsm fleece. Minimalist F 11 branding on chest.',
    sizes: ['S', 'M', 'L', 'XL'],
    details: [
      'Heavyweight 450gsm brushback fleece',
      'Dropped shoulder architectural fit',
      'Double-lined hood with no drawstrings for a cleaner look',
      'Ribbed cuffs and hem'
    ],
    material: '80% Organic Cotton, 20% Recycled Polyester',
    reviews: [
      { id: 'r1', user: 'Alex M.', rating: 5, comment: 'The weight of this hoodie is incredible. Best fit I own.', date: '2 days ago' },
      { id: 'r2', user: 'Jordan T.', rating: 4, comment: 'Premium feel, definitely worth the price.', date: '1 week ago' }
    ]
  },
  {
    id: 's1',
    name: 'F 11 STEEL PANTS',
    category: 'Bottoms',
    price: 9500,
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=800',
    description: 'Relaxed fit with tech-cuff details. Signature 11 embroidery.',
    sizes: ['M', 'L', 'XL'],
    details: [
      'Relaxed straight-leg silhouette',
      'Elasticated waistband with hidden internal drawstring',
      'Side-seam pockets and single back pocket',
      'Signature F 11 tonal embroidery'
    ],
    material: '100% Heavyweight Cotton Jersey',
    reviews: [
      { id: 'r3', user: 'Sarah L.', rating: 5, comment: 'Finally found sweatpants that actually look professional.', date: '3 days ago' }
    ]
  },
  {
    id: 't1',
    name: 'F 11 CORE TEE',
    category: 'T-Shirts',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
    description: 'Drop shoulder, premium cotton blend. Back F 11 logo.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    details: [
      '280gsm thick-cut cotton',
      'Boxy oversized fit',
      'Reinforced neck ribbing',
      'High-density screen print on reverse'
    ],
    material: '100% Premium Combed Cotton',
    reviews: [
      { id: 'r4', user: 'Marcus K.', rating: 5, comment: 'Perfect boxy fit. Not too long.', date: '5 days ago' }
    ]
  },
  {
    id: 'm1',
    name: 'F 11 MARVIN BEANIE',
    category: 'Accessories',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=800',
    description: 'Deep rib-knit beanie with signature F 11 red tag.',
    sizes: ['ONE SIZE'],
    details: [
      'Traditional marvin/dockworker style',
      'Heavy rib-knit construction',
      'Adjustable fold-over cuff',
      'Signature red F 11 woven label'
    ],
    material: '100% Merino Wool Blend',
    reviews: [
      { id: 'r5', user: 'Danny G.', rating: 4, comment: 'Warm and sits perfectly on the head.', date: '2 weeks ago' }
    ]
  },
  {
    id: 'h2',
    name: 'F 11 CRIMSON HOOD',
    category: 'Hoodies',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
    description: 'Limited edition red overdrive wash with 11 insignias.',
    sizes: ['L', 'XL'],
    details: [
      'Specialty acid-wash crimson finish',
      'Hand-distressed edges',
      'Heavyweight 500gsm fleece',
      'Individually numbered limited run'
    ],
    material: '100% Distressed Cotton',
    reviews: []
  },
  {
    id: 't2',
    name: 'F 11 ZERO TEE',
    category: 'T-Shirts',
    price: 3900,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800',
    description: 'Oversized fit with subtle F 11 back embroidery.',
    sizes: ['S', 'M', 'L'],
    details: [
      'Lightweight but structured 220gsm cotton',
      'Subtle tonal embroidery on back neck',
      'Clean hem finish',
      'Minimalist label to bottom left'
    ],
    material: '100% Organic Pima Cotton',
    reviews: [
      { id: 'r6', user: 'Elena V.', rating: 5, comment: 'The quality of the cotton is so soft.', date: '1 month ago' }
    ]
  },
  {
    id: 'b1',
    name: 'F 11 UTILITY BAG',
    category: 'Accessories',
    price: 14500,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
    description: 'Tactical ballistic nylon with modular strap system.',
    sizes: ['ONE SIZE'],
    details: [
      '1000D Ballistic Cordura construction',
      'Waterproof internal lining',
      'Fidlock magnetic buckle system',
      'Modular F 11 webbing attachments'
    ],
    material: '100% Ballistic Nylon',
    reviews: []
  },
  {
    id: 'c1',
    name: 'F 11 ALPHA CAP',
    category: 'Accessories',
    price: 5500,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800',
    description: 'Structured 6-panel design with rubberized 11 logo.',
    sizes: ['ONE SIZE'],
    details: [
      'Weather-resistant tech fabric',
      'Internal moisture-wicking band',
      'Laser-cut side ventilation',
      'Adjustable toggle clasp'
    ],
    material: 'Synthetic Performance Blend',
    reviews: []
  },
  {
    id: 's2',
    name: 'F 11 HEAVY SWEATS',
    category: 'Bottoms',
    price: 11000,
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&q=80&w=800',
    description: '500gsm oversized sweats with articulation paneling.',
    sizes: ['S', 'M', 'L', 'XL'],
    details: [
      'Ultra-heavyweight 500gsm fleece',
      'Reinforced knee articulation',
      'Invisible zip utility pockets',
      'Oversized stacking fit at ankles'
    ],
    material: '100% Heavy Cotton Fleece',
    reviews: []
  },
  {
    id: 'g1',
    name: 'F 11 PRO-TECH TANK',
    category: 'T-Shirts',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    description: 'Gym-specific performance tank with heat ventilation.',
    sizes: ['S', 'M', 'L', 'XL'],
    details: [
      'Moisture-wicking silver-ion fabric',
      'Laser-perforated back panel',
      'Flat-lock anti-friction seams',
      'High-visibility reflective 11 tag'
    ],
    material: 'Nylon / Spandex Performance Blend',
    reviews: []
  }
];
