import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    PenSquare, Calendar, CheckCircle2, AlertCircle, Link2,
    FileText, Sparkles, ArrowRight, TrendingUp, BarChart2, ArrowUpRight,
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { zernioApi, type ZernioPost } from "../services/api";
import { SiTiktok, SiInstagram, SiFacebook } from "@icons-pack/react-simple-icons";
import LinkedinIcon from "../components/icons/LinkedinIcon";

const PLATFORM_COLORS: Record<string, string> = {
    tiktok:    "#0f172a",
    instagram: "#ec4899",
    facebook:  "#2563eb",
    linkedin:  "#1d4ed8",
};

const PLATFORM_BG: Record<string, string> = {
    tiktok:    "bg-gray-900",
    instagram: "bg-gradient-to-br from-pink-500 to-purple-600",
    facebook:  "bg-blue-600",
    linkedin:  "bg-blue-700",
};

const PLATFORM_ICONS: Record<string, React.FC<{ size?: number; color?: string }>> = {
    tiktok: SiTiktok, instagram: SiInstagram, facebook: SiFacebook, linkedin: LinkedinIcon,
};

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
    scheduled: { label: "Scheduled", bg: "bg-blue-50",   text: "text-blue-600",  dot: "bg-blue-400" },
    published: { label: "Published", bg: "bg-green-50",  text: "text-green-600", dot: "bg-green-400" },
    draft:     { label: "Draft",     bg: "bg-gray-100",  text: "text-gray-500",  dot: "bg-gray-400" },
    failed:    { label: "Failed",    bg: "bg-red-50",    text: "text-red-500",   dot: "bg-red-400" },
};

function buildActivity(posts: ZernioPost[]) {
    const days: { day: string; posts: number }[] = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        const label = d.toLocaleDateString("en-US", { weekday: "short" });
        const count = posts.filter((p) => (p.createdAt ?? "").slice(0, 10) === key).length;
        days.push({ day: label, posts: count });
    }
    return days;
}

function StatCard({ label, value, sub, icon: Icon, loading }: {
    label: string; value: string | number; sub?: React.ReactNode;
    icon: React.FC<{ className?: string }>; loading?: boolean;
}) {
    return (
        <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</span>
                <div className="size-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Icon className="size-4 text-gray-500" />
                </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{loading ? "—" : value}</p>
            {sub && <div className="mt-1.5 text-xs text-gray-400">{sub}</div>}
        </div>
    );
}

function PostRow({ post }: { post: ZernioPost }) {
    const status = STATUS_CONFIG[post.status] ?? STATUS_CONFIG.draft;
    const platforms = post.platforms?.slice(0, 3) ?? [];
    return (
        <div className="flex items-center gap-4 py-3.5 border-b border-gray-100 last:border-0">
            <div className="size-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                {post.mediaItems?.[0]?.url
                    ? <img src={post.mediaItems[0].url} alt="" className="size-full object-cover" />
                    : <FileText className="size-4 text-gray-300" />}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 line-clamp-1 font-medium">{post.content}</p>
                <div className="flex items-center gap-2 mt-1">
                    <div className="flex -space-x-1">
                        {platforms.map((p) => {
                            const Icon = PLATFORM_ICONS[p.platform];
                            return Icon ? (
                                <div key={p.platform + p.accountId}
                                    className={`size-4 rounded-full ${PLATFORM_BG[p.platform] ?? "bg-gray-400"} flex items-center justify-center ring-1 ring-white`}>
                                    <Icon size={8} color="white" />
                                </div>
                            ) : null;
                        })}
                    </div>
                    <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${status.bg} ${status.text}`}>
                        <span className={`size-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                    </span>
                </div>
            </div>
            {post.scheduledFor && (
                <time className="text-xs text-gray-400 shrink-0">
                    {new Date(post.scheduledFor).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </time>
            )}
        </div>
    );
}

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl">
            <p className="font-medium">{label}</p>
            <p className="text-gray-300">{payload[0].value} post{payload[0].value !== 1 ? "s" : ""}</p>
        </div>
    );
}

