"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Heart, Search, User, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useUIStore } from "@/store/uiStore";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { items } = useCartStore();
  const { productIds } = useWishlistStore();
  const { setCartOpen, addToast } = useUIStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const totalCartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = productIds.length;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { label: "Shop", href: "/products" },
    { label: "Apothecary", href: "/products?category=apothecary" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Admin", href: "/admin" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-[50] w-full transition-all duration-300 font-dm ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-petal-border/60 shadow-sm py-4"
            : "bg-petal-canvas/90 backdrop-blur-sm border-b border-transparent py-5"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex items-center justify-between">
          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-petal-text-primary hover:text-petal-rose transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-playfair text-2xl font-bold tracking-tight text-petal-text-primary hover:text-petal-rose transition-colors duration-300">
              PETAL
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "?");
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[14px] font-semibold tracking-wide transition-all duration-200 hover:text-petal-rose relative ${
                    isActive ? "text-petal-rose" : "text-petal-text-secondary"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navActiveLine"
                      className="absolute bottom-[-6px] left-0 right-0 h-[2px] bg-petal-rose rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-5">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-petal-text-secondary hover:text-petal-rose transition-colors duration-200 p-1.5"
              aria-label="Search items"
            >
              <Search size={19} />
            </button>

            {/* Profile */}
            <Link
              href="/dashboard"
              className="text-petal-text-secondary hover:text-petal-rose transition-colors duration-200 p-1.5"
              aria-label="User Account"
            >
              <User size={19} />
            </Link>

            {/* Wishlist Link */}
            <Link
              href="/dashboard?tab=wishlist"
              className="text-petal-text-secondary hover:text-petal-rose transition-colors duration-200 p-1.5 relative"
              aria-label="Saved items"
            >
              <Heart size={19} />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-petal-rose text-white text-[9px] font-bold rounded-full flex items-center justify-center transform translate-x-1.5 -translate-y-1.5 border border-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag / Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="text-petal-text-secondary hover:text-petal-rose transition-colors duration-200 p-1.5 relative"
              aria-label="Shopping bag"
            >
              <ShoppingBag size={19} />
              {totalCartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-petal-lavender text-white text-[9px] font-bold rounded-full flex items-center justify-center transform translate-x-1.5 -translate-y-1.5 border border-white">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Floating Real-Time Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[73px] left-0 right-0 bg-white border-b border-petal-border shadow-md z-[49] py-5 px-6 font-dm"
          >
            <div className="max-w-[800px] mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-stone-50 border border-petal-border rounded-input px-5 py-3 pr-12 text-sm text-petal-text-primary placeholder-petal-text-tertiary focus:outline-none focus:border-petal-lavender focus:ring-4 focus:ring-petal-lavender/10 transition-all duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-petal-rose transition-colors"
                >
                  <Search size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Collapsible Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed top-[72px] left-0 right-0 bg-white border-b border-petal-border shadow-lg z-[48] overflow-hidden font-dm"
          >
            <div className="flex flex-col py-6 px-6 gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-semibold tracking-wide py-1.5 border-b border-stone-50 hover:text-petal-rose transition-colors duration-200 ${
                    pathname === link.href ? "text-petal-rose" : "text-petal-text-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
