import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  Plus, 
  Trash2, 
  Settings, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Grid, 
  Truck, 
  X, 
  Sparkles,
  Tag,
  AlertCircle
} from "lucide-react";
import { Product } from "../types";

export const AdminDashboardView: React.FC = () => {
  const { 
    products, 
    orders, 
    categories, 
    coupons, 
    addProduct, 
    deleteProduct, 
    updateOrderStatus, 
    addCoupon, 
    showToast 
  } = useApp();

  // Active sub-section view: "overview" | "products" | "orders" | "coupons"
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "coupons">("overview");

  // PRODUCT FORM FIELDS
  const [prodName, setProdName] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodOriginalPrice, setProdOriginalPrice] = useState("");
  const [prodImage, setProdImage] = useState("");
  const [prodCategory, setProdCategory] = useState("Wellness & Spa");
  const [prodStock, setProdStock] = useState("");
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodBestseller, setProdBestseller] = useState(false);
  const [prodNew, setProdNew] = useState(false);
  const [prodFestival, setProdFestival] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);

  // COUPON FORM FIELDS
  const [couponCode, setCouponCode] = useState("");
  const [couponPercent, setCouponPercent] = useState("");
  const [couponMin, setCouponMin] = useState("");

  // CALCULATIONS FOR STATS
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, curr) => sum + curr.total, 0);

  const pendingOrdersCount = orders.filter((o) => o.status === "pending").length;

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodDesc || !prodPrice || !prodImage || !prodStock) {
      showToast("Please fill in all required product fields.", "error");
      return;
    }

    try {
      const priceVal = Number(prodPrice);
      const originalVal = prodOriginalPrice ? Number(prodOriginalPrice) : priceVal;
      const stockVal = Number(prodStock);

      await addProduct({
      
        name: prodName,
        description: prodDesc,
        price: priceVal,
        originalPrice: originalVal,
        image: prodImage,
        category: prodCategory,
        rating: 4.8,
        reviewsCount: 1,
        stock: stockVal,
        featured: prodFeatured,
        bestSeller: prodBestseller,
        newArrival: prodNew,
        festivalOffer: prodFestival,
        images: []
      });

      // Reset
      setProdName("");
      setProdDesc("");
      setProdPrice("");
      setProdOriginalPrice("");
      setProdImage("");
      setProdStock("");
      setProdFeatured(false);
      setProdBestseller(false);
      setProdNew(false);
      setProdFestival(false);
      setShowProductModal(false);
      showToast("New premium gift item appended to catalog!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to create product.", "error");
    }
  };

  const handleAddCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode || !couponPercent || !couponMin) {
      showToast("Please enter all coupon attributes.", "error");
      return;
    }

    try {
      await addCoupon({
        code: couponCode.toUpperCase().trim(),
        discountPercent: Number(couponPercent),
        minPurchase: Number(couponMin)
      });
      setCouponCode("");
      setCouponPercent("");
      setCouponMin("");
      showToast(`Coupon code created successfully!`, "success");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this premium gift item? This cannot be undone.")) {
      try {
        await deleteProduct(id);
        showToast("Product deleted successfully.", "success");
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-8 animate-fade-in">
      
      {/* Page Title & Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">Admin Control Panel</h1>
          <p className="text-xs text-zinc-500 mt-1">Manage luxury products catalog, fulfill holiday orders, and design discount coupons.</p>
        </div>

        {/* Tab buttons */}
        <div className="inline-flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl gap-1 overflow-x-auto shrink-0 max-w-full">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${activeTab === "overview" ? "bg-white dark:bg-zinc-900 shadow-sm text-rose-500" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-white"}`}
          >
            Overview & Stats
          </button>
          <button 
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${activeTab === "products" ? "bg-white dark:bg-zinc-900 shadow-sm text-rose-500" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-white"}`}
          >
            Manage Catalog ({products.length})
          </button>
          <button 
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${activeTab === "orders" ? "bg-white dark:bg-zinc-900 shadow-sm text-rose-500" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-white"}`}
          >
            Orders Status ({orders.length})
          </button>
          <button 
            onClick={() => setActiveTab("coupons")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${activeTab === "coupons" ? "bg-white dark:bg-zinc-900 shadow-sm text-rose-500" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-white"}`}
          >
            Discount Coupons ({coupons.length})
          </button>
        </div>
      </div>

      {/* 1. OVERVIEW & STATS BENTO GRID */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            {/* Stat 1 */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-5 rounded-3xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xxs uppercase tracking-wider font-extrabold text-zinc-400">Total Sales</h4>
                <div className="text-xl sm:text-2xl font-black font-mono text-zinc-900 dark:text-white">${totalRevenue.toFixed(2)}</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-5 rounded-3xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xxs uppercase tracking-wider font-extrabold text-zinc-400">Orders Count</h4>
                <div className="text-xl sm:text-2xl font-black font-mono text-zinc-900 dark:text-white">{orders.length}</div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-5 rounded-3xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xxs uppercase tracking-wider font-extrabold text-zinc-400">Pending Orders</h4>
                <div className="text-xl sm:text-2xl font-black font-mono text-rose-500">{pendingOrdersCount}</div>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-5 rounded-3xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl">
                <Grid className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xxs uppercase tracking-wider font-extrabold text-zinc-400">Catalog Size</h4>
                <div className="text-xl sm:text-2xl font-black font-mono text-zinc-900 dark:text-white">{products.length} Items</div>
              </div>
            </div>

          </div>

          {/* Graphical representation simulation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Sales breakdown description */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-3xl space-y-4">
              <h3 className="font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-rose-500" /> Catalog Category Breakdown
              </h3>
              
              <div className="space-y-3.5 pt-2">
                {categories.map((cat) => {
                  const itemsInCat = products.filter((p) => p.category === cat.name).length;
                  const percent = Math.round((itemsInCat / (products.length || 1)) * 100);
                  return (
                    <div key={cat.name} className="space-y-1.5 text-xs">
                      <div className="flex justify-between font-semibold">
                        <span>{cat.name}</span>
                        <span className="font-mono text-zinc-400">{itemsInCat} Items ({percent}%)</span>
                      </div>
                      <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fulfill actions shortcut */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-3xl space-y-4">
              <h3 className="font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-rose-500" /> Pending Deliveries Queue
              </h3>

              {orders.filter((o) => o.status === "pending").length === 0 ? (
                <div className="p-8 text-center text-zinc-400 text-xs font-semibold">
                  🎉 Good work! No pending orders awaiting dispatch.
                </div>
              ) : (
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2">
                  {orders
                    .filter((o) => o.status === "pending")
                    .slice(0, 3)
                    .map((order) => (
                      <div 
                        key={order.id} 
                        className="p-3 bg-zinc-50 dark:bg-zinc-800/30 rounded-xl border border-zinc-100 dark:border-zinc-800 text-xs flex justify-between items-center"
                      >
                        <div>
                          <strong className="font-bold text-zinc-900 dark:text-white font-mono">{order.trackingNumber}</strong>
                          <div className="text-zinc-400">Total: ${order.total.toFixed(2)}</div>
                        </div>
                        <button 
                          onClick={() => setActiveTab("orders")}
                          className="px-3 py-1.5 bg-rose-500 text-white rounded-lg font-bold text-xxs cursor-pointer"
                        >
                          Fulfill Now
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 2. MANAGE PRODUCTS (CRUD) */}
      {activeTab === "products" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white">Active Product Curation ({products.length})</h2>
            <button 
              onClick={() => setShowProductModal(true)}
              className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4.5 h-4.5" /> Add Gift Hamper
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div 
                key={p.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-4 rounded-3xl flex gap-4 items-center justify-between shadow-sm relative group"
              >
                <div className="flex gap-3 items-center overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-14 h-14 object-cover rounded-xl shrink-0" />
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate">{p.name}</h4>
                    <span className="text-[10px] text-rose-500 font-bold font-mono">${p.price}</span>
                    <div className="text-[9px] text-zinc-400 font-semibold uppercase">{p.category}</div>
                  </div>
                </div>

                <button 
                  onClick={() => handleDeleteProduct(p.id)}
                  className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl cursor-pointer"
                  title="Delete from Catalog"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            ))}
          </div>

          {/* PRODUCT CREATION MODAL DRAWER */}
          {showProductModal && (
            <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative animate-fade-in">
                
                <div className="flex justify-between items-center pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <h3 className="font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-rose-500" /> Add New Gift Hamper
                  </h3>
                  <button onClick={() => setShowProductModal(false)} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="font-bold text-zinc-400 uppercase tracking-wide">Product Title</label>
                      <input 
                        type="text" required placeholder="e.g. Scented Cedar & Juniper Bath Box" 
                        value={prodName} onChange={(e) => setProdName(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-2.5 rounded-xl focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="font-bold text-zinc-400 uppercase tracking-wide">Product Description</label>
                      <textarea 
                        required rows={3} placeholder="A premium bath box with luxury organic soaps, pine essential oil..."
                        value={prodDesc} onChange={(e) => setProdDesc(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-2.5 rounded-xl focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-zinc-400 uppercase tracking-wide">Price ($)</label>
                      <input 
                        type="number" required step="0.01" placeholder="45.00"
                        value={prodPrice} onChange={(e) => setProdPrice(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-2.5 rounded-xl focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-zinc-400 uppercase tracking-wide">Original Strike Price ($)</label>
                      <input 
                        type="number" step="0.01" placeholder="59.99"
                        value={prodOriginalPrice} onChange={(e) => setProdOriginalPrice(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-2.5 rounded-xl focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="font-bold text-zinc-400 uppercase tracking-wide">Product Cover Image URL</label>
                      <input 
                        type="url" required placeholder="https://images.unsplash.com/..."
                        value={prodImage} onChange={(e) => setProdImage(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-2.5 rounded-xl focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-zinc-400 uppercase tracking-wide">Category</label>
                      <select 
                        value={prodCategory} onChange={(e) => setProdCategory(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-2.5 rounded-xl focus:outline-none"
                      >
                        {categories.map((cat) => (
                          <option key={cat.name} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-zinc-400 uppercase tracking-wide">Inventory Stock Count</label>
                      <input 
                        type="number" required placeholder="15"
                        value={prodStock} onChange={(e) => setProdStock(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-2.5 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Badges toggler checkboxes */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <label className="flex items-center gap-2 font-semibold text-zinc-600 cursor-pointer">
                      <input type="checkbox" checked={prodFeatured} onChange={() => setProdFeatured(!prodFeatured)} className="accent-rose-500 rounded" />
                      <span>Mark as Featured</span>
                    </label>
                    <label className="flex items-center gap-2 font-semibold text-zinc-600 cursor-pointer">
                      <input type="checkbox" checked={prodBestseller} onChange={() => setProdBestseller(!prodBestseller)} className="accent-rose-500 rounded" />
                      <span>Mark as Best Seller</span>
                    </label>
                    <label className="flex items-center gap-2 font-semibold text-zinc-600 cursor-pointer">
                      <input type="checkbox" checked={prodNew} onChange={() => setProdNew(!prodNew)} className="accent-rose-500 rounded" />
                      <span>Mark as New Arrival</span>
                    </label>
                    <label className="flex items-center gap-2 font-semibold text-zinc-600 cursor-pointer">
                      <input type="checkbox" checked={prodFestival} onChange={() => setProdFestival(!prodFestival)} className="accent-rose-500 rounded" />
                      <span>Mark as Festival Offer</span>
                    </label>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-lg transition-colors cursor-pointer"
                  >
                    Commit to Firestore
                  </button>

                </form>

              </div>
            </div>
          )}

        </div>
      )}

      {/* 3. MANAGE ORDERS */}
      {activeTab === "orders" && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-3xl shadow-sm space-y-6">
          <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white">Fulfill Deliveries Queue ({orders.length})</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Tracking Code</th>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Items Summary</th>
                  <th className="py-3 px-4">Total Price</th>
                  <th className="py-3 px-4">Status Controller</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
                    <td className="py-4 px-4 font-bold font-mono text-rose-500">{order.trackingNumber}</td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-zinc-900 dark:text-white">{order.shippingAddress.fullName}</div>
                      <div className="text-zinc-400">{order.shippingAddress.city}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="max-w-[200px] truncate">
                        {order.items.map(item => `${item.name} (x${item.quantity})`).join(", ")}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold font-mono">${order.total.toFixed(2)}</td>
                    <td className="py-4 px-4">
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 rounded-lg p-1.5 font-bold focus:outline-none focus:ring-1 focus:ring-rose-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. MANAGE COUPONS */}
      {activeTab === "coupons" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Create Coupon form (5 cols) */}
          <div className="md:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-extrabold text-zinc-900 dark:text-white">Create Promo Code</h3>
            
            <form onSubmit={handleAddCouponSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-400 uppercase tracking-wide">Coupon Code (Uppercase)</label>
                <input 
                  type="text" required placeholder="e.g. SPECIAL40"
                  value={couponCode} onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-2.5 rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-400 uppercase tracking-wide">Discount Percent (%)</label>
                <input 
                  type="number" required min="5" max="90" placeholder="15"
                  value={couponPercent} onChange={(e) => setCouponPercent(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-2.5 rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-400 uppercase tracking-wide">Minimum Purchase Requirement ($)</label>
                <input 
                  type="number" required placeholder="30"
                  value={couponMin} onChange={(e) => setCouponMin(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-2.5 rounded-xl focus:outline-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Create Coupon Code
              </button>
            </form>
          </div>

          {/* Active coupons list (7 cols) */}
          <div className="md:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-extrabold text-zinc-900 dark:text-white">Active Promo Codes ({coupons.length})</h3>

            <div className="space-y-3">
              {coupons.map((c) => (
                <div 
                  key={c.code}
                  className="p-3 bg-zinc-50 dark:bg-zinc-800/30 rounded-xl border border-zinc-100 dark:border-zinc-800/80 flex justify-between items-center text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-4 h-4 text-rose-500" />
                      <strong className="font-bold text-zinc-900 dark:text-white font-mono">{c.code}</strong>
                    </div>
                    <div className="text-zinc-500">
                      Discount: <strong className="font-bold text-rose-500">{c.discountPercent}%</strong> • Min Purchase: <strong className="font-bold">${c.minPurchase}</strong>
                    </div>
                  </div>
                  
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded uppercase">Active</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
