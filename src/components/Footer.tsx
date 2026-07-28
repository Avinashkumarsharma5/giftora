import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Mail, Gift, Phone, MapPin, ArrowRight, ShieldCheck, Truck, RefreshCw } from "lucide-react";

export const Footer: React.FC = () => {
  const { setCurrentView, showToast } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      showToast("Thank you for subscribing to the Giftora newsletter! Enjoy 10% off your next purchase.", "success");
      setNewsletterEmail("");
    }
  };

  return (
    <footer className="bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 transition-colors duration-300">
      
      {/* Trust Badges Bar */}
      <div className="border-b border-zinc-200/60 dark:border-zinc-800/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Free Express Delivery</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">On all gift boxes and orders above $40</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Easy Returns & Replacement</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Friendly 7-day return policy for unused items</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">100% Secure Checkout</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Your payments are protected with top security</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Logo & Slogan */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2 select-none" onClick={() => setCurrentView("home")}>
              <div className="p-2 bg-rose-500 rounded-xl text-white">
                <Gift className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-zinc-950 dark:text-white">
                Giftora<span className="text-rose-500">.</span>
              </span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">
              Discover unique, luxury, and thoughtful gift boxes tailored to every celebratory occasion. Bringing warmth and smiles right to your loved ones' doorsteps.
            </p>
            <div className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400 pt-2">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4.5 h-4.5 text-rose-500 shrink-0" />
                <span>+1 (555) 438-4438</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4.5 h-4.5 text-rose-500 shrink-0" />
                <span>support@giftora.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4.5 h-4.5 text-rose-500 shrink-0" />
                <span>800 Celebration Blvd, Suite 100, FL</span>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="sm:col-span-4 lg:col-span-2 space-y-4">
            <h4 className="text-sm font-semibold text-zinc-950 dark:text-white uppercase tracking-wider">Shop Collections</h4>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li><button onClick={() => setCurrentView("shop")} className="hover:text-rose-500 hover:underline transition-all">Gourmet Treats</button></li>
              <li><button onClick={() => setCurrentView("shop")} className="hover:text-rose-500 hover:underline transition-all">Home & Fragrances</button></li>
              <li><button onClick={() => setCurrentView("shop")} className="hover:text-rose-500 hover:underline transition-all">Wellness & Spa</button></li>
              <li><button onClick={() => setCurrentView("shop")} className="hover:text-rose-500 hover:underline transition-all">Custom Engravings</button></li>
              <li><button onClick={() => setCurrentView("shop")} className="hover:text-rose-500 hover:underline transition-all">New Arrivals</button></li>
            </ul>
          </div>

          {/* Experience Column */}
          <div className="sm:col-span-4 lg:col-span-2 space-y-4">
            <h4 className="text-sm font-semibold text-zinc-950 dark:text-white uppercase tracking-wider">Our Brand</h4>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li><button onClick={() => setCurrentView("about")} className="hover:text-rose-500 hover:underline transition-all">About Our Craft</button></li>
              <li><button onClick={() => setCurrentView("contact")} className="hover:text-rose-500 hover:underline transition-all">Get in Touch</button></li>
              <li><button onClick={() => setCurrentView("ai-advisor")} className="hover:text-rose-500 hover:underline transition-all">AI Gift Matcher</button></li>
              <li><a href="#" className="hover:text-rose-500 hover:underline transition-all">Sustainability Policy</a></li>
              <li><a href="#" className="hover:text-rose-500 hover:underline transition-all">Corporate Gifting</a></li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="sm:col-span-4 lg:col-span-4 space-y-4">
            <h4 className="text-sm font-semibold text-zinc-950 dark:text-white uppercase tracking-wider">Join our Newsletter</h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Stay in the loop for holiday discounts, new seasonal hampers, and personalized gifting ideas!
            </p>
            <form onSubmit={handleSubscribe} className="relative flex gap-2 w-full pt-1">
              <input 
                type="email" 
                required
                placeholder="Enter email address" 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white pl-4 pr-12 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
              <button 
                type="submit"
                className="absolute right-1.5 top-1.5 p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors cursor-pointer"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Footer Bottom copyright */}
      <div className="border-t border-zinc-200/60 dark:border-zinc-900 py-6 bg-zinc-100/50 dark:bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <p>© 2026 Giftora Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-rose-500 hover:underline">Privacy Policy</a>
            <a href="#" className="hover:text-rose-500 hover:underline">Terms of Service</a>
            <a href="#" className="hover:text-rose-500 hover:underline">Shipping & Delivery</a>
          </div>
        </div>
      </div>

    </footer>
  );
};
