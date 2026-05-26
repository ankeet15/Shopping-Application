"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useOrderStore } from "@/store/orderStore";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PetalBadge } from "@/components/PetalBadge";
import { useUIStore } from "@/store/uiStore";
import {
  getOrders,
  getFeaturedProducts,
  getCoupons,
  createCoupon,
  updateOrderStatus,
  addMockProduct,
  MockOrder,
  MockProduct,
  MockCoupon,
} from "@/lib/db";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Percent,
  Plus,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Calendar,
  X,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { addToast } = useUIStore();
  const { user } = useAuthStore();

  // Protect Route: Admin role required
  useEffect(() => {
    if (!user) {
      addToast("Administrator session required.", "error");
      router.push("/login/admin");
    } else if (user.role !== "admin") {
      addToast("Access denied. Customer account is unauthorized.", "error");
      router.push("/");
    }
  }, [user, router]);

  const [activeTab, setActiveTab] = useState<"analytics" | "orders" | "products" | "coupons">("analytics");

  // Sync with notification query parameters
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam && ["analytics", "orders", "products", "coupons"].includes(tabParam)) {
        setActiveTab(tabParam as any);
      }
    }
  }, []);

  // Dynamic lists from mock DB
  const { orders, setOrders } = useOrderStore();
  const [products, setProducts] = useState<MockProduct[]>([]);
  const [coupons, setCoupons] = useState<MockCoupon[]>([]);

  // Add Product Modal State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    brand: "",
    price: 0,
    comparePrice: 0,
    slug: "",
    description: "",
    images: [""],
    categorySlug: "living",
    stock: 20,
    colors: ["#78716C"],
    sizes: ["Standard"],
  });
  const [newColorInput, setNewColorInput] = useState("");
  const [newSizeInput, setNewSizeInput] = useState("");

  // Add Coupon State
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    value: 0,
    type: "PERCENT" as "PERCENT" | "FIXED",
  });

  // Load Admin Data
  useEffect(() => {
    async function loadAdminData() {
      const ords = await getOrders();
      setOrders(ords);

      const prods = await getFeaturedProducts();
      setProducts(prods);

      const coups = await getCoupons();
      setCoupons(coups);
    }
    loadAdminData();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      addToast(`Order #${orderId} marked as ${newStatus}.`, "success");
    } catch (err) {
      addToast("Failed to update status.", "error");
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.title && newProduct.brand && newProduct.price > 0 && newProduct.slug) {
      const added = await addMockProduct({
        title: newProduct.title,
        brand: newProduct.brand,
        price: newProduct.price,
        comparePrice: newProduct.comparePrice || undefined,
        slug: newProduct.slug,
        description: newProduct.description || "Ethically crafted minimal piece.",
        images: newProduct.images.filter(Boolean).length > 0 ? newProduct.images.filter(Boolean) : ["https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=600"],
        categorySlug: newProduct.categorySlug,
        stock: newProduct.stock,
        variants: {
          colors: newProduct.colors,
          sizes: newProduct.sizes,
        },
      });

      setProducts([added, ...products]);
      setShowAddProductModal(false);
      setNewProduct({
        title: "",
        brand: "",
        price: 0,
        comparePrice: 0,
        slug: "",
        description: "",
        images: [""],
        categorySlug: "living",
        stock: 20,
        colors: ["#78716C"],
        sizes: ["Standard"],
      });
      addToast(`Successfully created ${added.title}!`, "success");
    }
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCoupon.code && newCoupon.value > 0) {
      const added = await createCoupon(newCoupon.code.trim().toUpperCase(), newCoupon.value, newCoupon.type);
      setCoupons([...coupons, added]);
      setNewCoupon({ code: "", value: 0, type: "PERCENT" });
      addToast(`Coupon "${added.code}" is now active!`, "success");
    }
  };

  // Dashboard calculations
  const totalRevenue = orders.reduce((sum, o) => (o.status !== "CANCELLED" ? sum + o.total : sum), 0);
  const activeOrdersCount = orders.filter((o) => o.status !== "CANCELLED").length;
  const aov = activeOrdersCount > 0 ? totalRevenue / activeOrdersCount : 0;
  const conversionRate = 2.4; // constant static conversion baseline

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-petal-canvas font-dm py-12 select-none text-left">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16">
          {/* Header intro */}
          <div className="mb-10">
            <span className="text-[11px] font-bold uppercase tracking-widest text-petal-text-tertiary">
              Studio Command
            </span>
            <h1 className="text-4xl font-bold font-playfair text-petal-text-primary mt-1">
              admin <span className="italic font-normal text-petal-lavender">dashboard</span>
            </h1>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Revenue */}
            <div className="bg-white border border-petal-border p-5 rounded-card shadow-sm flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Total Revenue</span>
                <h3 className="text-2xl font-bold text-petal-text-primary mt-1">Rs {totalRevenue.toFixed(2)}</h3>
              </div>
              <div className="w-10 h-10 bg-rose-50 text-petal-rose rounded-full flex items-center justify-center">
                <TrendingUp size={16} />
              </div>
            </div>

            {/* Orders */}
            <div className="bg-white border border-petal-border p-5 rounded-card shadow-sm flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Active Orders</span>
                <h3 className="text-2xl font-bold text-petal-text-primary mt-1">{activeOrdersCount}</h3>
              </div>
              <div className="w-10 h-10 bg-purple-50 text-petal-lavender rounded-full flex items-center justify-center">
                <ShoppingBag size={16} />
              </div>
            </div>

            {/* AOV */}
            <div className="bg-white border border-petal-border p-5 rounded-card shadow-sm flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Average Order</span>
                <h3 className="text-2xl font-bold text-petal-text-primary mt-1">Rs {aov.toFixed(2)}</h3>
              </div>
              <div className="w-10 h-10 bg-sky-50 text-petal-sky rounded-full flex items-center justify-center">
                <Sparkles size={16} />
              </div>
            </div>

            {/* Conversion */}
            <div className="bg-white border border-petal-border p-5 rounded-card shadow-sm flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Conversion Rate</span>
                <h3 className="text-2xl font-bold text-petal-text-primary mt-1">{conversionRate.toFixed(1)}%</h3>
              </div>
              <div className="w-10 h-10 bg-emerald-50 text-petal-sage rounded-full flex items-center justify-center">
                <Percent size={16} />
              </div>
            </div>
          </div>

          {/* Navigation Controls & Layout Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column Tabs Sidebar */}
            <aside className="lg:col-span-3 bg-white border border-petal-border rounded-card p-5 shadow-sm space-y-2">
              {[
                { id: "analytics", label: "Analytics Fold", icon: BarChart3 },
                { id: "orders", label: "Client Orders", icon: ShoppingBag },
                { id: "products", label: "Products Catalog", icon: Sparkles },
                { id: "coupons", label: "Discount Coupons", icon: Percent },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-button text-xs font-bold uppercase tracking-widest transition-all ${
                      isActive
                        ? "bg-petal-subtle text-petal-lavender shadow-sm"
                        : "text-petal-text-secondary hover:bg-stone-50 hover:text-petal-text-primary"
                    }`}
                  >
                    <IconComponent size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </aside>

            {/* Right Column Content Panel */}
            <div className="lg:col-span-9">
              <AnimatePresence mode="wait">
                {/* TAB 0: ANALYTICS */}
                {activeTab === "analytics" && (
                  <motion.div
                    key="analytics"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-8"
                  >
                    {/* SVG Line Chart: Revenue */}
                    <div className="bg-white border border-petal-border rounded-card p-6 shadow-sm">
                      <h4 className="font-playfair text-base font-bold text-petal-text-primary mb-4 flex items-center gap-2">
                        <TrendingUp size={15} className="text-petal-rose" /> Monthly Revenue Trend
                      </h4>
                      {/* Zero-dependency responsive visual SVG chart */}
                      <svg viewBox="0 0 400 200" className="w-full h-auto overflow-visible select-none">
                        <defs>
                          <linearGradient id="roseGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FB7185" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#FB7185" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Horizontal Gridlines */}
                        <line x1="20" y1="30" x2="380" y2="30" stroke="#F5F5F4" strokeWidth="1" />
                        <line x1="20" y1="80" x2="380" y2="80" stroke="#F5F5F4" strokeWidth="1" />
                        <line x1="20" y1="130" x2="380" y2="130" stroke="#F5F5F4" strokeWidth="1" />
                        <line x1="20" y1="180" x2="380" y2="180" stroke="#D6D3D1" strokeWidth="1" />

                        {/* Chart Path Area with soft Rose gradient */}
                        <path
                          d="M 20 180 Q 80 140 140 100 T 260 70 T 380 40 L 380 180 Z"
                          fill="url(#roseGradient)"
                        />
                        {/* Chart Stroke Line */}
                        <path
                          d="M 20 180 Q 80 140 140 100 T 260 70 T 380 40"
                          fill="none"
                          stroke="#FB7185"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />

                        {/* Chart Dots */}
                        <circle cx="20" cy="180" r="5" fill="#FB7185" stroke="#FFFFFF" strokeWidth="1.5" />
                        <circle cx="140" cy="100" r="5" fill="#FB7185" stroke="#FFFFFF" strokeWidth="1.5" />
                        <circle cx="260" cy="70" r="5" fill="#FB7185" stroke="#FFFFFF" strokeWidth="1.5" />
                        <circle cx="380" cy="40" r="5" fill="#FB7185" stroke="#FFFFFF" strokeWidth="1.5" />

                        {/* Labels */}
                        <text x="20" y="195" textAnchor="middle" fill="#A8A29E" fontSize="9" fontWeight="bold">Feb</text>
                        <text x="140" y="195" textAnchor="middle" fill="#A8A29E" fontSize="9" fontWeight="bold">Mar</text>
                        <text x="260" y="195" textAnchor="middle" fill="#A8A29E" fontSize="9" fontWeight="bold">Apr</text>
                        <text x="380" y="195" textAnchor="middle" fill="#A8A29E" fontSize="9" fontWeight="bold">May</text>
                      </svg>
                    </div>

                    {/* SVG Bar Chart: Orders */}
                    <div className="bg-white border border-petal-border rounded-card p-6 shadow-sm">
                      <h4 className="font-playfair text-base font-bold text-petal-text-primary mb-4 flex items-center gap-2">
                        <BarChart3 size={15} className="text-petal-lavender" /> Order Distribution
                      </h4>
                      {/* Zero-dependency responsive visual SVG chart */}
                      <svg viewBox="0 0 400 200" className="w-full h-auto overflow-visible select-none">
                        {/* Horizontal Gridlines */}
                        <line x1="20" y1="30" x2="380" y2="30" stroke="#F5F5F4" strokeWidth="1" />
                        <line x1="20" y1="80" x2="380" y2="80" stroke="#F5F5F4" strokeWidth="1" />
                        <line x1="20" y1="130" x2="380" y2="130" stroke="#F5F5F4" strokeWidth="1" />
                        <line x1="20" y1="180" x2="380" y2="180" stroke="#D6D3D1" strokeWidth="1" />

                        {/* Custom Rounded Bar columns in Lavender */}
                        <rect x="50" y="100" width="30" height="80" rx="4" fill="#A78BFA" opacity="0.8" />
                        <rect x="140" y="60" width="30" height="120" rx="4" fill="#A78BFA" opacity="0.8" />
                        <rect x="230" y="80" width="30" height="100" rx="4" fill="#A78BFA" opacity="0.8" />
                        <rect x="320" y="40" width="30" height="140" rx="4" fill="#A78BFA" />

                        {/* Labels */}
                        <text x="65" y="195" textAnchor="middle" fill="#A8A29E" fontSize="9" fontWeight="bold">Living</text>
                        <text x="155" y="195" textAnchor="middle" fill="#A8A29E" fontSize="9" fontWeight="bold">Kitchen</text>
                        <text x="245" y="195" textAnchor="middle" fill="#A8A29E" fontSize="9" fontWeight="bold">Apothecary</text>
                        <text x="335" y="195" textAnchor="middle" fill="#A8A29E" fontSize="9" fontWeight="bold">Lighting</text>
                      </svg>
                    </div>
                  </motion.div>
                )}

                {/* TAB 1: CLIENT ORDERS */}
                {activeTab === "orders" && (
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="bg-white border border-petal-border rounded-card p-6 shadow-sm">
                      <h2 className="font-playfair text-xl font-bold text-petal-text-primary mb-1">
                        Client Orders
                      </h2>
                      <p className="text-xs text-petal-text-secondary font-semibold">
                        Edit order delivery pathways and mark active logistics.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {orders.map((ord) => {
                        let badgeType: "rose" | "lavender" | "sky" | "sage" | "neutral" = "lavender";
                        if (ord.status === "DELIVERED") badgeType = "sage";
                        if (ord.status === "SHIPPED") badgeType = "sky";
                        if (ord.status === "CANCELLED") badgeType = "rose";

                        return (
                          <div
                            key={ord.id}
                            className="bg-white border border-petal-border rounded-card p-5 shadow-sm space-y-4"
                          >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-50 pb-3">
                              <div>
                                <span className="font-playfair text-sm italic font-bold text-petal-text-primary">
                                  Order #{ord.id}
                                </span>
                                <span className="text-[10px] text-stone-400 font-bold ml-3">
                                  {new Date(ord.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <PetalBadge variant={badgeType} label={ord.status} />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium leading-relaxed">
                              <div>
                                <h5 className="font-bold text-[10px] uppercase tracking-wider text-stone-400 mb-1">
                                  Shipment Details
                                </h5>
                                <p className="text-petal-text-secondary">{ord.address}</p>
                              </div>
                              <div>
                                <h5 className="font-bold text-[10px] uppercase tracking-wider text-stone-400 mb-1">
                                  Payment Sum
                                </h5>
                                <p className="text-petal-text-secondary">
                                  <strong>Rs {ord.total.toFixed(2)}</strong> via {ord.paymentMethod}
                                </p>
                              </div>
                            </div>

                            {/* Status actions */}
                            {ord.status !== "DELIVERED" && ord.status !== "CANCELLED" && (
                              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-stone-50 justify-end">
                                <button
                                  onClick={() => handleUpdateStatus(ord.id, "CANCELLED")}
                                  className="text-petal-rose border border-rose-100 bg-rose-50/20 hover:bg-rose-50 text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-badge transition-all"
                                >
                                  Cancel Order
                                </button>
                                {ord.status === "PROCESSING" && (
                                  <button
                                    onClick={() => handleUpdateStatus(ord.id, "SHIPPED")}
                                    className="bg-petal-sky text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-badge hover:bg-sky-500 transition-all shadow-sm"
                                  >
                                    Ship Order
                                  </button>
                                )}
                                {ord.status === "SHIPPED" && (
                                  <button
                                    onClick={() => handleUpdateStatus(ord.id, "DELIVERED")}
                                    className="bg-petal-sage text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-badge hover:bg-emerald-500 transition-all shadow-sm"
                                  >
                                    Mark Delivered
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* TAB 2: PRODUCTS CATALOG */}
                {activeTab === "products" && (
                  <motion.div
                    key="products"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="bg-white border border-petal-border rounded-card p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="font-playfair text-xl font-bold text-petal-text-primary mb-1">
                          Product Stock
                        </h2>
                        <p className="text-xs text-petal-text-secondary font-semibold">
                          View active showroom items and adjust unit variables.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowAddProductModal(true)}
                        className="bg-petal-rose text-white font-semibold text-xs px-5 py-2.5 rounded-button shadow-md hover:bg-rose-500 hover:shadow-btn-active transition-all flex items-center gap-1.5"
                      >
                        <Plus size={14} /> Add Product
                      </button>
                    </div>

                    {/* Stock lists table */}
                    <div className="bg-white border border-petal-border rounded-card shadow-sm overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-stone-100 bg-stone-50/50 text-[10px] uppercase tracking-wider font-bold text-stone-400">
                            <th className="py-4 px-6">Product</th>
                            <th className="py-4 px-4">Brand</th>
                            <th className="py-4 px-4">Category</th>
                            <th className="py-4 px-4">Price</th>
                            <th className="py-4 px-4">Stock</th>
                            <th className="py-4 px-6 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="font-medium text-petal-text-secondary divide-y divide-stone-50">
                          {products.map((p) => {
                            const catNames: Record<string, string> = {
                              cat_1: "Living Room",
                              cat_2: "Kitchen Essentials",
                              cat_3: "Apothecary",
                              cat_4: "Ambient Lighting",
                              cat_5: "Bedroom",
                              cat_6: "Dining & Bar",
                            };
                            const categoryLabel = catNames[p.categoryId] || p.categoryId;
                            return (
                              <tr key={p.id} className="hover:bg-stone-50/20">
                                <td className="py-3 px-6 flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-thumbnail overflow-hidden bg-stone-50 border border-stone-100 flex-shrink-0">
                                    <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <span className="font-bold text-petal-text-primary line-clamp-1">{p.title}</span>
                                </td>
                                <td className="py-3 px-4">{p.brand}</td>
                                <td className="py-3 px-4 uppercase text-[9px] font-bold text-petal-lavender">
                                  {categoryLabel}
                                </td>
                                <td className="py-3 px-4 font-bold text-petal-text-primary">Rs {p.price}</td>
                              <td className="py-3 px-4">
                                <span className={p.stock > 5 ? "text-petal-sage" : "text-petal-rose font-bold"}>
                                  {p.stock} units
                                </span>
                              </td>
                              <td className="py-3 px-6 text-right">
                                <button
                                  onClick={() => addToast("Product edits are disabled for this demonstration.", "neutral")}
                                  className="text-[10px] font-bold text-petal-lavender hover:text-rose-400 underline transition-colors"
                                >
                                  Edit Specs
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {/* TAB 3: COUPONS */}
                {activeTab === "coupons" && (
                  <motion.div
                    key="coupons"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-8"
                  >
                    {/* Add Coupon Form (Left 5 cols) */}
                    <div className="md:col-span-5 bg-white border border-petal-border rounded-card p-6.5 shadow-sm space-y-6 h-fit">
                      <div>
                        <h3 className="font-playfair text-base font-bold text-petal-text-primary mb-1">
                          Create Coupon
                        </h3>
                        <p className="text-[11px] text-stone-400 font-semibold">
                          Register new validation codes for customer checkout HUDs.
                        </p>
                      </div>

                      <form onSubmit={handleAddCoupon} className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5">
                            Coupon Code
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. SANCTUARY20"
                            value={newCoupon.code}
                            onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                            className="w-full bg-stone-50 border border-petal-border rounded-input px-4 py-2.5 text-xs text-petal-text-primary placeholder-petal-text-tertiary focus:outline-none focus:border-petal-lavender"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5">
                              Value
                            </label>
                            <input
                              type="number"
                              required
                              min="1"
                              placeholder="20"
                              value={newCoupon.value || ""}
                              onChange={(e) => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                              className="w-full bg-stone-50 border border-petal-border rounded-input px-4 py-2.5 text-xs text-petal-text-primary focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5">
                              Unit Type
                            </label>
                            <select
                              value={newCoupon.type}
                              onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value as any })}
                              className="w-full bg-stone-50 border border-petal-border rounded-input px-3 py-2.5 text-xs text-petal-text-primary focus:outline-none"
                            >
                              <option value="PERCENT">Percent (%)</option>
                              <option value="FIXED">Fixed (Rs)</option>
                            </select>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-petal-rose text-white text-xs font-bold py-3 rounded-button shadow-sm hover:bg-rose-500 hover:shadow-btn-active transition-all"
                        >
                          Register Code
                        </button>
                      </form>
                    </div>

                    {/* Coupons list (Right 7 cols) */}
                    <div className="md:col-span-7 bg-white border border-petal-border rounded-card p-6.5 shadow-sm space-y-5 h-fit">
                      <h3 className="font-playfair text-base font-bold text-petal-text-primary mb-4">
                        Active Coupons
                      </h3>

                      <div className="divide-y divide-stone-50 text-xs">
                        {coupons.map((c) => (
                          <div key={c.code} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-sm text-petal-lavender bg-purple-50 px-3 py-1 rounded-badge border border-purple-100">
                                {c.code}
                              </span>
                              <div className="text-[10px] text-stone-400 mt-2 font-bold uppercase tracking-wider">
                                {c.type === "PERCENT" ? `${c.value}% reduction` : `Rs ${c.value} direct credit`}
                              </div>
                            </div>
                            <PetalBadge variant="sage" label="Active" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* ADD SHOWROOM PRODUCT MODAL (Framer Motion popup) */}
      <AnimatePresence>
        {showAddProductModal && (
          <>
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddProductModal(false)}
              className="fixed inset-0 bg-black/25 z-[90] backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-y-10 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 w-full max-w-[600px] bg-white rounded-section shadow-2xl z-[91] overflow-y-auto p-6.5 flex flex-col font-dm text-left border border-petal-border"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-5">
                <h3 className="font-playfair text-xl font-bold text-petal-text-primary">
                  New Sanctuary Item
                </h3>
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="p-1 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form content */}
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5">
                      Product Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Linen Throw Blanket"
                      value={newProduct.title}
                      onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                      className="w-full bg-stone-50 border border-petal-border rounded-input px-4 py-2.5 text-xs text-petal-text-primary focus:outline-none focus:border-petal-lavender"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5">
                      Artisan / Brand
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Loom & Craft"
                      value={newProduct.brand}
                      onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                      className="w-full bg-stone-50 border border-petal-border rounded-input px-4 py-2.5 text-xs text-petal-text-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5">
                      Price (Rs)
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="45"
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      className="w-full bg-stone-50 border border-petal-border rounded-input px-4 py-2.5 text-xs text-petal-text-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5">
                      Original / Compare Price
                    </label>
                    <input
                      type="number"
                      placeholder="55"
                      onChange={(e) => setNewProduct({ ...newProduct, comparePrice: Number(e.target.value) })}
                      className="w-full bg-stone-50 border border-petal-border rounded-input px-4 py-2.5 text-xs text-petal-text-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5">
                      Stock Units
                    </label>
                    <input
                      type="number"
                      required
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                      className="w-full bg-stone-50 border border-petal-border rounded-input px-4 py-2.5 text-xs text-petal-text-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5">
                      Unique URL Slug
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="linen-throw-blanket"
                      value={newProduct.slug}
                      onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value.toLowerCase() })}
                      className="w-full bg-stone-50 border border-petal-border rounded-input px-4 py-2.5 text-xs text-petal-text-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5">
                      Category
                    </label>
                    <select
                      value={newProduct.categorySlug}
                      onChange={(e) => setNewProduct({ ...newProduct, categorySlug: e.target.value })}
                      className="w-full bg-stone-50 border border-petal-border rounded-input px-4 py-2.5 text-xs text-petal-text-primary focus:outline-none"
                    >
                      <option value="living">Living Room</option>
                      <option value="kitchen">Kitchen Essentials</option>
                      <option value="apothecary">Apothecary</option>
                      <option value="lighting">Ambient Lighting</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5">
                    Showroom Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newProduct.images[0]}
                    onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.value] })}
                    className="w-full bg-stone-50 border border-petal-border rounded-input px-4 py-2.5 text-xs text-petal-text-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5">
                    Description Context
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Beautiful organic lifestyle narrative context..."
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full bg-stone-50 border border-petal-border rounded-input px-4 py-2.5 text-xs text-petal-text-primary focus:outline-none"
                  />
                </div>

                {/* Variants Editor widgets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-50">
                  {/* Colors */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5">
                      Add Colors (Active: {newProduct.colors.length})
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="e.g. #FB7185 or Sand"
                        value={newColorInput}
                        onChange={(e) => setNewColorInput(e.target.value)}
                        className="flex-1 bg-stone-50 border border-petal-border rounded-input px-3 py-1.5 text-xs text-petal-text-primary focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newColorInput.trim()) {
                            setNewProduct({ ...newProduct, colors: [...newProduct.colors, newColorInput.trim()] });
                            setNewColorInput("");
                          }
                        }}
                        className="bg-stone-50 hover:bg-stone-100 border border-petal-border rounded-button px-3.5 text-xs font-bold text-petal-text-primary"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {newProduct.colors.map((c, i) => (
                        <span key={i} className="text-[10px] font-bold bg-stone-50 px-2 py-0.5 rounded-badge border border-stone-200">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sizes */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5">
                      Add Sizes (Active: {newProduct.sizes.length})
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="e.g. Medium or 12oz"
                        value={newSizeInput}
                        onChange={(e) => setNewSizeInput(e.target.value)}
                        className="flex-1 bg-stone-50 border border-petal-border rounded-input px-3 py-1.5 text-xs text-petal-text-primary focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newSizeInput.trim()) {
                            setNewProduct({ ...newProduct, sizes: [...newProduct.sizes, newSizeInput.trim()] });
                            setNewSizeInput("");
                          }
                        }}
                        className="bg-stone-50 hover:bg-stone-100 border border-petal-border rounded-button px-3.5 text-xs font-bold text-petal-text-primary"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {newProduct.sizes.map((s, i) => (
                        <span key={i} className="text-[10px] font-bold bg-stone-50 px-2 py-0.5 rounded-badge border border-stone-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="bg-transparent border border-petal-border text-petal-text-secondary text-xs font-bold px-6 py-2.5 rounded-button hover:bg-stone-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-petal-rose text-white text-xs font-bold px-7 py-2.5 rounded-button shadow-sm hover:bg-rose-500 hover:shadow-btn-active transition-all"
                  >
                    Create Product
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
