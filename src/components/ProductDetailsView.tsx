import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Share2, 
  ShieldCheck, 
  Truck, 
  RefreshCcw, 
  Minus, 
  Plus, 
  Send, 
  ArrowLeft,
  User as UserIcon
} from "lucide-react";
import { Review } from "../types";

export const ProductDetailsView: React.FC = () => {
  const { 
    products, 
    selectedProductId, 
    setCurrentView, 
    setSelectedProductId, 
    addToCart, 
    toggleWishlist, 
    wishlist,
    currentUser,
    reviews,
    fetchReviews,
    submitReview,
    showToast
  } = useApp();

  const product = products.find((p) => p.id === selectedProductId);

  // Active States
  const [activeImage, setActiveImage] = useState("");
  const [qty, setQty] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Load active product image and reviews
  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      fetchReviews(product.id);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-sans">
        <h3 className="text-xl font-bold">Product Not Found</h3>
        <button 
          onClick={() => setCurrentView("shop")} 
          className="mt-4 px-5 py-2.5 bg-rose-500 text-white text-xs font-bold rounded-xl shadow-md"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    showToast(`Shared link copied to clipboard! Share the joy.`, "success");
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    setCurrentView("cart");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast("Please login to submit reviews.", "error");
      setCurrentView("login");
      return;
    }
    if (!reviewComment.trim()) {
      showToast("Please enter a comment for your review.", "error");
      return;
    }

    setSubmittingReview(true);
    try {
      await submitReview(product.id, reviewRating, reviewComment);
      setReviewComment("");
      setReviewRating(5);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingReview(false);
    }
  };

  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      {/* Back button */}
      <button 
        onClick={() => { setSelectedProductId(null); setCurrentView("shop"); }}
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-rose-500 mb-8 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4.5 h-4.5" /> Back to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* LEFT COLUMN: Gallery & Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-zinc-50 dark:bg-zinc-800/40 rounded-3xl overflow-hidden border border-zinc-100 dark:border-zinc-800 relative group">
            <img src={activeImage} alt={product.name} className="w-full h-full object-cover transition-all duration-300" />
            
            {/* Share action floating button */}
            <button 
              onClick={handleShare}
              className="absolute top-4 right-4 p-2.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm text-zinc-600 hover:text-rose-500 dark:text-zinc-400 rounded-full hover:scale-110 shadow-sm transition-all cursor-pointer"
              title="Share gift link"
            >
              <Share2 className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Thumbnail Gallery Row */}
          <div className="flex gap-4">
            <div 
              onClick={() => setActiveImage(product.image)}
              className={`w-20 h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${activeImage === product.image ? "border-rose-500" : "border-transparent opacity-70"}`}
            >
              <img src={product.image} alt="main image thumbnail" className="w-full h-full object-cover" />
            </div>
            {product.images?.map((imgUrl, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveImage(imgUrl)}
                className={`w-20 h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${activeImage === imgUrl ? "border-rose-500" : "border-transparent opacity-70"}`}
              >
                <img src={imgUrl} alt={`gallery item ${idx}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Details & Actions */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-widest bg-rose-500/10 px-2.5 py-1 rounded-full">{product.category}</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">{product.name}</h1>
            
            {/* Reviews summary */}
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-amber-400" : "text-zinc-200 dark:text-zinc-700"}`} />
                ))}
              </div>
              <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 font-mono">{product.rating}</span>
              <span className="text-xs text-zinc-400">({product.reviewsCount} reviews)</span>
            </div>
          </div>

          {/* Pricing bar */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-rose-600 font-mono">${product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-zinc-400 line-through font-mono">${product.originalPrice}</span>
            )}
            <span className="text-xs font-bold text-emerald-500 ml-2 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Save ${(product.originalPrice - product.price).toFixed(2)}
            </span>
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {product.description}
          </p>

          {/* Stock Availability */}
          <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Availability:</span>
            {product.stock > 0 ? (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/20 px-2 py-1 rounded-lg">
                In Stock ({product.stock} items left)
              </span>
            ) : (
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-100/60 dark:bg-rose-950/20 px-2 py-1 rounded-lg">
                Out of Stock
              </span>
            )}
          </div>

          {/* Quantity and Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            
            {/* Qty Selector */}
            {product.stock > 0 && (
              <div className="flex items-center justify-between border border-zinc-200 dark:border-zinc-700 rounded-2xl p-1 max-w-[140px] bg-zinc-50 dark:bg-zinc-800/40">
                <button 
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="p-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-white"
                  aria-label="Decrease Quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold font-mono px-3">{qty}</span>
                <button 
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="p-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-white"
                  aria-label="Increase Quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Main CTA actions */}
            <div className="flex flex-1 gap-3">
              {product.stock > 0 ? (
                <>
                  <button 
                    onClick={handleBuyNow}
                    className="flex-1 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    Buy Now
                  </button>
                  <button 
                    onClick={() => addToCart(product, qty)}
                    className="flex-1 py-3.5 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-white font-semibold rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ShoppingCart className="w-4.5 h-4.5 text-rose-500" />
                    Add to Cart
                  </button>
                </>
              ) : (
                <button 
                  disabled 
                  className="w-full py-3.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 font-semibold rounded-2xl cursor-not-allowed"
                >
                  Sold Out
                </button>
              )}

              {/* Wishlist Heart */}
              <button 
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 border border-zinc-200 dark:border-zinc-700 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0 shadow-sm ${isWishlisted ? "bg-rose-50/50 border-rose-200 dark:bg-rose-950/10 text-rose-500" : "text-zinc-400"}`}
                aria-label="Toggle Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
              </button>
            </div>

          </div>

          {/* Delivery & Brand Trust column */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-100 dark:border-zinc-800">
            <div className="flex gap-2.5 items-center">
              <Truck className="w-5 h-5 text-rose-500 shrink-0" />
              <div className="text-xxs leading-tight">
                <div className="font-bold">Fast Dispatch</div>
                <div className="text-zinc-400">Within 24 Hours</div>
              </div>
            </div>
            <div className="flex gap-2.5 items-center border-t sm:border-t-0 sm:border-l border-zinc-200 dark:border-zinc-800 pt-2 sm:pt-0 sm:pl-4">
              <RefreshCcw className="w-5 h-5 text-rose-500 shrink-0" />
              <div className="text-xxs leading-tight">
                <div className="font-bold">7-Day Return</div>
                <div className="text-zinc-400">Friendly Replacements</div>
              </div>
            </div>
            <div className="flex gap-2.5 items-center border-t sm:border-t-0 sm:border-l border-zinc-200 dark:border-zinc-800 pt-2 sm:pt-0 sm:pl-4">
              <ShieldCheck className="w-5 h-5 text-rose-500 shrink-0" />
              <div className="text-xxs leading-tight">
                <div className="font-bold">Free Box Wrap</div>
                <div className="text-zinc-400">Premium Materials</div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* REVIEWS & COMMENT SUBMIT SECTION */}
      <section className="mt-16 border-t border-zinc-100 dark:border-zinc-800 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Reviews List (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-xl font-bold text-zinc-950 dark:text-white">Customer Reviews ({reviews.length})</h2>
            
            {reviews.length === 0 ? (
              <div className="p-8 border border-dashed border-zinc-200 dark:border-zinc-800 text-center rounded-2xl text-zinc-400 text-sm">
                No reviews yet for this product. Be the very first to share your experience!
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {reviews.map((rev) => (
                  <div 
                    key={rev.id}
                    className="p-4 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center text-xs text-zinc-500">
                          <UserIcon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-zinc-900 dark:text-white">{rev.userName}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < rev.rating ? "fill-amber-400" : "text-zinc-200 dark:text-zinc-700"}`} />
                      ))}
                    </div>

                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Review Form (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 p-6 rounded-3xl space-y-4">
              <h3 className="font-bold text-zinc-950 dark:text-white">Submit Your Review</h3>
              
              {currentUser ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {/* Star selection */}
                  <div className="space-y-1.5">
                    <label className="text-xxs uppercase tracking-wider text-zinc-400 font-bold">Select Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="p-1 cursor-pointer"
                          aria-label={`Rate ${star} stars`}
                        >
                          <Star className={`w-6 h-6 ${star <= reviewRating ? "text-amber-400 fill-amber-400" : "text-zinc-200 dark:text-zinc-700"}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment box */}
                  <div className="space-y-1.5">
                    <label className="text-xxs uppercase tracking-wider text-zinc-400 font-bold">Your Comments</label>
                    <textarea 
                      required
                      rows={4}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your thoughts about this gift's quality, wrap design, and appeal..."
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white p-3 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={submittingReview}
                    className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-zinc-500 mb-3">You must be logged in to leave reviews.</p>
                  <button 
                    onClick={() => setCurrentView("login")}
                    className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold rounded-xl"
                  >
                    Login Now
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
