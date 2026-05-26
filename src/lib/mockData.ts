export interface MockCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  bgOpacity: string;
}

export interface MockProduct {
  id: string;
  title: string;
  slug: string;
  brand: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  categoryId: string;
  stock: number;
  featured: boolean;
  variants: {
    colors: string[];
    sizes: string[];
  };
  rating: number;
  reviewCount: number;
}

export interface MockReview {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
export interface MockCoupon {
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  minOrder: number;
}

export interface MockOrder {
  id: string;
  items: any[];
  address: string;
  phone: string;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  status: string;
  createdAt: string;
}

export const MOCK_CATEGORIES: MockCategory[] = [
  { id: "cat_1", name: "Living Room", slug: "living", icon: "Sofa", bgOpacity: "bg-rose-50/70 text-petal-rose" },
  { id: "cat_2", name: "Kitchen", slug: "kitchen", icon: "UtensilsCrossed", bgOpacity: "bg-purple-50/70 text-petal-lavender" },
  { id: "cat_3", name: "Apothecary", slug: "apothecary", icon: "Droplet", bgOpacity: "bg-sky-50/70 text-petal-sky" },
  { id: "cat_4", name: "Lighting", slug: "lighting", icon: "Sparkles", bgOpacity: "bg-emerald-50/70 text-petal-sage" },
  { id: "cat_5", name: "Bedroom", slug: "bedroom", icon: "BedDouble", bgOpacity: "bg-rose-50/70 text-petal-rose" },
  { id: "cat_6", name: "Dining & Bar", slug: "dining", icon: "GlassWater", bgOpacity: "bg-purple-50/70 text-petal-lavender" },
];

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: "prod_1",
    title: "Muted Clay Tea Set",
    slug: "muted-clay-tea-set",
    brand: "Ochre Home",
    description: "Individually hand-thrown ceramic tea set finished in a warm, textured sandstone glaze. Features a brass wire handle and includes four matching tea cups. Designed for slow afternoons and intentional living.",
    price: 72.00,
    comparePrice: 90.00,
    images: [
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&q=80&w=800"
    ],
    categoryId: "cat_1",
    stock: 12,
    featured: true,
    variants: {
      colors: ["#D6C5B3", "#E3D3C4"],
      sizes: ["Standard"]
    },
    rating: 4.8,
    reviewCount: 34
  },
  {
    id: "prod_2",
    title: "Woven Sage Lounge Blanket",
    slug: "woven-sage-blanket",
    brand: "Loom & Thread",
    description: "An incredibly soft, medium-weight waffle-weave throw blanket in organic Turkish cotton. Reversible design with twisted fringe detail, washed for ultimate comfort and draping.",
    price: 58.00,
    images: [
      "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800"
    ],
    categoryId: "cat_5",
    stock: 24,
    featured: true,
    variants: {
      colors: ["#A2B69E", "#D6C5B3"],
      sizes: ["Standard", "Large"]
    },
    rating: 4.9,
    reviewCount: 52
  },
  {
    id: "prod_3",
    title: "No. 4 Lavender Sage Candle",
    slug: "lavender-sage-candle",
    brand: "Aether Candle",
    description: "Hand-poured in a subtle cream ceramic vessel. Scented with pure essential oils of French lavender, white sage, and warm cedarwood. Burns with a clean, wood-wick crackle.",
    price: 24.00,
    comparePrice: 32.00,
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1602872030219-aa104ffae320?auto=format&fit=crop&q=80&w=800"
    ],
    categoryId: "cat_3",
    stock: 45,
    featured: true,
    variants: {
      colors: ["#FAF8F5"],
      sizes: ["8 oz", "12 oz"]
    },
    rating: 4.7,
    reviewCount: 120
  },
  {
    id: "prod_4",
    title: "Fluted Amber Glass Vase",
    slug: "fluted-amber-vase",
    brand: "Form & Void",
    description: "Mouthblown tinted glass vase with a delicate ribbed texture. Captures natural sunlight beautifully, creating soft warm highlights on resting surfaces. Beautiful with dried florals or a fresh garden stem.",
    price: 36.00,
    images: [
      "https://images.unsplash.com/photo-1581781870027-04212e231e96?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=800"
    ],
    categoryId: "cat_1",
    stock: 18,
    featured: true,
    variants: {
      colors: ["#D97706", "#38BDF8"],
      sizes: ["Small", "Medium"]
    },
    rating: 4.6,
    reviewCount: 19
  },
  {
    id: "prod_5",
    title: "Bouclé Curve Cushion",
    slug: "boucle-curve-cushion",
    brand: "Nest Studio",
    description: "Stunning sculptural pillow wrapped in cozy cream bouclé. The fluid circular layout adds visual texture and dimension to any neutral armchair or bed arrangement. Filled with lightweight hypoallergenic down.",
    price: 64.00,
    comparePrice: 78.00,
    images: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800"
    ],
    categoryId: "cat_1",
    stock: 9,
    featured: false,
    variants: {
      colors: ["#FDFBF7", "#E3D3C4"],
      sizes: ["18\" x 18\""]
    },
    rating: 4.5,
    reviewCount: 11
  },
  {
    id: "prod_6",
    title: "Fluted Water Glasses (Set of 4)",
    slug: "fluted-water-glasses",
    brand: "Ochre Home",
    description: "Ultra-thin, elegant water glasses featuring a fine ribbed texture. Durable borosilicate glass construction that is thermal shock resistant. Perfect for hosting or elevated daily hydration.",
    price: 42.00,
    images: [
      "https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1574926053821-79c5e338a933?auto=format&fit=crop&q=80&w=800"
    ],
    categoryId: "cat_6",
    stock: 30,
    featured: false,
    variants: {
      colors: ["#FFFFFF"],
      sizes: ["Set of 4"]
    },
    rating: 4.9,
    reviewCount: 41
  },
  {
    id: "prod_7",
    title: "Luna Curved Brass Lamp",
    slug: "luna-curved-lamp",
    brand: "Aether Light",
    description: "A premium arched floor lamp made of hand-brushed satin brass. Casting a soft, indirect downward warm light, it is ideal for placement next to reading armchairs or minimalist lounge corners.",
    price: 189.00,
    comparePrice: 249.00,
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=800"
    ],
    categoryId: "cat_4",
    stock: 5,
    featured: false,
    variants: {
      colors: ["#E5C158", "#1C1917"],
      sizes: ["Standard"]
    },
    rating: 4.8,
    reviewCount: 16
  },
  {
    id: "prod_8",
    title: "Solid French Oak Serving Platter",
    slug: "french-oak-platter",
    brand: "Form & Void",
    description: "Handcrafted from sustainably sourced centenary French oak. Treated with pure food-grade cold-pressed linseed oil to highlight the gorgeous natural wood grain. Includes a minimal tapered detail for effortless table pickup.",
    price: 65.00,
    images: [
      "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1598965402089-897db526a9ea?auto=format&fit=crop&q=80&w=800"
    ],
    categoryId: "cat_2",
    stock: 14,
    featured: false,
    variants: {
      colors: ["#8F6E4C"],
      sizes: ["Medium", "Large"]
    },
    rating: 4.7,
    reviewCount: 22
  }
];

