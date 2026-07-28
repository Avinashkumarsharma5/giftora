import React from "react";
import { useApp } from "../context/AppContext";
import { 
  User as UserIcon, 
  Package, 
  MapPin, 
  Calendar, 
  CreditCard, 
  AlertCircle, 
  Trash2, 
  XSquare,
  Gift
} from "lucide-react";

export const ProfileView: React.FC = () => {
  const { 
    currentUser, 
    userProfile, 
    orders, 
    ordersLoading, 
    cancelOrder, 
    setCurrentView,
    showToast
  } = useApp();

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4 font-sans">
        <UserIcon className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold">Please Login to Access Profile</h2>
        <p className="text-xs text-zinc-500">Sign in to check order dispatch status, claim discount coupons, and see premium gifts.</p>
        <button 
          onClick={() => setCurrentView("login")} 
          className="px-5 py-2.5 bg-rose-500 text-white font-bold rounded-xl shadow-md text-xs"
        >
          Login / Sign In
        </button>
      </div>
    );
  }

  // Simulated static rewards
  const rewardsPoints = orders.length * 100 + 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-8 animate-fade-in">
      
      {/* 1. Header Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* User Card brief */}
        <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-3xl shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <img 
                src={userProfile?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} 
                alt="avatar" 
                className="w-16 h-16 rounded-full object-cover border-2 border-rose-500/10" 
              />
              <div>
                <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white truncate">{userProfile?.displayName}</h2>
                <p className="text-xs text-zinc-400 truncate">{currentUser.email}</p>
                <span className="inline-block bg-rose-500/10 text-rose-600 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md mt-1">
                  {userProfile?.role || "Customer"}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-zinc-500 dark:text-zinc-400 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-500" />
                <span>Joined Giftora: <strong>July 2026</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>Default Address: <strong>Set at checkout</strong></span>
              </div>
            </div>
          </div>

          {/* Reward Points Badge */}
          <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white p-4 rounded-2xl space-y-1 relative overflow-hidden mt-4 shadow-md shadow-rose-500/10">
            <Gift className="absolute right-2.5 bottom-2.5 w-12 h-12 text-white/10" />
            <h4 className="text-xxs uppercase tracking-widest font-extrabold text-rose-100">Gifting Rewards Points</h4>
            <div className="text-2xl font-black font-mono">{rewardsPoints} pts</div>
            <p className="text-[10px] text-rose-50">Redeemable for free premium wraps on future orders!</p>
          </div>

        </div>

        {/* 2. Real-Time Orders List (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-3xl shadow-sm space-y-6">
          <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2.5">
            <Package className="w-5.5 h-5.5 text-rose-500" />
            My Order History ({orders.length})
          </h2>

          {ordersLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse bg-zinc-100 dark:bg-zinc-800/40 h-20 rounded-xl" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Package className="w-12 h-12 text-zinc-200 dark:text-zinc-700 mx-auto" />
              <h3 className="font-bold text-zinc-800 dark:text-zinc-200">No Orders Placed</h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                You haven't purchased any luxurious gift hampers yet. Treat someone special today!
              </p>
              <button 
                onClick={() => setCurrentView("shop")} 
                className="px-5 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Start Gifting
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div 
                  key={order.id}
                  className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl overflow-hidden p-4 space-y-3.5 relative"
                >
                  
                  {/* Row Top Status info */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    <div className="space-y-0.5">
                      <span className="text-xxs text-zinc-400 font-bold uppercase tracking-wider">Tracking Code</span>
                      <div className="text-xs font-bold font-mono text-rose-600">{order.trackingNumber}</div>
                    </div>

                    <div className="space-y-0.5 sm:text-right">
                      <span className="text-xxs text-zinc-400 font-bold uppercase tracking-wider">Placed Date</span>
                      <div className="text-xs text-zinc-700 dark:text-zinc-300 font-mono">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Status badge */}
                    <div className="shrink-0">
                      <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        order.status === "completed" 
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : order.status === "shipped"
                          ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                          : order.status === "cancelled"
                          ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="border-t border-zinc-200/50 dark:border-zinc-800/50 pt-3 flex flex-wrap gap-2.5">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 p-1.5 pr-3 rounded-xl shrink-0 max-w-[180px]">
                        <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded-lg shrink-0" />
                        <div className="overflow-hidden">
                          <h4 className="text-[10px] font-bold text-zinc-900 dark:text-zinc-200 truncate leading-tight">{item.name}</h4>
                          <span className="text-[9px] text-zinc-400 font-semibold">Qty: {item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Row Bottom calculations & Cancel Button */}
                  <div className="border-t border-zinc-200/50 dark:border-zinc-800/50 pt-3 flex items-center justify-between text-xs font-semibold text-zinc-600">
                    <div className="flex gap-1">
                      <span>Total Paid:</span>
                      <strong className="font-extrabold font-mono text-zinc-950 dark:text-white">${order.total.toFixed(2)}</strong>
                    </div>

                    {/* Cancel action if pending */}
                    {order.status === "pending" && (
                      <button 
                        onClick={() => cancelOrder(order.id)}
                        className="flex items-center gap-1.5 text-xxs font-black text-rose-500 hover:bg-rose-500/15 border border-rose-500/10 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                        title="Cancel Pending Order"
                      >
                        <XSquare className="w-3.5 h-3.5" /> Cancel Order
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
