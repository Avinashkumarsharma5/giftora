import React, { useEffect, useRef, useState } from "react";
import {
  Gift,
  Heart,
  Home,
  Search,
  ShoppingBag,
  Sparkles,
  User,
  Grid2x2,
  X,
  ChevronRight,
  Info,
  Phone,
} from "lucide-react";
import { useApp } from "../context/AppContext";

const MotionStyles = () => (
  <style>{`
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-8px) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .animate-slide-down {
      animation: slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    .animate-slide-up {
      animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `}</style>
);

export default function Navbar() {
  const {
    cart,
    wishlist,
    products,
    currentUser,
    currentView,
    setCurrentView,
    setSelectedProductId,
  } = useApp();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const searchRef = useRef(null);

  const results = search.trim()
    ? products
        .filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const total = cart.reduce((sum, item) => sum + item.quantity, 0);

  const go = (view) => {
    setCurrentView(view);
    setMoreOpen(false);
    setOpen(false);
  };

  const openProduct = (id) => {
    setSelectedProductId(id);
    setCurrentView("product-details");
    setSearch("");
    setOpen(false);
  };

  useEffect(() => {
    const close = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const navItems = [
    { key: "home", label: "Home", icon: Home },
    { key: "shop", label: "Shop", icon: ShoppingBag },
    { key: "ai-advisor", label: "AI Advisor", icon: Sparkles },
  ];

  const isActive = (key) => currentView === key;

  return (
    <>
      <MotionStyles />

      {/* ---------- Header ---------- */}
      <header className="font-body sticky top-0 z-50 bg-[#E87516]/95 text-white shadow-lg shadow-orange-950/15 backdrop-blur-xl border-b border-white/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo - Left */}
            <button
              onClick={() => go("home")}
              className="flex items-center gap-2 group"
            >
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/30">
                <Gift className="h-4.5 w-4.5 text-[#FFF8F0]" size={18} />
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-white ring-2 ring-[#E87516]" />
              </span>
              <span className="font-display text-2xl font-semibold tracking-tight text-white">
                Gifttora
              </span>
            </button>

            {/* Right Icons */}
            <div className="flex items-center gap-1.5">
              {/* Search */}
              <div ref={searchRef} className="relative">
                <button
                  type="button"
                  onClick={() => setOpen(!open)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
                >
                  <Search size={18} />
                </button>

                {open && (
                  <div className="absolute right-0 top-11 w-[340px] sm:w-[380px] rounded-2xl border border-[#E9DCC8] bg-white p-4 shadow-2xl animate-slide-down">
                    <input
                      autoFocus
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search gifts..."
                      className="w-full rounded-xl border border-[#E9DCC8] px-4 py-2.5 text-sm outline-none focus:border-[#6B1E3C] focus:shadow-[0_0_0_3px_rgba(107,30,60,0.1)]"
                    />

                    {results.length > 0 && (
                      <div className="mt-3 max-h-72 overflow-y-auto space-y-1">
                        {results.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => openProduct(item.id)}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-[#FBEAF0]"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                            <div className="flex-1 text-left">
                              <p className="truncate text-sm font-medium">
                                {item.name}
                              </p>
                              <p className="text-xs font-semibold text-[#6B1E3C]">
                                ₹{item.price}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {search && results.length === 0 && (
                      <div className="py-6 text-center text-sm text-gray-500">
                        No products found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <button
                onClick={() => go("wishlist")}
                aria-label="Wishlist"
                  className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
              >
                <Heart size={18} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#E87516] ring-2 ring-[#E87516]">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Profile */}
              <button
                onClick={() => go(currentUser ? "profile" : "login")}
                aria-label="Account"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
              >
                <User size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ---------- Bottom Navigation ---------- */}
      <nav className="font-body fixed bottom-0 left-0 right-0 z-50 border-t border-white/20 bg-[#E87516] text-white shadow-[0_-8px_24px_rgba(121,53,0,.15)]">
        <div className="relative h-[68px]">
          <div className="grid h-full grid-cols-4 max-w-md mx-auto">
            {navItems.map(({ key, label, icon: Icon }) => {
              const active = isActive(key);
              return (
                <button
                  key={key}
                  onClick={() => go(key)}
                  className="flex flex-col items-center justify-center gap-0.5 text-[10px]"
                >
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.4 : 1.8}
                    className="text-white"
                  />
                  <span
                    className={
                      active
                        ? "font-semibold text-white"
                        : "text-white/75"
                    }
                  >
                    {label}
                  </span>
                  <span
                    className={`h-1 w-1 rounded-full transition-opacity ${
                      active ? "bg-white opacity-100" : "opacity-0"
                    }`}
                  />
                </button>
              );
            })}

            <button
              onClick={() => setMoreOpen(true)}
              className="flex flex-col items-center justify-center gap-0.5 text-[10px]"
            >
              <Grid2x2
                size={20}
                strokeWidth={moreOpen ? 2.4 : 1.8}
                className="text-white"
              />
              <span
                className={
                  moreOpen ? "font-semibold text-white" : "text-white/75"
                }
              >
                More
              </span>
              <span
                className={`h-1 w-1 rounded-full transition-opacity ${
                  moreOpen ? "bg-white opacity-100" : "opacity-0"
                }`}
              />
            </button>
          </div>

          {/* Cart Button - Positioned on the right side */}
          <button
            onClick={() => go("cart")}
            aria-label="Cart"
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#C85A00] shadow-lg shadow-orange-950/25 ring-2 ring-white/70 transition hover:scale-105 active:scale-95">
              <ShoppingBag size={20} className="text-white" />
              {total > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#6B1F2A] text-[10px] font-bold text-white ring-2 ring-[#E87516]">
                  {total > 9 ? "9+" : total}
                </span>
              )}
            </span>
          </button>
        </div>
      </nav>

      {/* ---------- More Sheet ---------- */}
      {moreOpen && (
        <>
          <div
            onClick={() => setMoreOpen(false)}
            className="fixed inset-0 z-[55] bg-[#2B1620]/40 backdrop-blur-sm"
          />
          <div className="font-body fixed bottom-[84px] left-4 right-4 z-[60] rounded-3xl bg-white p-5 shadow-2xl animate-slide-up max-w-sm mx-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-[#2B1620]">
                Menu
              </h2>
              <button
                onClick={() => setMoreOpen(false)}
                aria-label="Close menu"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FBEAF0] text-[#6B1E3C] transition hover:bg-[#F5D9E4]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {[
                { key: "shop", label: "Categories", icon: Grid2x2 },
                { key: "about", label: "About Us", icon: Info },
                { key: "contact", label: "Contact Us", icon: Phone },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => go(key)}
                  className="flex w-full items-center gap-3 rounded-xl border border-[#E9DCC8] p-3.5 text-left transition hover:bg-[#FBEAF0]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FBEAF0] text-[#6B1E3C]">
                    <Icon size={16} />
                  </span>
                  <span className="flex-1 text-sm font-medium text-[#2B1620]">
                    {label}
                  </span>
                  <ChevronRight size={16} className="text-[#B0A395]" />
                </button>
              ))}
            </div>

            {currentUser && (
              <div className="mt-4 pt-4 border-t border-[#E9DCC8]">
                <div className="flex items-center gap-3 px-1">
                  <div className="h-10 w-10 rounded-full bg-[#6B1E3C] flex items-center justify-center text-white font-semibold text-sm">
                    {currentUser.name?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#2B1620]">
                      {currentUser.name || "User"}
                    </p>
                    <p className="text-xs text-[#B0A395]">
                      {currentUser.email || "user@email.com"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Spacer */}
      <div className="h-[68px]" />
    </>
  );
}
