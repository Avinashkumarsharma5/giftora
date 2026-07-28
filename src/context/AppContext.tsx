import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  User as FirebaseUser,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  where,
  arrayUnion,
  arrayRemove,
  serverTimestamp
} from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "../firebase";
import { Product, Category, CartItem, Order, Review, Coupon, UserProfile } from "../types";

interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface AppContextType {
  // Auth
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  authLoading: boolean;
  loginEmail: (e: string, p: string) => Promise<void>;
  registerEmail: (e: string, p: string, name: string) => Promise<void>;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  
  // Products & Categories
  products: Product[];
  categories: Category[];
  productsLoading: boolean;
  refreshProducts: () => Promise<void>;
  seedInitialData: () => Promise<void>;
  addProduct: (p: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, p: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Cart & Wishlist
  cart: CartItem[];
  addToCart: (p: Product, qty?: number) => void;
  updateCartQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCouponCode: (code: string) => boolean;
  removeCoupon: () => void;
  
  wishlist: string[]; // array of productIds
  toggleWishlist: (productId: string) => Promise<void>;
  
  // Active Navigation
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  
  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, "id" | "userId" | "createdAt" | "orderStatus" | "paymentStatus" | "trackingNumber">) => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order["orderStatus"]) => Promise<void>;
  allOrders: Order[]; // For Admin
  
  // Reviews
  reviews: Review[];
  fetchReviews: (productId: string) => Promise<Review[]>;
  submitReview: (productId: string, rating: number, comment: string) => Promise<void>;
  
  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;
  
  // Toast
  toasts: ToastMessage[];
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;
  
  // Stats
  salesStats: { totalRevenue: number; totalOrders: number; totalUsers: number; totalProducts: number };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Products & Categories
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  
  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const local = localStorage.getItem("giftora_cart");
    return local ? JSON.parse(local) : [];
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  
  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  // Navigation
  const [currentView, setCurrentView] = useState("home");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  // User specific Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]); // For admin
  
  // Reviews Cache
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // Theme
  const [darkMode, setDarkMode] = useState(() => {
    const local = localStorage.getItem("giftora_dark");
    return local !== "false"; // Default to true for the Elegant Dark theme
  });
  
  // Toast
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // 1. Theme handler
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("giftora_dark", String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // 2. Toast management
  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 3. Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem("giftora_cart", JSON.stringify(cart));
  }, [cart]);

  // 4. Load Products and Categories from Firestore
  const refreshProducts = async () => {
    setProductsLoading(true);
    try {
      const prodSnap = await getDocs(collection(db, "products"));
      const catSnap = await getDocs(collection(db, "categories"));
      
      const loadedProducts: Product[] = [];
      prodSnap.forEach((doc) => {
        loadedProducts.push({ id: doc.id, ...doc.data() } as Product);
      });
      
      const loadedCategories: Category[] = [];
      catSnap.forEach((doc) => {
        loadedCategories.push({ id: doc.id, ...doc.data() } as Category);
      });
      
      setProducts(loadedProducts);
      setCategories(loadedCategories);
      
      // If Firestore database is completely empty, handle seeding or fallback
      if (loadedProducts.length === 0) {
        const isAdminUser = auth.currentUser?.email === "gameplay2436rj@gmail.com";
        if (isAdminUser) {
          await seedInitialData();
        } else {
          // If not admin, load default fallback products so the site is not empty
          const response = await fetch("/api/default-products");
          const data = await response.json();
          if (data.products && data.categories) {
            const indexedProds = data.products.map((p: any, i: number) => ({ ...p, id: `default-${i}` }));
            const indexedCats = data.categories.map((c: any, i: number) => ({ ...c, id: `cat-${i}` }));
            setProducts(indexedProds);
            setCategories(indexedCats);
          }
        }
      }
    } catch (err) {
      console.error("Error reading Firestore products, falling back to static default:", err);
      // Fetch default items from Express backend as safe fallback
      try {
        const response = await fetch("/api/default-products");
        const data = await response.json();
        if (data.products && data.categories) {
          const indexedProds = data.products.map((p: any, i: number) => ({ ...p, id: `default-${i}` }));
          const indexedCats = data.categories.map((c: any, i: number) => ({ ...c, id: `cat-${i}` }));
          setProducts(indexedProds);
          setCategories(indexedCats);
        }
      } catch (e) {
        console.error("Failed to load default products fallback:", e);
      }
    } finally {
      setProductsLoading(false);
    }
  };

  const seedInitialData = async () => {
    try {
      showToast("Initializing authentic catalog database...", "info");
      const response = await fetch("/api/default-products");
      const data = await response.json();
      if (data.products && data.categories) {
        // Seed categories
        const catMap: { [name: string]: string } = {};
        for (const cat of data.categories) {
          const docRef = await addDoc(collection(db, "categories"), cat);
          catMap[cat.name] = docRef.id;
        }
        // Seed products
        for (const prod of data.products) {
          await addDoc(collection(db, "products"), prod);
        }
        showToast("Database populated with premium products!", "success");
        // Reload
        const prodSnap = await getDocs(collection(db, "products"));
        const catSnap = await getDocs(collection(db, "categories"));
        const loadedProducts: Product[] = [];
        prodSnap.forEach((doc) => {
          loadedProducts.push({ id: doc.id, ...doc.data() } as Product);
        });
        const loadedCategories: Category[] = [];
        catSnap.forEach((doc) => {
          loadedCategories.push({ id: doc.id, ...doc.data() } as Category);
        });
        setProducts(loadedProducts);
        setCategories(loadedCategories);
      }
    } catch (err) {
      console.error("Error seeding Firestore products:", err);
      showToast("Failed to seed database, running on local defaults", "error");
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  // 5. Auth State & Database Syncing
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Sync user profile
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          
          let profile: UserProfile;
          const isAdminEmail = user.email === "gameplay2436rj@gmail.com";
          
          if (userDoc.exists()) {
            profile = userDoc.data() as UserProfile;
            // Overwrite role if they are the designated admin email
            if (isAdminEmail && profile.role !== "admin") {
              profile.role = "admin";
              await updateDoc(userDocRef, { role: "admin" });
            }
          } else {
            // Create user profile
            profile = {
              uid: user.uid,
              email: user.email || "",
              displayName: user.displayName || user.email?.split("@")[0] || "Gifter",
              photoURL: user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
              role: isAdminEmail ? "admin" : "user",
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, profile);
          }
          setUserProfile(profile);
          refreshProducts();
          
          // Fetch wishlist
          const wishlistDoc = await getDoc(doc(db, "wishlists", user.uid));
          if (wishlistDoc.exists()) {
            setWishlist(wishlistDoc.data().productIds || []);
          } else {
            setWishlist([]);
          }
          
          // Setup snapshot listener for personal orders
          const ordersQuery = query(collection(db, "orders"), where("userId", "==", user.uid));
          const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
            const userOrders: Order[] = [];
            snapshot.forEach((d) => {
              userOrders.push({ id: d.id, ...d.data() } as Order);
            });
            // Sort by createdAt desc
            userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setOrders(userOrders);
          }, (error) => {
            handleFirestoreError(error, OperationType.GET, "orders");
          });

          // Setup snapshot listener for ALL orders (Admin Dashboard)
          let unsubscribeAllOrders = () => {};
          if (profile.role === "admin") {
            const allOrdersQuery = collection(db, "orders");
            unsubscribeAllOrders = onSnapshot(allOrdersQuery, (snapshot) => {
              const all: Order[] = [];
              snapshot.forEach((d) => {
                all.push({ id: d.id, ...d.data() } as Order);
              });
              all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
              setAllOrders(all);
            }, (error) => {
              handleFirestoreError(error, OperationType.GET, "orders");
            });
          }

          return () => {
            unsubscribeOrders();
            unsubscribeAllOrders();
          };

        } catch (err) {
          console.error("Error setting up user profile / listeners:", err);
        }
      } else {
        setUserProfile(null);
        setWishlist([]);
        setOrders([]);
        setAllOrders([]);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Auth Operations
  const loginEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
    showToast("Welcome back to Giftora!", "success");
    setCurrentView("home");
  };

  const registerEmail = async (email: string, pass: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    // Profile created via onAuthStateChanged listener
    showToast(`Welcome ${name}! Account created successfully.`, "success");
    setCurrentView("home");
  };

  const loginGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    showToast("Logged in with Google successfully!", "success");
    setCurrentView("home");
  };

  const logout = async () => {
    await signOut(auth);
    showToast("Logged out successfully.", "info");
    setCurrentView("home");
  };

  // Admin Catalog Actions
  const addProduct = async (p: Omit<Product, "id">) => {
    try {
      const docRef = await addDoc(collection(db, "products"), p);
      showToast(`Product "${p.name}" added successfully!`, "success");
      await refreshProducts();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, "products");
    }
  };

  const updateProduct = async (id: string, p: Partial<Product>) => {
    try {
      const docRef = doc(db, "products", id);
      await updateDoc(docRef, p);
      showToast(`Product updated successfully!`, "success");
      await refreshProducts();
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, "products", id));
      showToast("Product deleted successfully.", "success");
      await refreshProducts();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    }
  };

  // Cart Operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const exist = prev.find((item) => item.product.id === product.id);
      if (exist) {
        showToast(`Updated "${product.name}" quantity to ${exist.quantity + quantity} in cart!`, "success");
        return prev.map((item) => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      showToast(`Added "${product.name}" to cart!`, "success");
      return [...prev, { product, quantity }];
    });
  };

  const updateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => 
      prev.map((item) => 
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast("Item removed from cart.", "info");
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCouponCode = (code: string): boolean => {
    const uppercaseCode = code.toUpperCase().trim();
    if (uppercaseCode === "GIFT10") {
      setAppliedCoupon({ code: "GIFT10", discountPercent: 10, minPurchase: 20, active: true });
      showToast("Coupon GIFT10 applied! 10% discount added.", "success");
      return true;
    } else if (uppercaseCode === "WELCOME20") {
      setAppliedCoupon({ code: "WELCOME20", discountPercent: 20, minPurchase: 40, active: true });
      showToast("Coupon WELCOME20 applied! 20% discount added.", "success");
      return true;
    } else if (uppercaseCode === "FESTIVE30") {
      setAppliedCoupon({ code: "FESTIVE30", discountPercent: 30, minPurchase: 60, active: true });
      showToast("Coupon FESTIVE30 applied! 30% discount added.", "success");
      return true;
    }
    showToast("Invalid coupon code.", "error");
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast("Coupon removed.", "info");
  };

  // Wishlist Operations
  const toggleWishlist = async (productId: string) => {
    if (!currentUser) {
      showToast("Please sign in to save products to wishlist.", "error");
      setCurrentView("login");
      return;
    }
    const exists = wishlist.includes(productId);
    const wishlistRef = doc(db, "wishlists", currentUser.uid);
    try {
      if (exists) {
        setWishlist((prev) => prev.filter((id) => id !== productId));
        await setDoc(wishlistRef, { 
          userId: currentUser.uid, 
          productIds: arrayRemove(productId) 
        }, { merge: true });
        showToast("Removed from wishlist.", "info");
      } else {
        setWishlist((prev) => [...prev, productId]);
        await setDoc(wishlistRef, { 
          userId: currentUser.uid, 
          productIds: arrayUnion(productId) 
        }, { merge: true });
        showToast("Added to wishlist!", "success");
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `wishlists/${currentUser.uid}`);
    }
  };

  // Order Operations
  const createOrder = async (orderData: Omit<Order, "id" | "userId" | "createdAt" | "orderStatus" | "paymentStatus" | "trackingNumber">) => {
    if (!currentUser) {
      throw new Error("User must be logged in to create orders");
    }
    try {
      const trackingNum = "GFT-" + Math.floor(100000 + Math.random() * 900000);
      const newOrder: Omit<Order, "id"> = {
        ...orderData,
        userId: currentUser.uid,
        orderStatus: "processing",
        paymentStatus: orderData.paymentMethod === "cod" ? "pending" : "paid",
        trackingNumber: trackingNum,
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, "orders"), newOrder);
      
      // Reduce product stock level safely
      for (const item of orderData.items) {
        const prodRef = doc(db, "products", item.productId);
        const prodDoc = await getDoc(prodRef);
        if (prodDoc.exists()) {
          const currentStock = prodDoc.data().stock || 0;
          const newStock = Math.max(0, currentStock - item.quantity);
          await updateDoc(prodRef, { stock: newStock });
        }
      }

      showToast("Order placed successfully!", "success");
      clearCart();
      return { id: docRef.id, ...newOrder } as Order;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, "orders");
      throw err;
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { orderStatus: "cancelled" });
      showToast("Order cancelled successfully.", "info");
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order["orderStatus"]) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { orderStatus: status });
      showToast(`Order status updated to ${status}`, "success");
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  // Review Operations
  const fetchReviews = async (productId: string) => {
    try {
      const reviewsQuery = query(collection(db, "reviews"), where("productId", "==", productId));
      const snap = await getDocs(reviewsQuery);
      const list: Review[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Review);
      });
      // Sort newest first
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setReviews(list);
      return list;
    } catch (err) {
      console.error("Error fetching reviews:", err);
      return [];
    }
  };

  const submitReview = async (productId: string, rating: number, comment: string) => {
    if (!currentUser || !userProfile) {
      showToast("Please login to submit reviews.", "error");
      return;
    }
    try {
      const newReview = {
        productId,
        userId: currentUser.uid,
        userName: userProfile.displayName,
        rating,
        comment,
        createdAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, "reviews"), newReview);
      showToast("Review submitted! Thank you for your feedback.", "success");
      
      // Re-calculate average rating for product
      const reviewsQuery = query(collection(db, "reviews"), where("productId", "==", productId));
      const snap = await getDocs(reviewsQuery);
      let totalRating = 0;
      let count = 0;
      snap.forEach((d) => {
        totalRating += d.data().rating;
        count++;
      });
      
      if (count > 0) {
        const average = parseFloat((totalRating / count).toFixed(1));
        const prodRef = doc(db, "products", productId);
        await updateDoc(prodRef, { 
          rating: average,
          reviewsCount: count
        });
        await refreshProducts();
      }
      
      await fetchReviews(productId);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, "reviews");
    }
  };

  // Admin Sales Analytics
  const getSalesStats = () => {
    const totalRevenue = allOrders
      .filter((o) => o.orderStatus !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);
    const totalOrders = allOrders.length;
    const totalProducts = products.length;
    // Simple mock or approximate based on seeded users, can be just a friendly calculation
    const totalUsers = 12 + allOrders.reduce((acc, curr) => acc + (curr.userId ? 1 : 0), 0);
    
    return {
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      totalOrders,
      totalUsers,
      totalProducts
    };
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      userProfile,
      authLoading,
      loginEmail,
      registerEmail,
      loginGoogle,
      logout,
      
      products,
      categories,
      productsLoading,
      refreshProducts,
      seedInitialData,
      addProduct,
      updateProduct,
      deleteProduct,
      
      cart,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      appliedCoupon,
      applyCouponCode,
      removeCoupon,
      
      wishlist,
      toggleWishlist,
      
      currentView,
      setCurrentView,
      selectedProductId,
      setSelectedProductId,
      
      orders,
      createOrder,
      cancelOrder,
      updateOrderStatus,
      allOrders,
      
      reviews,
      fetchReviews,
      submitReview,
      
      darkMode,
      toggleDarkMode,
      
      toasts,
      showToast,
      removeToast,
      
      salesStats: getSalesStats()
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
