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
  // --- BEDROOM (cat_5): 7 items ---
  {
    id: "prod_bed_1",
    title: "3D Solar System Crystal Ball Night Light",
    slug: "3d-solar-system-crystal-ball",
    brand: "Aether Light",
    description: "An exquisite 3D laser-engraved solar system crystal ball paired with a solid wooden base. Emits a soft warm glow, projecting the cosmic dance onto your ceiling. Perfect for adding a magical touch to your bedside table.",
    price: 1299.00,
    comparePrice: 1599.00,
    images: ["/assests/Bedroom/517Z6vuaBKL._AC_UL480_FMwebp_QL65_.webp"],
    categoryId: "cat_5",
    stock: 25,
    featured: true,
    variants: { colors: ["#FAF8F5"], sizes: ["Standard"] },
    rating: 4.9,
    reviewCount: 45
  },
  {
    id: "prod_bed_2",
    title: "Minimalist Digital Alarm Clock",
    slug: "minimalist-digital-alarm-clock",
    brand: "Form & Void",
    description: "Sleek and modern digital bedside clock featuring a large, easy-to-read LCD screen, temperature display, calendar, and smart backlight. Equipped with snooze and gentle alarm sounds to ease you into your morning routine.",
    price: 899.00,
    comparePrice: 1199.00,
    images: ["/assests/Bedroom/51MctYF8BiL._AC_UL640_FMwebp_QL65_.webp"],
    categoryId: "cat_5",
    stock: 35,
    featured: false,
    variants: { colors: ["#FAF8F5", "#1C1917"], sizes: ["Standard"] },
    rating: 4.5,
    reviewCount: 22
  },
  {
    id: "prod_bed_3",
    title: "Cute Chibi Couple Wooden Plaque",
    slug: "cute-chibi-couple-wooden-plaque",
    brand: "Nest Studio",
    description: "Handcrafted wooden door/wall hanging featuring a delightful hand-drawn style chibi couple with a hanging banner reading 'With Love'. Decorated with delicate green vines, perfect for welcoming warmth into your bedroom sanctuary.",
    price: 699.00,
    images: ["/assests/Bedroom/61KeTeFWWDL._AC_UL640_FMwebp_QL65_.webp"],
    categoryId: "cat_5",
    stock: 12,
    featured: false,
    variants: { colors: ["#D6C5B3"], sizes: ["Standard"] },
    rating: 4.8,
    reviewCount: 16
  },
  {
    id: "prod_bed_4",
    title: "Wall Charger Phone Holder",
    slug: "wall-charger-phone-holder",
    brand: "Form & Void",
    description: "A minimal and functional self-adhesive wall mount phone holder. Conveniently installed next to your bedside power outlet to securely support your mobile device while charging, eliminating cluttered cables.",
    price: 349.00,
    comparePrice: 499.00,
    images: ["/assests/Bedroom/61mJSikurML._AC_UL640_FMwebp_QL65_.webp"],
    categoryId: "cat_5",
    stock: 120,
    featured: false,
    variants: { colors: ["#FFFFFF", "#D6C5B3"], sizes: ["Standard"] },
    rating: 4.3,
    reviewCount: 89
  },
  {
    id: "prod_bed_5",
    title: "Solimo Segmented Wall Clock",
    slug: "solimo-segmented-wall-clock",
    brand: "Ochre Home",
    description: "An artistic analog wall clock featuring segmented rustic color schemes and clear numerals. Silent sweep movement guarantees a quiet bedroom environment while lending a vintage-inspired aesthetic to your wall.",
    price: 1499.00,
    comparePrice: 1999.00,
    images: ["/assests/Bedroom/711KZ2KfEpL._AC_UL640_FMwebp_QL65_.webp"],
    categoryId: "cat_5",
    stock: 15,
    featured: false,
    variants: { colors: ["#D6C5B3"], sizes: ["12 inches"] },
    rating: 4.6,
    reviewCount: 37
  },
  {
    id: "prod_bed_6",
    title: "Rustic Wisdom Hanging Plaque",
    slug: "rustic-wisdom-hanging-plaque",
    brand: "Loom & Thread",
    description: "A multi-tiered wooden hanging plaque linked with natural jute rope. Features heartwarming motivational reminders like 'Be Positive', 'Dream Big', and 'Stay Humble' to set a positive tone for your personal space.",
    price: 799.00,
    comparePrice: 999.00,
    images: ["/assests/Bedroom/71Mly7EKFYL._AC_UL640_FMwebp_QL65_.webp"],
    categoryId: "cat_5",
    stock: 40,
    featured: true,
    variants: { colors: ["#8F6E4C"], sizes: ["Standard"] },
    rating: 4.7,
    reviewCount: 54
  },
  {
    id: "prod_bed_7",
    title: "Black Metal 'home' Key Hanger",
    slug: "black-metal-home-key-hanger",
    brand: "Ochre Home",
    description: "Elegant wall-mounted key holder featuring a sleek black metal cutout of the word 'home'. Includes sturdy hooks to organize keys, lanyards, or small bedroom accessories with rustic minimal charm.",
    price: 499.00,
    images: ["/assests/Bedroom/81eil1Y4QpL._AC_UL640_FMwebp_QL65_.webp"],
    categoryId: "cat_5",
    stock: 50,
    featured: false,
    variants: { colors: ["#1C1917"], sizes: ["Standard"] },
    rating: 4.4,
    reviewCount: 29
  },

  // --- DINING & BAR ITEMS (cat_6): 5 items ---
  {
    id: "prod_dine_1",
    title: "Countertop Bamboo Wine Rack",
    slug: "countertop-bamboo-wine-rack",
    brand: "Ochre Home",
    description: "Crafted from natural, sustainably sourced bamboo, this free-standing wine bottle rack holds up to 6 bottles horizontally to keep corks moist. Its organic, geometric layout complements any kitchen or bar counter.",
    price: 1899.00,
    comparePrice: 2499.00,
    images: ["/assests/Dining & Bar Items/61Nkidjx-FL._AC_UL800_FMwebp_QL65_.webp"],
    categoryId: "cat_6",
    stock: 18,
    featured: true,
    variants: { colors: ["#D6C5B3"], sizes: ["6-Bottle"] },
    rating: 4.8,
    reviewCount: 31
  },
  {
    id: "prod_dine_2",
    title: "Boston Shaker Cocktail Set",
    slug: "boston-shaker-cocktail-set",
    brand: "Form & Void",
    description: "Professional 12-piece stainless steel cocktail shaker set complete with a sleek bamboo storage stand. Includes Boston shaker, muddler, double jigger, pourers, and strainer for craft cocktail preparation at home.",
    price: 3299.00,
    comparePrice: 3999.00,
    images: ["/assests/Dining & Bar Items/61a33JUOuPL._AC_UL800_FMwebp_QL65_.webp"],
    categoryId: "cat_6",
    stock: 10,
    featured: true,
    variants: { colors: ["#FFFFFF", "#8F6E4C"], sizes: ["12-Piece"] },
    rating: 4.9,
    reviewCount: 64
  },
  {
    id: "prod_dine_3",
    title: "Natural Acacia Wood Coasters",
    slug: "natural-acacia-wood-coasters",
    brand: "Nest Studio",
    description: "Set of 6 round acacia wood coasters neatly stacked in a minimalist black metal holder. Features natural wood grain patterns and protective pads to safeguard your dining tables from moisture and heat.",
    price: 999.00,
    images: ["/assests/Dining & Bar Items/71OEWl8tiWL._AC_UL640_FMwebp_QL65_.webp"],
    categoryId: "cat_6",
    stock: 60,
    featured: false,
    variants: { colors: ["#8F6E4C"], sizes: ["Set of 6"] },
    rating: 4.7,
    reviewCount: 42
  },
  {
    id: "prod_dine_4",
    title: "Wall-Mounted Wooden Wine Rack",
    slug: "wall-mounted-wooden-wine-rack",
    brand: "Ochre Home",
    description: "Stunning rustic wood wall-mounted wine cabinet rack. Securely displays wine bottles and features slots underneath to hang up to 6 stemmed wine glasses. Creates an elegant focal point for dining rooms.",
    price: 4499.00,
    comparePrice: 5499.00,
    images: ["/assests/Dining & Bar Items/71UutWdQOJL._AC_UL480_FMwebp_QL65_.webp"],
    categoryId: "cat_6",
    stock: 8,
    featured: false,
    variants: { colors: ["#8F6E4C"], sizes: ["Large"] },
    rating: 4.6,
    reviewCount: 19
  },
  {
    id: "prod_dine_5",
    title: "Hand-Woven Rattan Cutlery Holder",
    slug: "hand-woven-rattan-cutlery-holder",
    brand: "Loom & Thread",
    description: "A charming, hand-woven natural rattan caddy with partitioned compartments and a sturdy handle. Perfect for organizing cutlery, napkins, or baking utensils for an earthy, rustic dining experience.",
    price: 1199.00,
    images: ["/assests/Dining & Bar Items/81qvXiLuE5L._AC_UL480_FMwebp_QL65_.webp"],
    categoryId: "cat_6",
    stock: 22,
    featured: false,
    variants: { colors: ["#D6C5B3"], sizes: ["Standard"] },
    rating: 4.5,
    reviewCount: 15
  },

  // --- LIGHTING (cat_4): 9 items ---
  {
    id: "prod_light_1",
    title: "LED Plug-in Night Lights (Pack of 2)",
    slug: "led-plug-in-night-lights",
    brand: "Aether Light",
    description: "Smart dusk-to-dawn sensor LED night lights. Emits a gentle, warm white illumination ideal for hallways, bathrooms, or nursery rooms. Automatically turns on in darkness to guide your steps safely.",
    price: 599.00,
    images: ["/assests/Lighting/51Wjei45NzL._AC_UL480_FMwebp_QL65_.webp"],
    categoryId: "cat_4",
    stock: 150,
    featured: false,
    variants: { colors: ["#FFFFFF"], sizes: ["Pack of 2"] },
    rating: 4.6,
    reviewCount: 104
  },
  {
    id: "prod_light_2",
    title: "Warm White Neon LED Strip Light",
    slug: "warm-white-neon-led-strip",
    brand: "Aether Light",
    description: "Super flexible neon-style LED strip light that glows evenly without visible dots. IP65 waterproof design, perfect for under-cabinet kitchen lighting, accent headboards, or bedroom ambient backlighting.",
    price: 1499.00,
    comparePrice: 1999.00,
    images: ["/assests/Lighting/61FWtvIUEaL._AC_UL640_FMwebp_QL65_.webp"],
    categoryId: "cat_4",
    stock: 40,
    featured: true,
    variants: { colors: ["#E5C158"], sizes: ["5 Meters"] },
    rating: 4.7,
    reviewCount: 38
  },
  {
    id: "prod_light_3",
    title: "Tap Control Silicone Panda Lamp",
    slug: "tap-control-silicone-panda-lamp",
    brand: "Nest Studio",
    description: "Incredibly soft, BPA-free washable silicone panda night light. Features easy tap control to switch between soft warm light and a colorful 7-color breathing mode. Includes a cute knitted holiday scarf.",
    price: 1199.00,
    images: ["/assests/Lighting/61XdpiDG9zL._AC_UL320_.jpg"],
    categoryId: "cat_4",
    stock: 30,
    featured: false,
    variants: { colors: ["#FFFFFF"], sizes: ["Standard"] },
    rating: 4.8,
    reviewCount: 57
  },
  {
    id: "prod_light_4",
    title: "Solar Garden Pathway Stakes (12 Pack)",
    slug: "solar-garden-pathway-stakes",
    brand: "Aether Light",
    description: "Sleek stainless steel solar pathway stakes that project beautiful segmented starry patterns. Fully solar-powered, weatherproof, and color-changing to turn your dark pathways into a vibrant evening escape.",
    price: 2499.00,
    comparePrice: 3499.00,
    images: ["/assests/Lighting/61bFc+A+53L._AC_UL480_FMwebp_QL65_.webp"],
    categoryId: "cat_4",
    stock: 20,
    featured: false,
    variants: { colors: ["#1C1917"], sizes: ["12-Pack"] },
    rating: 4.5,
    reviewCount: 49
  },
  {
    id: "prod_light_5",
    title: "Vintage G40 Globe String Lights",
    slug: "vintage-g40-globe-string-lights",
    brand: "Aether Light",
    description: "15-foot heavy-duty outdoor string lights with vintage G40 clear warm bulbs. Connectable design, weatherproof, and perfect for creating a cozy bistros atmosphere on your balcony, patio, or dining area.",
    price: 1999.00,
    comparePrice: 2499.00,
    images: ["/assests/Lighting/71DiogsqB3L._AC_UL800_FMwebp_QL65_.webp"],
    categoryId: "cat_4",
    stock: 35,
    featured: true,
    variants: { colors: ["#1C1917"], sizes: ["15 Feet"] },
    rating: 4.8,
    reviewCount: 76
  },
  {
    id: "prod_light_6",
    title: "3D Textured Moon Lamp",
    slug: "3d-textured-moon-lamp",
    brand: "Aether Light",
    description: "A beautiful 3D-printed glowing moon lamp displaying realistic lunar craters and surface texture. Placed on a solid geometric wood stand, it supports touch controls to switch between cool white and warm yellow.",
    price: 1399.00,
    comparePrice: 1799.00,
    images: ["/assests/Lighting/71RXvbYMSpS._AC_UL640_FMwebp_QL65_.webp"],
    categoryId: "cat_4",
    stock: 28,
    featured: false,
    variants: { colors: ["#FAF8F5"], sizes: ["15 cm"] },
    rating: 4.7,
    reviewCount: 92
  },
  {
    id: "prod_light_7",
    title: "Water Ripple Wave Cube Projector",
    slug: "water-ripple-wave-cube-projector",
    brand: "Aether Light",
    description: "An acrylic cube projector lamp featuring a moving internal rotor that creates a beautiful water ripple wave effect. PROJECTS flowing blue or warm yellow lights on your ceiling for a calming ocean atmosphere.",
    price: 1799.00,
    images: ["/assests/Lighting/71caZJGQnJL._AC_UL640_FMwebp_QL65_.webp"],
    categoryId: "cat_4",
    stock: 15,
    featured: false,
    variants: { colors: ["#FFFFFF"], sizes: ["Standard"] },
    rating: 4.6,
    reviewCount: 31
  },
  {
    id: "prod_light_8",
    title: "Astronaut Nebula Galaxy Projector",
    slug: "astronaut-nebula-galaxy-projector",
    brand: "Aether Light",
    description: "An adorable astronaut figurine holding a guitar that projects a massive, colorful nebula sky and green twinkling stars. Features an adjustable projection angle and a remote control for customized starry shows.",
    price: 2899.00,
    comparePrice: 3499.00,
    images: ["/assests/Lighting/71tNpFOCa5L._AC_UL640_FMwebp_QL65_.webp"],
    categoryId: "cat_4",
    stock: 18,
    featured: true,
    variants: { colors: ["#FFFFFF"], sizes: ["Standard"] },
    rating: 4.9,
    reviewCount: 58
  },
  {
    id: "prod_light_9",
    title: "Multi-Color Sunset Projection Lamp",
    slug: "multi-color-sunset-projection-lamp",
    brand: "Aether Light",
    description: "USB-powered sunset projection lamp designed with a 180-degree rotating head. Projects a brilliant warm sun glow or a vibrant twilight aura on your wall. Includes a remote control for 16 distinct ambient shades.",
    price: 1299.00,
    images: ["/assests/Lighting/81fj+LUXbNL._AC_UL480_FMwebp_QL65_.webp"],
    categoryId: "cat_4",
    stock: 45,
    featured: false,
    variants: { colors: ["#1C1917"], sizes: ["Standard"] },
    rating: 4.4,
    reviewCount: 40
  },

  // --- LIVING ROOM (cat_1): 7 items ---
  {
    id: "prod_live_1",
    title: "Octagonal Modern Side Table",
    slug: "octagonal-modern-side-table",
    brand: "Form & Void",
    description: "A chic geometric side table with a matte black octagonal top and solid oak tapered legs. Perfectly sized to rest next to your favorite lounge armchair to hold coffee, books, or a small fluted amber vase.",
    price: 3499.00,
    comparePrice: 4299.00,
    images: ["/assests/Living Room/610biGbcawL._AC_UL165_SR165,165_.jpg"],
    categoryId: "cat_1",
    stock: 10,
    featured: true,
    variants: { colors: ["#1C1917"], sizes: ["Standard"] },
    rating: 4.7,
    reviewCount: 18
  },
  {
    id: "prod_live_2",
    title: "Navy Blue Vintage Persian Rug",
    slug: "navy-blue-vintage-persian-rug",
    brand: "Loom & Thread",
    description: "An exquisite vintage Persian style area rug in a rich navy blue colorway. Crafted with intricate floral medallions and delicate white fringes, it adds plush, soft warmth and ancient soul to minimalist living rooms.",
    price: 5999.00,
    comparePrice: 7999.00,
    images: ["/assests/Living Room/71ImIbUKkIL._SX522_.jpg"],
    categoryId: "cat_1",
    stock: 6,
    featured: true,
    variants: { colors: ["#1D4ED8"], sizes: ["5' x 8'", "8' x 10'"] },
    rating: 4.9,
    reviewCount: 23
  },
  {
    id: "prod_live_3",
    title: "Artificial Succulents Set (Set of 8)",
    slug: "artificial-succulents-set",
    brand: "Nest Studio",
    description: "A collection of 8 different lifelike faux succulents and grass arrangements housed in minimal white ceramic square pots. Ideal for bringing zero-maintenance greenery to floating shelves or coffee tables.",
    price: 1299.00,
    images: ["/assests/Living Room/8139T8YbdkL._SX522_.jpg"],
    categoryId: "cat_1",
    stock: 35,
    featured: false,
    variants: { colors: ["#FFFFFF"], sizes: ["Set of 8"] },
    rating: 4.6,
    reviewCount: 41
  },
  {
    id: "prod_live_4",
    title: "Ceramic Donut Vase",
    slug: "ceramic-donut-vase",
    brand: "Form & Void",
    description: "A sculptural, hollow donut-shaped ceramic vase featuring a sandy, matte cream finish. Its smooth, round silhouette provides a striking modernist accent whether displayed empty or with dried pampas grass.",
    price: 1899.00,
    comparePrice: 2299.00,
    images: ["/assests/Living Room/813Kzy7rfqL._SX522_.jpg"],
    categoryId: "cat_1",
    stock: 14,
    featured: false,
    variants: { colors: ["#FAF8F5"], sizes: ["Standard"] },
    rating: 4.8,
    reviewCount: 30
  },
  {
    id: "prod_live_5",
    title: "Meditating Buddha Statue Figurine",
    slug: "meditating-buddha-statue",
    brand: "Nest Studio",
    description: "A beautifully detailed meditating Buddha statue, finished in matte black with an ornate gold robe adorned with sparkling mirrors. Inspires serene, tranquil vibes and intentional mindfulness in your space.",
    price: 1599.00,
    images: ["/assests/Living Room/815eXSPF+4L._SX522_.jpg"],
    categoryId: "cat_1",
    stock: 16,
    featured: false,
    variants: { colors: ["#1C1917"], sizes: ["Standard"] },
    rating: 4.7,
    reviewCount: 15
  },
  {
    id: "prod_live_6",
    title: "Stacked Stone Ceramic Table Lamp",
    slug: "stacked-stone-ceramic-table-lamp",
    brand: "Form & Void",
    description: "An artistic table lamp featuring a stacked ceramic base shaped like soft river stones in harmonious peach, sage, and dark teal tones. Topped with a natural oatmeal linen shade for a warm, filtered ambient glow.",
    price: 3999.00,
    comparePrice: 4999.00,
    images: ["/assests/Living Room/81iVpyo5dWL._SX425_.jpg"],
    categoryId: "cat_1",
    stock: 8,
    featured: true,
    variants: { colors: ["#FAF8F5"], sizes: ["Standard"] },
    rating: 4.9,
    reviewCount: 12
  },
  {
    id: "prod_live_7",
    title: "Modern Teal Giraffe Sculptures (Set of 3)",
    slug: "modern-teal-giraffe-sculptures",
    brand: "Form & Void",
    description: "An abstract set of three long-necked resin giraffe figurines. Styled in a deep matte teal hue with elegant gold-painted ears and tails, adding a playful yet sophisticated Scandinavian accent to bookshelves.",
    price: 2299.00,
    images: ["/assests/Living Room/81qpvdKwOqL._AC_UF480,480_SR480,480_.jpg"],
    categoryId: "cat_1",
    stock: 12,
    featured: false,
    variants: { colors: ["#0F766E"], sizes: ["Set of 3"] },
    rating: 4.5,
    reviewCount: 20
  },

  // --- APOTHECARY (cat_3): 7 items ---
  {
    id: "prod_apoth_1",
    title: "Pure Rosemary Essential Oil",
    slug: "pure-rosemary-essential-oil",
    brand: "Blend It Raw",
    description: "100% pure steam-distilled Rosemary Essential Oil in a classic amber bottle. Known for its stimulating and clarifying properties, perfect for home diffuser therapy or diluting in hair oils for robust growth.",
    price: 499.00,
    images: ["/assests/apothecary/41NVNN9-2kL._AC_UL165_SR165,165_.jpg"],
    categoryId: "cat_3",
    stock: 80,
    featured: false,
    variants: { colors: ["#FAF8F5"], sizes: ["100ml"] },
    rating: 4.6,
    reviewCount: 142
  },
  {
    id: "prod_apoth_2",
    title: "Steam-Distilled Pure Rose Water",
    slug: "steam-distilled-pure-rose-water",
    brand: "Urban Botanics",
    description: "A gentle, hydrating face mist distilled from organic Himalayan rose petals. Free from synthetic chemicals and artificial preservatives, it instantly refreshes, balances pH levels, and leaves skin with a natural dewy glow.",
    price: 399.00,
    comparePrice: 499.00,
    images: ["/assests/apothecary/41QVaQJJmhL._SY300_SX300_QL70_FMwebp_.webp"],
    categoryId: "cat_3",
    stock: 110,
    featured: true,
    variants: { colors: ["#FAF8F5"], sizes: ["200ml"] },
    rating: 4.8,
    reviewCount: 310
  },
  {
    id: "prod_apoth_3",
    title: "Pure Aloe Vera Hydrating Gel",
    slug: "pure-aloe-vera-hydrating-gel",
    brand: "Blend It Raw",
    description: "A 99% pure, lightweight aloe vera gel sourced directly from organic farms. Hydrates, calms sunburns, and soothes dry skin irritation. Free from artificial green colorants, thickeners, or fragrance.",
    price: 449.00,
    images: ["/assests/apothecary/51FVHjwvJTL._SX522_.jpg"],
    categoryId: "cat_3",
    stock: 90,
    featured: false,
    variants: { colors: ["#FAF8F5"], sizes: ["200g"] },
    rating: 4.7,
    reviewCount: 118
  },
  {
    id: "prod_apoth_4",
    title: "Rosemary Hair Nourishing Mist",
    slug: "rosemary-hair-nourishing-mist",
    brand: "Urban Botanics",
    description: "A revitalizing rosemary and mint hair mist formulated in an easy spray bottle. Strengthens weak hair strands, moisturizes a dry, itchy scalp, and controls frizz, restoring glossy natural bounce.",
    price: 499.00,
    images: ["/assests/apothecary/51wtkdDB2IL._SX425_.jpg"],
    categoryId: "cat_3",
    stock: 65,
    featured: false,
    variants: { colors: ["#FAF8F5"], sizes: ["100ml"] },
    rating: 4.5,
    reviewCount: 82
  },
  {
    id: "prod_apoth_5",
    title: "Rapid Clear Acne Facewash",
    slug: "rapid-clear-acne-facewash",
    brand: "Solved",
    description: "An advanced, dermatologically tested rapid action facewash infused with tea tree oil and gentle salicylic acid. Deeply purifies pores, reduces active acne, and prevents future breakouts without stripping skin.",
    price: 699.00,
    comparePrice: 899.00,
    images: ["/assests/apothecary/6155rdrl30L._AC_UL165_SR165,165_.jpg"],
    categoryId: "cat_3",
    stock: 45,
    featured: true,
    variants: { colors: ["#FAF8F5"], sizes: ["100ml"] },
    rating: 4.6,
    reviewCount: 63
  },
  {
    id: "prod_apoth_6",
    title: "Frankincense Resin Dropper Oil",
    slug: "frankincense-resin-dropper-oil",
    brand: "Blend It Raw",
    description: "A premium, wildcrafted Frankincense resin infused oil in a dropper bottle. Known as the king of oils for its anti-aging benefits, it deeply rejuvenates skin cells and creates a meditative aura during skincare routines.",
    price: 899.00,
    comparePrice: 1099.00,
    images: ["/assests/apothecary/61ny25CJwFL._SX522_.jpg"],
    categoryId: "cat_3",
    stock: 25,
    featured: false,
    variants: { colors: ["#FAF8F5"], sizes: ["15ml"] },
    rating: 4.8,
    reviewCount: 39
  },
  {
    id: "prod_apoth_7",
    title: "Himalayan Sea Buckthorn Pulp",
    slug: "himalayan-sea-buckthorn-pulp",
    brand: "wellwith",
    description: "A 300ml bottle of 100% pure liquid concentrate sea buckthorn pulp wildcrafted from the high altitudes of Ladakh. Packed with Omega 3, 6, 9, and rare Omega 7, this rich berry drink boosts immunity and skin health.",
    price: 1199.00,
    images: ["/assests/apothecary/71CuV+Vse2L._AC_UF480,480_SR480,480_.jpg"],
    categoryId: "cat_3",
    stock: 30,
    featured: true,
    variants: { colors: ["#FAF8F5"], sizes: ["300ml"] },
    rating: 4.9,
    reviewCount: 71
  },

  // --- KITCHEN (cat_2): 6 items ---
  {
    id: "prod_kit_1",
    title: "2-in-1 Sink Soap Dispenser",
    slug: "2-in-1-sink-soap-dispenser",
    brand: "Form & Void",
    description: "A sleek, space-saving kitchen sink accessory featuring a liquid soap pump dispenser integrated with a top sponge holding tray. Offers effortless one-handed soap dispensing, keeping sink countertops dry.",
    price: 499.00,
    images: ["/assests/kitchen Items/51DS8h5RqhL._SX466_.jpg"],
    categoryId: "cat_2",
    stock: 140,
    featured: false,
    variants: { colors: ["#0F766E"], sizes: ["Standard"] },
    rating: 4.4,
    reviewCount: 112
  },
  {
    id: "prod_kit_2",
    title: "2-Tier Rustic Wood Spice Organizer",
    slug: "2-tier-rustic-wood-spice-organizer",
    brand: "Ochre Home",
    description: "A minimalist 2-tier organizer featuring beautiful warm solid wood shelves mounted on a black metal frame. Neatly stores and displays spice jars or apothecary vials, enhancing countertop aesthetics.",
    price: 1299.00,
    comparePrice: 1699.00,
    images: ["/assests/kitchen Items/51HJLohsGjL._AC_UL165_SR165,165_.jpg"],
    categoryId: "cat_2",
    stock: 25,
    featured: true,
    variants: { colors: ["#8F6E4C"], sizes: ["2-Tier"] },
    rating: 4.7,
    reviewCount: 43
  },
  {
    id: "prod_kit_3",
    title: "2-Tier White Wire Spice Rack",
    slug: "2-tier-white-wire-spice-rack",
    brand: "Ochre Home",
    description: "A crisp white, dual-tier wire shelf organizer perfect for modern cabinets. Holds salt cellars, olive oil cruets, or spice jars, bringing clean, accessible structure to busy baking areas.",
    price: 1099.00,
    images: ["/assests/kitchen Items/61i-G4VG+CL._AC_UL165_SR165,165_.jpg"],
    categoryId: "cat_2",
    stock: 35,
    featured: false,
    variants: { colors: ["#FFFFFF"], sizes: ["2-Tier"] },
    rating: 4.5,
    reviewCount: 29
  },
  {
    id: "prod_kit_4",
    title: "Spice Rack Organizer with Bamboo Jars",
    slug: "spice-rack-organizer-bamboo-jars",
    brand: "Ochre Home",
    description: "An elevated countertop spice organizer featuring a rustic dark wood step stand and 10 elegant clear borosilicate glass jars topped with airtight bamboo lids. Perfect for preserving gourmet spices.",
    price: 2699.00,
    comparePrice: 3299.00,
    images: ["/assests/kitchen Items/71nMDPj0-IL._SX569_.jpg"],
    categoryId: "cat_2",
    stock: 12,
    featured: true,
    variants: { colors: ["#8F6E4C"], sizes: ["10-Jar Set"] },
    rating: 4.8,
    reviewCount: 51
  },
  {
    id: "prod_kit_5",
    title: "2-Tier Stainless Steel Dish Rack",
    slug: "2-tier-stainless-steel-dish-rack",
    brand: "Form & Void",
    description: "A heavy-duty, double-decker kitchen dish drying rack in fingerprint-resistant black. Features a smart 360-degree drainboard, knife block, cutting board holder, and high-capacity slots for plates and bowls.",
    price: 3499.00,
    comparePrice: 4499.00,
    images: ["/assests/kitchen Items/811Buo9VfOL._AC_UF480,480_SR480,480_.jpg"],
    categoryId: "cat_2",
    stock: 16,
    featured: true,
    variants: { colors: ["#1C1917"], sizes: ["Standard"] },
    rating: 4.9,
    reviewCount: 34
  },
  {
    id: "prod_kit_6",
    title: "Sliding Under-Sink Cabinet Organizer",
    slug: "sliding-under-sink-cabinet-organizer",
    brand: "Form & Void",
    description: "A 2-tier heavy-duty storage unit designed specifically for under-sink cabinets. Features smooth-sliding pull-out baskets and additional side hanging hooks to maximize organization of cleaning supplies.",
    price: 1999.00,
    images: ["/assests/kitchen Items/81XRG861m5L._AC_UL165_SR165,165_.jpg"],
    categoryId: "cat_2",
    stock: 28,
    featured: false,
    variants: { colors: ["#1C1917"], sizes: ["2-Tier"] },
    rating: 4.6,
    reviewCount: 22
  }
];

