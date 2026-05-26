"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  RotateCcw,
  ShieldCheck,
  Leaf,
  ArrowRight,
  Sofa,
  UtensilsCrossed,
  Droplet,
  Sparkles,
  BedDouble,
  GlassWater,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useUIStore } from "@/store/uiStore";
import { getFeaturedProducts, MockProduct } from "@/lib/db";

// Lucide icon helper mapping
const iconMap: Record<string, React.ComponentType<any>> = {
  Sofa,
  UtensilsCrossed,
  Droplet,
  Sparkles,
  BedDouble,
  GlassWater,
};

export default function Homepage() {
  const router = useRouter();
  const [featuredProducts, setFeaturedProducts] = useState<MockProduct[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<MockProduct[]>([]);
  const [email, setEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addToast } = useUIStore();

  useEffect(() => {
    async function loadData() {
      const featured = await getFeaturedProducts();
      setFeaturedProducts(featured.slice(0, 4));

      // Simulate recently viewed from local storage
      const stored = localStorage.getItem("petal-recently-viewed");
      if (stored) {
        try {
          const ids: string[] = JSON.parse(stored);
          const allProducts = await getFeaturedProducts(); // fallback mock items load
          const filtered = allProducts.filter((p) => ids.includes(p.id));
          setRecentlyViewed(filtered.slice(0, 4));
        } catch (e) {
          console.error(e);
        }
      }
    }
    loadData();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setNewsletterSubscribed(true);
      addToast("Welcome to PETAL! Thank you for subscribing.", "success");
      setEmail("");
    }
  };

  const handleAddToCart = (product: MockProduct) => {
    addItem({
      productId: product.id,
      title: product.title,
      brand: product.brand,
      price: product.price,
      image: product.images[0],
      color: product.variants.colors[0],
      size: product.variants.sizes[0],
      quantity: 1,
    });
    addToast(`${product.title} added to your bag.`, "success");
  };

  const handleToggleWishlist = (product: MockProduct) => {
    const isAdded = toggleWishlist(product.id);
    addToast(
      isAdded ? `${product.title} saved to wishlist.` : `${product.title} removed from wishlist.`,
      "neutral"
    );
  };

  // 6 pastel backgrounds rotating
  const categories = [
    { name: "Living Room", slug: "living", icon: "Sofa", bg: "bg-[#FFF1F2]/80 hover:bg-[#FFE4E6] text-petal-rose" },
    { name: "Kitchen", slug: "kitchen", icon: "UtensilsCrossed", bg: "bg-[#F5F3FF]/80 hover:bg-[#EDE9FE] text-petal-lavender" },
    { name: "Apothecary", slug: "apothecary", icon: "Droplet", bg: "bg-[#F0F9FF]/80 hover:bg-[#E0F2FE] text-petal-sky" },
    { name: "Ambient Lighting", slug: "lighting", icon: "Sparkles", bg: "bg-[#ECFDF5]/80 hover:bg-[#D1FAE5] text-petal-sage" },
    { name: "Bedroom", slug: "bedroom", icon: "BedDouble", bg: "bg-[#FFF1F2]/80 hover:bg-[#FFE4E6] text-petal-rose" },
    { name: "Dining & Bar", slug: "dining", icon: "GlassWater", bg: "bg-[#F5F3FF]/80 hover:bg-[#EDE9FE] text-petal-lavender" },
  ];

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-petal-canvas select-none">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-16 md:py-24 bg-petal-canvas font-dm">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Left aligned copy */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-start text-left"
            >
              <h1 className="text-5xl md:text-7xl font-bold leading-[1.08] tracking-tight text-petal-text-primary font-playfair mb-6">
                slow living, <br />
                <span className="italic font-normal text-petal-rose">beautifully</span> <br />
                curated
              </h1>
              <p className="text-base md:text-lg text-petal-text-secondary max-w-[440px] mb-9 font-medium leading-relaxed">
                Intentional home & apothecary objects hand-chosen to shape sanctuaries of stillness, slow warmth, and simple elegance.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="bg-petal-rose text-white font-semibold text-[15px] px-8 py-3.5 rounded-button shadow-md hover:bg-rose-500 hover:shadow-btn-active transition-all duration-200"
                >
                  Shop Collection
                </Link>
                <Link
                  href="/products?category=apothecary"
                  className="bg-transparent border-1.5 border-petal-border text-petal-text-primary font-semibold text-[15px] px-8 py-3.5 rounded-button hover:bg-white hover:border-petal-border-hover transition-all duration-200"
                >
                  Explore Apothecary
                </Link>
              </div>
            </motion.div>

            {/* Right side overlapping collage */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative h-[480px] w-full hidden md:block"
            >
              {/* Image 1: Background Large */}
              <div className="absolute top-12 left-4 w-[280px] h-[340px] rounded-section overflow-hidden shadow-card-resting border border-petal-border">
                <img
                  src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=600"
                  alt="Minimal clay tea brewing set"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Image 2: Overlay Top Right */}
              <div className="absolute top-0 right-8 w-[240px] h-[280px] rounded-section overflow-hidden shadow-card-hover border border-petal-border-hover z-10">
                <img
                  src="https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&q=80&w=600"
                  alt="Woven cotton blanket"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Image 3: Overlay Bottom Right */}
              <div className="absolute bottom-4 right-16 w-[180px] h-[200px] rounded-section overflow-hidden shadow-card-resting border border-petal-border z-20">
                <img
                  src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600"
                  alt="Aesthetic essential oils candle"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* CATEGORY STRIP */}
        <section className="py-12 bg-white border-y border-petal-border">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16">
            <div className="flex overflow-x-auto gap-5 pb-2 scrollbar-none items-center scroll-smooth snap-x snap-mandatory">
              {categories.map((cat, idx) => {
                const IconComponent = iconMap[cat.icon] || Sofa;
                return (
                  <Link
                    key={idx}
                    href={`/products?category=${cat.slug}`}
                    className={`snap-center flex-shrink-0 flex items-center gap-3.5 px-6 py-4 rounded-button transition-all duration-300 font-dm border border-transparent shadow-sm ${cat.bg}`}
                  >
                    <IconComponent size={18} className="stroke-[1.8]" />
                    <span className="text-sm font-semibold tracking-wide">{cat.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* TRENDING SECTION (LOVED RIGHT NOW) */}
        <section className="py-20 md:py-24 bg-petal-canvas font-dm">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-[11px] uppercase tracking-widest font-bold text-petal-text-tertiary">
                  Curated Favorites
                </span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-petal-text-primary font-playfair mt-1">
                  loved <span className="italic font-normal text-petal-rose">right now</span>
                </h2>
              </div>
              <Link
                href="/products"
                className="group flex items-center gap-1.5 text-sm font-semibold text-petal-lavender hover:text-rose-400 transition-colors duration-200"
              >
                View all items
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Stagger grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  image={product.images[0]}
                  brand={product.brand}
                  name={product.title}
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  price={product.price}
                  comparePrice={product.comparePrice}
                  onAddToCart={() => handleAddToCart(product)}
                  onWishlist={() => handleToggleWishlist(product)}
                  onQuickView={() => router.push(`/products/${product.slug}`)}
                  isWishlisted={isInWishlist(product.id)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="py-12 bg-petal-subtle font-dm">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Free Returns */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-petal-rose shadow-sm border border-rose-50">
                <RotateCcw size={18} />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-petal-text-primary">
                  30-Day Effortless Returns
                </h4>
                <p className="text-xs text-petal-text-secondary mt-0.5">
                  Change your mind? Send it back in its original package.
                </p>
              </div>
            </div>
            {/* Secure Checkout */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-petal-lavender shadow-sm border border-purple-50">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-petal-text-primary">
                  Encrypted Bank Payments
                </h4>
                <p className="text-xs text-petal-text-secondary mt-0.5">
                  Secure checkout handled via Stripe and Razorpay integrations.
                </p>
              </div>
            </div>
            {/* Eco Packaging */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-petal-sky shadow-sm border border-sky-50">
                <Leaf size={18} />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-petal-text-primary">
                  100% Circular Packaging
                </h4>
                <p className="text-xs text-petal-text-secondary mt-0.5">
                  Biodegradable boxes, recycled tissue paper, and clean inks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* RECENTLY VIEWED (Shown only if user browsed items) */}
        {recentlyViewed.length > 0 && (
          <section className="py-16 md:py-20 bg-white font-dm border-b border-petal-border">
            <div className="max-w-[1280px] mx-auto px-6 md:px-16">
              <h3 className="text-xl font-bold tracking-tight text-petal-text-primary font-playfair mb-8">
                your recently <span className="italic font-normal text-petal-lavender">viewed</span> items
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {recentlyViewed.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    image={product.images[0]}
                    brand={product.brand}
                    name={product.title}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                    price={product.price}
                    comparePrice={product.comparePrice}
                    onAddToCart={() => handleAddToCart(product)}
                    onWishlist={() => handleToggleWishlist(product)}
                    onQuickView={() => router.push(`/products/${product.slug}`)}
                    isWishlisted={isInWishlist(product.id)}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* NEWSLETTER */}
        <section className="py-20 md:py-24 bg-white font-dm">
          <div className="max-w-[1080px] mx-auto px-6 md:px-16">
            <div className="bg-petal-subtle rounded-section px-8 py-16 md:py-20 text-center flex flex-col items-center justify-center shadow-sm border border-purple-50/50">
              <span className="text-[10px] uppercase tracking-widest font-bold text-petal-text-tertiary">
                Join our circle
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-petal-text-primary font-playfair mt-2 mb-4">
                receive our slow <span className="italic font-normal text-petal-rose">journal</span>
              </h2>
              <p className="text-sm md:text-base text-petal-text-secondary max-w-[460px] leading-relaxed mb-9">
                Subscribers receive exclusive access to capsule collections, architectural guides, slow living reflections, and 10% off their first order.
              </p>

              {newsletterSubscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-emerald-100 rounded-button px-6 py-3 text-sm text-petal-sage font-semibold flex items-center gap-2"
                >
                  <Leaf size={16} /> Thank you! Check your inbox for your 10% welcome journal.
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row w-full max-w-[480px] gap-3"
                >
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-white border border-petal-border rounded-input px-5 py-3.5 text-sm text-petal-text-primary placeholder-petal-text-tertiary focus:outline-none focus:border-petal-lavender focus:ring-4 focus:ring-petal-lavender/10 transition-all duration-200"
                  />
                  <button
                    type="submit"
                    className="bg-petal-rose text-white font-semibold text-sm px-8 py-3.5 rounded-button shadow-md hover:bg-rose-500 hover:shadow-btn-active active:shadow-sm transition-all duration-200 flex-shrink-0"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
