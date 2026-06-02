import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { BarChart2, CheckCircle2, Calendar, FileText, AlertTriangle, PenSquare } from "lucide-react";
import { useAuth } from "../context/AuthContext";
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
    tiktok:    "bg-slate-900",
    instagram: "bg-gradient-to-br from-pink-500 to-purple-600",
    facebook:  "bg-blue-600",
    linkedin:  "bg-blue-700",
};
const PLATFORM_ICONS: Record<string, React.FC<{ size?: number; color?: string }>> = {
    tiktok: SiTiktok, instagram: SiInstagram, facebook: SiFacebook, linkedin: LinkedinIcon,
};
const STATUS_COLORS: Record<string, string> = {
    published: "#10b981",
    scheduled: "#3b82f6",
    draft:     "#94a3b8",
    failed:    "#ef4444",
};

type Range = "7d" | "30d" | "90d";

const RANGE_DAYS: Record<Range, number> = { "7d": 7, "30d": 30, "90d": 90 };

function buildDailyData(posts: ZernioPost[], days: number) {
    const result: { date: string; label: string; published: number; scheduled: number; draft: number; failed: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        const label = days <= 7
            ? d.toLocaleDateString("en-US", { weekday: "short" })
            : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const dayPosts = posts.filter((p) => (p.createdAt ?? "").slice(0, 10) === key);
        result.push({
            date: key, label,
            published: dayPosts.filter((p) => p.status === "published").length,
            scheduled:  dayPosts.filter((p) => p.status === "scheduled").length,
            draft:      dayPosts.filter((p) => p.status === "draft").length,
            failed:     dayPosts.filter((p) => p.status === "failed").length,
        });
    }
    return result;
}

function buildCumulativeData(posts: ZernioPost[], days: number) {
    const daily = buildDailyData(posts, days);
    let cum = 0;
    return daily.map((d) => {
        cum += d.published + d.scheduled + d.draft;
        return { ...d, total: cum };
    });
}

function MetricCard({
    label, value, sub, icon: Icon, loading,
}: {
    label: string; value: string | number; sub?: string;
    icon: React.FC<{ className?: string }>; color?: string; loading?: boolean;
}) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</span>
                <div className="size-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Icon className="size-4 text-gray-500" />
                </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{loading ? "—" : value}</p>
            {sub && <p className="text-xs text-gray-400 mt-1.5">{sub}</p>}
        </div>
    );
}

function CustomBarTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-gray-900 text-white text-xs px-3 py-2.5 rounded-lg shadow-xl space-y-1">
            <p className="font-semibold mb-1">{label}</p>
            {payload.map((entry: any) => (
                <div key={entry.dataKey} className="flex items-center gap-2">
                    <span className="size-2 rounded-full" style={{ background: entry.fill }} />
                    <span className="capitalize text-gray-300">{entry.dataKey}:</span>
                    <span className="font-medium">{entry.value}</span>
                </div>
            ))}
        </div>
    );
}

function CustomPieTooltip({ active, payload }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl">
            <p className="capitalize font-medium">{payload[0].name}</p>
            <p className="text-gray-300">{payload[0].value} posts ({payload[0].payload.pct}%)</p>
        </div>
    );
}

