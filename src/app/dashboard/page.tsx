"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PetalBadge } from "@/components/PetalBadge";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { getOrders, getFeaturedProducts, MockOrder, MockProduct } from "@/lib/db";
import { User, ShoppingBag, Heart, MapPin, Wallet, ArrowRight, Plus, Trash2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";

function UserDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useUIStore();
  const { productIds, toggleWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  // Protect Route: Customer role required
  useEffect(() => {
    if (!user) {
      addToast("Please log in to view your dashboard.", "error");
      router.push("/login");
    } else if (user.role === "admin") {
      addToast("Administrators cannot access the customer dashboard.", "error");
      router.push("/admin");
    }
  }, [user, router]);

  const activeTab = searchParams.get("tab") || "profile";

  // State
  const [orders, setOrders] = useState<MockOrder[]>([]);
  const [wishlistItems, setWishlistItems] = useState<MockProduct[]>([]);
  const [walletBalance, setWalletBalance] = useState(15000.0);
  const [addFundsAmount, setAddFundsAmount] = useState("");
  const [userProfile, setUserProfile] = useState({
    name: "Ankit K.",
    email: "anket15@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    phone: "+1 (555) 019-2834",
    joined: "May 2026",
  });

  // Sync profile state with logged-in user
  useEffect(() => {
    if (user) {
      setUserProfile((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  // Fetch orders & wishlist items
  useEffect(() => {
    async function loadDashboardData() {
      // Load orders
      const ords = await getOrders("mock-user-1");
      setOrders(ords);

      // Load wishlist items
      const allProducts = await getFeaturedProducts();
      const wishes = allProducts.filter((p) => productIds.includes(p.id));
      setWishlistItems(wishes);
    }
    loadDashboardData();
  }, [productIds]);

  const handleTabChange = (tabName: string) => {
    router.push(`/dashboard?tab=${tabName}`);
  };

  const handleAddFunds = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(addFundsAmount);
    if (!isNaN(amt) && amt > 0) {
      setWalletBalance((prev) => prev + amt);
      addFundsAmount && addToast(`Added Rs ${amt.toFixed(2)} to your wallet.`, "success");
      setAddFundsAmount("");
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

  const handleRemoveWishlist = (productId: string) => {
    toggleWishlist(productId);
    addToast("Removed item from your wishlist.", "neutral");
  };

  return (
    <div className="flex-1 bg-petal-canvas font-dm py-10 text-left">
      <div className="max-w-[1280px] mx-auto px-6 md:px-16">
        {/* Intro greeting */}
        <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-petal-text-tertiary">
              Studio Portal
            </span>
            <h1 className="text-4xl font-bold font-playfair text-petal-text-primary mt-1">
              welcome back, <span className="italic font-normal text-petal-rose">{userProfile.name}</span>
            </h1>
          </div>

          {/* Wallet Balance Strip */}
          <div className="bg-white border border-petal-border p-4.5 rounded-card shadow-sm flex items-center gap-5">
            <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-petal-lavender">
              <Wallet size={16} />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-petal-text-tertiary">
                Wallet Balance
              </div>
              <div className="text-lg font-bold text-petal-text-primary mt-0.5">
                Rs {walletBalance.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column Sidebar (3 cols) */}
          <aside className="lg:col-span-3 bg-white border border-petal-border rounded-card p-5 shadow-sm space-y-2">
            {[
              { id: "profile", label: "Studio Profile", icon: User },
              { id: "orders", label: "Order Logs", icon: ShoppingBag },
              { id: "wishlist", label: "Your Wishlist", icon: Heart },
              { id: "wallet", label: "Wallet & Funds", icon: Wallet },
            ].map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
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

          {/* Right Column Content (9 cols) */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {/* PROFILE TAB */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white border border-petal-border rounded-card p-6.5 shadow-sm space-y-8"
                >
                  <div>
                    <h2 className="font-playfair text-xl font-bold text-petal-text-primary mb-1">
                      Studio Profile
                    </h2>
                    <p className="text-xs text-petal-text-secondary font-semibold">
                      Manage your contact details and shipping parameters.
                    </p>
                  </div>

                  {/* Avatar & details */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-stone-50">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-stone-50 border border-stone-100 flex-shrink-0">
                      <img src={userProfile.avatar} alt="User Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="font-playfair text-lg font-bold text-petal-text-primary">
                        {userProfile.name}
                      </h3>
                      <p className="text-xs text-petal-text-secondary mt-1 font-medium">
                        Circle member since {userProfile.joined}
                      </p>
                      <button
                        onClick={() => addToast("Avatar updates are disabled for mock users.", "neutral")}
                        className="mt-3.5 bg-petal-canvas border border-petal-border hover:border-petal-border-hover text-petal-text-secondary hover:text-petal-text-primary font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded-badge transition-all"
                      >
                        Change Photo
                      </button>
                    </div>
                  </div>

                  {/* Settings grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                    <div>
                      <span className="block font-bold text-[10px] uppercase tracking-widest text-stone-400 mb-2">
                        Email Address
                      </span>
                      <div className="bg-stone-50 border border-petal-border/60 rounded-input px-4 py-3 text-petal-text-secondary font-semibold">
                        {userProfile.email}
                      </div>
                    </div>
                    <div>
                      <span className="block font-bold text-[10px] uppercase tracking-widest text-stone-400 mb-2">
                        Contact Phone
                      </span>
                      <div className="bg-stone-50 border border-petal-border/60 rounded-input px-4 py-3 text-petal-text-secondary font-semibold">
                        {userProfile.phone}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ORDER LOGS TAB */}
              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-white border border-petal-border rounded-card p-6.5 shadow-sm">
                    <h2 className="font-playfair text-xl font-bold text-petal-text-primary mb-1">
                      Order Logs
                    </h2>
                    <p className="text-xs text-petal-text-secondary font-semibold">
                      Review dispatch channels and status markers for ordered items.
                    </p>
                  </div>

                  {orders.length > 0 ? (
                    <div className="space-y-5">
                      {orders.map((ord) => {
                        // Badge color maps
                        let badgeType: "rose" | "lavender" | "sky" | "sage" | "neutral" = "lavender";
                        if (ord.status === "DELIVERED") badgeType = "sage";
                        if (ord.status === "SHIPPED") badgeType = "sky";
                        if (ord.status === "CANCELLED") badgeType = "rose";

                        return (
                          <div
                            key={ord.id}
                            className="bg-white border border-petal-border rounded-card p-5.5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <span className="font-playfair text-sm italic font-bold text-petal-text-primary">
                                  Order #{ord.id}
                                </span>
                                <PetalBadge variant={badgeType} label={ord.status} />
                              </div>
                              <p className="text-xs text-petal-text-secondary font-medium leading-relaxed max-w-[400px]">
                                <strong>Destination:</strong> {ord.address} <br />
                                <strong>Date:</strong> {new Date(ord.createdAt).toLocaleDateString()}
                              </p>
                            </div>

                            <div className="text-left md:text-right space-y-2.5 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-stone-50">
                              <div className="text-sm font-bold text-petal-text-primary">
                                Total paid: Rs {ord.total.toFixed(2)}
                              </div>
                              <span className="text-[10px] uppercase font-bold text-petal-text-tertiary tracking-wider block">
                                Paid via {ord.paymentMethod}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-white border border-petal-border rounded-card p-12 shadow-sm text-center">
                      <p className="text-sm font-semibold text-petal-text-secondary italic">
                        You have not placed any orders yet.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* WISHLIST TAB */}
              {activeTab === "wishlist" && (
                <motion.div
                  key="wishlist"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-white border border-petal-border rounded-card p-6.5 shadow-sm">
                    <h2 className="font-playfair text-xl font-bold text-petal-text-primary mb-1">
                      Your Wishlist
                    </h2>
                    <p className="text-xs text-petal-text-secondary font-semibold">
                      Your saved pieces ready to accent intentional spaces.
                    </p>
                  </div>

                  {wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlistItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white border border-petal-border hover:border-petal-border-hover rounded-card p-4 shadow-sm flex flex-col justify-between group transition-all"
                        >
                          <div>
                            <div className="aspect-[4/3] rounded-thumbnail overflow-hidden bg-stone-50 border border-stone-100 mb-3.5 relative">
                              <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                              <button
                                onClick={() => handleRemoveWishlist(item.id)}
                                className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-stone-100 text-stone-400 hover:text-petal-rose transition-colors"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                            <span className="text-[9px] tracking-widest uppercase font-bold text-petal-text-tertiary block">
                              {item.brand}
                            </span>
                            <h4 className="font-bold text-xs text-petal-text-primary mt-1 line-clamp-1">
                              {item.title}
                            </h4>
                          </div>

                          <div className="flex items-center justify-between gap-3 mt-4">
                            <span className="text-xs font-bold text-petal-text-primary">
                              Rs {item.price.toFixed(2)}
                            </span>
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="bg-petal-rose hover:bg-rose-500 text-white font-semibold text-[10px] px-3.5 py-1.5 rounded-button shadow-sm hover:shadow-btn-active transition-all"
                            >
                              Add to bag
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-petal-border rounded-card p-12 shadow-sm text-center">
                      <p className="text-sm font-semibold text-petal-text-secondary italic">
                        No saved items in your wishlist circle.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* WALLET TAB */}
              {activeTab === "wallet" && (
                <motion.div
                  key="wallet"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white border border-petal-border rounded-card p-6.5 shadow-sm space-y-8"
                >
                  <div>
                    <h2 className="font-playfair text-xl font-bold text-petal-text-primary mb-1">
                      Wallet & Funds
                    </h2>
                    <p className="text-xs text-petal-text-secondary font-semibold">
                      Add mock credits to your shopping balance to evaluate payments.
                    </p>
                  </div>

                  {/* Add Funds Form */}
                  <form onSubmit={handleAddFunds} className="space-y-4 max-w-[360px]">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5">
                        Add Funds (Rs)
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="number"
                          required
                          min="100"
                          max="50000"
                          placeholder="e.g. 50"
                          value={addFundsAmount}
                          onChange={(e) => setAddFundsAmount(e.target.value)}
                          className="flex-1 bg-stone-50 border border-petal-border rounded-input px-4 py-2.5 text-xs text-petal-text-primary placeholder-petal-text-tertiary focus:outline-none focus:border-petal-lavender focus:ring-4 focus:ring-petal-lavender/10 transition-all"
                        />
                        <button
                          type="submit"
                          className="bg-petal-rose text-white text-xs font-bold px-6 py-2.5 rounded-button shadow-sm hover:bg-rose-500 hover:shadow-btn-active transition-all"
                        >
                          Add Credits
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Benefits guidelines */}
                  <div className="bg-petal-subtle border border-purple-50/50 p-5 rounded-card flex gap-4 text-xs font-medium leading-relaxed text-petal-text-secondary">
                    <ShieldCheck size={18} className="text-petal-lavender flex-shrink-0" />
                    <p>
                      <strong>Circle wallet credits</strong> can be checked out during cart submissions. Coupon codes (such as <strong className="text-petal-lavender">SLOW10</strong>) apply on top of wallet transactions!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserDashboardPage() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <div className="flex-1 bg-petal-canvas flex items-center justify-center min-h-[400px]">
            <span className="text-petal-text-secondary text-sm font-semibold font-dm animate-pulse">
              Authenticating user circle...
            </span>
          </div>
        }
      >
        <UserDashboardContent />
      </Suspense>
      <Footer />
    </>
  );
}
