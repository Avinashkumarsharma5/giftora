import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Sparkles, ArrowRight, HelpCircle, DollarSign, CheckCircle, Heart, Search, RotateCcw, Info } from "lucide-react";
export const AIGiftAdvisor = () => {
    const { setCurrentView, showToast } = useApp();
    // Wizard States
    const [recipient, setRecipient] = useState("Partner");
    const [occasion, setOccasion] = useState("Birthday");
    const [interests, setInterests] = useState(["Wellness", "Coffee & Tea"]);
    const [budget, setBudget] = useState("$30 - $60");
    // Loading and recommendations result
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("Analyzing recipient details...");
    const [recommendations, setRecommendations] = useState([]);
    const toggleInterest = (interest) => {
        if (interests.includes(interest)) {
            setInterests(interests.filter((i) => i !== interest));
        }
        else {
            setInterests([...interests, interest]);
        }
    };
    const handleGenerate = async () => {
        if (interests.length === 0) {
            showToast("Please select at least one interest to customize recommendations.", "info");
            return;
        }
        setLoading(true);
        setRecommendations([]);
        // Custom step-by-step loading captions
        const messages = [
            "Consulting the elite Giftora catalogs...",
            "Scenting custom organic waxes & premium wraps...",
            "Sifting custom full-grain leather textures...",
            "Gemini generating luxury personalized caskets..."
        ];
        let step = 0;
        const interval = setInterval(() => {
            if (step < messages.length) {
                setLoadingText(messages[step]);
                step++;
            }
        }, 1800);
        try {
            await new Promise((resolve) => setTimeout(resolve, 850));
            const curated = interests.slice(0, 4).map((interest, index) => ({
                giftName: `${occasion} ${interest} Gift Edit`,
                reason: `A thoughtful ${interest.toLowerCase()} pick curated for your ${recipient.toLowerCase()}, with a personal ${occasion.toLowerCase()} feel.`,
                priceEstimate: budget,
                suggestedCategory: interest
            }));
            setRecommendations(curated.length ? curated : [{ giftName: "Signature Gift Box", reason: "A considered local recommendation for a special occasion.", priceEstimate: budget, suggestedCategory: "Curated" }]);
            showToast("Generated local gift recommendations!", "success");
        }
        finally {
            clearInterval(interval);
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-10", children: [_jsxs("div", { className: "text-center space-y-3", children: [_jsxs("div", { className: "inline-flex items-center gap-2 bg-rose-500/10 text-rose-600 dark:text-rose-400 px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase", children: [_jsx(Sparkles, { className: "w-4 h-4 text-rose-500" }), "AI Gift Matcher Wizard"] }), _jsx("h1", { className: "text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight leading-none", children: "Find the Ultimate Personalized Gift" }), _jsx("p", { className: "text-sm text-zinc-500 max-w-lg mx-auto", children: "Skip hours of browsing. Sift through custom luxury templates matching specific lifestyle hobbies and budgets using Gemini AI." })] }), recommendations.length === 0 && !loading ? (
            /* WIZARD CARD */
            _jsxs("div", { className: "bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-xl space-y-8 animate-fade-in", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-8", children: [_jsxs("div", { className: "space-y-3", children: [_jsxs("label", { className: "text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5", children: [_jsx(HelpCircle, { className: "w-4 h-4 text-rose-500" }), " Who is the recipient?"] }), _jsx("div", { className: "flex flex-wrap gap-2", children: ["Partner", "Best Friend", "Parent", "Colleague", "Sibling", "Kids"].map((r) => (_jsx("button", { type: "button", onClick: () => setRecipient(r), className: `px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${recipient === r ? "border-rose-500 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-black shadow-sm" : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/30"}`, children: r }, r))) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("label", { className: "text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5", children: [_jsx(Sparkles, { className: "w-4 h-4 text-rose-500" }), " What is the special occasion?"] }), _jsx("div", { className: "flex flex-wrap gap-2", children: ["Birthday", "Anniversary", "Holiday / Christmas", "Housewarming", "Just Because", "Valentine's"].map((o) => (_jsx("button", { type: "button", onClick: () => setOccasion(o), className: `px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${occasion === o ? "border-rose-500 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-black shadow-sm" : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/30"}`, children: o }, o))) })] }), _jsxs("div", { className: "space-y-3 sm:col-span-2 border-t border-zinc-100 dark:border-zinc-800 pt-6", children: [_jsxs("label", { className: "text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5", children: [_jsx(Sparkles, { className: "w-4 h-4 text-rose-500" }), " What are their interests & hobbies?"] }), _jsx("div", { className: "flex flex-wrap gap-2", children: ["Wellness", "Coffee & Tea", "Technology", "Cooking", "Reading", "Fashion", "Chocolates & Sweets", "Gourmet Wine", "Home Decor"].map((interest) => {
                                            const isSelected = interests.includes(interest);
                                            return (_jsx("button", { type: "button", onClick: () => toggleInterest(interest), className: `px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${isSelected ? "border-rose-500 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-black shadow-sm" : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/30"}`, children: interest }, interest));
                                        }) })] }), _jsxs("div", { className: "space-y-3 sm:col-span-2 border-t border-zinc-100 dark:border-zinc-800 pt-6", children: [_jsxs("label", { className: "text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5", children: [_jsx(DollarSign, { className: "w-4 h-4 text-rose-500" }), " Choose target budget tier"] }), _jsx("div", { className: "flex flex-wrap gap-2", children: ["Under $30", "$30 - $60", "Above $60"].map((b) => (_jsx("button", { type: "button", onClick: () => setBudget(b), className: `px-5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${budget === b ? "border-rose-500 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-black shadow-sm" : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/30"}`, children: b }, b))) })] })] }), _jsxs("button", { type: "button", onClick: handleGenerate, className: "w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 group", children: ["Sift Curation Recommendations", _jsx(ArrowRight, { className: "w-4.5 h-4.5 group-hover:translate-x-1.5 transition-transform" })] })] })) : loading ? (
            /* LOADING STATE */
            _jsxs("div", { className: "bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-12 rounded-3xl shadow-xl text-center space-y-6", children: [_jsxs("div", { className: "relative inline-block", children: [_jsx("div", { className: "absolute inset-0 bg-rose-500 rounded-full blur-xl opacity-30 animate-pulse" }), _jsx("div", { className: "w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin relative mx-auto" })] }), _jsx("h3", { className: "text-lg font-bold text-zinc-900 dark:text-white", children: "Formulating recommendations..." }), _jsx("p", { className: "text-xs text-rose-500 font-bold tracking-wider uppercase animate-pulse", children: loadingText })] })) : (
            /* RESULTS VIEW */
            _jsxs("div", { className: "space-y-8 animate-fade-in", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("h2", { className: "text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-emerald-500" }), "AI Recommendations Selected"] }), _jsxs("button", { onClick: () => setRecommendations([]), className: "px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors", children: [_jsx(RotateCcw, { className: "w-4 h-4" }), " Start Over"] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: recommendations.map((item, index) => (_jsxs("div", { className: "bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between", children: [_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between items-baseline gap-2.5", children: [_jsx("h3", { className: "text-base font-extrabold text-zinc-950 dark:text-white", children: item.giftName }), _jsx("span", { className: "text-xs font-bold text-rose-500 font-mono shrink-0 bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded", children: item.priceEstimate })] }), _jsx("span", { className: "inline-block text-[10px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-2 py-0.5 rounded", children: item.suggestedCategory }), _jsxs("p", { className: "text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed italic", children: ["\"", item.reason, "\""] })] }), _jsxs("div", { className: "border-t border-zinc-100 dark:border-zinc-800/80 pt-4 flex gap-2", children: [_jsxs("button", { onClick: () => { setCurrentView("shop"); }, className: "flex-1 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 cursor-pointer", children: [_jsx(Search, { className: "w-3.5 h-3.5" }), "Search Catalog"] }), _jsx("button", { onClick: () => {
                                                showToast(`Adding request for "${item.giftName}" to customer profile list.`, "success");
                                            }, className: "py-2 px-3 border border-zinc-200 dark:border-zinc-700 text-zinc-500 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800", title: "Add to wish tracker", children: _jsx(Heart, { className: "w-4.5 h-4.5" }) })] })] }, index))) }), _jsxs("div", { className: "flex gap-2 p-4 bg-amber-500/10 rounded-2xl text-xs text-amber-700 dark:text-amber-400", children: [_jsx(Info, { className: "w-5 h-5 shrink-0" }), _jsxs("span", { children: ["If any recommendation captures your attention, click ", _jsx("strong", { children: "Search Catalog" }), " to filter our ready-to-ship premium options matching those specific categories!"] })] })] }))] }));
};
