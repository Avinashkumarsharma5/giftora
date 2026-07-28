import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User as UserIcon, 
  Sun, 
  Moon, 
  Sparkles, 
  LogOut, 
  LayoutDashboard, 
  Menu, 
  X,
  MapPin,
  Gift
} from "lucide-react";

export const Header: React.FC = () => {
  const { 
    currentUser, 
    userProfile, 
    cart, 
    wishlist, 
    currentView, 
    setCurrentView, 
    darkMode, 
    toggleDarkMode, 
    logout,
    products,
    setSelectedProductId
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Filter products based on search query
  const suggestions = searchQuery.trim() 
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView("product-details");
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView("shop");
      setShowSuggestions(false);
    }
  };

  const totalCartItems = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-black/40 backdrop-blur-md border-b border-zinc-100 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => { setCurrentView("home"); setSelectedProductId(null); }} 
            className="flex items-center gap-2 cursor-pointer select-none shrink-0"
            id="nav-logo"
          >
            <div className="w-8 h-8 bg-gradient-to-tr from-violet-600 to-fuchsia-500 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Gift className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-zinc-950 dark:text-white font-sans uppercase">
              Giftora
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <button 
              onClick={() => setCurrentView("home")} 
              className={`hover:text-rose-500 dark:hover:text-white transition-colors ${currentView === "home" ? "text-rose-500 dark:text-white font-semibold" : ""}`}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentView("shop")} 
              className={`hover:text-rose-500 dark:hover:text-white transition-colors ${currentView === "shop" ? "text-rose-500 dark:text-white font-semibold" : ""}`}
            >
              Shop
            </button>
            <button 
              onClick={() => setCurrentView("ai-advisor")} 
              className="flex items-center gap-1.5 bg-rose-50 dark:bg-white/5 text-rose-600 dark:text-rose-300 px-3.5 py-1.5 rounded-full hover:bg-rose-100 dark:hover:bg-white/10 transition-all border border-rose-100 dark:border-white/10 text-xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400 animate-spin" style={{ animationDuration: "3s" }} />
              AI Gift Matcher
            </button>
            <button 
              onClick={() => setCurrentView("about")} 
              className={`hover:text-rose-500 dark:hover:text-white transition-colors ${currentView === "about" ? "text-rose-500 dark:text-white font-semibold" : ""}`}
            >
              About
            </button>
            <button 
              onClick={() => setCurrentView("contact")} 
              className={`hover:text-rose-500 dark:hover:text-white transition-colors ${currentView === "contact" ? "text-rose-500 dark:text-white font-semibold" : ""}`}
            >
              Contact
            </button>
          </nav>

          {/* Search Bar */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden sm:block relative flex-1 max-w-md mx-4"
            ref={suggestionRef}
          >
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search for luxury gifts..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full bg-zinc-50 dark:bg-white/5 text-zinc-950 dark:text-white pl-10 pr-4 py-2 rounded-full text-sm border border-zinc-200 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all"
              />
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
            </div>

            {/* Live Search Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xl rounded-xl overflow-hidden z-50">
                <div className="p-2 border-b border-zinc-100 dark:border-zinc-800 text-xxs font-semibold uppercase tracking-wider text-zinc-400">
                  Recommended Products
                </div>
                {suggestions.map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => handleSuggestionClick(p.id)}
                    className="flex items-center gap-3 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
                  >
                    <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                    <div className="overflow-hidden">
                      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{p.name}</div>
                      <div className="text-xs text-rose-500 font-semibold">${p.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </form>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-zinc-600" />}
            </button>

            {/* Wishlist Button */}
            <button 
              onClick={() => setCurrentView("wishlist")}
              className="relative p-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button 
              onClick={() => setCurrentView("cart")}
              className="relative p-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* User Profile / Admin Menu */}
            <div className="relative">
              {currentUser ? (
                <div>
                  <button 
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1 bg-zinc-50 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700/60 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    <img 
                      src={userProfile?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} 
                      alt="avatar" 
                      className="w-7 h-7 rounded-full object-cover" 
                    />
                    <span className="hidden lg:inline text-xs font-semibold pr-2 text-zinc-700 dark:text-zinc-300 max-w-[100px] truncate">
                      {userProfile?.displayName}
                    </span>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xl rounded-xl py-1.5 z-50">
                      <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">{userProfile?.displayName}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{currentUser.email}</p>
                      </div>

                      <button 
                        onClick={() => { setCurrentView("profile"); setProfileDropdownOpen(false); }}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-left transition-colors"
                      >
                        <UserIcon className="w-4 h-4" />
                        My Profile & Orders
                      </button>

                      {userProfile?.role === "admin" && (
                        <button 
                          onClick={() => { setCurrentView("admin"); setProfileDropdownOpen(false); }}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-left transition-colors border-t border-zinc-100 dark:border-zinc-800"
                        >
                          <LayoutDashboard className="w-4 h-4 text-rose-500" />
                          Admin Dashboard
                        </button>
                      )}

                      <button 
                        onClick={() => { logout(); setProfileDropdownOpen(false); }}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-left transition-colors border-t border-zinc-100 dark:border-zinc-800"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setCurrentView("login")}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 text-sm font-semibold rounded-xl hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white dark:hover:text-white transition-all duration-300 shadow-sm"
                >
                  <UserIcon className="w-4 h-4" />
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 transition-all">
          <div className="px-4 py-3 space-y-2">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative w-full mb-3">
              <input 
                type="text" 
                placeholder="Search premium gifts..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); }}
                className="w-full bg-zinc-50 dark:bg-zinc-800 text-zinc-950 dark:text-white pl-10 pr-4 py-2 rounded-xl text-sm border border-zinc-200 dark:border-zinc-700/50"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
            </form>

            <button 
              onClick={() => { setCurrentView("home"); setMobileMenuOpen(false); }}
              className={`block w-full py-2.5 text-left text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:text-rose-500 ${currentView === "home" ? "text-rose-500" : ""}`}
            >
              Home
            </button>
            <button 
              onClick={() => { setCurrentView("shop"); setMobileMenuOpen(false); }}
              className={`block w-full py-2.5 text-left text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:text-rose-500 ${currentView === "shop" ? "text-rose-500" : ""}`}
            >
              Shop
            </button>
            <button 
              onClick={() => { setCurrentView("ai-advisor"); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 w-full py-2.5 text-left text-sm font-bold text-rose-500"
            >
              <Sparkles className="w-4 h-4" />
              AI Gift Matcher
            </button>
            <button 
              onClick={() => { setCurrentView("about"); setMobileMenuOpen(false); }}
              className={`block w-full py-2.5 text-left text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:text-rose-500 ${currentView === "about" ? "text-rose-500" : ""}`}
            >
              About
            </button>
            <button 
              onClick={() => { setCurrentView("contact"); setMobileMenuOpen(false); }}
              className={`block w-full py-2.5 text-left text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:text-rose-500 ${currentView === "contact" ? "text-rose-500" : ""}`}
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
