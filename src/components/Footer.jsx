import React from "react";
import { Gift, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { useApp } from "../context/AppContext";

export const Footer = () => {
  const { setCurrentView } = useApp();
  const go = view => setCurrentView(view);
  return <footer className="site-footer mt-16 bg-[#2d1215] text-rose-100">
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2"><button onClick={() => go("home")} className="brand brand--footer"><span className="brand__mark"><Gift className="h-4 w-4"/></span><span>Giftora</span></button><p className="mt-4 max-w-sm text-sm leading-6 text-rose-100/70">Thoughtful gifts, made personal. We help turn every occasion into a memory worth keeping.</p><div className="mt-5 space-y-2 text-sm text-rose-100/75"><p className="flex items-center gap-2"><Phone className="h-4 w-4 text-rose-300"/> +91 98765 43210</p><p className="flex items-center gap-2"><Mail className="h-4 w-4 text-rose-300"/> hello@giftora.in</p><p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-rose-300"/> Made with love in India</p></div></div>
        <FooterLinks title="Explore" items={[["Shop gifts", "shop"], ["Gift finder", "ai-advisor"], ["Best sellers", "shop"], ["My wishlist", "wishlist"]]} go={go}/>
        <FooterLinks title="Help" items={[["My account", "profile"], ["Track your order", "profile"], ["Contact us", "contact"], ["About Giftora", "about"]]} go={go}/>
        <div><h3>Follow along</h3><p className="mt-3 text-sm leading-6 text-rose-100/70">Fresh gifting ideas and seasonal edits, every week.</p><div className="mt-4 flex gap-2"><a href="#" aria-label="Instagram" className="footer-social"><Instagram className="h-4 w-4"/></a><a href="#" aria-label="Email" className="footer-social"><Mail className="h-4 w-4"/></a></div></div>
      </div>
    </div>
    <div className="border-t border-white/10"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-xs text-rose-100/55 sm:flex-row sm:items-center sm:justify-between sm:px-8"><span>© 2026 Giftora. All rights reserved.</span><div className="flex gap-5"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Shipping & returns</a></div></div></div>
  </footer>;
};

function FooterLinks({ title, items, go }) { return <div><h3>{title}</h3><ul className="mt-4 space-y-2.5">{items.map(([label, view]) => <li key={label}><button onClick={() => go(view)}>{label}</button></li>)}</ul></div>; }