export const MOCK_REVIEWS: MockReview[] = [
  {
    id: "rev_1",
    productId: "prod_1",
    userName: "Clara M.",
    rating: 5,
    comment: "This tea set is stunningly crafted. The warm texture feels so grounding to hold, and the brass wire adds a beautiful elegant accent. Packaged with such care!",
    createdAt: "2026-05-18T10:30:00.000Z"
  },
  {
    id: "rev_2",
    productId: "prod_1",
    userName: "Julian P.",
    rating: 4,
    comment: "Absolutely gorgeous design. The cups fit comfortably in hand. Deducting one star only because the pour is slightly slow, but it really enforces slow living!",
    createdAt: "2026-05-10T14:15:00.000Z"
  },
  {
    id: "rev_3",
    productId: "prod_2",
    userName: "Emma G.",
    rating: 5,
    comment: "Extremely soft! It has a wonderful drape weight to it and the sage color blends beautifully with my warm linen linen sheets. Highly recommend.",
    createdAt: "2026-05-20T08:45:00.000Z"
  },
  {
    id: "rev_4",
    productId: "prod_3",
    userName: "Lucas K.",
    rating: 5,
    comment: "The scent is pure, not artificial at all. The cedarwood notes add this deep foresty warmth to the lavender and sage. The ceramic pot is gorgeous.",
    createdAt: "2026-05-22T19:20:00.000Z"
  }
];

export const MOCK_COUPONS: MockCoupon[] = [
  { code: "SLOW10", type: "PERCENT", value: 10, minOrder: 50 },
  { code: "WELCOME5", type: "FIXED", value: 5, minOrder: 20 },
  { code: "SPRING20", type: "PERCENT", value: 20, minOrder: 100 }
];
