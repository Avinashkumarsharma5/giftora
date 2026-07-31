import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Header from "./components/Header";
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
const AppContent = () => {
    const { currentView, darkMode, toast, hideToast } = useApp();
    // Handle active dark mode theme classes
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        }
        else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);
    // View router
    const renderView = () => {
        switch (currentView) {
            case "home":
                return _jsx(HomeView, {});
            case "shop":
                return _jsx(ShopView, {});
            case "product-details":
                return _jsx(ProductDetailsView, {});
            case "cart":
                return _jsx(CartView, {});
            case "checkout":
                return _jsx(CheckoutView, {});
            case "login":
                return _jsx(AuthView, {});
            case "profile":
                return _jsx(ProfileView, {});
            case "admin":
                return _jsx(AdminDashboardView, {});
            case "ai-advisor":
                return _jsx(AIGiftAdvisor, {});
            case "wishlist":
                return _jsx(WishlistView, {});
            case "about":
                return _jsx(AboutView, {});
            case "contact":
                return _jsx(ContactView, {});
            default:
                return _jsx(HomeView, {});
        }
    };
    return (_jsxs("div", { className: "min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300", children: [toast && (_jsx("div", { className: "fixed bottom-6 right-6 z-50 animate-fade-in", children: _jsxs("div", { className: `px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border text-xs font-bold ${toast.type === "success"
                        ? "bg-emerald-500 text-white border-emerald-400"
                        : toast.type === "error"
                            ? "bg-rose-600 text-white border-rose-500"
                            : "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-800"}`, children: [_jsx("span", { children: toast.message }), _jsx("button", { onClick: hideToast, className: "p-1 hover:bg-white/10 rounded-full font-black ml-2", children: "\u2715" })] }) })), _jsx(Header, {}), _jsx("main", { className: "flex-grow", children: renderView() }), _jsx(Footer, {})] }));
};
export default function App() {
    return (_jsx(AppProvider, { children: _jsx(AppContent, {}) }));
}
