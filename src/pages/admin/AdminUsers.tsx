import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, Shield, ExternalLink } from "lucide-react";
import { adminApi, type AdminUser } from "../../services/api";
import { useAdminAuth } from "../../context/AdminAuthContext";

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "#ec4899", facebook: "#2563eb", tiktok: "#0f172a", youtube: "#ef4444",
  linkedin: "#1d4ed8", twitter: "#111827", threads: "#374151", pinterest: "#e60023",
  reddit: "#ea580c", telegram: "#0ea5e9", discord: "#4f46e5", bluesky: "#0285ff",
  whatsapp: "#16a34a", googlebusiness: "#3b82f6",
};

function PlatformDot({ platform }: { platform: string }) {
  return (
    <span
      title={platform}
      className="size-2.5 rounded-full inline-block border border-black/10"
      style={{ background: PLATFORM_COLORS[platform] || "#64748b" }}
    />
  );
}

function PlanBadge({ plan, dark }: { plan: string; dark: boolean }) {
  const styles: Record<string, string> = {
    free:     dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500",
    pro:      "bg-[#AAFF00]/10 text-[#AAFF00] border border-[#AAFF00]/20",
    business: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${styles[plan] || styles.free}`}>
      {plan}
    </span>
  );
}

export default function AdminUsers() {
  const { theme } = useAdminAuth();
  const dark = theme === "dark";
  const [users, setUsers]   = useState<AdminUser[]>([]);
  const [total, setTotal]   = useState(0);
  const [pages, setPages]   = useState(1);
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery]   = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = useCallback(async (p: number, q: string) => {
    setLoading(true);
    try {
      const data = await adminApi.users({ page: p, limit: 20, search: q });
      setUsers(data.users);
      setTotal(data.total);
      setPages(data.pages);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(page, query); }, [page, query, load]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setQuery(search);
  }

  function fmt(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  const card  = dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const head  = dark ? "text-white" : "text-slate-900";
  const muted = dark ? "text-slate-400" : "text-slate-500";
  const inputCls = dark
    ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-[#AAFF00]/50"
    : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#AAFF00]/60";
  const thHead = dark ? "border-slate-800" : "border-slate-200";
  const thText = dark ? "text-slate-500" : "text-slate-400";
  const rowDiv = dark ? "divide-slate-800" : "divide-slate-100";
  const rowHov = dark ? "hover:bg-slate-800/50" : "hover:bg-slate-50";
  const skeletonBg = dark ? "bg-slate-800" : "bg-slate-200";
  const pagBg  = dark ? "bg-slate-800 text-slate-400 hover:bg-slate-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200";
  const clearBg = dark ? "bg-slate-800 text-slate-400 hover:bg-slate-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200";

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-2xl font-black ${head}`}>Users</h1>
          <p className={`text-sm mt-1 ${muted}`}>
            {loading ? "Loading…" : `${total} registered user${total !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-3 max-w-md">
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 ${muted}`} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className={`w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm outline-none transition-colors ${inputCls}`}
          />
        </div>
        <button type="submit"
          className="px-4 py-2.5 bg-[#AAFF00] text-black text-sm font-semibold rounded-xl hover:bg-[#c8ff33] transition-colors">
          Search
        </button>
        {query && (
          <button type="button" onClick={() => { setSearch(""); setQuery(""); setPage(1); }}
            className={`px-4 py-2.5 text-sm rounded-xl transition-colors ${clearBg}`}>
            Clear
          </button>
        )}
      </form>

      {/* Table */}
      <div className={`border rounded-2xl overflow-hidden ${card}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${thHead}`}>
                {["User", "Joined", "Plan", "Accounts", "Platforms", ""].map((h, i) => (
                  <th key={i} className={`${i < 5 ? "text-left" : ""} px-5 py-3.5 text-xs font-semibold uppercase tracking-wider ${thText}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${rowDiv}`}>
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <tr key={i}>
                    {Array(6).fill(0).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className={`h-4 rounded animate-pulse ${skeletonBg}`} style={{ width: j === 0 ? "160px" : "80px" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className={`px-5 py-16 text-center text-sm ${muted}`}>No users found</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}
                    onClick={() => navigate(`/admin/users/${u.id}`)}
                    className={`cursor-pointer transition-colors ${rowHov}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`size-8 rounded-full flex items-center justify-center font-semibold text-xs shrink-0
                          ${dark ? "bg-slate-700 text-white" : "bg-slate-200 text-slate-700"}`}>
                          {u.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className={`text-sm font-medium truncate ${head}`}>{u.name}</p>
                            {!!u.is_admin && <Shield className="size-3 text-[#AAFF00] shrink-0" />}
                          </div>
                          <p className={`text-xs truncate ${muted}`}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-5 py-4 text-xs whitespace-nowrap ${muted}`}>{fmt(u.created_at)}</td>
                    <td className="px-5 py-4"><PlanBadge plan={u.plan} dark={dark} /></td>
                    <td className="px-5 py-4">
                      <span className={`text-sm font-semibold ${head}`}>{u.accountCount}</span>
                      <span className={`text-xs ml-1 ${muted}`}>/ {2 + u.paid_account_slots}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 flex-wrap">
                        {u.platforms.length === 0
                          ? <span className={`text-xs ${muted}`}>None</span>
                          : u.platforms.map((p) => <PlatformDot key={p} platform={p} />)
                        }
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <ExternalLink className={`size-3.5 inline ${muted}`} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className={`flex items-center justify-between px-5 py-4 border-t ${thHead}`}>
            <p className={`text-xs ${muted}`}>Page {page} of {pages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className={`size-8 flex items-center justify-center rounded-lg disabled:opacity-40 transition-colors ${pagBg}`}>
                <ChevronLeft className="size-4" />
              </button>
              <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}
                className={`size-8 flex items-center justify-center rounded-lg disabled:opacity-40 transition-colors ${pagBg}`}>
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
