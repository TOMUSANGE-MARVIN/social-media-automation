import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Shield, FileText, CheckCircle2, Clock, AlertTriangle, Edit2, Check, X, HardDrive } from "lucide-react";
import { adminApi, type AdminUserDetail } from "../../services/api";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { SiInstagram, SiFacebook, SiTiktok, SiYoutube, SiWhatsapp, SiX, SiPinterest, SiThreads, SiReddit, SiTelegram, SiDiscord, SiBluesky, SiGoogle } from "@icons-pack/react-simple-icons";
import LinkedinIcon from "../../components/icons/LinkedinIcon";

const PLATFORM_META: Record<string, { Icon: any; bg: string; label: string }> = {
  instagram:      { Icon: SiInstagram, bg: "bg-gradient-to-br from-pink-500 to-purple-600", label: "Instagram" },
  facebook:       { Icon: SiFacebook,  bg: "bg-blue-600",    label: "Facebook" },
  tiktok:         { Icon: SiTiktok,    bg: "bg-slate-900",   label: "TikTok" },
  youtube:        { Icon: SiYoutube,   bg: "bg-red-600",     label: "YouTube" },
  linkedin:       { Icon: LinkedinIcon, bg: "bg-blue-700",   label: "LinkedIn" },
  twitter:        { Icon: SiX,         bg: "bg-black",       label: "X (Twitter)" },
  threads:        { Icon: SiThreads,   bg: "bg-gray-900",    label: "Threads" },
  pinterest:      { Icon: SiPinterest, bg: "bg-red-600",     label: "Pinterest" },
  reddit:         { Icon: SiReddit,    bg: "bg-orange-600",  label: "Reddit" },
  telegram:       { Icon: SiTelegram,  bg: "bg-sky-500",     label: "Telegram" },
  discord:        { Icon: SiDiscord,   bg: "bg-indigo-600",  label: "Discord" },
  bluesky:        { Icon: SiBluesky,   bg: "bg-sky-500",     label: "Bluesky" },
  whatsapp:       { Icon: SiWhatsapp,  bg: "bg-green-600",   label: "WhatsApp" },
  googlebusiness: { Icon: SiGoogle,    bg: "bg-blue-500",    label: "Google Business" },
};

const STATUS_STYLES: Record<string, { label: string; Icon: any; color: string }> = {
  published: { label: "Published", Icon: CheckCircle2,  color: "text-green-400" },
  scheduled: { label: "Scheduled", Icon: Clock,         color: "text-blue-400" },
  failed:    { label: "Failed",    Icon: AlertTriangle, color: "text-red-400" },
  draft:     { label: "Draft",     Icon: FileText,      color: "text-slate-500" },
};

const PLANS = ["free", "pro", "business"];

