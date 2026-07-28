import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  Minus, 
  Plus, 
  Trash2, 
  Tag, 
  ArrowRight, 
  ShoppingBag, 
  ArrowLeft,
  X,
  Truck
} from "lucide-react";

export const CartView: React.FC = () => {
  const { 
    cart, 
    updateCartQty, 
    removeFromCart, 
    setCurrentView, 
    appliedCoupon, 
    applyCouponCode, 
    removeCoupon,
    showToast
  } = useApp();

  const [couponInput, setCouponInput] = useState("");

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  // Free shipping above $40
  const shippingCost = cartSubtotal >= 40 || cartSubtotal === 0 ? 0 : 5.99;
  
  // Calculate discount
  const discountAmount = appliedCoupon 
    ? (cartSubtotal * appliedCoupon.discountPercent) / 100 
    : 0;

  const orderTotal = cartSubtotal - discountAmount + shippingCost;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    
    // Check min purchase
    const code = couponInput.toUpperCase().trim();
    let minPurchase = 0;
    if (code === "GIFT10") minPurchase = 20;
    else if (code === "WELCOME20") minPurchase = 40;
    else if (code === "FESTIVE30") minPurchase = 60;

    if (cartSubtotal < minPurchase) {
      showToast(`Coupon ${code} requires a minimum purchase of $${minPurchase}.`, "error");
      return;
    }

    applyCouponCode(couponInput);
    setCouponInput("");
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      showToast("Your cart is empty. Find some beautiful gifts first!", "info");
      return;
    }
    setCurrentView("checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6 font-sans">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-md">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-800 dark:text-white">Your Shopping Cart is Empty</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
          Looks like you haven't added any gorgeous gift sets or hampers to your basket yet. Let's find something perfect!
        </p>
        <button 
          onClick={() => setCurrentView("shop")}
          className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-2xl shadow-lg shadow-rose-500/20 transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CART ITEMS LIST (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Shipping notice bar */}
          <div className="flex items-center gap-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 p-4 rounded-2xl">
            <Truck className="w-5 h-5 text-rose-500 animate-bounce" />
            <div className="text-xs sm:text-sm text-rose-800 dark:text-rose-400 font-semibold">
              {cartSubtotal >= 40 ? (
                <span>🎉 Congratulations! You have unlocked <strong>FREE Express Delivery</strong>.</span>
              ) : (
                <span>Add <strong>${(40 - cartSubtotal).toFixed(2)}</strong> more to get <strong>FREE Express Delivery</strong>!</span>
              )}
            </div>
          </div>

          <div className="space-y-3.5">
            {cart.map((item) => (
              <div 
                key={item.product.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-4 rounded-3xl flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm relative group"
              >
                
                {/* Product thumbnail & Info */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-xl shrink-0" />
                  <div className="overflow-hidden">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">{item.product.name}</h3>
                    <p className="text-xs text-rose-500 font-bold font-mono">${item.product.price} each</p>
                  </div>
                </div>

                {/* Quantity and Total controls */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  
                  {/* Quantity adjustment */}
                  <div className="flex items-center justify-between border border-zinc-200 dark:border-zinc-700/60 rounded-xl p-1 bg-zinc-50 dark:bg-zinc-800/40 min-w-[110px]">
                    <button 
                      onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                      className="p-1.5 text-zinc-500 hover:text-zinc-800 dark:hover:text-white"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold font-mono px-2">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                      className="p-1.5 text-zinc-500 hover:text-zinc-800 dark:hover:text-white"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Price Sum */}
                  <div className="text-right shrink-0 min-w-[70px]">
                    <span className="text-sm font-black text-zinc-900 dark:text-white font-mono">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Remove action */}
                  <button 
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-zinc-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>

                </div>

              </div>
            ))}
          </div>

          <button 
            onClick={() => setCurrentView("shop")}
            className="text-xs sm:text-sm font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Gifting & Shopping
          </button>
        </div>

        {/* ORDER SUMMARY (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-3xl shadow-sm space-y-6">
            <h2 className="text-base font-bold text-zinc-950 dark:text-white uppercase tracking-wider pb-3 border-b border-zinc-100 dark:border-zinc-800">
              Order Summary
            </h2>

            {/* Calculations rows */}
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                <span>Subtotal</span>
                <span className="font-semibold font-mono text-zinc-800 dark:text-zinc-100">${cartSubtotal.toFixed(2)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-500">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4" /> Coupon Discount ({appliedCoupon.discountPercent}%)
                  </span>
                  <span className="font-bold font-mono">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                <span>Shipping & Wrapping</span>
                {shippingCost === 0 ? (
                  <span className="font-bold text-emerald-500 uppercase text-xs">FREE</span>
                ) : (
                  <span className="font-semibold font-mono text-zinc-800 dark:text-zinc-100">${shippingCost.toFixed(2)}</span>
                )}
              </div>

              <div className="flex justify-between text-base font-bold text-zinc-900 dark:text-white pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <span>Grand Total</span>
                <span className="font-black font-mono text-rose-600">${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupon Code input form */}
            <form onSubmit={handleApplyCoupon} className="space-y-3.5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <label className="text-xxs uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-rose-500" /> Apply Coupon Code
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 p-3 rounded-xl text-xs font-bold">
                  <span>Code Applied: {appliedCoupon.code}</span>
                  <button 
                    type="button" 
                    onClick={removeCoupon} 
                    className="p-1 hover:bg-emerald-500/20 rounded-full"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. WELCOME20" 
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-zinc-950 dark:bg-zinc-100 hover:bg-rose-500 dark:hover:bg-rose-500 text-white dark:text-zinc-950 hover:text-white dark:hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              )}
            </form>

            {/* Proceed to checkout CTA */}
            <button 
              onClick={handleProceedToCheckout}
              className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 group"
            >
              Proceed to Secure Checkout
              <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};
