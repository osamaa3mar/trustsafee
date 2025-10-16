import { useBalances } from "@/hooks/useBalances";
import { api } from "@/lib/api";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import BuyHBARDialog from "@/components/BuyHBARDialog";
import LockedFunds from "@/components/LockedFunds";
import WithdrawDialog from "@/components/WithdrawDialog";
import { Wallet, Lock, TrendingUp, CheckCircle2, Clock } from "lucide-react";

export default function Dashboard() {
  const { data: balances, isLoading } = useBalances();
  const [buying, setBuying] = useState(false);
  const [status, setStatus] = useState<null | { ref: string; state: string }>(null);
  const qc = useQueryClient();

  const createBuy = async () => {
    setBuying(true);
    const { data } = await api.post("/api/buy", { amount: 50 });
    setStatus({ ref: data.paymentRef, state: data.status });
    const poll = setInterval(async () => {
      const res = await api.get(`/api/buy/${data.paymentRef}`);
      setStatus({ ref: res.data.paymentRef, state: res.data.status });
      if (res.data.status === "completed") {
        clearInterval(poll);
        setBuying(false);
        qc.invalidateQueries({ queryKey: ["balances"] });
        qc.invalidateQueries({ queryKey: ["trades"] });
      }
    }, 1000);
  };

  const getCurrencyGradient = (currency: string) => {
    const gradients = {
      HBAR: "from-purple-500/10 to-blue-500/10",
      USD: "from-green-500/10 to-emerald-500/10",
      default: "from-slate-500/10 to-gray-500/10"
    };
    return gradients[currency as keyof typeof gradients] || gradients.default;
  };

  const getCurrencyIcon = (currency: string) => {
    return currency === "HBAR" ? <TrendingUp className="w-5 h-5" /> : <Wallet className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Dashboard
          </h1>
        </div>

        {/* Balance Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(isLoading ? [1, 2, 3] : balances)?.map((b: any, i: number) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${
                isLoading ? "from-slate-800/50 to-slate-900/50" : getCurrencyGradient(b.currency)
              } backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/20`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
              <div className="relative p-6 space-y-4">
                {/* Currency Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                      {isLoading ? (
                        <div className="w-5 h-5 bg-white/20 rounded animate-pulse"></div>
                      ) : (
                        getCurrencyIcon(b.currency)
                      )}
                    </div>
                    <span className="text-sm font-medium text-white/80">
                      {isLoading ? (
                        <div className="w-16 h-4 bg-white/20 rounded animate-pulse"></div>
                      ) : (
                        b.currency
                      )}
                    </span>
                  </div>
                </div>

                {/* Available Balance */}
                <div className="space-y-1">
                  <div className="text-xs font-medium text-white/60 uppercase tracking-wider">
                    Available
                  </div>
                  <div className="text-4xl font-bold text-white">
                    {isLoading ? (
                      <div className="w-32 h-10 bg-white/20 rounded animate-pulse"></div>
                    ) : (
                      b.available.toLocaleString()
                    )}
                  </div>
                </div>

                {/* Locked Balance */}
                <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                  <Lock className="w-3.5 h-3.5 text-white/50" />
                  <span className="text-xs text-white/60">Locked:</span>
                  <span className="text-sm font-semibold text-white/80">
                    {isLoading ? (
                      <div className="w-16 h-4 bg-white/20 rounded animate-pulse"></div>
                    ) : (
                      b.locked.toLocaleString()
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Locked Funds Section */}
        <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="p-6">
            <LockedFunds />
          </div>
        </section>

        {/* Buy HBAR Section */}
        <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <BuyHBARDialog />

              {status && (
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  {status.state === "completed" ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-400 animate-pulse" />
                  )}
                  <span className="text-sm text-white/80">
                    Payment{" "}
                    <span className="font-mono text-white/90">
                      {status.ref.slice(0, 8)}…
                    </span>{" "}
                    is{" "}
                    <span
                      className={`font-semibold ${
                        status.state === "completed"
                          ? "text-green-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {status.state}
                    </span>{" "}
                    <span className="text-white/60">via CliQ</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}