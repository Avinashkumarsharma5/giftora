import React, { useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomeView } from "./components/HomeView";
import { ShopView } from "./components/ShopView";
import { ProductDetailsView } from "./components/ProductDetailsView";
import { CartView } from "./components/CartView";
import { CheckoutView } from "./components/CheckoutView";
import { AuthView } from "./components/AuthView";
import { ProfileView } from "./components/ProfileView";
import { AdminDashboardView } from "./components/AdminDashboardView";
import { AIGiftAdvisor } from "./components/AIGiftAdvisor";
import { WishlistView } from "./components/WishlistView";
import { AboutView, ContactView } from "./components/StaticPages";

const AppContent: React.FC = () => {
  const { currentView, darkMode, toast, hideToast } = useApp();

  // Handle active dark mode theme classes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // View router
  const renderView = () => {
    switch (currentView) {
      case "home":
        return <HomeView />;
      case "shop":
        return <ShopView />;
      case "product-details":
        return <ProductDetailsView />;
      case "cart":
        return <CartView />;
      case "checkout":
        return <CheckoutView />;
      case "login":
        return <AuthView />;
      case "profile":
        return <ProfileView />;
      case "admin":
        return <AdminDashboardView />;
      case "ai-advisor":
        return <AIGiftAdvisor />;
      case "wishlist":
        return <WishlistView />;
      case "about":
        return <AboutView />;
      case "contact":
        return <ContactView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      
      {/* Dynamic Toast System Popup */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div className={`px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border text-xs font-bold ${
            toast.type === "success" 
              ? "bg-emerald-500 text-white border-emerald-400"
              : toast.type === "error"
              ? "bg-rose-600 text-white border-rose-500"
              : "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-800"
          }`}>
            <span>{toast.message}</span>
            <button 
              onClick={hideToast}
              className="p-1 hover:bg-white/10 rounded-full font-black ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main app grid */}
      <Header />
      
      <main className="flex-grow">
        {renderView()}
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
