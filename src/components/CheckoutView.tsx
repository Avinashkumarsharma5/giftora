import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  CreditCard, 
  Wallet, 
  Truck, 
  CheckCircle, 
  Gift, 
  ArrowLeft, 
  Lock, 
  AlertCircle 
} from "lucide-react";

export const CheckoutView: React.FC = () => {
  const { 
    cart, 
    currentUser, 
    appliedCoupon, 
    createOrder, 
    setCurrentView,
    showToast
  } = useApp();

  // Shipment form inputs
  const [fullName, setFullName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card" | "upi">("card");

  // Payment detailed inputs
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");

  // Checkout Status States
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  // Totals calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingCost = cartSubtotal >= 40 ? 0 : 5.99;
  const discountAmount = appliedCoupon ? (cartSubtotal * appliedCoupon.discountPercent) / 100 : 0;
  const grandTotal = cartSubtotal - discountAmount + shippingCost;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      showToast("Please sign in or register to complete checkout.", "error");
      setCurrentView("login");
      return;
    }

    if (!fullName || !addressLine1 || !city || !postalCode || !phone) {
      showToast("Please fill in all shipping details.", "error");
      return;
    }

    if (paymentMethod === "card" && (!cardNumber || !cardExpiry || !cardCvv)) {
      showToast("Please fill in your card details.", "error");
      return;
    }

    if (paymentMethod === "upi" && !upiId) {
      showToast("Please enter your UPI ID.", "error");
      return;
    }

    setSubmitting(true);
    showToast("Processing secure authorization transaction...", "info");

    try {
      // Create Order payload
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image
      }));

      const newOrder = await createOrder({
        items: orderItems,
        total: grandTotal,
        shippingAddress: {
          fullName,
          addressLine1,
          city,
          postalCode,
          phone
        },
        paymentMethod
      });

      setPlacedOrder(newOrder);
      showToast("Order placed successfully! Custom card prepared.", "success");
    } catch (err: any) {
      console.error(err);
      showToast("Failed to process transaction. Please verify card attributes.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION COMPONENT
  if (placedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-8 font-sans">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-rose-500 rounded-full blur-xl opacity-30 animate-pulse" />
          <div className="w-20 h-20 bg-rose-500 text-white rounded-full flex items-center justify-center relative mx-auto shadow-xl">
            <CheckCircle className="w-10 h-10" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Order Confirmed!</h1>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">
            Thank you for shopping with Giftora. Your luxurious, curated gift hampers are being prepared for dispatch!
          </p>
        </div>

        {/* Invoice Brief Card */}
        <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 p-6 rounded-3xl space-y-4 text-left">
          <div className="flex justify-between items-center pb-3 border-b border-zinc-200/50 dark:border-zinc-800/50">
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Tracking Code</span>
            <span className="text-sm font-bold text-rose-500 font-mono">{placedOrder.trackingNumber}</span>
          </div>

          <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex justify-between">
              <span>Recipient Name:</span>
              <strong className="font-bold text-zinc-900 dark:text-white">{placedOrder.shippingAddress.fullName}</strong>
            </div>
            <div className="flex justify-between">
              <span>Destination City:</span>
              <strong className="font-bold text-zinc-900 dark:text-white">{placedOrder.shippingAddress.city}</strong>
            </div>
            <div className="flex justify-between">
              <span>Delivery Timeline:</span>
              <strong className="font-bold text-rose-500 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> 2 - 3 Days (Express)
              </strong>
            </div>
            <div className="flex justify-between pt-3 border-t border-zinc-200/50 dark:border-zinc-800/50 text-sm font-black text-zinc-900 dark:text-white">
              <span>Total Debited:</span>
              <span className="font-mono text-rose-600">${placedOrder.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            onClick={() => setCurrentView("profile")}
            className="px-6 py-3 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-semibold rounded-2xl shadow-md transition-colors cursor-pointer"
          >
            Track in My Orders
          </button>
          <button 
            onClick={() => setCurrentView("home")}
            className="px-6 py-3 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-white font-semibold rounded-2xl transition-all cursor-pointer"
          >
            Continue Gifting
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      {/* Return link */}
      <button 
        onClick={() => setCurrentView("cart")}
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-rose-500 mb-8 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4.5 h-4.5" /> Back to Cart
      </button>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight mb-8">Secure Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SHIPPMENT & PAYMENT FORMS (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Shipment Section */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-3xl shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-rose-500" />
              Shipping Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xxs uppercase tracking-wider text-zinc-400 font-bold">Recipient Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Eleanor Vance" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xxs uppercase tracking-wider text-zinc-400 font-bold">Street Address</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 104 Celebration Lane, Apt 4C" 
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xxs uppercase tracking-wider text-zinc-400 font-bold">City / State</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Miami, FL" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xxs uppercase tracking-wider text-zinc-400 font-bold">Postal Zip Code</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 33101" 
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xxs uppercase tracking-wider text-zinc-400 font-bold">Recipient Mobile Phone</label>
                <input 
                  type="tel" 
                  required
                  placeholder="e.g. +1 (555) 438-4438" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-3xl shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-rose-500" />
              Secure Payment Method
            </h2>

            {/* Custom Payment selector grid */}
            <div className="grid grid-cols-3 gap-4">
              <div 
                onClick={() => setPaymentMethod("card")}
                className={`border rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-all ${paymentMethod === "card" ? "border-rose-500 bg-rose-50/20 dark:bg-rose-950/10 text-rose-600" : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 text-zinc-500"}`}
              >
                <CreditCard className="w-6 h-6" />
                <span className="text-xs font-bold">Card</span>
              </div>

              <div 
                onClick={() => setPaymentMethod("upi")}
                className={`border rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-all ${paymentMethod === "upi" ? "border-rose-500 bg-rose-50/20 dark:bg-rose-950/10 text-rose-600" : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 text-zinc-500"}`}
              >
                <Wallet className="w-6 h-6" />
                <span className="text-xs font-bold">UPI ID</span>
              </div>

              <div 
                onClick={() => setPaymentMethod("cod")}
                className={`border rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-all ${paymentMethod === "cod" ? "border-rose-500 bg-rose-50/20 dark:bg-rose-950/10 text-rose-600" : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 text-zinc-500"}`}
              >
                <Truck className="w-6 h-6" />
                <span className="text-xs font-bold">COD</span>
              </div>
            </div>

            {/* Simulated Payment field values */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/30 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
              {paymentMethod === "card" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5 sm:col-span-3">
                    <label className="text-xxs uppercase tracking-wider text-zinc-400 font-bold">Card Number</label>
                    <input 
                      type="text" 
                      required={paymentMethod === "card"}
                      placeholder="4000 1234 5678 9010" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, "").replace(/(\d{4})/g, "$1 ").trim())}
                      maxLength={19}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-950 dark:text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xxs uppercase tracking-wider text-zinc-400 font-bold">Expiry Date</label>
                    <input 
                      type="text" 
                      required={paymentMethod === "card"}
                      placeholder="MM/YY" 
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      maxLength={5}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-950 dark:text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xxs uppercase tracking-wider text-zinc-400 font-bold">CVV Code</label>
                    <input 
                      type="password" 
                      required={paymentMethod === "card"}
                      placeholder="123" 
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      maxLength={3}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-950 dark:text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 sm:col-span-3 text-xxs text-zinc-400 pt-2 font-semibold">
                    <Lock className="w-3.5 h-3.5 text-rose-500" />
                    <span>Transactions are encrypted with modern 256-bit Secure Socket layers.</span>
                  </div>
                </div>
              )}

              {paymentMethod === "upi" && (
                <div className="space-y-2">
                  <label className="text-xxs uppercase tracking-wider text-zinc-400 font-bold">UPI Handle Address</label>
                  <input 
                    type="text" 
                    required={paymentMethod === "upi"}
                    placeholder="e.g. user@okhdfcbank" 
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-950 dark:text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none"
                  />
                  <p className="text-[10px] text-zinc-400 font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Accept UPI push request on your mobile banking app once placed.
                  </p>
                </div>
              )}

              {paymentMethod === "cod" && (
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-zinc-900 dark:text-white">Cash on Delivery Confirmation</h4>
                  <p className="text-zinc-500 leading-relaxed">
                    Pay with Cash, Card or digital scan when our Express delivery agent hands over your wrapped gift set. Friendly, secure, and hassle-free.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* SHOPPING LIST BRIEF (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-3xl shadow-sm space-y-4">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800">
              Review Package
            </h2>

            <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-3 items-center justify-between text-xs">
                  <div className="flex gap-2.5 items-center">
                    <img src={item.product.image} alt={item.product.name} className="w-10 h-10 object-cover rounded-lg" />
                    <div>
                      <h4 className="font-bold text-zinc-800 dark:text-zinc-200 line-clamp-1">{item.product.name}</h4>
                      <span className="text-[10px] text-zinc-400">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold font-mono">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Subtotal table details */}
            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal:</span>
                <span className="font-semibold font-mono text-zinc-700 dark:text-zinc-300">${cartSubtotal.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount:</span>
                  <span className="font-bold font-mono">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-500">
                <span>Wrapping & Delivery:</span>
                {shippingCost === 0 ? (
                  <span className="font-bold text-emerald-500 uppercase">FREE</span>
                ) : (
                  <span className="font-semibold font-mono text-zinc-700 dark:text-zinc-300">${shippingCost.toFixed(2)}</span>
                )}
              </div>
              <div className="flex justify-between text-sm font-black text-zinc-900 dark:text-white pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <span>Total to Pay:</span>
                <span className="font-mono text-rose-600">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit button */}
            <button 
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white disabled:opacity-50 font-bold rounded-2xl shadow-lg shadow-rose-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authorizing...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Place Secure Order (${grandTotal.toFixed(2)})
                </>
              )}
            </button>

          </div>
        </div>

      </form>
    </div>
  );
};
