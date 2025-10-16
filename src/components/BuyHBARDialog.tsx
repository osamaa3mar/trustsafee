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
        <Button className="relative overflow-hidden bg-gradient-to-r from-[#b8923a] to-[#ddb146] hover:from-[#a6822f] hover:to-[#b8923a] text-white border-0 shadow-lg shadow-[#ddb146]/20 transition-all duration-300 hover:shadow-[#ddb146]/40 hover:scale-[1.02] w-full sm:w-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
          <TrendingUp className="w-4 h-4 mr-2" />
          <span className="relative z-10">Buy HBAR</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-950 border-white/10 text-white shadow-2xl max-w-[95vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl">
            <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-[#ddb146]/20 to-[#f4c563]/20 border border-white/10">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-[#ddb146]" />
            </div>
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Buy HBAR
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-5 pt-3 sm:pt-4">
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium text-white/80 uppercase tracking-wider flex items-center gap-2">
              <span>Amount (JOD)</span>
            </label>
            <div className="relative">
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                min={1}
                className="bg-white/5 border-white/10 text-white text-base sm:text-lg h-11 sm:h-12 pl-3 sm:pl-4 pr-14 sm:pr-16 rounded-xl focus:border-[#ddb146]/50 focus:ring-2 focus:ring-[#ddb146]/20 transition-all"
                placeholder="50"
              />
              <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/50 font-medium text-sm">
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
            <div className="rounded-xl bg-white/5 border border-white/10 p-3 sm:p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                {status.state === "completed" ? (
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 animate-pulse flex-shrink-0" />
                )}
                <div className="flex-1 space-y-1">
                  <p className="text-xs text-white/60 uppercase tracking-wider">Payment Reference</p>
                  <p className="text-xs sm:text-sm">
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
            className="w-full h-11 sm:h-12 bg-gradient-to-r from-[#b8923a] to-[#ddb146] hover:from-[#a6822f] hover:to-[#b8923a] text-white border-0 shadow-lg shadow-[#ddb146]/20 transition-all duration-300 hover:shadow-[#ddb146]/40 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-semibold"
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
          <div className="pt-2 sm:pt-3 border-t border-white/10">
            <p className="text-xs text-white/50 text-center">
              Payment will be processed via CliQ instantly
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}