export default function Analytics() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<ZernioPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState<Range>("30d");

    useEffect(() => {
        if (!user?.zernioProfileId) { setLoading(false); return; }
        zernioApi.posts.list({ limit: 200, page: 1 })
            .then((res) => setPosts(res.posts ?? []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user?.zernioProfileId]);

    const days = RANGE_DAYS[range];
    const cutoff = new Date(Date.now() - days * 86400000).toISOString();
    const rangedPosts = useMemo(() => posts.filter((p) => (p.createdAt ?? "") >= cutoff), [posts, range]);

    const totalPosts   = rangedPosts.length;
    const published    = rangedPosts.filter((p) => p.status === "published").length;
    const scheduled    = rangedPosts.filter((p) => p.status === "scheduled").length;
    const failRate     = totalPosts > 0 ? Math.round((rangedPosts.filter((p) => p.status === "failed").length / totalPosts) * 100) : 0;

    const dailyData    = useMemo(() => buildDailyData(rangedPosts, days), [rangedPosts, days]);
    const cumulData    = useMemo(() => buildCumulativeData(rangedPosts, days), [rangedPosts, days]);

    // Platform pie data
    const platformCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        rangedPosts.forEach((p) => (p.platforms ?? []).forEach((pl) => {
            counts[pl.platform] = (counts[pl.platform] ?? 0) + 1;
        }));
        const total = Object.values(counts).reduce((s, v) => s + v, 0) || 1;
        return Object.entries(counts).map(([name, value]) => ({
            name, value, pct: Math.round((value / total) * 100),
        })).sort((a, b) => b.value - a.value);
    }, [rangedPosts]);

    // Status pie data
    const statusData = useMemo(() => {
        const counts: Record<string, number> = { published: 0, scheduled: 0, draft: 0, failed: 0 };
        rangedPosts.forEach((p) => { counts[p.status] = (counts[p.status] ?? 0) + 1; });
        return Object.entries(counts)
            .filter(([, v]) => v > 0)
            .map(([name, value]) => ({ name, value, pct: totalPosts > 0 ? Math.round((value / totalPosts) * 100) : 0 }));
    }, [rangedPosts, totalPosts]);

    const isEmpty = totalPosts === 0 && !loading;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Track your content performance across all platforms</p>
                </div>
                <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1">
                    {(["7d", "30d", "90d"] as Range[]).map((r) => (
                        <button key={r} onClick={() => setRange(r)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                range === r ? "bg-slate-900 text-white" : "text-gray-500 hover:text-gray-900"
                            }`}>
                            {r === "7d" ? "7 days" : r === "30d" ? "30 days" : "90 days"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard label="Total Posts"  value={totalPosts} sub={`in last ${range}`}
                    icon={FileText}      color="bg-slate-700"    loading={loading} />
                <MetricCard label="Published"    value={published}  sub="successfully sent"
                    icon={CheckCircle2}  color="bg-emerald-500"  loading={loading} />
                <MetricCard label="Scheduled"    value={scheduled}  sub="pending publish"
                    icon={Calendar}      color="bg-blue-500"     loading={loading} />
                <MetricCard label="Fail Rate"    value={`${failRate}%`} sub="of all posts"
                    icon={AlertTriangle} color={failRate > 10 ? "bg-red-500" : "bg-amber-500"} loading={loading} />
            </div>

            {isEmpty ? (
                <div className="bg-white rounded-xl border border-gray-200 py-20 text-center">
                    <BarChart2 className="size-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No posts in this period</p>
                    <p className="text-gray-400 text-sm mt-1">Start creating content to see your analytics</p>
                    <Link to="/compose"
                        className="mt-5 inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm px-5 py-2.5 rounded-lg font-medium transition-colors">
                        <PenSquare className="size-4" /> Create your first post
                    </Link>
                </div>
            ) : (
                <>
                    {/* Cumulative growth */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className="mb-5">
                            <h2 className="font-semibold text-gray-900">Posts Over Time</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Cumulative total posts created</p>
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={cumulData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#111827" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#111827" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                                    interval={days <= 7 ? 0 : days <= 30 ? 4 : 9} />
                                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip content={({ active, payload, label }) => {
                                    if (!active || !payload?.length) return null;
                                    return (
                                        <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl">
                                            <p className="font-medium">{label}</p>
                                            <p className="text-gray-300">{payload[0].value} total posts</p>
                                        </div>
                                    );
                                }} />
                                <Area type="monotone" dataKey="total" stroke="#111827" strokeWidth={2}
                                    fill="url(#totalGrad)" dot={false} activeDot={{ r: 4, fill: "#111827" }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Daily bar + platform pie */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                        {/* Daily breakdown bar chart */}
                        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-5">
                            <div className="mb-5">
                                <h2 className="font-semibold text-gray-900">Daily Activity</h2>
                                <p className="text-xs text-gray-400 mt-0.5">Posts by status per day</p>
                            </div>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={dailyData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                                        interval={days <= 7 ? 0 : days <= 30 ? 4 : 9} />
                                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                                    <Tooltip content={<CustomBarTooltip />} />
                                    <Bar dataKey="published" fill="#10b981" radius={[2, 2, 0, 0]} stackId="a" />
                                    <Bar dataKey="scheduled"  fill="#3b82f6" radius={[2, 2, 0, 0]} stackId="a" />
                                    <Bar dataKey="draft"      fill="#e2e8f0" radius={[2, 2, 0, 0]} stackId="a" />
                                    <Bar dataKey="failed"     fill="#ef4444" radius={[2, 2, 0, 0]} stackId="a" />
                                </BarChart>
                            </ResponsiveContainer>
                            {/* Legend */}
                            <div className="flex flex-wrap gap-3 mt-3">
                                {Object.entries(STATUS_COLORS).map(([status, color]) => (
                                    <div key={status} className="flex items-center gap-1.5">
                                        <span className="size-2.5 rounded-sm" style={{ background: color }} />
                                        <span className="text-xs capitalize text-gray-500">{status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Platform pie */}
                        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
                            <div className="mb-4">
                                <h2 className="font-semibold text-gray-900">Platform Mix</h2>
                                <p className="text-xs text-gray-400 mt-0.5">Posts by platform</p>
                            </div>
                            {platformCounts.length === 0 ? (
                                <div className="h-40 flex items-center justify-center text-gray-300 text-xs">No data</div>
                            ) : (
                                <>
                                    <ResponsiveContainer width="100%" height={140}>
                                        <PieChart>
                                            <Pie data={platformCounts} dataKey="value" nameKey="name"
                                                cx="50%" cy="50%" innerRadius={40} outerRadius={65}
                                                paddingAngle={3}>
                                                {platformCounts.map((entry) => (
                                                    <Cell key={entry.name}
                                                        fill={PLATFORM_COLORS[entry.name] ?? "#94a3b8"} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomPieTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="space-y-2 mt-3">
                                        {platformCounts.map((p) => {
                                            const Icon = PLATFORM_ICONS[p.name];
                                            return (
                                                <div key={p.name} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        {Icon && (
                                                            <div className={`size-5 rounded-md ${PLATFORM_BG[p.name] ?? "bg-slate-400"} flex items-center justify-center`}>
                                                                <Icon size={10} color="white" />
                                                            </div>
                                                        )}
                                                        <span className="text-xs capitalize text-slate-600">{p.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-xs font-medium text-slate-700">{p.value}</span>
                                                        <span className="text-xs text-gray-400">({p.pct}%)</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Status breakdown */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className="mb-5">
                            <h2 className="font-semibold text-gray-900">Status Breakdown</h2>
                            <p className="text-xs text-gray-400 mt-0.5">All posts by current status</p>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {statusData.map(({ name, value, pct }) => (
                                <div key={name} className="bg-slate-50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="size-2.5 rounded-full" style={{ background: STATUS_COLORS[name] ?? "#94a3b8" }} />
                                        <span className="text-xs capitalize text-gray-500">{name}</span>
                                    </div>
                                    <p className="text-2xl font-bold text-white">{value}</p>
                                    <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: STATUS_COLORS[name] ?? "#94a3b8" }} />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">{pct}% of total</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Best day of week */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className="mb-5">
                            <h2 className="font-semibold text-gray-900">Best Day to Post</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Average posts created per weekday</p>
                        </div>
                        <BestDayChart posts={rangedPosts} />
                    </div>
                </>
            )}
        </div>
    );
}

function BestDayChart({ posts }: { posts: ZernioPost[] }) {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts = Array(7).fill(0);
    posts.forEach((p) => {
        const d = new Date(p.createdAt ?? "");
        if (!isNaN(d.getTime())) counts[d.getDay()]++;
    });
    const max = Math.max(...counts, 1);
    const data = dayNames.map((day, i) => ({ day, posts: counts[i] }));

    return (
        <ResponsiveContainer width="100%" height={120}>
            <BarChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                        <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl">
                            <p className="font-medium">{label}</p>
                            <p className="text-gray-300">{payload[0].value} posts</p>
                        </div>
                    );
                }} />
                <Bar dataKey="posts" radius={[4, 4, 0, 0]}>
                    {data.map((entry) => (
                        <Cell key={entry.day}
                            fill={entry.posts === max && max > 0 ? "#ef4444" : "#e2e8f0"} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
