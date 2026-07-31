import React, { useMemo, useState } from "react";
import {
  ArrowRight, Bot, ChevronRight, Gift, Heart, PackageCheck, Search,
  ShieldCheck, Sparkles, Star, Truck, WandSparkles, ShoppingBag
} from "lucide-react";
import { useApp } from "../context/AppContext";

const reviews = [
  ["Priya Sharma", "The packaging felt so personal. It made our anniversary genuinely memorable.", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"],
  ["Rahul Mehta", "Beautiful gift, delivered on time and exactly like the photos.", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100"],
  ["Neha Verma", "The gift finder helped me choose something perfect in minutes.", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"],
];

function SectionHeading({ eyebrow, title, text, onViewAll }) {
  return <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-7">
    <div>
      {eyebrow && <p className="text-[11px] uppercase tracking-[.2em] font-bold text-rose-600 mb-2">{eyebrow}</p>}
      <h2 className="font-display text-3xl text-zinc-900 leading-tight">{title}</h2>
      {text && <p className="text-sm text-zinc-500 mt-1.5">{text}</p>}
    </div>
    {onViewAll && <button onClick={onViewAll} className="inline-flex items-center gap-1 self-start sm:self-auto text-sm font-bold text-rose-700 hover:text-rose-900">
      View all <ChevronRight className="w-4 h-4" />
    </button>}
  </div>;
}

function ProductCard({ product, onOpen, onCart, onWish, wished }) {
  if (!product) return null;
  const discount = product.originalPrice > product.price ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  return <article className="group rounded-2xl border border-[#f0e4db] bg-white overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-950/10 transition-all duration-300">
    <div onClick={() => onOpen(product.id)} className="relative aspect-square cursor-pointer overflow-hidden bg-[#f9f3ee]">
      <img src={product.image} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
      {discount > 0 && <span className="absolute left-3 top-3 rounded-md bg-rose-700 px-2 py-1 text-[10px] font-black text-white">{discount}% OFF</span>}
      <button onClick={(event) => { event.stopPropagation(); onWish(product.id); }} aria-label="Save product" className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-rose-700 shadow-sm hover:bg-rose-700 hover:text-white">
        <Heart className={`h-4 w-4 ${wished ? "fill-current" : ""}`} />
      </button>
      <button onClick={(event) => { event.stopPropagation(); onOpen(product.id); }} className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-14 whitespace-nowrap rounded-full bg-zinc-900 px-4 py-2 text-xs font-bold text-white transition-transform group-hover:translate-y-0">Quick view</button>
    </div>
    <div className="p-4">
      <p className="text-[10px] uppercase tracking-wider font-bold text-rose-600">{product.category}</p>
      <h3 onClick={() => onOpen(product.id)} className="mt-1 cursor-pointer truncate text-sm font-bold text-zinc-800 hover:text-rose-700">{product.name}</h3>
      <div className="mt-2 flex items-center gap-1 text-amber-500"><Star className="h-3.5 w-3.5 fill-current" /><span className="text-xs font-bold text-zinc-600">{product.rating || "4.8"}</span><span className="text-xs text-zinc-400">({product.reviewsCount || 0})</span></div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <div><span className="font-bold text-zinc-900">₹{product.price}</span>{product.originalPrice > product.price && <span className="ml-1.5 text-xs text-zinc-400 line-through">₹{product.originalPrice}</span>}</div>
        <button onClick={() => onCart(product, 1)} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-700 hover:text-white">Add</button>
      </div>
    </div>
  </article>;
}

export const HomeView = () => {
  const { products, categories, productsLoading, setCurrentView, setSelectedProductId, addToCart, toggleWishlist, wishlist, showToast } = useApp();
  const [email, setEmail] = useState("");
  const [finder, setFinder] = useState({ for: "Someone special", occasion: "Birthday", budget: "Under ₹1,500" });
  const featured = useMemo(() => products.filter(p => p.featured).slice(0, 4), [products]);
  const newArrivals = useMemo(() => products.filter(p => p.newArrival).slice(0, 4), [products]);
  const bestSellers = useMemo(() => products.filter(p => p.bestSeller).slice(0, 4), [products]);
  const trending = useMemo(() => products.filter(p => p.festivalOffer || p.bestSeller).slice(0, 4), [products]);
  const openProduct = id => { setSelectedProductId(id); setCurrentView("product-details"); };
  const showShop = () => setCurrentView("shop");
  const subscribe = event => { event.preventDefault(); if (email.trim()) { showToast("You're on the list — welcome to Giftora!", "success"); setEmail(""); } };
  const finderSubmit = () => { showToast(`Finding ${finder.occasion.toLowerCase()} gifts for ${finder.for.toLowerCase()}…`, "info"); setCurrentView("ai-advisor"); };
  const productGrid = list => productsLoading ? <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{[1,2,3,4].map(i => <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-rose-100" />)}</div> : <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{list.map(product => <ProductCard key={product.id} product={product} onOpen={openProduct} onCart={addToCart} onWish={toggleWishlist} wished={wishlist.includes(product.id)} />)}</div>;

  return <div className="bg-[#fffaf6] pb-16 text-zinc-800 animate-fade-in">
    <section className="border-b border-rose-100 bg-rose-800 py-2 text-center text-[11px] font-semibold text-white">Free shipping on orders above ₹999 <span className="mx-3 text-rose-200">•</span> Same day delivery in select cities</section>

    <section className="relative overflow-hidden bg-[#fff1eb]">
      <div className="absolute inset-0 opacity-30 paper-grain" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:py-20">
        <div className="relative z-10 max-w-xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.14em] text-rose-700"><Sparkles className="h-3.5 w-3.5" /> Curated for every feeling</p>
          <h1 className="font-display text-5xl leading-[1.05] text-zinc-900 sm:text-6xl">Celebrate every moment with <span className="text-rose-700">meaningful gifts.</span></h1>
          <p className="mt-5 max-w-md text-base leading-7 text-zinc-600">Thoughtful hampers, fresh flowers and personalized keepsakes—beautifully wrapped and delivered with love.</p>
          <div className="mt-7 flex flex-wrap gap-3"><button onClick={showShop} className="inline-flex items-center gap-2 rounded-xl bg-rose-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-rose-900/20 hover:bg-rose-800">Shop now <ArrowRight className="h-4 w-4" /></button><button onClick={() => setCurrentView("ai-advisor")} className="rounded-xl border border-rose-200 bg-white px-5 py-3 text-sm font-bold text-rose-700 hover:bg-rose-50">Find a perfect gift</button></div>
          <div className="mt-10 grid max-w-md grid-cols-3 border-t border-rose-200 pt-5"><div><b className="block text-xl text-rose-700">10K+</b><span className="text-[10px] uppercase tracking-wide text-zinc-500">Happy gifts</span></div><div><b className="block text-xl text-rose-700">4.9★</b><span className="text-[10px] uppercase tracking-wide text-zinc-500">Customer love</span></div><div><b className="block text-xl text-rose-700">24 hrs</b><span className="text-[10px] uppercase tracking-wide text-zinc-500">Fast dispatch</span></div></div>
        </div>
        <div className="relative mx-auto w-full max-w-lg"><div className="absolute -right-7 -top-7 h-40 w-40 rounded-full bg-rose-200/60 blur-2xl" /><img className="relative aspect-[5/4] w-full rounded-[2rem] object-cover shadow-2xl shadow-rose-950/20" src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=85" alt="Wrapped premium gifts" /><div className="absolute -bottom-5 -left-4 rounded-2xl border border-rose-100 bg-white p-3 shadow-xl"><p className="text-xs font-bold text-zinc-900">Gift wrapping on us</p><p className="mt-0.5 text-[11px] text-zinc-500">For every special order</p></div></div>
      </div>
    </section>

    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-3 px-5 py-5 sm:grid-cols-3 sm:px-8"><div className="flex items-center gap-3 rounded-xl bg-white p-4"><Truck className="h-6 w-6 text-rose-700"/><div><b className="text-xs">Free shipping</b><p className="text-[11px] text-zinc-500">On orders above ₹999</p></div></div><div className="flex items-center gap-3 rounded-xl bg-white p-4"><PackageCheck className="h-6 w-6 text-rose-700"/><div><b className="text-xs">Same-day delivery</b><p className="text-[11px] text-zinc-500">In select cities</p></div></div><div className="flex items-center gap-3 rounded-xl bg-white p-4"><ShieldCheck className="h-6 w-6 text-rose-700"/><div><b className="text-xs">Safe payments</b><p className="text-[11px] text-zinc-500">100% secure checkout</p></div></div></section>

    <main className="mx-auto max-w-7xl space-y-20 px-5 pt-10 sm:px-8">
      <section><SectionHeading eyebrow="Handpicked for you" title="Featured products" text="Small gestures. Lasting memories." onViewAll={showShop}/>{productGrid(featured)}</section>
      <section className="grid gap-8 rounded-3xl bg-[#f9e8e2] p-6 md:grid-cols-[1.15fr_.85fr] md:p-9"><div><p className="text-[11px] font-bold uppercase tracking-[.2em] text-rose-700">Giftora AI</p><h2 className="mt-2 font-display text-3xl text-zinc-900">Not sure what to gift?</h2><p className="mt-2 text-sm leading-6 text-zinc-600">Tell us a little about the person and we’ll find a thoughtful match.</p><div className="mt-6 grid gap-3 sm:grid-cols-3">{Object.entries(finder).map(([key, value]) => <select key={key} value={value} onChange={e => setFinder({...finder, [key]: e.target.value})} className="rounded-lg border border-rose-200 bg-white px-3 py-3 text-xs text-zinc-700 focus:outline-rose-500"><option>{key === "for" ? "Someone special" : key === "occasion" ? "Birthday" : "Under ₹1,500"}</option><option>{key === "for" ? "Partner" : key === "occasion" ? "Anniversary" : "₹1,500 - ₹3,000"}</option><option>{key === "for" ? "Friend" : key === "occasion" ? "Wedding" : "Above ₹3,000"}</option></select>)}</div><button onClick={finderSubmit} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-rose-700 px-4 py-3 text-xs font-bold text-white hover:bg-rose-800"><WandSparkles className="h-4 w-4"/> Find my gift</button></div><div className="relative min-h-48 overflow-hidden rounded-2xl"><img className="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=700&q=85" alt="Gift finder"/><div className="absolute inset-0 bg-gradient-to-tr from-rose-950/50 to-transparent"/><Bot className="absolute bottom-5 right-5 h-12 w-12 rounded-full bg-white p-3 text-rose-700 shadow-lg"/></div></section>
      <section><SectionHeading eyebrow="Shop by moment" title="Find gifts by category" text="A thoughtful edit for every celebration." onViewAll={showShop}/><div className="grid grid-cols-2 gap-3 sm:grid-cols-5">{categories.slice(0, 10).map(cat => <button key={cat.id || cat.name} onClick={showShop} className="group overflow-hidden rounded-2xl border border-rose-100 bg-white text-left"><div className="aspect-[4/3] overflow-hidden bg-rose-50"><img className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src={cat.image} alt={cat.name}/></div><p className="p-3 text-xs font-bold text-zinc-700 group-hover:text-rose-700">{cat.name}</p></button>)}</div></section>
      <section><SectionHeading eyebrow="Just landed" title="New arrivals" text="Fresh little surprises for your favourite people." onViewAll={showShop}/>{productGrid(newArrivals)}</section>
      <section className="relative overflow-hidden rounded-3xl bg-[#711827] px-6 py-10 text-white md:px-12"><div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[url('https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=85')] bg-cover bg-center opacity-70 md:block"/><div className="relative max-w-md"><p className="text-xs font-bold uppercase tracking-[.2em] text-rose-200">Festival collection</p><h2 className="mt-3 font-display text-4xl">Up to 30% off<br/>on gifts & hampers</h2><p className="mt-4 text-sm leading-6 text-rose-100">Make their day extraordinary with limited edition festive gift boxes.</p><button onClick={showShop} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-xs font-bold text-rose-800 hover:bg-rose-50">Explore offers <ArrowRight className="h-4 w-4"/></button></div></section>
      <section><SectionHeading eyebrow="Loved by everyone" title="Best sellers" text="The gifts our customers keep coming back for." onViewAll={showShop}/>{productGrid(bestSellers)}</section>
      <section><SectionHeading eyebrow="Popular right now" title="Trending gifts" text="The season’s most saved and shared finds." onViewAll={showShop}/>{productGrid(trending)}</section>
      <section><SectionHeading eyebrow="From our community" title="Words that make us smile" text="Over 10,000 moments made special."/><div className="grid gap-4 md:grid-cols-3">{reviews.map(([name, quote, image]) => <article key={name} className="rounded-2xl border border-rose-100 bg-white p-6"><div className="flex text-amber-500">{Array.from({length:5}, (_,i)=><Star key={i} className="h-4 w-4 fill-current"/>)}</div><p className="mt-4 text-sm leading-6 text-zinc-600">“{quote}”</p><div className="mt-5 flex items-center gap-3"><img className="h-9 w-9 rounded-full object-cover" src={image} alt={name}/><div><b className="text-xs">{name}</b><p className="text-[10px] text-zinc-400">Verified customer</p></div></div></article>)}</div></section>
      <section className="overflow-hidden rounded-3xl border border-rose-100 bg-[#fbece5] px-6 py-10 text-center sm:px-14"><Gift className="mx-auto h-8 w-8 text-rose-700"/><h2 className="mt-3 font-display text-3xl text-zinc-900">A little joy, straight to your inbox</h2><p className="mx-auto mt-2 max-w-md text-sm text-zinc-600">Gift ideas, thoughtful reminders and exclusive offers—only the good stuff.</p><form onSubmit={subscribe} className="mx-auto mt-6 flex max-w-lg flex-col gap-2 sm:flex-row"><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your email address" className="min-w-0 flex-1 rounded-lg border border-rose-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-600"/><button className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-700 px-5 py-3 text-sm font-bold text-white hover:bg-rose-800">Subscribe <ArrowRight className="h-4 w-4"/></button></form></section>
    </main>
    <button onClick={() => window.scrollTo({top: 0, behavior: "smooth"})} aria-label="Back to top" className="fixed bottom-5 right-5 z-40 grid h-11 w-11 place-items-center rounded-full bg-rose-700 text-white shadow-lg hover:bg-rose-800"><ArrowRight className="h-5 w-5 -rotate-90"/></button>
  </div>;
};