export default function AdminUserDetailPage() {
  const { theme } = useAdminAuth();
  const dark = theme === "dark";
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData]         = useState<AdminUserDetail | null>(null);
  const [loading, setLoading]   = useState(true);
  const [editPlan, setEditPlan] = useState(false);
  const [plan, setPlan]         = useState("free");
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    if (!id) return;
    adminApi.userDetail(id)
      .then((d) => { setData(d); setPlan(d.user.plan); })
      .catch(() => navigate("/admin/users"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  async function savePlan() {
    if (!id) return;
    setSaving(true);
    await adminApi.updateUser(id, { plan });
    setData((d) => d ? { ...d, user: { ...d.user, plan } } : d);
    setSaving(false);
    setEditPlan(false);
  }

  async function toggleAdmin() {
    if (!id || !data) return;
    const newVal = data.user.is_admin ? 0 : 1;
    await adminApi.updateUser(id, { is_admin: newVal });
    setData((d) => d ? { ...d, user: { ...d.user, is_admin: newVal } } : d);
  }

  function fmt(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }

  function fmtShort(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  const card   = dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const head   = dark ? "text-white" : "text-slate-900";
  const muted  = dark ? "text-slate-400" : "text-slate-500";
  const dimmed = dark ? "text-slate-600" : "text-slate-400";
  const inner  = dark ? "bg-slate-800" : "bg-slate-50 border border-slate-100";
  const selCls = dark
    ? "bg-slate-800 border-slate-700 text-white focus:border-[#AAFF00]/50"
    : "bg-white border-slate-200 text-slate-900 focus:border-[#AAFF00]/60";
  const btnSec = dark
    ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
    : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900";

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className={`h-6 w-32 rounded ${dark ? "bg-slate-800" : "bg-slate-200"}`} />
          <div className={`h-32 rounded-2xl ${dark ? "bg-slate-800" : "bg-slate-200"}`} />
          <div className="grid grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => <div key={i} className={`h-24 rounded-2xl ${dark ? "bg-slate-800" : "bg-slate-200"}`} />)}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;
  const { user, accounts, postStats, recentPosts } = data;

  return (
    <div className="p-8">
      {/* Back */}
      <button onClick={() => navigate("/admin/users")}
        className={`flex items-center gap-2 text-sm mb-6 transition-colors ${muted} hover:${head}`}>
        <ChevronLeft className="size-4" /> Back to users
      </button>

      {/* User header */}
      <div className={`border rounded-2xl p-6 mb-6 ${card}`}>
        <div className="flex items-start gap-5">
          <div className="size-16 rounded-2xl bg-[#AAFF00] flex items-center justify-center text-black font-black text-2xl shrink-0">
            {user.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className={`text-xl font-black ${head}`}>{user.name}</h1>
              {!!user.is_admin && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-[#AAFF00] bg-[#AAFF00]/10 border border-[#AAFF00]/20 px-2 py-0.5 rounded-full">
                  <Shield className="size-2.5" /> ADMIN
                </span>
              )}
            </div>
            <p className={`text-sm mt-0.5 ${muted}`}>{user.email}</p>
            <p className={`text-xs mt-1 ${dimmed}`}>Joined {fmt(user.created_at)}</p>
            <p className={`text-xs mt-0.5 font-mono ${dimmed}`}>Zernio: {user.zernio_profile_id || "—"}</p>
          </div>
          <div className="flex flex-col items-end gap-3 shrink-0">
            {/* Plan editor */}
            <div className="flex items-center gap-2">
              {editPlan ? (
                <>
                  <select value={plan} onChange={(e) => setPlan(e.target.value)}
                    className={`text-xs border rounded-lg px-2 py-1.5 outline-none ${selCls}`}>
                    {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <button onClick={savePlan} disabled={saving}
                    className="size-7 flex items-center justify-center bg-[#AAFF00] text-black rounded-lg hover:bg-[#c8ff33] disabled:opacity-50">
                    <Check className="size-3.5" />
                  </button>
                  <button onClick={() => { setEditPlan(false); setPlan(user.plan); }}
                    className={`size-7 flex items-center justify-center rounded-lg ${btnSec}`}>
                    <X className="size-3.5" />
                  </button>
                </>
              ) : (
                <>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize
                    ${user.plan === "free"
                      ? dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
                      : "bg-[#AAFF00]/10 text-[#AAFF00] border border-[#AAFF00]/20"
                    }`}>
                    {user.plan}
                  </span>
                  <button onClick={() => setEditPlan(true)}
                    className={`size-7 flex items-center justify-center rounded-lg transition-colors ${btnSec}`}>
                    <Edit2 className="size-3" />
                  </button>
                </>
              )}
            </div>
            {/* Toggle admin */}
            <button onClick={toggleAdmin}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                user.is_admin
                  ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                  : dark
                    ? "border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
                    : "border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}>
              {user.is_admin ? "Revoke Admin" : "Make Admin"}
            </button>
          </div>
        </div>
      </div>

      {/* Storage */}
      {(user as any).storageUsed !== undefined && (
        <StorageCard
          used={(user as any).storageUsed}
          total={(user as any).storageTotal}
          paidGb={user.paid_account_slots /* reuse field */ ?? 0}
          dark={dark} card={card} head={head} muted={muted}
          userId={user.id}
          onUpdate={(gb) => setData((d) => d ? { ...d, user: { ...d.user, paid_account_slots: gb } as any } : d)}
        />
      )}

      {/* Post stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[
          { label: "Total Posts", value: postStats.total,     color: head },
          { label: "Published",   value: postStats.published, color: "text-green-400" },
          { label: "Scheduled",   value: postStats.scheduled, color: "text-blue-400" },
          { label: "Failed",      value: postStats.failed,    color: "text-red-400" },
          { label: "Drafts",      value: postStats.draft,     color: muted },
        ].map((s) => (
          <div key={s.label} className={`border rounded-2xl p-5 text-center ${card}`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className={`text-xs mt-1 ${muted}`}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connected accounts */}
        <div className={`border rounded-2xl p-6 ${card}`}>
          <h2 className={`text-base font-bold mb-1 ${head}`}>Connected Accounts</h2>
          <p className={`text-xs mb-5 ${muted}`}>{accounts.length} of {2 + user.paid_account_slots} slots used</p>

          <div className={`h-1.5 rounded-full overflow-hidden mb-5 ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
            <div className="h-full bg-[#AAFF00] rounded-full transition-all"
              style={{ width: `${Math.min(100, (accounts.length / (2 + user.paid_account_slots)) * 100)}%` }} />
          </div>

          {accounts.length === 0 ? (
            <p className={`text-sm py-4 text-center ${muted}`}>No accounts connected</p>
          ) : (
            <div className="space-y-3">
              {accounts.map((acc) => {
                const meta = PLATFORM_META[acc.platform];
                const Icon = meta?.Icon;
                return (
                  <div key={acc._id} className={`flex items-center gap-3 p-3 rounded-xl ${inner}`}>
                    <div className={`size-9 rounded-lg ${meta?.bg || "bg-slate-700"} flex items-center justify-center shrink-0`}>
                      {Icon && <Icon size={16} color="white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${head}`}>@{acc.username || acc.displayName}</p>
                      <p className={`text-xs ${muted}`}>{meta?.label || acc.platform}</p>
                    </div>
                    <span className={`size-2 rounded-full ${acc.isActive ? "bg-green-500" : "bg-slate-600"}`} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent posts */}
        <div className={`border rounded-2xl p-6 ${card}`}>
          <h2 className={`text-base font-bold mb-1 ${head}`}>Recent Posts</h2>
          <p className={`text-xs mb-5 ${muted}`}>Last {recentPosts.length} posts</p>

          {recentPosts.length === 0 ? (
            <p className={`text-sm py-4 text-center ${muted}`}>No posts yet</p>
          ) : (
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {recentPosts.map((post) => {
                const s = STATUS_STYLES[post.status] || STATUS_STYLES.draft;
                const Icon = s.Icon;
                return (
                  <div key={post._id} className={`flex items-start gap-3 p-3 rounded-xl ${inner}`}>
                    <Icon className={`size-3.5 shrink-0 mt-0.5 ${s.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs line-clamp-2 leading-relaxed ${head}`}>{post.content || "(no content)"}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-medium ${s.color}`}>{s.label}</span>
                        <span className={`text-[10px] ${dimmed}`}>
                          {post.scheduledFor ? fmtShort(post.scheduledFor) : fmtShort(post.createdAt)}
                        </span>
                        {post.platforms.map((p) => (
                          <span key={p.platform}
                            className="size-1.5 rounded-full inline-block"
                            style={{ background: PLATFORM_META[p.platform]?.bg?.includes("gradient") ? "#ec4899" : "#64748b" }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function fmtBytes(b: number) {
  if (b >= 1024 ** 3) return `${(b / 1024 ** 3).toFixed(2)} GB`;
  if (b >= 1024 ** 2) return `${(b / 1024 ** 2).toFixed(0)} MB`;
  return `${(b / 1024).toFixed(0)} KB`;
}

function StorageCard({
  used, total, dark, card, head, muted, userId, onUpdate,
}: {
  used: number; total: number; paidGb: number;
  dark: boolean; card: string; head: string; muted: string;
  userId: string; onUpdate: (gb: number) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [extraGb, setExtraGb] = useState("");
  const [saving, setSaving] = useState(false);
  const pct = Math.min((used / total) * 100, 100);
  const danger  = pct >= 95;
  const warning = pct >= 80;
  const barColor = danger ? "bg-red-500" : warning ? "bg-amber-400" : "bg-[#AAFF00]";

  async function grantStorage() {
    const gb = parseInt(extraGb);
    if (!gb || gb < 1) return;
    setSaving(true);
    await adminApi.updateUser(userId, { paid_storage_gb: gb } as any);
    onUpdate(gb);
    setSaving(false);
    setAdding(false);
    setExtraGb("");
  }

  return (
    <div className={`border rounded-2xl p-5 mb-6 ${card}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HardDrive className={`size-4 ${danger ? "text-red-400" : muted}`} />
          <span className={`text-sm font-semibold ${head}`}>Storage</span>
        </div>
        {!adding && (
          <button onClick={() => setAdding(true)}
            className="text-xs px-3 py-1 rounded-lg bg-[#AAFF00]/10 text-[#AAFF00] border border-[#AAFF00]/20 hover:bg-[#AAFF00]/20 transition-colors">
            Grant storage
          </button>
        )}
        {adding && (
          <div className="flex items-center gap-2">
            <input
              type="number" min={1} placeholder="GB"
              value={extraGb} onChange={(e) => setExtraGb(e.target.value)}
              className={`w-20 text-xs border rounded-lg px-2 py-1.5 outline-none ${dark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"}`}
            />
            <button onClick={grantStorage} disabled={saving}
              className="size-7 flex items-center justify-center bg-[#AAFF00] text-black rounded-lg disabled:opacity-50">
              <Check className="size-3.5" />
            </button>
            <button onClick={() => { setAdding(false); setExtraGb(""); }}
              className={`size-7 flex items-center justify-center rounded-lg ${dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
              <X className="size-3.5" />
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between text-xs mb-2">
        <span className={muted}>{fmtBytes(used)} used</span>
        <span className={muted}>{fmtBytes(total)} total</span>
      </div>
      <div className={`h-2 rounded-full overflow-hidden ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <p className={`text-xs mt-2 ${muted}`}>{pct.toFixed(1)}% used · {fmtBytes(total - used)} remaining</p>
    </div>
  );
}
