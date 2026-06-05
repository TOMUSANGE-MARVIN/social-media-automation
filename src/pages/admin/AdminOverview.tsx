import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Users, TrendingUp, Link2, CreditCard, ArrowUpRight } from "lucide-react";
import { adminApi, type AdminStats } from "../../services/api";
import { useAdminAuth } from "../../context/AdminAuthContext";

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "#ec4899", facebook: "#2563eb", tiktok: "#0f172a", youtube: "#ef4444",
  linkedin: "#1d4ed8", twitter: "#000000", threads: "#374151", pinterest: "#e60023",
  reddit: "#ea580c", telegram: "#0ea5e9", discord: "#4f46e5", bluesky: "#0285ff",
  whatsapp: "#16a34a", googlebusiness: "#3b82f6",
};

function StatCard({
  label, value, sub, icon: Icon, accent = false, dark = true,
}: { label: string; value: string | number; sub?: string; icon: React.FC<any>; accent?: boolean; dark?: boolean }) {
  const base = dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  return (
    <div className={`rounded-2xl p-6 border ${accent ? "bg-[#AAFF00] border-transparent" : base}`}>
      <div className="flex items-start justify-between mb-4">
        <p className={`text-sm font-medium ${accent ? "text-black/70" : dark ? "text-slate-400" : "text-slate-500"}`}>{label}</p>
        <div className={`size-9 rounded-xl flex items-center justify-center ${accent ? "bg-black/10" : dark ? "bg-slate-800" : "bg-slate-100"}`}>
          <Icon className={`size-4 ${accent ? "text-black" : dark ? "text-slate-400" : "text-slate-500"}`} />
        </div>
      </div>
      <p className={`text-3xl font-black ${accent ? "text-black" : dark ? "text-white" : "text-slate-900"}`}>{value}</p>
      {sub && <p className={`text-xs mt-1 ${accent ? "text-black/60" : "text-slate-500"}`}>{sub}</p>}
    </div>
  );
}

function Skeleton({ className = "", dark = true }: { className?: string; dark?: boolean }) {
  return <div className={`animate-pulse ${dark ? "bg-slate-800" : "bg-slate-200"} rounded-xl ${className}`} />;
}

