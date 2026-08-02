import React, { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext(undefined);
const image = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;
const catalog = [
  ["Rose Quartz Wellness Ritual", "Wellness", "photo-1608571423902-eed4a5ad8108", 1299, 1699, true, true],
  ["Artisanal Truffle Gift Box", "Gourmet", "photo-1549007994-cb92ca8a4a77", 1099, 1399, true, false],
  ["Scented Soy Candle Duo", "Home Decor", "photo-1603006905003-be475563bc59", 899, 1199, false, true],
  ["Personalised Leather Wallet", "Fashion", "photo-1627123424574-724758594e93", 2499, 2999, true, true],
  ["Ambient Sunset Projection Lamp", "Electronics", "photo-1507679799987-c73779587ccf", 1799, 2199, false, false],
  ["Organic Tea Infuser Set", "Gourmet", "photo-1576092768241-dec231879fc3", 1499, 1899, true, false],
  ["Walnut Bluetooth Speaker", "Electronics", "photo-1545454675-3531b543be5d", 3299, 3999, true, true],
  ["Handmade Travel Journal", "Fashion", "photo-1517842645767-c639042777db", 999, 1299, false, false],
].map(([name, category, photo, price, originalPrice, featured, bestSeller], index) => ({ id: `gift-${index + 1}`, name, category, image: image(photo), images: [image(photo)], price, originalPrice, featured, bestSeller, newArrival: index === 1 || index === 4 || index === 7, festivalOffer: index % 2 === 0, stock: 12 + index * 4, rating: 4.5 + (index % 4) / 10, reviewsCount: 42 + index * 19, description: `A beautifully curated ${name.toLowerCase()} designed to make every occasion feel personal and memorable.` }));
const categories = [
  ["Wellness", "photo-1540555700478-4be289fbecef"], ["Gourmet", "photo-1549007994-cb92ca8a4a77"], ["Home Decor", "photo-1603006905003-be475563bc59"], ["Fashion", "photo-1627123424574-724758594e93"], ["Electronics", "photo-1507679799987-c73779587ccf"],
].map(([name, photo]) => ({ id: name.toLowerCase().replaceAll(" ", "-"), name, image: image(photo) }));

export function AppProvider({ children }) {
  const [products, setProducts] = useState(catalog);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("giftora_cart") || "[]"));
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem("giftora_wishlist") || "[]"));
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem("giftora_user") || "null"));
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem("giftora_orders") || "[]"));
  const [reviews, setReviews] = useState([]);
  const [coupons, setCoupons] = useState([{ code: "GIFT10", discountPercent: 10, minPurchase: 20, active: true }]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [currentView, setCurrentView] = useState("home");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = "success") => { const id = crypto.randomUUID(); setToasts((all) => [...all, { id, message, type }]); window.setTimeout(() => setToasts((all) => all.filter((toast) => toast.id !== id)), 4000); };
  const removeToast = (id) => setToasts((all) => all.filter((toast) => toast.id !== id));
  useEffect(() => localStorage.setItem("giftora_cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("giftora_wishlist", JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem("giftora_orders", JSON.stringify(orders)), [orders]);
  useEffect(() => { document.documentElement.classList.toggle("dark", darkMode); }, [darkMode]);
  const login = async (email) => { const user = { uid: `local-${Date.now()}`, email, name: email.split("@")[0], displayName: email.split("@")[0], photoURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", role: "user" }; setCurrentUser(user); localStorage.setItem("giftora_user", JSON.stringify(user)); showToast("Demo account signed in locally."); setCurrentView("home"); };
  const register = async (email, _password, name, photoURL) => { const user = { uid: `local-${Date.now()}`, email, name, displayName: name, photoURL: photoURL || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", role: "user" }; setCurrentUser(user); localStorage.setItem("giftora_user", JSON.stringify(user)); showToast("Your local demo account is ready."); setCurrentView("home"); };
  const loginWithGoogle = () => login("guest@giftora.local");
  const logout = () => { setCurrentUser(null); localStorage.removeItem("giftora_user"); setCurrentView("home"); showToast("Signed out from local demo.", "info"); };
  const addToCart = (product, quantity = 1) => setCart((items) => { const exists = items.find((item) => item.product.id === product.id); showToast(exists ? "Bag quantity updated." : "Added to your bag."); return exists ? items.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item) : [...items, { product, quantity }]; });
  const updateCartQty = (id, quantity) => quantity <= 0 ? removeFromCart(id) : setCart((items) => items.map((item) => item.product.id === id ? { ...item, quantity } : item));
  const removeFromCart = (id) => { setCart((items) => items.filter((item) => item.product.id !== id)); showToast("Item removed from bag.", "info"); };
  const clearCart = () => { setCart([]); setAppliedCoupon(null); };
  const toggleWishlist = (id) => { if (!currentUser) { showToast("Sign in to save gifts.", "error"); setCurrentView("login"); return; } setWishlist((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]); };
  const applyCouponCode = (code) => { const coupon = coupons.find((item) => item.code === code.toUpperCase().trim() && item.active); if (!coupon) { showToast("Invalid coupon code.", "error"); return false; } setAppliedCoupon(coupon); showToast(`${coupon.code} applied.`); return true; };
  const removeCoupon = () => setAppliedCoupon(null);
  const createOrder = async (orderData) => { const order = { ...orderData, id: `order-${Date.now()}`, userId: currentUser?.uid || "guest", trackingNumber: `GFT-${Math.floor(100000 + Math.random() * 900000)}`, status: "pending", orderStatus: "processing", createdAt: new Date().toISOString() }; setOrders((all) => [order, ...all]); clearCart(); return order; };
  const cancelOrder = (id) => setOrders((all) => all.map((order) => order.id === id ? { ...order, status: "cancelled", orderStatus: "cancelled" } : order));
  const updateOrderStatus = (id, status) => setOrders((all) => all.map((order) => order.id === id ? { ...order, status, orderStatus: status } : order));
  const addProduct = async (product) => { setProducts((all) => [{ ...product, id: `gift-${Date.now()}`, rating: 4.8, reviewsCount: 0, images: [product.image] }, ...all]); showToast("Product added locally."); };
  const updateProduct = async (id, product) => setProducts((all) => all.map((item) => item.id === id ? { ...item, ...product } : item));
  const deleteProduct = async (id) => { setProducts((all) => all.filter((item) => item.id !== id)); showToast("Product removed locally.", "info"); };
  const fetchReviews = async (productId) => reviews.filter((review) => review.productId === productId);
  const submitReview = async (productId, rating, comment) => { const review = { id: `review-${Date.now()}`, productId, rating, comment, userName: currentUser?.displayName || "Guest", createdAt: new Date().toISOString() }; setReviews((all) => [review, ...all]); showToast("Review added locally."); };
  const addCoupon = (coupon) => setCoupons((all) => [...all, { ...coupon, active: true }]);
  const salesStats = { totalRevenue: orders.filter((order) => order.status !== "cancelled").reduce((sum, order) => sum + order.total, 0), totalOrders: orders.length, totalUsers: 1, totalProducts: products.length };
  return <AppContext.Provider value={{ currentUser, userProfile: currentUser, authLoading: false, ordersLoading: false, login, register, loginWithGoogle, loginEmail: login, registerEmail: register, loginGoogle: loginWithGoogle, logout, products, categories, productsLoading: false, refreshProducts: () => {}, seedInitialData: () => {}, addProduct, updateProduct, deleteProduct, cart, addToCart, updateCartQty, removeFromCart, clearCart, appliedCoupon, applyCouponCode, removeCoupon, wishlist, toggleWishlist, currentView, setCurrentView, selectedProductId, setSelectedProductId, orders, allOrders: orders, createOrder, cancelOrder, updateOrderStatus, reviews, fetchReviews, submitReview, coupons, addCoupon, darkMode, toggleDarkMode: () => setDarkMode((value) => !value), toasts, toast: toasts[0], showToast, removeToast, hideToast: () => toasts[0] && removeToast(toasts[0].id), salesStats }}>{children}</AppContext.Provider>;
}
export const useApp = () => { const context = useContext(AppContext); if (!context) throw new Error("useApp must be used within an AppProvider"); return context; };
