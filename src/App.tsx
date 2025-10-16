import { Toaster, toast } from "sonner";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import TradeHistory from "./pages/trade-history";
import Settings from "./pages/settings";
import Login from "./pages/login";
import NotFound from "./pages/not-found";
import { Home, History, Settings2, Bell, Shield } from "lucide-react";

export default function App() {
  const location = useLocation();
  const isLoggedIn = true; // TODO replace with real auth

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-lg shadow-black/20">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2 group transition-all duration-300"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg shadow-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                TrustSafe
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive("/")
                    ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/history"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive("/history")
                    ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <History className="w-4 h-4" />
                <span>History</span>
              </Link>

              <Link
                to="/settings"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive("/settings")
                    ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Settings2 className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </div>

            {/* Right Section */}
            <div className="ml-auto flex items-center gap-3">
              {/* Notification Button */}
              <button
                onClick={() => toast.success("Settlement completed")}
                className="relative flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/80 hover:text-white text-sm font-medium transition-all duration-200 group"
              >
                <div className="relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                </div>
                <span className="hidden sm:inline">Notify</span>
              </button>

              {/* User Avatar/Menu */}
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-sm font-semibold shadow-lg cursor-pointer hover:scale-105 transition-transform">
                <span>U</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl">
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? <Dashboard /> : <Navigate to="/login" state={{ from: location }} />
            }
          />
          <Route path="/history" element={<TradeHistory />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>© 2025 TrustSafe. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
              <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
              <a href="#" className="hover:text-white/60 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        richColors 
        theme="dark"
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
          },
        }}
      />
    </div>
  );
}