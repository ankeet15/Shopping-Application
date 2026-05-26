"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RatingStar } from "@/components/RatingStar";
import { QuantityStepper } from "@/components/QuantityStepper";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useUIStore } from "@/store/uiStore";
import { getProductBySlug, getReviews, addReview, MockProduct, MockReview } from "@/lib/db";
import { Heart, Truck, RefreshCw, Shield, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  const router = useRouter();
  const { user } = useAuthStore();

  // Route protection
  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.role === "admin") {
      router.push("/admin");
    }
  }, [user, router]);

  // Stores
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addToast } = useUIStore();

  // State
  const [product, setProduct] = useState<MockProduct | null>(null);
  const [reviews, setReviews] = useState<MockReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">("desc");

  // Review Form state
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");

  // Load product and reviews
  useEffect(() => {
    async function loadProductData() {
      setLoading(true);
      const p = await getProductBySlug(slug);
      if (p) {
        setProduct(p);
        setSelectedColor(p.variants.colors[0] || "");
        setSelectedSize(p.variants.sizes[0] || "");

        // Fetch product reviews
        const productReviews = await getReviews(p.id);
        setReviews(productReviews);

        // Record recently viewed items in localStorage
        const stored = localStorage.getItem("petal-recently-viewed");
        let ids: string[] = [];
        if (stored) {
          try {
            ids = JSON.parse(stored);
          } catch (e) {
            console.error(e);
          }
        }
        ids = [p.id, ...ids.filter((id) => id !== p.id)];
        localStorage.setItem("petal-recently-viewed", JSON.stringify(ids.slice(0, 8)));
      } else {
        router.push("/products");
      }
      setLoading(false);
    }
    loadProductData();
  }, [slug, router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex-1 bg-petal-canvas flex items-center justify-center min-h-[450px]">
          <span className="text-petal-text-secondary text-sm font-semibold font-dm animate-pulse">
            Arranging showroom...
          </span>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) return null;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      title: product.title,
      brand: product.brand,
      price: product.price,
      image: product.images[0],
      color: selectedColor,
      size: selectedSize,
      quantity,
    });
    addToast(`${product.title} added to your bag.`, "success");
  };

  const handleToggleWishlist = () => {
    const isAdded = toggleWishlist(product.id);
    addToast(
      isAdded ? `${product.title} saved to wishlist.` : `${product.title} removed from wishlist.`,
      "neutral"
    );
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newReviewName.trim() && newReviewComment.trim()) {
      const added = await addReview(
        product.id,
        newReviewName.trim(),
        newReviewRating,
        newReviewComment.trim()
      );
      setReviews([added, ...reviews]);
      addToast("Review submitted successfully! Thank you.", "success");
      setNewReviewName("");
      setNewReviewComment("");
      setNewReviewRating(5);
    }
  };

  // Review Distribution calculation
  const totalRatingCount = reviews.length;
  const ratingDistribution = [0, 0, 0, 0, 0]; // Index 0 represents 1-star, etc.
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) {
      ratingDistribution[r.rating - 1]++;
    }
  });

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-petal-canvas font-dm py-12 select-none">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16">
          {/* Main Info Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column (55% / 7 cols) - Image gallery */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              {/* Main Display container */}
              <div className="w-full aspect-[4/3] rounded-section overflow-hidden bg-white border border-petal-border relative group shadow-sm">
                <img
                  src={product.images[activeImageIdx]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-106 cursor-zoom-in"
                />
              </div>

              {/* Thumbnails strip */}
              {product.images.length > 1 && (
                <div className="flex gap-4.5 overflow-x-auto py-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-20 h-20 rounded-thumbnail overflow-hidden border-2 bg-white flex-shrink-0 transition-all duration-200 ${
                        activeImageIdx === idx ? "border-petal-rose shadow-sm" : "border-petal-border hover:border-petal-border-hover"
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column (45% / 5 cols) - Product details */}
            <div className="lg:col-span-5 flex flex-col items-start text-left">
              <span className="text-[11px] tracking-widest font-bold uppercase text-petal-lavender">
                {product.brand}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold font-playfair text-petal-text-primary mt-2 mb-3 leading-tight">
                {product.title}
              </h1>

              {/* Rating Row */}
              <div className="flex items-center gap-3.5 mb-6">
                <RatingStar rating={product.rating} reviewCount={reviews.length} showCount={false} />
                <button
                  onClick={() => {
                    setActiveTab("reviews");
                    const element = document.getElementById("details-tab-section");
                    if (element) element.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-xs font-semibold text-petal-text-secondary hover:text-petal-rose transition-colors underline"
                >
                  Read {reviews.length} Verified {reviews.length === 1 ? "Review" : "Reviews"}
                </button>
              </div>

              {/* Price Block */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-petal-text-primary">
                  Rs {product.price.toFixed(2)}
                </span>
                {product.comparePrice && (
                  <span className="text-base text-petal-text-tertiary line-through font-semibold">
                    Rs {product.comparePrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Short description */}
              <p className="text-[14px] leading-relaxed text-petal-text-secondary mb-8 font-medium">
                {product.description}
              </p>

              {/* Color variant dots */}
              {product.variants.colors.length > 0 && (
                <div className="mb-6 w-full">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-petal-text-primary mb-3">
                    Color Hue
                  </h4>
                  <div className="flex gap-3">
                    {product.variants.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-6.5 h-6.5 rounded-full border border-stone-200 transition-all flex items-center justify-center ${
                          selectedColor === color
                            ? "ring-2 ring-offset-2 ring-petal-lavender shadow-smScale"
                            : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Select color ${color}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size variant pills */}
              {product.variants.sizes.length > 0 && (
                <div className="mb-8 w-full">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-petal-text-primary mb-3">
                    Select Size
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`text-xs font-bold px-4.5 py-2.5 rounded-badge border transition-all ${
                          selectedSize === size
                            ? "bg-petal-subtle border-petal-lavender text-petal-lavender shadow-sm"
                            : "bg-white border-petal-border text-petal-text-secondary hover:border-petal-border-hover hover:text-petal-text-primary"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stepper + Add buttons row */}
              <div className="flex flex-wrap items-center gap-4.5 mb-8 w-full border-b border-petal-border/60 pb-8">
                <QuantityStepper value={quantity} onChange={setQuantity} />
                <button
                  onClick={handleAddToCart}
                  className="flex-1 min-w-[180px] bg-petal-rose text-white font-semibold text-[15px] px-8 py-3.5 rounded-button shadow-md hover:bg-rose-500 hover:shadow-btn-active active:shadow-sm transition-all duration-200"
                >
                  Add to Bag
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`p-3.5 rounded-full border transition-all ${
                    isInWishlist(product.id)
                      ? "bg-rose-50 text-petal-rose border-rose-100 shadow-sm"
                      : "bg-transparent text-petal-text-primary border-petal-border hover:text-petal-rose hover:border-petal-border-hover"
                  }`}
                  aria-label="Add to wishlist"
                >
                  <Heart size={16} className={isInWishlist(product.id) ? "fill-petal-rose" : ""} />
                </button>
              </div>

              {/* Shipping & trust indicators */}
              <div className="flex flex-col gap-3 text-petal-text-secondary text-[13px] font-medium">
                <div className="flex items-center gap-3">
                  <Truck size={15} className="text-petal-sky flex-shrink-0" />
                  <span>Estimated Delivery: 3 - 5 business days</span>
                </div>
                <div className="flex items-center gap-3">
                  <RefreshCw size={15} className="text-petal-rose flex-shrink-0" />
                  <span>Free returns and exchanges within 30 days</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield size={15} className="text-petal-sage flex-shrink-0" />
                  <span>Secure transactions managed via Stripe checkout</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details & reviews tabs fold */}
          <section id="details-tab-section" className="mt-20 pt-10 border-t border-petal-border">
            {/* Pill Tab bar */}
            <div className="flex justify-center border-b border-petal-border pb-px mb-12">
              <div className="flex gap-2.5 bg-white border border-petal-border p-1 rounded-button shadow-sm">
                <button
                  onClick={() => setActiveTab("desc")}
                  className={`text-sm font-bold px-6 py-2.5 rounded-badge transition-all ${
                    activeTab === "desc"
                      ? "bg-petal-subtle text-petal-lavender shadow-sm"
                      : "text-petal-text-secondary hover:text-petal-text-primary"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`text-sm font-bold px-6 py-2.5 rounded-badge transition-all ${
                    activeTab === "specs"
                      ? "bg-petal-subtle text-petal-lavender shadow-sm"
                      : "text-petal-text-secondary hover:text-petal-text-primary"
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`text-sm font-bold px-6 py-2.5 rounded-badge transition-all ${
                    activeTab === "reviews"
                      ? "bg-petal-subtle text-petal-lavender shadow-sm"
                      : "text-petal-text-secondary hover:text-petal-text-primary"
                  }`}
                >
                  Reviews ({reviews.length})
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            <div className="max-w-[800px] mx-auto text-left">
              {activeTab === "desc" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 text-[15px] leading-relaxed text-petal-text-secondary font-medium"
                >
                  <p>
                    Each {product.title} is designed with a deep dedication to slow, intentional living. We focus on organic materials, textured details, and balanced shapes that bring high-end art into utility.
                  </p>
                  <p>
                    Our artisans carefully throw, spin, and handcraft each piece, ensuring no two are exactly identical. This subtle uniqueness is the heart of PETAL, providing an editorial aesthetic that centers calm in modern sanctuaries.
                  </p>
                </motion.div>
              )}

              {activeTab === "specs" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-petal-border rounded-card p-6 shadow-sm overflow-hidden"
                >
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-[14px]">
                    <div className="border-b border-stone-50 pb-2.5">
                      <dt className="font-bold text-petal-text-primary">Manufacturer</dt>
                      <dd className="text-petal-text-secondary mt-0.5">{product.brand}</dd>
                    </div>
                    <div className="border-b border-stone-50 pb-2.5">
                      <dt className="font-bold text-petal-text-primary">Material</dt>
                      <dd className="text-petal-text-secondary mt-0.5">100% Organic Eco-certified</dd>
                    </div>
                    <div className="border-b border-stone-50 pb-2.5">
                      <dt className="font-bold text-petal-text-primary">Country of Origin</dt>
                      <dd className="text-petal-text-secondary mt-0.5">Ethically Crafted globally</dd>
                    </div>
                    <div className="border-b border-stone-50 pb-2.5">
                      <dt className="font-bold text-petal-text-primary">Availability</dt>
                      <dd className="text-petal-text-secondary mt-0.5">
                        {product.stock > 0 ? `In Stock (${product.stock} units)` : "Sold Out"}
                      </dd>
                    </div>
                  </dl>
                </motion.div>
              )}

              {activeTab === "reviews" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-12"
                >
                  {/* Reviews Summary Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white border border-petal-border p-6 rounded-card shadow-sm">
                    {/* Overall Score */}
                    <div className="text-center md:border-r border-petal-border md:pr-8 py-4">
                      <div className="text-5xl font-bold font-playfair text-petal-text-primary">
                        {product.rating.toFixed(1)}
                      </div>
                      <RatingStar rating={product.rating} showCount={false} className="justify-center mt-2.5" />
                      <div className="text-xs text-petal-text-secondary font-bold uppercase tracking-widest mt-2">
                        {reviews.length} Customer {reviews.length === 1 ? "Review" : "Reviews"}
                      </div>
                    </div>

                    {/* Star Distribution bars */}
                    <div className="flex flex-col gap-2">
                      {[5, 4, 3, 2, 1].map((rate) => {
                        const count = ratingDistribution[rate - 1];
                        const percentage = totalRatingCount > 0 ? (count / totalRatingCount) * 100 : 0;
                        return (
                          <div key={rate} className="flex items-center gap-3.5 text-xs font-semibold text-petal-text-secondary">
                            <span className="w-3">{rate}★</span>
                            <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                              <div className="h-full bg-petal-rose rounded-full" style={{ width: `${percentage}%` }} />
                            </div>
                            <span className="w-6 text-right">({count})</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit review form */}
                  <div className="bg-rose-50/50 border border-rose-100/60 rounded-card p-6.5 text-left">
                    <h4 className="font-playfair text-lg font-bold text-petal-text-primary mb-1">
                      Share your experience
                    </h4>
                    <p className="text-xs text-petal-text-secondary font-semibold mb-6">
                      Your thoughts help others select perfect accents for their sanctuaries.
                    </p>

                    <form onSubmit={handleSubmitReview} className="space-y-4.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-petal-text-primary mb-2">
                            Your Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Jane D."
                            value={newReviewName}
                            onChange={(e) => setNewReviewName(e.target.value)}
                            className="w-full bg-white border border-petal-border rounded-input px-4 py-2.5 text-sm text-petal-text-primary placeholder-petal-text-tertiary focus:outline-none focus:border-petal-lavender focus:ring-4 focus:ring-petal-lavender/10 transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-petal-text-primary mb-2">
                            Rating Stars
                          </label>
                          <select
                            value={newReviewRating}
                            onChange={(e) => setNewReviewRating(Number(e.target.value))}
                            className="w-full bg-white border border-petal-border rounded-input px-4 py-2.5 text-sm text-petal-text-primary focus:outline-none focus:border-petal-lavender transition-all cursor-pointer font-bold"
                          >
                            <option value={5}>5 Stars (Perfect)</option>
                            <option value={4}>4 Stars (Very Good)</option>
                            <option value={3}>3 Stars (Good)</option>
                            <option value={2}>2 Stars (Fair)</option>
                            <option value={1}>1 Star (Poor)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-petal-text-primary mb-2">
                          Your Comment
                        </label>
                        <textarea
                          required
                          rows={3}
                          placeholder="How does it feel resting in your space? Write a brief review..."
                          value={newReviewComment}
                          onChange={(e) => setNewReviewComment(e.target.value)}
                          className="w-full bg-white border border-petal-border rounded-input px-4 py-3 text-sm text-petal-text-primary placeholder-petal-text-tertiary focus:outline-none focus:border-petal-lavender focus:ring-4 focus:ring-petal-lavender/10 transition-all duration-200"
                        />
                      </div>

                      <button
                        type="submit"
                        className="bg-petal-rose text-white font-semibold text-xs px-6 py-3 rounded-button shadow-sm hover:bg-rose-500 hover:shadow-btn-active transition-all duration-200"
                      >
                        Submit Journal Review
                      </button>
                    </form>
                  </div>

                  {/* Reviews lists */}
                  <div className="space-y-6">
                    {reviews.length > 0 ? (
                      reviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="border-b border-petal-border/60 pb-6 last:border-b-0 space-y-2.5 text-left"
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-bold text-sm text-petal-text-primary">
                              {rev.userName}
                            </div>
                            <div className="text-xs text-petal-text-tertiary font-bold">
                              {new Date(rev.createdAt).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                          </div>
                          <RatingStar rating={rev.rating} showCount={false} />
                          <p className="text-sm leading-relaxed text-petal-text-secondary font-medium mt-1">
                            {rev.comment}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-petal-text-secondary italic text-center py-6">
                        No reviews have been written yet. Be the first to share!
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