export const MOCK_REVIEWS: MockReview[] = [
  {
    id: "rev_1",
    productId: "prod_live_6",
    userName: "Clara M.",
    rating: 5,
    comment: "This table lamp is stunningly crafted. The river stones colored base is a masterwork, and the ambient warm glow is so peaceful. Packaged with such care!",
    createdAt: "2026-05-18T10:30:00.000Z"
  },
  {
    id: "rev_2",
    productId: "prod_live_6",
    userName: "Julian P.",
    rating: 4,
    comment: "Absolutely gorgeous design. The linen shade gives off a beautiful soft lighting. A must buy for a minimal bedroom setup!",
    createdAt: "2026-05-10T14:15:00.000Z"
  },
  {
    id: "rev_3",
    productId: "prod_dine_2",
    userName: "Emma G.",
    rating: 5,
    comment: "Professional high quality cocktail set. The bamboo stand keeps everything super neat. Made custom high-end cocktails at home easily!",
    createdAt: "2026-05-20T08:45:00.000Z"
  },
  {
    id: "rev_4",
    productId: "prod_apoth_2",
    userName: "Lucas K.",
    rating: 5,
    comment: "Best rose water ever! Incredibly calming and fresh scent, completely natural. Skin feels super soft after using.",
    createdAt: "2026-05-22T19:20:00.000Z"
  }
];

export const MOCK_COUPONS: MockCoupon[] = [
  { code: "SLOW10", type: "PERCENT", value: 10, minOrder: 1500 },
  { code: "WELCOME5", type: "FIXED", value: 250, minOrder: 1000 },
  { code: "SPRING20", type: "PERCENT", value: 20, minOrder: 3000 }
];