export default function Dashboard() {
    const { user } = useAuth();
    const { accounts } = useApp();
    const [posts, setPosts] = useState<ZernioPost[]>([]);
    const [allPosts, setAllPosts] = useState<ZernioPost[]>([]);
    const [stats, setStats] = useState({ scheduled: 0, published: 0, draft: 0, failed: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.zernioProfileId) { setLoading(false); return; }
        Promise.all([
            zernioApi.posts.list({ limit: 5, page: 1 }),
            zernioApi.posts.list({ status: "scheduled", limit: 1 }),
            zernioApi.posts.list({ status: "published", limit: 1 }),
            zernioApi.posts.list({ status: "draft",     limit: 1 }),
            zernioApi.posts.list({ status: "failed",    limit: 1 }),
            zernioApi.posts.list({ limit: 100, page: 1 }),
        ])
            .then(([recent, sched, pub, draft, failed, all]) => {
                setPosts(recent.posts ?? []);
                setAllPosts(all.posts ?? []);
                setStats({
                    scheduled: sched.pagination.total,
                    published: pub.pagination.total,
                    draft:     draft.pagination.total,
                    failed:    failed.pagination.total,
                });
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user?.zernioProfileId]);

    const firstName = user?.name?.split(" ")[0] ?? "there";
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    const activity = buildActivity(allPosts);
    const totalPosts = stats.scheduled + stats.published + stats.draft + stats.failed;

    const platformCounts = allPosts.reduce<Record<string, number>>((acc, p) => {
        (p.platforms ?? []).forEach((pl) => {
            acc[pl.platform] = (acc[pl.platform] ?? 0) + 1;
        });
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">{greeting}, {firstName}</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Here's your content overview for today</p>
                </div>
                <Link to="/compose"
                    className="flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors shrink-0">
                    <PenSquare className="size-4" /> New post
                </Link>
            </div>

            {/* Profile warning */}
            {!user?.zernioProfileId && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-700">
                        There was an issue setting up your social profile. Please contact support.
                    </p>
                </div>
            )}

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Accounts" value={accounts.length} icon={Link2} loading={false}
                    sub={accounts.length === 0
                        ? <Link to="/accounts" className="text-gray-900 font-medium underline underline-offset-2">Connect now</Link>
                        : `platform${accounts.length !== 1 ? "s" : ""} connected`} />
                <StatCard label="Scheduled" value={stats.scheduled} icon={Calendar} loading={loading} sub="queued posts" />
                <StatCard label="Published"  value={stats.published} icon={CheckCircle2} loading={loading} sub="all time" />
                <StatCard label="Total Posts" value={totalPosts} icon={TrendingUp} loading={loading}
                    sub={`${stats.draft} draft${stats.draft !== 1 ? "s" : ""}`} />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Activity chart */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="font-semibold text-gray-900 text-sm">Publishing Activity</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Posts created — last 7 days</p>
                        </div>
                        <Link to="/analytics" className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors font-medium">
                            Full analytics <ArrowRight className="size-3" />
                        </Link>
                    </div>
                    <ResponsiveContainer width="100%" height={150}>
                        <AreaChart data={activity} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                            <defs>
                                <linearGradient id="activityGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor="#111827" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#111827" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="posts" stroke="#111827" strokeWidth={2}
                                fill="url(#activityGrad)" dot={{ fill: "#111827", r: 3 }} activeDot={{ r: 5 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Platform breakdown */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h2 className="font-semibold text-gray-900 text-sm mb-0.5">Platforms</h2>
                    <p className="text-xs text-gray-400 mb-5">Breakdown by platform</p>
                    {Object.keys(platformCounts).length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 text-gray-200">
                            <BarChart2 className="size-7 mb-2" />
                            <p className="text-xs text-gray-400">No data yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3.5">
                            {Object.entries(platformCounts)
                                .sort(([, a], [, b]) => b - a)
                                .map(([platform, count]) => {
                                    const total = Object.values(platformCounts).reduce((s, v) => s + v, 0);
                                    const pct = Math.round((count / total) * 100);
                                    const Icon = PLATFORM_ICONS[platform];
                                    return (
                                        <div key={platform}>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <div className="flex items-center gap-2">
                                                    {Icon && (
                                                        <div className={`size-5 rounded-md ${PLATFORM_BG[platform] ?? "bg-gray-400"} flex items-center justify-center`}>
                                                            <Icon size={10} color="white" />
                                                        </div>
                                                    )}
                                                    <span className="text-xs capitalize text-gray-600">{platform}</span>
                                                </div>
                                                <span className="text-xs text-gray-400 font-medium">{pct}%</span>
                                            </div>
                                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${pct}%`, backgroundColor: PLATFORM_COLORS[platform] ?? "#9ca3af" }} />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent posts + AI promo */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900 text-sm">Recent Posts</h2>
                        <Link to="/posts" className="text-xs text-gray-500 hover:text-gray-900 font-medium flex items-center gap-1 transition-colors">
                            View all <ArrowRight className="size-3" />
                        </Link>
                    </div>
                    <div className="px-5">
                        {loading ? (
                            <div className="py-12 text-center text-sm text-gray-400">Loading…</div>
                        ) : posts.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="text-gray-400 text-sm">No posts yet</p>
                                <Link to="/compose" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors">
                                    Create your first post <ArrowUpRight className="size-3.5" />
                                </Link>
                            </div>
                        ) : (
                            posts.map((p) => <PostRow key={p._id} post={p} />)
                        )}
                    </div>
                </div>

                {/* AI promo */}
                <div className="ai-promo-card bg-gray-900 rounded-xl p-6 flex flex-col">
                    <div className="size-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                        <Sparkles className="size-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-white text-sm mb-2">AI Content Generator</h3>
                    <p className="text-sm text-gray-400 flex-1 mb-6 leading-relaxed">
                        Generate on-brand posts and images for all your platforms instantly with GPT-4o and DALL-E.
                    </p>
                    <Link to="/compose"
                        className="flex items-center justify-center gap-2 bg-[#AAFF00] text-gray-900 text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#c8ff33] transition-colors">
                        <PenSquare className="size-4" /> Start Writing
                    </Link>
                </div>
            </div>
        </div>
    );
}