export default function AdminOverview() {
  const { theme } = useAdminAuth();
  const dark = theme === "dark";
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi.stats()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const platformData = stats
    ? Object.entries(stats.platformCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), count, color: PLATFORM_COLORS[name] || "#64748b" }))
    : [];

  const growthData = stats?.growth.map((g) => ({
    date: g.date.slice(5),
    count: g.count,
  })) ?? [];

  const card  = dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const head  = dark ? "text-white" : "text-slate-900";
  const muted = dark ? "text-slate-400" : "text-slate-500";
  const grid  = dark ? "stroke-[#1e293b]" : "stroke-[#e2e8f0]";
  const tooltipStyle = dark
    ? { background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#fff", fontSize: 12 }
    : { background: "#fff",    border: "1px solid #e2e8f0", borderRadius: 8, color: "#0f172a", fontSize: 12 };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-2xl font-black ${head}`}>Overview</h1>
        <p className={`text-sm mt-1 ${muted}`}>Platform health and key metrics at a glance</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-36" dark={dark} />)
        ) : (
          <>
            <StatCard label="Total Users"        value={stats!.totalUsers}    sub={`+${stats!.newUsers7d} this week`}   icon={Users}      accent dark={dark} />
            <StatCard label="New (30 days)"      value={stats!.newUsers30d}   sub="registered users"                    icon={TrendingUp}       dark={dark} />
            <StatCard label="Connected Accounts" value={stats!.totalAccounts} sub="across all users"                    icon={Link2}            dark={dark} />
            <StatCard label="Paid Users"         value={stats!.paidUsers}     sub={`${stats!.freeUsers} on free tier`}  icon={CreditCard}       dark={dark} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {/* Growth chart */}
        <div className={`lg:col-span-3 border rounded-2xl p-6 ${card}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-base font-bold ${head}`}>User Growth</h2>
              <p className={`text-xs mt-0.5 ${muted}`}>Daily signups — last 30 days</p>
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-48" dark={dark} />
          ) : growthData.length === 0 ? (
            <div className={`h-48 flex items-center justify-center text-sm ${muted}`}>No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={growthData} barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#1e293b" : "#e2e8f0"} vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#AAFF00", opacity: 0.05 }} />
                <Bar dataKey="count" name="Signups" fill="#AAFF00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Platform breakdown */}
        <div className={`lg:col-span-2 border rounded-2xl p-6 ${card}`}>
          <h2 className={`text-base font-bold mb-1 ${head}`}>Platform Breakdown</h2>
          <p className={`text-xs mb-5 ${muted}`}>Connected accounts by platform</p>
          {loading ? (
            <div className="space-y-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-7" dark={dark} />)}</div>
          ) : platformData.length === 0 ? (
            <div className={`h-40 flex items-center justify-center text-sm ${muted}`}>No accounts yet</div>
          ) : (
            <div className="space-y-2.5">
              {platformData.slice(0, 8).map((p) => (
                <div key={p.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>{p.name}</span>
                    <span className={`text-xs ${muted}`}>{p.count}</span>
                  </div>
                  <div className={`h-1.5 rounded-full overflow-hidden ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(p.count / (platformData[0]?.count || 1)) * 100}%`, background: p.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Plan distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`border rounded-2xl p-6 ${card}`}>
          <h2 className={`text-base font-bold mb-1 ${head}`}>Plan Distribution</h2>
          <p className={`text-xs mb-5 ${muted}`}>Users per subscription tier</p>
          {loading ? (
            <div className="space-y-3">{Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-12" dark={dark} />)}</div>
          ) : (
            <div className="space-y-3">
              {Object.entries(stats?.planDistribution || {}).map(([plan, count]) => (
                <div key={plan} className={`flex items-center justify-between p-3 rounded-xl ${dark ? "bg-slate-800" : "bg-slate-50 border border-slate-100"}`}>
                  <div className="flex items-center gap-2.5">
                    <span className={`size-2 rounded-full ${plan === "free" ? "bg-slate-500" : "bg-[#AAFF00]"}`} />
                    <span className={`text-sm font-medium capitalize ${head}`}>{plan}</span>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${head}`}>{count}</p>
                    <p className={`text-[10px] ${muted}`}>{Math.round((count / (stats?.totalUsers || 1)) * 100)}%</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className={`lg:col-span-2 border rounded-2xl p-6 ${card}`}>
          <h2 className={`text-base font-bold mb-1 ${head}`}>Quick Actions</h2>
          <p className={`text-xs mb-5 ${muted}`}>Jump to management tasks</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Manage Users",    sub: `${stats?.totalUsers ?? "—"} total`,          to: "/admin/users", color: "from-violet-500/10 to-violet-500/5 border-violet-500/20 text-violet-400" },
              { label: "View Accounts",   sub: `${stats?.totalAccounts ?? "—"} connected`,   to: "/admin/users", color: "from-sky-500/10 to-sky-500/5 border-sky-500/20 text-sky-400" },
              { label: "Free Users",      sub: `${stats?.freeUsers ?? "—"} users`,           to: "/admin/users", color: "from-slate-500/10 to-slate-500/5 border-slate-500/20 text-slate-400" },
              { label: "Paid Users",      sub: `${stats?.paidUsers ?? "—"} users`,           to: "/admin/users", color: "from-[#AAFF00]/10 to-[#AAFF00]/5 border-[#AAFF00]/20 text-[#AAFF00]" },
            ].map((item) => (
              <Link key={item.label} to={item.to}
                className={`flex items-start justify-between p-4 rounded-xl bg-gradient-to-br border transition-opacity hover:opacity-80 ${item.color}`}>
                <div>
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs opacity-70 mt-0.5">{item.sub}</p>
                </div>
                <ArrowUpRight className="size-4 shrink-0 mt-0.5 opacity-60" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
