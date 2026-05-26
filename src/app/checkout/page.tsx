"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { createOrder, getCoupons } from "@/lib/db";
import {
  MapPin,
  CreditCard,
  CheckCircle,
  ShieldCheck,
  ChevronRight,
  Plus,
  TrendingUp,
  ArrowLeft,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ShippingAddress {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { addToast } = useUIStore();
  const { items, couponCode, getSubtotal, getDiscountAmount, getDeliveryCost, getTotal, clearCart } =
    useCartStore();

  const [currentStep, setCurrentStep] = useState(0); // 0 = Address, 1 = Payment, 2 = Review, 3 = Success
  const [placedOrderId, setPlacedOrderId] = useState("");

  // Step 0 Address States
  const [addresses, setAddresses] = useState<ShippingAddress[]>([
    {
      id: "addr-1",
      name: "Ankit K.",
      phone: "+1 (555) 019-2834",
      street: "124 Intentional Way, Apt 3B",
      city: "Portland",
      postalCode: "97201",
      country: "United States",
      isDefault: true,
    },
    {
      id: "addr-2",
      name: "Ochre Design Studio",
      phone: "+1 (555) 043-9812",
      street: "88 Clay & Stoneware Blvd",
      city: "Seattle",
      postalCode: "98101",
      country: "United States",
      isDefault: false,
    },
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState("addr-1");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
    country: "United States",
  });

  // Step 1 Payment States
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod">("card");
  const [cardInfo, setCardInfo] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [upiId, setUpiId] = useState("");

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const delivery = getDeliveryCost();
  const total = getTotal();

  // Redirect if cart is empty and not on success step
  useEffect(() => {
    if (items.length === 0 && currentStep < 3) {
      router.push("/products");
    }
  }, [items, currentStep, router]);

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newAddress.name &&
      newAddress.phone &&
      newAddress.street &&
      newAddress.city &&
      newAddress.postalCode
    ) {
      const added: ShippingAddress = {
        id: `addr-${Date.now()}`,
        ...newAddress,
        isDefault: false,
      };
      setAddresses([...addresses, added]);
      setSelectedAddressId(added.id);
      setShowNewAddressForm(false);
      setNewAddress({ name: "", phone: "", street: "", city: "", postalCode: "", country: "United States" });
      addToast("New shipping address added.", "success");
    }
  };

  const handlePlaceOrder = async () => {
    const activeAddress = addresses.find((a) => a.id === selectedAddressId);
    if (!activeAddress) return;

    try {
      const dbItems = items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        color: i.color,
        size: i.size,
      }));

      const newOrder = await createOrder({
        userId: "mock-user-1",
        items: dbItems,
        total: total,
        address: `${activeAddress.name}, ${activeAddress.street}, ${activeAddress.city}, ${activeAddress.postalCode}, ${activeAddress.country}`,
        couponCode: couponCode || undefined,
        paymentMethod: paymentMethod.toUpperCase(),
      });

      setPlacedOrderId(newOrder.id);
      addToast("Order placed successfully!", "success");
      clearCart();
      setCurrentStep(3); // Go to success page
    } catch (err) {
      addToast("Failed to place order. Please try again.", "error");
    }
  };

  const steps = [
    { label: "Shipping", icon: MapPin },
    { label: "Payment", icon: CreditCard },
    { label: "Review", icon: CheckCircle },
  ];

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-petal-canvas font-dm py-12 select-none">
        <div className="max-w-[1080px] mx-auto px-6 md:px-16">
          {/* Stepper Headers */}
          {currentStep < 3 && (
            <div className="flex items-center justify-between mb-12 max-w-[600px] mx-auto">
              {steps.map((step, idx) => {
                const IconComponent = step.icon;
                const isCompleted = currentStep > idx;
                const isActive = currentStep === idx;
                return (
                  <React.Fragment key={idx}>
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                          isCompleted
                            ? "bg-petal-rose border-petal-rose text-white"
                            : isActive
                            ? "border-petal-rose text-petal-rose bg-white"
                            : "border-stone-200 text-stone-400 bg-white"
                        }`}
                      >
                        {isCompleted ? <CheckCircle size={15} className="fill-white text-petal-rose" /> : <IconComponent size={14} />}
                      </div>
                      <span
                        className={`text-xs font-bold uppercase tracking-wider ${
                          isActive || isCompleted ? "text-petal-text-primary" : "text-petal-text-tertiary"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                          isCompleted ? "bg-petal-rose" : "bg-stone-200"
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Content column: Forms or success details */}
            <div className="lg:col-span-8 space-y-6">
              <AnimatePresence mode="wait">
                {/* STEP 0: SHIPPING ADDRESS */}
                {currentStep === 0 && (
                  <motion.div
                    key="step-shipping"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    className="space-y-6 text-left"
                  >
                    <div className="bg-white border border-petal-border rounded-card p-6.5 shadow-sm">
                      <h2 className="font-playfair text-xl font-bold text-petal-text-primary mb-1">
                        Shipping Address
                      </h2>
                      <p className="text-xs text-petal-text-secondary font-semibold mb-6">
                        Where should we dispatch your intentional pieces?
                      </p>

                      {/* Saved addresses list */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {addresses.map((addr) => (
                          <div
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`border rounded-card p-5 cursor-pointer transition-all relative ${
                              selectedAddressId === addr.id
                                ? "border-petal-rose bg-rose-50/20 shadow-sm"
                                : "border-petal-border hover:border-petal-border-hover bg-white"
                            }`}
                          >
                            <div className="font-bold text-sm text-petal-text-primary mb-1">
                              {addr.name}
                            </div>
                            <div className="text-xs text-petal-text-secondary leading-relaxed font-medium">
                              {addr.street} <br />
                              {addr.city}, {addr.postalCode} <br />
                              {addr.country}
                            </div>
                            <div className="text-[10px] text-stone-400 mt-3 font-semibold">
                              {addr.phone}
                            </div>
                            {selectedAddressId === addr.id && (
                              <div className="absolute top-4 right-4 w-4 h-4 bg-petal-rose text-white rounded-full flex items-center justify-center border border-white">
                                <span className="text-[8px]">✓</span>
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Add Address button card */}
                        <button
                          onClick={() => setShowNewAddressForm(true)}
                          className="border border-dashed border-stone-200 hover:border-petal-lavender hover:bg-purple-50/10 rounded-card p-5 flex flex-col items-center justify-center text-center gap-2 group transition-all"
                        >
                          <Plus size={20} className="text-stone-400 group-hover:text-petal-lavender transition-colors" />
                          <span className="text-xs font-bold text-stone-500 group-hover:text-petal-lavender transition-colors">
                            Add New Address
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* New Address Dialog Form */}
                    {showNewAddressForm && (
                      <motion.form
                        onSubmit={handleAddAddress}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-white border border-petal-border rounded-card p-6.5 shadow-sm space-y-4"
                      >
                        <h3 className="font-playfair text-base font-bold text-petal-text-primary mb-3">
                          New Shipping Destination
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5">
                              Recipient Name
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Jane D."
                              value={newAddress.name}
                              onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                              className="w-full bg-stone-50 border border-petal-border rounded-input px-4 py-2.5 text-xs text-petal-text-primary placeholder-petal-text-tertiary focus:outline-none focus:border-petal-lavender focus:ring-4 focus:ring-petal-lavender/10 transition-all duration-200"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              required
                              placeholder="+1 (555) 012-3456"
                              value={newAddress.phone}
                              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                              className="w-full bg-stone-50 border border-petal-border rounded-input px-4 py-2.5 text-xs text-petal-text-primary placeholder-petal-text-tertiary focus:outline-none focus:border-petal-lavender focus:ring-4 focus:ring-petal-lavender/10 transition-all duration-200"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5">
                            Street Address
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="123 Harmony lane, Suite 4"
                            value={newAddress.street}
                            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                            className="w-full bg-stone-50 border border-petal-border rounded-input px-4 py-2.5 text-xs text-petal-text-primary placeholder-petal-text-tertiary focus:outline-none focus:border-petal-lavender focus:ring-4 focus:ring-petal-lavender/10 transition-all duration-200"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5">
                              City
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Portland"
                              value={newAddress.city}
                              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                              className="w-full bg-stone-50 border border-petal-border rounded-input px-4 py-2.5 text-xs text-petal-text-primary placeholder-petal-text-tertiary focus:outline-none focus:border-petal-lavender focus:ring-4 focus:ring-petal-lavender/10 transition-all duration-200"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5">
                              Postal Code
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="97201"
                              value={newAddress.postalCode}
                              onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                              className="w-full bg-stone-50 border border-petal-border rounded-input px-4 py-2.5 text-xs text-petal-text-primary placeholder-petal-text-tertiary focus:outline-none focus:border-petal-lavender focus:ring-4 focus:ring-petal-lavender/10 transition-all duration-200"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5">
                              Country
                            </label>
                            <select
                              value={newAddress.country}
                              onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                              className="w-full bg-stone-50 border border-petal-border rounded-input px-4 py-2.5 text-xs text-petal-text-primary focus:outline-none focus:border-petal-lavender transition-all cursor-pointer font-bold"
                            >
                              <option value="United States">United States</option>
                              <option value="Canada">Canada</option>
                              <option value="India">India</option>
                              <option value="United Kingdom">United Kingdom</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-3">
                          <button
                            type="button"
                            onClick={() => setShowNewAddressForm(false)}
                            className="bg-transparent border border-petal-border text-petal-text-secondary text-xs font-bold px-5 py-2.5 rounded-button hover:bg-stone-50 hover:border-petal-border-hover transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-petal-rose text-white text-xs font-bold px-6 py-2.5 rounded-button hover:bg-rose-500 shadow-sm hover:shadow-btn-active transition-all"
                          >
                            Save Address
                          </button>
                        </div>
                      </motion.form>
                    )}

                    <div className="flex justify-end">
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="bg-petal-rose text-white font-semibold text-[14px] px-8 py-3.5 rounded-button shadow-md hover:bg-rose-500 hover:shadow-btn-active transition-all duration-200 flex items-center gap-1.5"
                      >
                        Continue to Payment
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 1: PAYMENT METHOD */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-payment"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    className="space-y-6 text-left"
                  >
                    <div className="bg-white border border-petal-border rounded-card p-6.5 shadow-sm">
                      <h2 className="font-playfair text-xl font-bold text-petal-text-primary mb-1">
                        Secure Payments
                      </h2>
                      <p className="text-xs text-petal-text-secondary font-semibold mb-6">
                        Transactions are fully encrypted. Select your preferred gateway:
                      </p>

                      <div className="space-y-4">
                        {/* Option 1: Credit Card */}
                        <div
                          onClick={() => setPaymentMethod("card")}
                          className={`border rounded-card p-5 cursor-pointer transition-all relative ${
                            paymentMethod === "card"
                              ? "border-petal-rose bg-rose-50/20"
                              : "border-petal-border hover:border-petal-border-hover bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-3.5 mb-4">
                            <input
                              type="radio"
                              checked={paymentMethod === "card"}
                              onChange={() => setPaymentMethod("card")}
                              className="accent-petal-rose w-4 h-4 cursor-pointer"
                            />
                            <div className="font-bold text-sm text-petal-text-primary">
                              Stripe Credit Card
                            </div>
                          </div>

                          {paymentMethod === "card" && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="space-y-4 pt-2"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5">
                                    Card Number
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="4242 4242 4242 4242"
                                    value={cardInfo.number}
                                    onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })}
                                    className="w-full bg-white border border-petal-border rounded-input px-4 py-2.5 text-xs text-petal-text-primary focus:outline-none focus:border-petal-lavender"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5">
                                    Cardholder Name
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Jane D."
                                    value={cardInfo.name}
                                    onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value })}
                                    className="w-full bg-white border border-petal-border rounded-input px-4 py-2.5 text-xs text-petal-text-primary focus:outline-none focus:border-petal-lavender"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5">
                                    Expiry Month/Year
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="MM / YY"
                                    value={cardInfo.expiry}
                                    onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                                    className="w-full bg-white border border-petal-border rounded-input px-4 py-2.5 text-xs text-petal-text-primary focus:outline-none focus:border-petal-lavender"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5">
                                    CVC Security Code
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="123"
                                    value={cardInfo.cvc}
                                    onChange={(e) => setCardInfo({ ...cardInfo, cvc: e.target.value })}
                                    className="w-full bg-white border border-petal-border rounded-input px-4 py-2.5 text-xs text-petal-text-primary focus:outline-none focus:border-petal-lavender"
                                  />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>

                        {/* Option 2: Razorpay UPI */}
                        <div
                          onClick={() => setPaymentMethod("upi")}
                          className={`border rounded-card p-5 cursor-pointer transition-all relative ${
                            paymentMethod === "upi"
                              ? "border-petal-rose bg-rose-50/20"
                              : "border-petal-border hover:border-petal-border-hover bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-3.5 mb-4">
                            <input
                              type="radio"
                              checked={paymentMethod === "upi"}
                              onChange={() => setPaymentMethod("upi")}
                              className="accent-petal-rose w-4 h-4 cursor-pointer"
                            />
                            <div className="font-bold text-sm text-petal-text-primary">
                              Razorpay Instant UPI
                            </div>
                          </div>

                          {paymentMethod === "upi" && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="space-y-4 pt-2"
                            >
                              <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                  type="text"
                                  placeholder="e.g. ankit@okaxis"
                                  value={upiId}
                                  onChange={(e) => setUpiId(e.target.value)}
                                  className="flex-1 bg-white border border-petal-border rounded-input px-4 py-2.5 text-xs text-petal-text-primary focus:outline-none focus:border-petal-lavender"
                                />
                                <button
                                  type="button"
                                  onClick={() => addToast("UPI handles authenticated.", "success")}
                                  className="bg-purple-50 border border-purple-100 hover:border-petal-lavender text-petal-lavender font-bold text-xs px-6 py-2.5 rounded-button transition-all"
                                >
                                  Verify VPA
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </div>

                        {/* Option 3: COD */}
                        <div
                          onClick={() => setPaymentMethod("cod")}
                          className={`border rounded-card p-5 cursor-pointer transition-all relative ${
                            paymentMethod === "cod"
                              ? "border-petal-rose bg-rose-50/20"
                              : "border-petal-border hover:border-petal-border-hover bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <input
                              type="radio"
                              checked={paymentMethod === "cod"}
                              onChange={() => setPaymentMethod("cod")}
                              className="accent-petal-rose w-4 h-4 cursor-pointer"
                            />
                            <div>
                              <div className="font-bold text-sm text-petal-text-primary">
                                Cash on Delivery (COD)
                              </div>
                              <p className="text-[11px] text-stone-400 font-semibold mt-0.5">
                                Pay with physical cash when our shipping partner delivers.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => setCurrentStep(0)}
                        className="flex items-center gap-1.5 text-xs font-bold text-petal-text-secondary hover:text-petal-rose transition-colors"
                      >
                        <ChevronLeft size={15} />
                        Back to shipping
                      </button>
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="bg-petal-rose text-white font-semibold text-[14px] px-8 py-3.5 rounded-button shadow-md hover:bg-rose-500 hover:shadow-btn-active transition-all duration-200 flex items-center gap-1.5"
                      >
                        Review order details
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: REVIEW ORDER */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-review"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    className="space-y-6 text-left"
                  >
                    <div className="bg-white border border-petal-border rounded-card p-6.5 shadow-sm space-y-6">
                      <div>
                        <h2 className="font-playfair text-xl font-bold text-petal-text-primary mb-1">
                          Review Sanctuary Order
                        </h2>
                        <p className="text-xs text-petal-text-secondary font-semibold">
                          Final look at your details before crafting dispatch paths.
                        </p>
                      </div>

                      {/* Items verification lists */}
                      <div className="border-y border-stone-100 py-5 space-y-4">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                              <div className="w-12 h-12 rounded-[10px] overflow-hidden bg-stone-50 border border-stone-100 flex-shrink-0">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-petal-text-primary line-clamp-1">
                                  {item.title}
                                </h4>
                                <div className="text-[10px] font-bold text-petal-text-secondary mt-0.5">
                                  {item.brand} • Size: {item.size || "default"}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-bold text-petal-text-primary">
                                Rs {(item.price * item.quantity).toFixed(2)}
                              </div>
                              <div className="text-[10px] text-stone-400 font-semibold mt-0.5">
                                Qty: {item.quantity}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Info Summary Blocks */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs leading-relaxed">
                        <div className="border border-stone-100 p-4.5 rounded-card">
                          <h4 className="font-bold text-petal-text-primary mb-2 uppercase tracking-wider text-[10px]">
                            Shipping To
                          </h4>
                          {(() => {
                            const addr = addresses.find((a) => a.id === selectedAddressId);
                            if (!addr) return null;
                            return (
                              <p className="text-petal-text-secondary font-medium">
                                <strong>{addr.name}</strong> <br />
                                {addr.street} <br />
                                {addr.city}, {addr.postalCode}, {addr.country} <br />
                                Phone: {addr.phone}
                              </p>
                            );
                          })()}
                        </div>

                        <div className="border border-stone-100 p-4.5 rounded-card">
                          <h4 className="font-bold text-petal-text-primary mb-2 uppercase tracking-wider text-[10px]">
                            Paid Via
                          </h4>
                          <p className="text-petal-text-secondary font-medium">
                            {paymentMethod === "card" && "Stripe Credit Card"}
                            {paymentMethod === "upi" && `Razorpay UPI (${upiId || "authenticated"})`}
                            {paymentMethod === "cod" && "Cash on Delivery (COD)"}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-petal-sage font-semibold mt-3">
                            <ShieldCheck size={13} />
                            SSL Fully Encrypted Protocol
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="flex items-center gap-1.5 text-xs font-bold text-petal-text-secondary hover:text-petal-rose transition-colors"
                      >
                        <ChevronLeft size={15} />
                        Back to payment
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        className="bg-petal-rose text-white font-semibold text-[15px] px-10 py-4 rounded-button shadow-md hover:bg-rose-500 hover:shadow-btn-active active:shadow-sm transition-all duration-200 flex items-center gap-2"
                      >
                        Complete Order & Dispatch
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: SUCCESS ANIMATED SCREEN */}
                {currentStep === 3 && (
                  <motion.div
                    key="step-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-12 py-16 text-center max-w-[640px] mx-auto space-y-8"
                  >
                    {/* Animated Checkmark in Sage */}
                    <div className="flex justify-center">
                      <motion.div
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 10, stiffness: 100 }}
                        className="w-24 h-24 bg-[#ECFDF5] text-petal-sage border border-emerald-100 rounded-full flex items-center justify-center shadow-md relative"
                      >
                        <span className="text-4xl">✓</span>
                        <div className="absolute inset-0 rounded-full border-4 border-emerald-400/20 animate-ping pointer-events-none" />
                      </motion.div>
                    </div>

                    <div className="space-y-4">
                      <span className="text-[11px] uppercase tracking-widest font-bold text-petal-sage">
                        Triumph! Transaction Success
                      </span>
                      <h2 className="text-4xl md:text-5xl font-bold font-playfair text-petal-text-primary tracking-tight">
                        order placed! <br />
                        <span className="italic font-normal text-petal-rose">thank you</span>
                      </h2>
                      <p className="text-sm text-petal-text-secondary font-medium leading-relaxed max-w-[400px] mx-auto">
                        Your order has been recorded in our journal log. We are carefully wraps-coating your pieces in biodegradable packaging.
                      </p>
                    </div>

                    {/* Order Number Badge */}
                    <div className="flex justify-center">
                      <div className="bg-petal-subtle border border-purple-50 text-petal-lavender text-xs font-bold px-6 py-2.5 rounded-badge tracking-wider uppercase">
                        Order ref: #{placedOrderId || "PTL-998822"}
                      </div>
                    </div>

                    {/* Navigation Actions */}
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
                      <button
                        onClick={() => router.push("/dashboard?tab=orders")}
                        className="bg-petal-rose text-white font-semibold text-sm px-8 py-3.5 rounded-button shadow-md hover:bg-rose-500 hover:shadow-btn-active transition-all"
                      >
                        Track Sanctuary Order
                      </button>
                      <button
                        onClick={() => router.push("/products")}
                        className="bg-transparent border-1.5 border-petal-border text-petal-text-primary font-semibold text-sm px-8 py-3.5 rounded-button hover:bg-white hover:border-petal-border-hover transition-all"
                      >
                        Continue Browsing
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Side Summary panel (only displayed when checkout is in progress) */}
            {currentStep < 3 && (
              <div className="lg:col-span-4 bg-white border border-petal-border rounded-card p-6 shadow-sm text-left">
                <h3 className="font-playfair text-lg font-bold text-petal-text-primary border-b border-stone-50 pb-3 mb-5">
                  Order Summary
                </h3>

                {/* Subtotals Block */}
                <div className="space-y-3.5 text-xs text-petal-text-secondary font-medium">
                  <div className="flex justify-between">
                    <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span className="text-petal-text-primary">Rs {subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-petal-rose font-semibold">
                      <span>Active Coupon Discount</span>
                      <span>−Rs {discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Standard Shipping</span>
                    <span className="text-petal-text-primary">
                      {delivery === 0 ? "Free" : `Rs ${delivery.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-petal-text-primary pt-3.5 border-t border-stone-100">
                    <span className="font-playfair text-base italic">Total</span>
                    <span className="font-playfair text-lg font-bold">Rs {total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Coupon notification if any */}
                {couponCode && (
                  <div className="mt-5 bg-purple-50/50 border border-purple-100/50 rounded-badge px-3 py-2 text-[10px] text-petal-lavender font-bold flex items-center gap-1.5">
                    <span>✓ Coupon &ldquo;{couponCode}&rdquo; Applied</span>
                  </div>
                )}

                <div className="mt-6 pt-5 border-t border-stone-100 flex items-center gap-3.5 text-[11px] text-stone-400 font-semibold leading-relaxed">
                  <ShieldCheck size={16} className="text-petal-sage flex-shrink-0" />
                  <span>Your connection is securely encrypted and validated.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
