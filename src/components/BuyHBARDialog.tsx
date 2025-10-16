import { useState } from "react";
import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, Wallet, CheckCircle2, Clock, Loader2 } from "lucide-react";

export default function BuyHBARDialog() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("50");
  const [status, setStatus] = useState<null | { ref: string, state: string }>(null);
  const [loading, setLoading] = useState(false);
  const qc = useQueryClient();

  const startBuy = async () => {
    try {
      setLoading(true);
      const { data } = await api.post("/api/buy", { amount: Number(amount) || 0 });
      setStatus({ ref: data.paymentRef, state: data.status });
      toast.info("Payment pending via CliQ…");
      const poll = setInterval(async () => {
        const res = await api.get(`/api/buy/${data.paymentRef}`);
        setStatus({ ref: res.data.paymentRef, state: res.data.status });
        if (res.data.status === "completed") {
          clearInterval(poll);
          toast.success("Settlement completed");
          setLoading(false);
          setOpen(false);
          qc.invalidateQueries({ queryKey: ["balances"] });
          qc.invalidateQueries({ queryKey: ["trades"] });
        }
      }, 1000);
    } catch (e: any) {
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg shadow-purple-500/30 transition-all duration-300 hover:shadow-purple-500/50 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
          <TrendingUp className="w-4 h-4 mr-2" />
          <span className="relative z-10">Buy HBAR</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-950 border-white/10 text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10">
              <Wallet className="w-5 h-5 text-purple-400" />
            </div>
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Buy HBAR
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-4">
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 uppercase tracking-wider flex items-center gap-2">
              <span>Amount (JOD)</span>
            </label>
            <div className="relative">
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                min={1}
                className="bg-white/5 border-white/10 text-white text-lg h-12 pl-4 pr-16 rounded-xl focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 font-medium">
                JOD
              </span>
            </div>
            <p className="text-xs text-white/50 flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3" />
              Minimum purchase: 1 JOD
            </p>
          </div>

          {/* Status Display */}
          {status && (
            <div className="rounded-xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                {status.state === "completed" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                ) : (
                  <Clock className="w-5 h-5 text-yellow-400 animate-pulse flex-shrink-0" />
                )}
                <div className="flex-1 space-y-1">
                  <p className="text-xs text-white/60 uppercase tracking-wider">Payment Reference</p>
                  <p className="text-sm">
                    <span className="font-mono text-white/90">{status.ref.slice(0, 8)}…</span>
                    {" · "}
                    <span
                      className={`font-semibold ${
                        status.state === "completed" ? "text-green-400" : "text-yellow-400"
                      }`}
                    >
                      {status.state}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Confirm Button */}
          <Button
            disabled={loading}
            onClick={startBuy}
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg shadow-purple-500/30 transition-all duration-300 hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-base font-semibold"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Confirm Purchase
              </span>
            )}
          </Button>

          {/* Info Footer */}
          <div className="pt-3 border-t border-white/10">
            <p className="text-xs text-white/50 text-center">
              Payment will be processed via CliQ instantly
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}