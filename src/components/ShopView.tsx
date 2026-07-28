import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { 
  Search, 
  SlidersHorizontal, 
  Star, 
  Heart, 
  ShoppingCart, 
  Grid, 
  List, 
  ChevronLeft, 
  ChevronRight,
  Info
} from "lucide-react";
import { Product } from "../types";

export const ShopView: React.FC = () => {
  const { 
    products, 
    categories, 
    productsLoading, 
    setCurrentView, 
    setSelectedProductId, 
    addToCart, 
    toggleWishlist, 
    wishlist 
  } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<number>(100);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("featured");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Layout View Style (Grid vs List)
  const [isGridView, setIsGridView] = useState<boolean>(true);

  // Computed filtered & sorted products
  const processedProducts = useMemo(() => {
    let result = [...products];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    // 2. Category
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // 3. Price Range (up to priceRange slider value)
    result = result.filter((p) => p.price <= priceRange);

    // 4. Min Rating
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    // 5. Stock Status
    if (onlyInStock) {
      result = result.filter((p) => p.stock > 0);
    }

    // 6. Sorting
    if (sortBy === "featured") {
      // Sort featured products first
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "reviews") {
      result.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return result;
  }, [products, searchQuery, selectedCategory, priceRange, minRating, onlyInStock, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(processedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedProducts.slice(start, start + itemsPerPage);
  }, [processedProducts, currentPage]);

  const handleProductClick = (id: string) => {
    setSelectedProductId(id);
    setCurrentView("product-details");
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setPriceRange(100);
    setMinRating(0);
    setOnlyInStock(false);
    setSortBy("featured");
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* FILTERS COLUMN - Left side (3 cols on desktop) */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-3xl shadow-sm space-y-6 sticky top-24">
            
            <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-rose-500" />
                Filters
              </h3>
              <button 
                onClick={resetFilters}
                className="text-xs font-semibold text-rose-500 hover:underline cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Category</label>
              <div className="flex flex-col gap-1.5">
                <button 
                  onClick={() => { setSelectedCategory("All"); setCurrentPage(1); }}
                  className={`w-full text-left text-sm py-1.5 px-3 rounded-lg font-medium transition-colors ${selectedCategory === "All" ? "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-bold" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"}`}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button 
                    key={cat.id || cat.name}
                    onClick={() => { setSelectedCategory(cat.name); setCurrentPage(1); }}
                    className={`w-full text-left text-sm py-1.5 px-3 rounded-lg font-medium transition-colors ${selectedCategory === cat.name ? "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-bold" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div className="space-y-3.5 border-t border-zinc-100 dark:border-zinc-800 pt-5">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Max Price</label>
                <span className="text-sm font-bold text-rose-500 font-mono">${priceRange}</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="150" 
                step="5"
                value={priceRange} 
                onChange={(e) => { setPriceRange(Number(e.target.value)); setCurrentPage(1); }}
                className="w-full accent-rose-500 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-xxs text-zinc-400 font-mono font-bold">
                <span>$10</span>
                <span>$150</span>
              </div>
            </div>

            {/* Star Rating Filter */}
            <div className="space-y-3 border-t border-zinc-100 dark:border-zinc-800 pt-5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Minimum Rating</label>
              <div className="flex flex-col gap-2">
                {[4, 3, 2].map((stars) => (
                  <button 
                    key={stars}
                    onClick={() => { setMinRating(stars); setCurrentPage(1); }}
                    className={`flex items-center gap-2 text-xs py-1 px-2 rounded-lg transition-colors ${minRating === stars ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"}`}
                  >
                    <div className="flex text-amber-400 shrink-0">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < stars ? "fill-amber-400" : "text-zinc-200 dark:text-zinc-700"}`} />
                      ))}
                    </div>
                    <span>& Up</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Availability Toggle */}
            <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-5">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Only In Stock</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={onlyInStock} 
                  onChange={() => { setOnlyInStock(!onlyInStock); setCurrentPage(1); }}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-rose-500"></div>
              </label>
            </div>

          </div>
        </aside>

        {/* PRODUCTS GRID COLUMN - Right side (9 cols on desktop) */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Topbar Filter & Sort controller */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
            
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <input 
                type="text" 
                placeholder="Search catalog..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full bg-zinc-50 dark:bg-zinc-800 text-zinc-950 dark:text-white pl-9 pr-3 py-2 border border-zinc-200 dark:border-zinc-700/60 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase shrink-0">Sort By</span>
              <select 
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 rounded-xl px-3 py-2 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              >
                <option value="featured">Best Matches (Featured)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviewed</option>
              </select>

              {/* View Layout Switcher */}
              <div className="hidden sm:flex border border-zinc-200 dark:border-zinc-700/60 rounded-xl p-1 gap-1">
                <button 
                  onClick={() => setIsGridView(true)} 
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isGridView ? "bg-rose-500 text-white" : "text-zinc-400 hover:text-zinc-800 dark:hover:text-white"}`}
                  title="Grid View"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setIsGridView(false)} 
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${!isGridView ? "bg-rose-500 text-white" : "text-zinc-400 hover:text-zinc-800 dark:hover:text-white"}`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Catalog Listing */}
          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-zinc-100 dark:bg-zinc-800/40 rounded-3xl aspect-[3/4]" />
              ))}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800 rounded-3xl space-y-4">
              <Info className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto" />
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">No Gift Items Found</h3>
              <p className="text-sm text-zinc-500 max-w-sm mx-auto">
                No products match your active combination of query filters. Try lowering the min rating or expanding price ranges.
              </p>
              <button 
                onClick={resetFilters}
                className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : isGridView ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {paginatedProducts.map((p) => {
                const isWishlisted = wishlist.includes(p.id);
                return (
                  <div 
                    key={p.id}
                    className="bg-white dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-rose-500/5 group transition-all duration-300 relative flex flex-col h-full"
                  >
                    {/* Badges */}
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
          ) : (
            /* LIST VIEW */
            <div className="space-y-4">
              {paginatedProducts.map((p) => {
                const isWishlisted = wishlist.includes(p.id);
                return (
                  <div 
                    key={p.id}
                    className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-4 rounded-3xl flex flex-col sm:flex-row gap-5 hover:shadow-xl transition-all duration-300 relative"
                  >
                    {/* Image */}
                    <div 
                      onClick={() => handleProductClick(p.id)}
                      className="w-full sm:w-44 h-44 shrink-0 rounded-2xl overflow-hidden bg-zinc-50 cursor-pointer"
                    >
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col flex-1 gap-2 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{p.category}</span>
                        <button 
                          onClick={() => toggleWishlist(p.id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-500 dark:text-zinc-500 dark:hover:text-rose-400 cursor-pointer transition-colors"
                        >
                          <Heart className={`w-4.5 h-4.5 ${isWishlisted ? "text-rose-500 fill-rose-500" : ""}`} />
                        </button>
                      </div>

                      <h3 
                        onClick={() => handleProductClick(p.id)}
                        className="text-base font-bold text-zinc-900 dark:text-white hover:text-rose-500 cursor-pointer transition-colors"
                      >
                        {p.name}
                      </h3>

                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>

                      <div className="flex items-center gap-1.5">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(p.rating) ? "fill-amber-400" : "text-zinc-200 dark:text-zinc-700"}`} />
                          ))}
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">({p.reviewsCount} reviews)</span>
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-extrabold text-zinc-950 dark:text-white font-mono">${p.price}</span>
                          {p.originalPrice > p.price && (
                            <span className="text-sm text-zinc-400 line-through font-mono">${p.originalPrice}</span>
                          )}
                        </div>

                        <button 
                          onClick={() => addToCart(p, 1)}
                          className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl shadow-md transition-colors cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {processedProducts.length > itemsPerPage && (
            <div className="flex justify-center items-center gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <button 
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                Page <strong className="font-bold text-zinc-950 dark:text-white">{currentPage}</strong> of {totalPages}
              </span>

              <button 
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </main>

      </div>
    </div>
  );
};
