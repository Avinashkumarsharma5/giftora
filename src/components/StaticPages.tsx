import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  Gift, 
  MapPin, 
  Phone, 
  Mail, 
  Send, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  HeartHandshake,
  Heart
} from "lucide-react";

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans space-y-12 animate-fade-in">
      
      {/* Intro display heading */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 dark:text-white tracking-tight leading-none">
          Our Gifting Craft & Story
        </h1>
        <p className="text-sm text-zinc-500 max-w-lg mx-auto">
          Founded in 2026, Giftora was created with a humble dream: bringing authentic luxury, handcrafted precision, and bespoke warmth back to celebrates.
        </p>
      </div>

      {/* Narrative grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <p>
            We believe that a gift shouldn't just be an item; it's a bridge of love, a scent of memory, and a physical manifestation of a thoughtful relationship.
          </p>
          <p>
            Every single hamper we ship is hand-curated at our headquarters in Florida. We coordinate with organic bee farms, local leather tanners, soy candle artisans, and eco-friendly packaging suppliers to guarantee unmatched tactile appeal.
          </p>
          <div className="space-y-2 text-zinc-800 dark:text-zinc-100 font-bold pt-2">
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-rose-500" />
              <span>Sourced from single-origin growers</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-rose-500" />
              <span>100% biodegradable custom card wrapping</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-rose-500" />
              <span>Bespoke custom engravings on demand</span>
            </div>
          </div>
        </div>

        <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-zinc-100 dark:border-zinc-800">
          <img 
            src="https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600" 
            alt="Giftora Packaging Workshop" 
            className="w-full h-full object-cover" 
          />
        </div>
      </div>

      {/* Core values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
        <div className="bg-zinc-50 dark:bg-zinc-900/40 p-6 rounded-2xl space-y-3">
          <ShieldCheck className="w-7 h-7 text-rose-500" />
          <h4 className="font-bold text-zinc-900 dark:text-white">Strict Quality Checks</h4>
          <p className="text-xs text-zinc-500 leading-relaxed">Each leather wallet, face roller, and soy candle undergoes rigorous checks before being wrapped.</p>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900/40 p-6 rounded-2xl space-y-3">
          <HeartHandshake className="w-7 h-7 text-rose-500" />
          <h4 className="font-bold text-zinc-900 dark:text-white">Eco-Friendly Craft</h4>
          <p className="text-xs text-zinc-500 leading-relaxed">No plastics, no paraben waxes. Scented candles are made strictly with clean-burning organic soy.</p>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900/40 p-6 rounded-2xl space-y-3">
          <Clock className="w-7 h-7 text-rose-500" />
          <h4 className="font-bold text-zinc-900 dark:text-white">Express Delivery</h4>
          <p className="text-xs text-zinc-500 leading-relaxed">Dispatched in under 24 hours in insulated premium thermal packaging to prevent chocolate melting.</p>
        </div>
      </div>

    </div>
  );
};

export const ContactView: React.FC = () => {
  const { showToast } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSending(true);
    setTimeout(() => {
      showToast("Thank you! Your inquiry has been routed to our florida curation desk.", "success");
      setName("");
      setEmail("");
      setMessage("");
      setSending(false);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans space-y-12 animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight">Contact Our Concierge Desk</h1>
        <p className="text-sm text-zinc-500 max-w-md mx-auto">
          Need bulk corporate gifting assistance or custom hamper requests? Our specialists are available 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
          <h3 className="font-extrabold text-zinc-900 dark:text-white">Send a Message</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-400 uppercase tracking-wide">Full Name</label>
                <input 
                  type="text" required placeholder="Eleanor Vance" 
                  value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-3 rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-400 uppercase tracking-wide">Email Address</label>
                <input 
                  type="email" required placeholder="eleanor@example.com" 
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-3 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-zinc-400 uppercase tracking-wide">Inquiry Message</label>
              <textarea 
                required rows={5} placeholder="Describe your corporate event, quantity required, or custom engraving words..."
                value={message} onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-3 rounded-xl focus:outline-none"
              />
            </div>

            <button 
              type="submit"
              disabled={sending}
              className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              {sending ? "Routing..." : "Send Inquiry"}
            </button>
          </form>
        </div>

        {/* Contact Info (5 cols) */}
        <div className="lg:col-span-5 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 p-6 sm:p-8 rounded-3xl flex flex-col justify-between space-y-6">
          <div className="space-y-6 text-sm">
            <h3 className="font-extrabold text-zinc-900 dark:text-white">Corporate HQ Address</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3 items-center">
                <MapPin className="w-5 h-5 text-rose-500 shrink-0" />
                <span>800 Celebration Blvd, Suite 100, Celebration, FL 34747</span>
              </div>

              <div className="flex gap-3 items-center">
                <Phone className="w-5 h-5 text-rose-500 shrink-0" />
                <span>+1 (555) 438-4438 (Free Toll)</span>
              </div>

              <div className="flex gap-3 items-center">
                <Mail className="w-5 h-5 text-rose-500 shrink-0" />
                <span>concierge@giftora.com</span>
              </div>
            </div>
          </div>

          {/* Interactive Map Simulation */}
          <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 relative bg-zinc-200">
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600" 
              alt="Miami Map Simulation" 
              className="w-full h-full object-cover opacity-60" 
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/15">
              <div className="p-3 bg-rose-500 rounded-full text-white shadow-xl animate-bounce">
                <Gift className="w-5 h-5" />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
