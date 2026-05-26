"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useUIStore } from "@/store/uiStore";
import { getProducts, getCategories, MockProduct, MockCategory } from "@/lib/db";
import { Grid, List, SlidersHorizontal, ChevronDown, Check, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ProductCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Stores
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addToast } = useUIStore();

  // State
  const [products, setProducts] = useState<MockProduct[]>([]);
  const [categories, setCategories] = useState<MockCategory[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filters state from URL or defaults
  const activeCategory = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("search") || "";
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("latest");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetch categories
  useEffect(() => {
    async function loadCategories() {
      const data = await getCategories();
      setCategories(data);
    }
    loadCategories();
  }, []);

  // Fetch filtered products
  useEffect(() => {
    async function loadProducts() {
      const filtered = await getProducts({
        category: activeCategory,
        search: searchQuery,
        maxPrice: maxPrice,
        rating: minRating || undefined,
        inStock: inStockOnly,
        sort: sortBy,
      });
      setProducts(filtered);
      setCurrentPage(1); // Reset page on filter change
    }
    loadProducts();
  }, [activeCategory, searchQuery, maxPrice, minRating, inStockOnly, sortBy]);

  // Pagination bounds
  const itemsPerPage = 6;
  const totalPages = Math.ceil(products.length / itemsPerPage) || 1;
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    router.push(`/products?${params.toString()}`);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(Number(e.target.value));
  };

  return (
    <div className="flex-1 bg-petal-canvas font-dm py-10">
      <div className="max-w-[1280px] mx-auto px-6 md:px-16">
        {/* Breadcrumb & Intro */}
        <div className="mb-10 text-left">
          <div className="text-xs text-petal-text-tertiary font-bold tracking-widest uppercase">
            Browse Studio
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-playfair text-petal-text-primary mt-2">
            the <span className="italic font-normal text-petal-rose">collections</span>
          </h1>
          {searchQuery && (
            <p className="text-sm text-petal-text-secondary mt-3 font-semibold">
              Showing search results for &ldquo;{searchQuery}&rdquo; ({products.length} items found)
            </p>
          )}
        </div>

        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-petal-border pb-5 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden flex items-center gap-2 bg-white border border-petal-border hover:border-petal-border-hover px-4 py-2.5 rounded-button text-sm font-semibold text-petal-text-primary transition-colors"
            >
              <SlidersHorizontal size={15} />
              Filters
            </button>
            <span className="text-sm font-semibold text-petal-text-secondary">
              {products.length} {products.length === 1 ? "item" : "items"} available
            </span>
          </div>

          <div className="flex items-center justify-end gap-3.5">
            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-petal-border hover:border-petal-border-hover text-sm font-semibold text-petal-text-primary px-5 py-2.5 pr-10 rounded-button focus:outline-none focus:border-petal-lavender cursor-pointer select-none"
              >
                <option value="latest">Sort: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Rating: Highest</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 pointer-events-none text-stone-400" />
            </div>

            {/* Layout Toggles */}
            <div className="hidden sm:flex items-center gap-1 border border-petal-border bg-white rounded-button p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-full transition-colors ${
                  viewMode === "grid" ? "bg-petal-subtle text-petal-lavender" : "text-stone-400 hover:text-stone-600"
                }`}
                aria-label="Grid view"
              >
                <Grid size={15} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-full transition-colors ${
                  viewMode === "list" ? "bg-petal-subtle text-petal-lavender" : "text-stone-400 hover:text-stone-600"
                }`}
                aria-label="List view"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Catalog Body */}
        <div className="flex gap-8 relative items-start">
          {/* Filters Sidebar (Left, 280px) */}
          <aside
            className={`w-[280px] flex-shrink-0 bg-white border border-petal-border rounded-card p-6 shadow-sm sticky top-28 transition-all duration-300 z-30 lg:block ${
              sidebarOpen
                ? "fixed top-0 bottom-0 left-0 right-0 w-full overflow-y-auto block h-screen pt-24"
                : "hidden"
            }`}
          >
            <div className="flex items-center justify-between lg:hidden mb-6">
              <h3 className="font-bold text-lg font-playfair text-petal-text-primary">Filter Settings</h3>
              <button onClick={() => setSidebarOpen(false)} className="text-stone-400 hover:text-stone-600 font-semibold text-sm">
                Close
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-8 text-left">
              <h4 className="text-xs font-bold uppercase tracking-widest text-petal-text-primary mb-4 font-dm">
                Collection
              </h4>
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => handleCategoryChange("all")}
                  className={`text-left text-sm font-semibold transition-colors flex items-center justify-between ${
                    activeCategory === "all" ? "text-petal-rose" : "text-petal-text-secondary hover:text-petal-text-primary"
                  }`}
                >
                  <span>All Items</span>
                  {activeCategory === "all" && <Check size={14} className="text-petal-rose" />}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`text-left text-sm font-semibold transition-colors flex items-center justify-between ${
                      activeCategory === cat.slug ? "text-petal-rose" : "text-petal-text-secondary hover:text-petal-text-primary"
                    }`}
                  >
                    <span>{cat.name}</span>
                    {activeCategory === cat.slug && <Check size={14} className="text-petal-rose" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter (Dual-handle Slider styled in Rose) */}
            <div className="mb-8 text-left">
              <h4 className="text-xs font-bold uppercase tracking-widest text-petal-text-primary mb-4 font-dm">
                Price Cap
              </h4>
              <div className="flex flex-col gap-3">
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={maxPrice}
                  onChange={handlePriceChange}
                  className="w-full accent-petal-rose h-1.5 bg-stone-100 rounded-lg cursor-pointer"
                />
                <div className="flex items-center justify-between text-xs font-bold text-petal-text-secondary mt-1">
                  <span>Rs 100</span>
                  <span className="bg-rose-50 text-petal-rose px-3 py-1 rounded-badge border border-rose-100">
                    Max: Rs {maxPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-8 text-left">
              <h4 className="text-xs font-bold uppercase tracking-widest text-petal-text-primary mb-4 font-dm">
                Minimum Rating
              </h4>
              <div className="flex flex-col gap-2.5">
                {[5, 4, 3].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setMinRating(minRating === rate ? null : rate)}
                    className={`flex items-center justify-between text-left text-sm font-semibold transition-colors ${
                      minRating === rate ? "text-petal-lavender" : "text-petal-text-secondary hover:text-petal-text-primary"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={12}
                            className={
                              star <= rate ? "fill-petal-lavender text-petal-lavender" : "text-stone-200 fill-stone-100"
                            }
                          />
                        ))}
                      </div>
                      <span>&amp; up</span>
                    </div>
                    {minRating === rate && <Check size={14} className="text-petal-lavender" />}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock toggle */}
            <div className="text-left">
              <h4 className="text-xs font-bold uppercase tracking-widest text-petal-text-primary mb-4 font-dm">
                Availability
              </h4>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4.5 h-4.5 accent-petal-rose rounded-input cursor-pointer"
                />
                <span className="text-sm font-semibold text-petal-text-secondary">In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Product grid / list */}
          <div className="flex-1">
            {paginatedProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    : "flex flex-col gap-6"
                }
              >
                {paginatedProducts.map((product) => {
                  if (viewMode === "grid") {
                    return (
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
                    );
                  } else {
                    // Premium List view layout
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-petal-border hover:border-petal-border-hover p-5 rounded-card shadow-sm flex flex-col sm:flex-row gap-6 group hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200"
                      >
                        <div className="w-full sm:w-[220px] h-[160px] flex-shrink-0 rounded-thumbnail overflow-hidden bg-stone-50 border border-stone-100">
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-1.04 transition-all duration-300"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between items-start text-left">
                          <div>
                            <span className="text-[10px] tracking-widest font-bold uppercase text-petal-text-tertiary">
                              {product.brand}
                            </span>
                            <h3 className="text-lg font-bold text-petal-text-primary hover:text-petal-rose transition-colors mt-0.5">
                              {product.title}
                            </h3>
                            <p className="text-xs text-petal-text-secondary mt-2 line-clamp-2 pr-10 font-medium">
                              {product.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-6 mt-4 w-full justify-between">
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-bold text-petal-text-primary">
                                Rs {product.price.toFixed(2)}
                              </span>
                              {product.comparePrice && (
                                <span className="text-xs text-petal-text-tertiary line-through">
                                  Rs {product.comparePrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleToggleWishlist(product)}
                                className={`p-2.5 rounded-full border transition-all ${
                                  isInWishlist(product.id)
                                    ? "bg-rose-50 text-petal-rose border-rose-100"
                                    : "bg-white text-stone-400 border-petal-border hover:text-petal-rose"
                                }`}
                              >
                                <Star size={15} className={isInWishlist(product.id) ? "fill-petal-rose" : ""} />
                              </button>
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="bg-petal-rose hover:bg-rose-500 text-white font-semibold text-xs px-5 py-2.5 rounded-button shadow-sm hover:shadow-btn-active transition-all"
                              >
                                Add to Bag
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }
                })}
              </div>
            ) : (
              <div className="py-20 text-center flex flex-col items-center justify-center bg-white rounded-card border border-petal-border p-6 shadow-sm">
                <p className="text-base font-semibold text-petal-text-secondary">
                  No items matched your filters.
                </p>
                <button
                  onClick={() => {
                    handleCategoryChange("all");
                    setMaxPrice(250);
                    setMinRating(null);
                    setInStockOnly(false);
                    router.push("/products");
                  }}
                  className="mt-4 bg-petal-lavender hover:bg-purple-500 text-white font-semibold text-xs px-6 py-2.5 rounded-button shadow-sm transition-all"
                >
                  Reset all filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  const isActive = currentPage === pNum;
                  return (
                    <button
                      key={pNum}
                      onClick={() => {
                        setCurrentPage(pNum);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`w-9.5 h-9.5 rounded-full text-xs font-bold transition-all border ${
                        isActive
                          ? "bg-petal-rose text-white border-petal-rose shadow-sm"
                          : "bg-white text-petal-text-secondary border-petal-border hover:border-petal-border-hover hover:text-petal-text-primary"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductCatalogPage() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <div className="flex-1 bg-petal-canvas flex items-center justify-center min-h-[400px]">
            <span className="text-petal-text-secondary text-sm font-semibold font-dm animate-pulse">
              Curating catalog...
            </span>
          </div>
        }
      >
        <ProductCatalogContent />
      </Suspense>
      <Footer />
    </>
  );
}
