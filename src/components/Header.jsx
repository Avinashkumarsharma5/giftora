import React, { useEffect, useRef, useState } from "react";
import { Gift, Heart, Menu, Search, ShoppingBag, Sparkles, User, X } from "lucide-react";
import { useApp } from "../context/AppContext";

export const Header = () => {
  const { cart, wishlist, products, currentUser, currentView, setCurrentView, setSelectedProductId } = useApp();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const searchRef = useRef(null);
  const results = search.trim() ? products.filter(item => item.name.toLowerCase().includes(search.toLowerCase())).slice(0, 5) : [];
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  const go = view => { setCurrentView(view); setMenu(false); };
  const openProduct = id => { setSelectedProductId(id); setCurrentView("product-details"); setSearch(""); setOpen(false); };
  useEffect(() => { const close = event => { if (searchRef.current && !searchRef.current.contains(event.target)) setOpen(false); }; document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close); }, []);
  return <>
    <header className="site-header sticky top-0 z-50 border-b border-rose-100 bg-[#fffdfb]/95 backdrop-blur-xl">
      <div className="site-header__inner mx-auto flex h-[74px] max-w-7xl items-center gap-5 px-5 sm:px-8">
        <button onClick={() => go("home")} className="brand shrink-0"><span className="brand__mark"><Gift className="h-4 w-4"/></span><span>Giftora</span></button>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
          {[ ["Home", "home"], ["Shop", "shop"], ["Categories", "shop"], ["About us", "about"], ["Contact us", "contact"] ].map(([label, view]) => <button key={label} onClick={() => go(view)} className={`nav-link ${currentView === view ? "nav-link--active" : ""}`}>{label}</button>)}
        </nav>
        <form ref={searchRef} onSubmit={event => { event.preventDefault(); if (search.trim()) go("shop"); }} className="header-search relative ml-auto hidden max-w-sm flex-1 md:block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-500"/>
          <input value={search} onChange={event => { setSearch(event.target.value); setOpen(true); }} onFocus={() => setOpen(true)} placeholder="Search gifts, flowers, hampers..." />
          {open && results.length > 0 && <div className="search-results">{results.map(item => <button type="button" onClick={() => openProduct(item.id)} key={item.id}><img src={item.image} alt=""/><span><b>{item.name}</b><small>₹{item.price}</small></span></button>)}</div>}
        </form>
        <div className="flex items-center gap-1.5">
          <button onClick={() => go("ai-advisor")} className="hidden rounded-lg bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 xl:inline-flex xl:items-center xl:gap-1.5"><Sparkles className="h-3.5 w-3.5"/> Gift finder</button>
          <button onClick={() => go("wishlist")} className="icon-action" aria-label="Wishlist"><Heart className="h-[19px] w-[19px]"/>{wishlist.length > 0 && <i>{wishlist.length}</i>}</button>
          <button onClick={() => go("cart")} className="icon-action" aria-label="Cart"><ShoppingBag className="h-[19px] w-[19px]"/>{total > 0 && <i>{total}</i>}</button>
          <button onClick={() => go(currentUser ? "profile" : "login")} className="user-action"><User className="h-4 w-4"/><span className="hidden sm:inline">{currentUser ? "Account" : "Sign in"}</span></button>
          <button onClick={() => setMenu(!menu)} className="ml-1 grid h-10 w-10 place-items-center rounded-lg text-rose-800 hover:bg-rose-50 lg:hidden" aria-label="Open menu">{menu ? <X/> : <Menu/>}</button>
        </div>
      </div>
      {menu && <div className="mobile-nav border-t border-rose-100 bg-[#fffdfb] px-5 py-4 lg:hidden"><form onSubmit={event => { event.preventDefault(); go("shop"); }} className="header-search relative mb-4 md:hidden"><Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-500"/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search gifts..."/></form>{[["Home","home"],["Shop","shop"],["Categories","shop"],["AI Gift Finder","ai-advisor"],["About us","about"],["Contact us","contact"]].map(([label, view]) => <button key={label} onClick={() => go(view)}>{label}</button>)}</div>}
    </header>
  </>;
};
