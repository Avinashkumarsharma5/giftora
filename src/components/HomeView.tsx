import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  Sparkles, 
  ArrowRight, 
  Star, 
  Heart, 
  ShoppingCart, 
  ChevronRight, 
  Copy, 
  Gift, 
  HeartHandshake, 
  Clock, 
  CornerDownRight 
} from "lucide-react";
import { motion } from "motion/react";
import { Product } from "../types";

export const HomeView: React.FC = () => {
  const { 
    products, 
    categories, 
    productsLoading, 
    setCurrentView, 
    setSelectedProductId, 
    addToCart, 
    toggleWishlist, 
    wishlist,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<"featured" | "bestseller" | "new">("featured");

  const filteredProducts = products.filter((p) => {
    if (activeTab === "featured") return p.featured;
    if (activeTab === "bestseller") return p.bestSeller;
    if (activeTab === "new") return p.newArrival;
    return p.featured;
  });

  const festivalOffers = products.filter(p => p.festivalOffer).slice(0, 3);

  const handleProductClick = (id: string) => {
    setSelectedProductId(id);
    setCurrentView("product-details");
  };

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Coupon "${code}" copied to clipboard!`, "success");
  };

  return (
    <div className="space-y-16 pb-20 animate-fade-in font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-[#040405] bg-elegant-dark-grid py-16 sm:py-24 border-b border-zinc-200/5 dark:border-white/10">
        
        {/* Subtle decorative vector patterns */}
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] -z-10 animate-pulse duration-5000" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-fuchsia-600/10 rounded-full blur-[80px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600/20 to-fuchsia-500/20 text-violet-400 border border-violet-500/20 px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-4 h-4 text-fuchsia-400" />
                Scented & Curated Gifting Experience
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight font-sans tracking-tight">
                Perfect <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Gifts</span> for Every Loved Connection
              </h1>
              
              <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Explore luxury, custom-engraved, and premium bespoke boxes. Take our AI Gift Recommendation quiz to find the ultimate personalized package in 10 seconds!
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button 
                  onClick={() => setCurrentView("shop")}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-tr from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 text-white font-semibold rounded-2xl shadow-lg shadow-violet-500/20 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  Shop Best Sellers
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </button>
                <button 
                  onClick={() => setCurrentView("ai-advisor")}
                  className="w-full sm:w-auto px-8 py-3.5 bg-white/5 dark:bg-white/5 text-white font-semibold rounded-2xl border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-5 h-5 text-fuchsia-400 animate-pulse" />
                  Try AI Advisor Quiz
                </button>
              </div>

              {/* Small trust row */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">10K+</div>
                  <div className="text-xxs uppercase tracking-wider text-zinc-500 font-semibold">Delivered Boxes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">4.9★</div>
                  <div className="text-xxs uppercase tracking-wider text-zinc-500 font-semibold">Customer Star</div>
                </div>
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">24Hr</div>
                  <div className="text-xxs uppercase tracking-wider text-zinc-500 font-semibold">Instant Dispatch</div>
                </div>
              </div>
            </div>

            {/* Hero Right Banner Carousel Card */}
            <div className="relative flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Floating tags */}
                <div className="absolute -top-4 -left-4 bg-zinc-900/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/10 flex items-center gap-2 z-10 animate-bounce" style={{ animationDuration: "3s" }}>
                  <div className="p-1.5 bg-amber-500/20 rounded-lg"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /></div>
                  <div>
                    <div className="text-xs font-bold text-white">Rated 5 Stars</div>
                    <div className="text-[10px] text-zinc-400 font-medium">Bespoke Quality</div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 bg-zinc-900/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/10 flex items-center gap-2.5 z-10 animate-bounce" style={{ animationDuration: "4s" }}>
                  <div className="p-1.5 bg-violet-500/20 rounded-lg text-violet-400"><Gift className="w-4.5 h-4.5" /></div>
                  <div>
                    <div className="text-xs font-bold text-white">Luxury Boxes</div>
                    <div className="text-[10px] text-zinc-400 font-medium">Gift Wrap Free</div>
                  </div>
                </div>

                {/* Main Hero Image Frame */}
                <div className="aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80" 
                    alt="Premium luxury Gift Boxes" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-xxs uppercase tracking-widest text-violet-400 font-bold">Featured curation</span>
                    <h3 className="text-lg font-bold">Artisanal Gourmet & Fragrance Hamper</h3>
                    <p className="text-xs text-zinc-300 mt-1">Starting from only $45.00</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Circular Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Explore Curated Categories</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Find products matching custom lifestyles</p>
          </div>
          <button 
            onClick={() => setCurrentView("shop")} 
            className="text-sm text-rose-500 font-semibold flex items-center gap-1 hover:gap-1.5 transition-all cursor-pointer"
          >
            All Categories <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <div 
              key={cat.id || cat.name}
              onClick={() => setCurrentView("shop")}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-transparent group-hover:border-rose-500 shadow-md group-hover:shadow-rose-500/10 transition-all duration-300 relative">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/10 dark:bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-3 group-hover:text-rose-500 transition-colors">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Tabbed Products Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">Our Premium Curations</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Gifts designed to capture true elegance. From wellness products to artisanal gourmet chocolates.
          </p>

          {/* Navigation Tabs */}
          <div className="flex justify-center pt-2">
            <div className="inline-flex bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-2xl gap-1">
              <button 
                onClick={() => setActiveTab("featured")}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === "featured" ? "bg-white dark:bg-zinc-900 shadow-sm text-rose-500" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-white"}`}
              >
                Featured
              </button>
              <button 
                onClick={() => setActiveTab("bestseller")}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === "bestseller" ? "bg-white dark:bg-zinc-900 shadow-sm text-rose-500" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-white"}`}
              >
                Best Sellers
              </button>
              <button 
                onClick={() => setActiveTab("new")}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === "new" ? "bg-white dark:bg-zinc-900 shadow-sm text-rose-500" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-white"}`}
              >
                New Arrivals
              </button>
            </div>
          </div>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 4, 5].map((i) => (
              <div key={i} className="animate-pulse bg-zinc-100 dark:bg-zinc-800/40 rounded-2xl aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filteredProducts.map((p) => {
              const isWishlisted = wishlist.includes(p.id);
              return (
                <div 
                  key={p.id}
                  className="bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-100 dark:border-zinc-800/80 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-rose-500/5 group transition-all duration-300 relative flex flex-col h-full"
                >
                  
                  {/* Badge */}
                  {p.bestSeller && (
                    <span className="absolute top-3 left-3 bg-amber-500 text-white text-[9px] font-bold px-2 py-1 rounded-full z-10 shadow-sm uppercase tracking-wider">
                      Best Seller
                    </span>
                  )}
                  {p.newArrival && !p.bestSeller && (
                    <span className="absolute top-3 left-3 bg-rose-500 text-white text-[9px] font-bold px-2 py-1 rounded-full z-10 shadow-sm uppercase tracking-wider">
                      New Arrival
                    </span>
                  )}

                  {/* Wishlist Button */}
                  <button 
                    onClick={() => toggleWishlist(p.id)}
                    className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm text-zinc-400 hover:text-rose-500 dark:text-zinc-500 dark:hover:text-rose-400 rounded-full hover:scale-110 shadow-sm transition-all z-10 cursor-pointer"
                    aria-label="Add to Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? "text-rose-500 fill-rose-500" : ""}`} />
                  </button>

                  {/* Image wrapper */}
                  <div 
                    onClick={() => handleProductClick(p.id)}
                    className="aspect-square bg-zinc-50 dark:bg-zinc-800/40 overflow-hidden relative cursor-pointer"
                  >
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>

                  {/* Details */}
                  <div className="p-4 flex flex-col flex-1 gap-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{p.category}</span>
                    <h3 
                      onClick={() => handleProductClick(p.id)}
                      className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:text-rose-500 cursor-pointer transition-colors"
                    >
                      {p.name}
                    </h3>

                    {/* Ratings */}
                    <div className="flex items-center gap-1">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < Math.floor(p.rating) ? "fill-amber-400" : "text-zinc-200 dark:text-zinc-700"}`} 
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium font-mono">({p.reviewsCount})</span>
                    </div>

                    {/* Price and Add to Cart */}
                    <div className="flex items-center justify-between mt-auto pt-2 gap-2 border-t border-zinc-100/60 dark:border-zinc-800/50">
                      <div className="flex items-baseline gap-1.5 shrink-0">
                        <span className="text-base font-bold text-zinc-900 dark:text-white font-mono">${p.price}</span>
                        {p.originalPrice > p.price && (
                          <span className="text-xs text-zinc-400 dark:text-zinc-500 line-through font-mono">${p.originalPrice}</span>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => addToCart(p, 1)}
                        className="p-2.5 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-500 dark:hover:text-white rounded-xl transition-all duration-300 cursor-pointer shrink-0"
                        title="Add to Cart"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Festival Offer Promo Section */}
      <section className="bg-gradient-to-r from-violet-950 via-fuchsia-950/40 to-zinc-950 border border-white/10 text-white rounded-3xl max-w-7xl mx-auto mx-4 sm:mx-6 lg:mx-8 py-12 px-6 sm:px-12 relative overflow-hidden shadow-2xl">
        
        {/* Abstract shape */}
        <div className="absolute right-[-5%] top-[-20%] w-80 h-80 bg-violet-500/20 rounded-full blur-[80px]" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
          <div className="space-y-4 text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-[0.2em] bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-violet-300">
              Limited Festive Collection
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-sans tracking-tight">
              Elegance in Every Wrapped Moment
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Use code <strong className="font-bold text-fuchsia-400">WELCOME20</strong> to grab a flat 20% discount on orders above $40, or <strong className="font-bold text-violet-400">FESTIVE30</strong> for orders above $60! Wrap options are entirely on us.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3.5 pt-2">
              <div 
                onClick={() => copyCoupon("WELCOME20")}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl text-xs font-bold font-mono cursor-pointer transition-colors backdrop-blur-sm"
                title="Copy WELCOME20"
              >
                WELCOME20 <Copy className="w-3.5 h-3.5 text-violet-400" />
              </div>
              <div 
                onClick={() => copyCoupon("FESTIVE30")}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl text-xs font-bold font-mono cursor-pointer transition-colors backdrop-blur-sm"
                title="Copy FESTIVE30"
              >
                FESTIVE30 <Copy className="w-3.5 h-3.5 text-fuchsia-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {festivalOffers.map(p => (
              <div 
                key={p.id}
                onClick={() => handleProductClick(p.id)}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2 cursor-pointer hover:bg-white/10 transition-all text-center group"
              >
                <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-white/10">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="text-[10px] font-bold line-clamp-1 leading-tight text-zinc-300">{p.name}</div>
                <div className="text-xs font-black font-mono mt-0.5 text-violet-400">${p.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Customer Review Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">Delighted Customers</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Read beautiful stories of connection and smiles shared</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 p-6 rounded-3xl relative">
            <div className="flex text-amber-400 gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed italic mb-6">
              "Giftora transformed my mom's 60th birthday! The rose quartz set was wrapped beautifully and the lavender scented candles smelled heavenly. Best online gifting experience ever!"
            </p>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120" alt="Sarah" className="w-10 h-10 object-cover rounded-full" />
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Sarah Jenkins</h4>
                <p className="text-xxs text-zinc-400">Verified buyer • New York</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 p-6 rounded-3xl relative">
            <div className="flex text-amber-400 gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed italic mb-6">
              "The personalized leather wallet looked extremely professional and bespoke. Highly distinguished full-grain quality. The recipient was thrilled! Highly recommended for premium gifts."
            </p>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120" alt="Michael" className="w-10 h-10 object-cover rounded-full" />
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Michael Chang</h4>
                <p className="text-xxs text-zinc-400">Verified buyer • San Francisco</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 p-6 rounded-3xl relative">
            <div className="flex text-amber-400 gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed italic mb-6">
              "I used the AI Gift Matcher because I had no idea what to give my tech-savvy cousin. The suggestion was spot on and he loved the sunset lamp projection! Fast shipping."
            </p>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120" alt="Emily" className="w-10 h-10 object-cover rounded-full" />
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Emily Rodriguez</h4>
                <p className="text-xxs text-zinc-400">Verified buyer • Chicago</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
