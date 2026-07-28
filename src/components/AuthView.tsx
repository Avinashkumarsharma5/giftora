import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Mail, Lock, User as UserIcon, LogIn, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export const AuthView: React.FC = () => {
  const { login, register, loginWithGoogle, setCurrentView, showToast } = useApp();

  // Mode: login or register
  const [mode, setMode] = useState<"login" | "register">("login");

  // Inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  // Loading state
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please fill in email and password fields.", "error");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
        showToast("Signed in successfully!", "success");
        setCurrentView("home");
      } else {
        if (!fullName) {
          showToast("Please enter your name.", "error");
          setLoading(false);
          return;
        }
        await register(email, password, fullName, photoURL);
        showToast("Registered your new Giftora account successfully!", "success");
        setCurrentView("home");
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Authentication failed. Please verify credentials.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      showToast("Signed in with Google successfully!", "success");
      setCurrentView("home");
    } catch (err: any) {
      console.error(err);
      showToast("Google sign in canceled or failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 font-sans">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 rounded-3xl shadow-xl space-y-6">
        
        {/* Top greeting */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-rose-500/10 text-rose-500 rounded-2xl mx-auto mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
            {mode === "login" ? "Welcome Back to Giftora" : "Join the Joyful Family"}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {mode === "login" 
              ? "Discover custom gift box templates, check order statuses and sync lists" 
              : "Register to earn 100 Reward points and access AI custom recommendations"
            }
          </p>
        </div>

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <div className="space-y-1.5">
                <label className="text-xxs uppercase tracking-wider text-zinc-400 font-bold">Full Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    placeholder="Eleanor Vance" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 text-zinc-950 dark:text-white pl-10 pr-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xxs uppercase tracking-wider text-zinc-400 font-bold">Avatar Image URL (Optional)</label>
                <input 
                  type="url" 
                  placeholder="https://example.com/avatar.jpg" 
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 text-zinc-950 dark:text-white px-3 py-2.5 rounded-xl text-xs focus:outline-none"
                />
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="text-xxs uppercase tracking-wider text-zinc-400 font-bold">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                required
                placeholder="eleanor@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 text-zinc-950 dark:text-white pl-10 pr-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <label className="text-xxs uppercase tracking-wider text-zinc-400 font-bold">Password</label>
              {mode === "login" && (
                <button 
                  type="button"
                  onClick={() => showToast("Simulated link sent. Please verify password reset inbox.", "info")}
                  className="text-xxs font-semibold text-rose-500 hover:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <input 
                type="password" 
                required
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 text-zinc-950 dark:text-white pl-10 pr-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
              <Lock className="absolute left-3.5 top-3.5 w-3.5 h-3.5 text-zinc-400" />
            </div>
          </div>

          {/* Submit button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/25 transition-all cursor-pointer flex items-center justify-center gap-1.5 group"
          >
            {loading ? (
              <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4.5 h-4.5" />
                {mode === "login" ? "Sign In to Account" : "Register New Account"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-2">
          <div className="absolute left-0 right-0 h-[1px] bg-zinc-100 dark:bg-zinc-800" />
          <span className="relative z-10 bg-white dark:bg-zinc-900 px-3 text-xxs font-bold text-zinc-400 uppercase tracking-widest">or</span>
        </div>

        {/* Google signin button */}
        <button 
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-2xl font-semibold text-xs text-zinc-700 dark:text-zinc-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          {/* Flat stylized Google G logo */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.7 12.3c0-.8-.1-1.7-.2-2.5H12v4.8h6.6c-.3 1.5-1.1 2.8-2.4 3.7v3.1h3.9c2.3-2.1 3.6-5.2 3.6-9.1z"/>
            <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3.1c-1.1.7-2.5 1.2-4.1 1.2-3.2 0-5.8-2.1-6.8-5H1.2v3.2C3.2 21.4 7.3 24 12 24z"/>
            <path fill="#FBBC05" d="M5.2 14.2c-.2-.7-.4-1.5-.4-2.2s.2-1.5.4-2.2V6.6H1.2C.4 8.2 0 10 0 12s.4 3.8 1.2 5.4l4-3.2z"/>
            <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.1 0 12 0 7.3 0 3.2 2.6 1.2 6.6l4 3.2c1-2.9 3.6-5 6.8-5z"/>
          </svg>
          Sign In with Google Account
        </button>

        {/* Toggle Mode Footer */}
        <div className="text-center pt-2">
          {mode === "login" ? (
            <p className="text-xs text-zinc-500">
              New to Giftora?{" "}
              <button 
                onClick={() => setMode("register")}
                className="font-bold text-rose-500 hover:underline cursor-pointer"
              >
                Create an account
              </button>
            </p>
          ) : (
            <p className="text-xs text-zinc-500">
              Already have an account?{" "}
              <button 
                onClick={() => setMode("login")}
                className="font-bold text-rose-500 hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
