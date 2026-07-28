import React from "react";
import { useApp } from "../context/AppContext";
import { Heart, ShoppingCart, Trash2, ArrowLeft, Star } from "lucide-react";

export const WishlistView: React.FC = () => {
  const { wishlist, products, toggleWishlist, addToCart, setCurrentView, setSelectedProductId } = useApp();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleProductClick = (id: string) => {
    setSelectedProductId(id);
    setCurrentView("product-details");
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4 font-sans">
        <Heart className="w-12 h-12 text-rose-300 mx-auto animate-pulse" />
        <h2 className="text-xl font-bold text-zinc-800 dark:text-white">Your Wishlist is Empty</h2>
        <p className="text-xs text-zinc-500">Keep track of your favorite luxury gift hampers and box caskets here.</p>
        <button 
          onClick={() => setCurrentView("shop")} 
          className="px-5 py-2.5 bg-rose-500 text-white font-bold rounded-xl shadow-md text-xs cursor-pointer"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-8 animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">My Wishlist</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {wishlistedProducts.map((p) => (
          <div 
            key={p.id}
            className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col h-full group"
          >
            
            {/* Remove item button */}
            <button 
              onClick={() => toggleWishlist(p.id)}
              className="absolute top-3 right-3 p-2 bg-white/95 dark:bg-zinc-900/95 text-rose-500 rounded-full shadow-sm cursor-pointer z-10"
              title="Remove from Wishlist"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Thumbnail */}
            <div 
              onClick={() => handleProductClick(p.id)}
              className="aspect-square overflow-hidden cursor-pointer bg-zinc-50"
            >
              <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>

            {/* Details */}
            <div className="p-4 flex flex-col flex-1 gap-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{p.category}</span>
              <h3 
                onClick={() => handleProductClick(p.id)}
                className="text-sm font-semibold text-zinc-900 dark:text-white line-clamp-1 group-hover:text-rose-500 cursor-pointer"
              >
                {p.name}
              </h3>

              <div className="flex items-center gap-1">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < Math.floor(p.rating) ? "fill-amber-400" : "text-zinc-200"}`} />
                  ))}
                </div>
                <span className="text-[10px] text-zinc-400">({p.reviewsCount})</span>
              </div>

              {/* Price and Cart */}
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-sm font-bold text-zinc-900 dark:text-white font-mono">${p.price}</span>
                <button 
                  onClick={() => addToCart(p, 1)}
                  className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-lg transition-all"
                  title="Move to Cart"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
