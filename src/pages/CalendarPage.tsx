import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, RefreshCw, PenSquare, Clock, X, Loader2 } from "lucide-react";
import { zernioApi, type ZernioPost } from "../services/api";

// ─── helpers ──────────────────────────────────────────────────────────────────

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "#ec4899", facebook: "#2563eb", tiktok: "#334155",
  youtube: "#ef4444", linkedin: "#1d4ed8", twitter: "#374151",
  threads: "#374151", pinterest: "#e60023", reddit: "#ea580c",
  telegram: "#0ea5e9", discord: "#4f46e5", bluesky: "#0285ff",
  whatsapp: "#16a34a", googlebusiness: "#3b82f6",
};

const MONTH_NAMES = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function getCalendarDays(year: number, month: number): Date[] {
  const days: Date[] = [];
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev  = new Date(year, month, 0).getDate();

  for (let i = firstDay - 1; i >= 0; i--)
    days.push(new Date(year, month - 1, daysInPrev - i));
  for (let d = 1; d <= daysInMonth; d++)
    days.push(new Date(year, month, d));
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++)
    days.push(new Date(year, month + 1, i));

  return days;
}

function postDateKey(post: ZernioPost) {
  const d = post.scheduledFor ? new Date(post.scheduledFor) : new Date(post.createdAt);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function dayKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

// ─── Reschedule modal ─────────────────────────────────────────────────────────

function RescheduleModal({ post, onConfirm, onCancel }: {
  post: ZernioPost;
  onConfirm: (iso: string) => Promise<void>;
  onCancel: () => void;
}) {
  const current = post.scheduledFor ? new Date(post.scheduledFor).toISOString().slice(0, 16) : "";
  const [val, setVal]     = useState(current);
  const [saving, setSaving] = useState(false);
  const [err, setErr]     = useState("");

  async function save() {
    if (!val) { setErr("Pick a date and time."); return; }
    if (new Date(val) <= new Date()) { setErr("Must be a future date."); return; }
    setSaving(true);
    try { await onConfirm(val); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed."); setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Reschedule post</h2>
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 max-w-xs">{post.content}</p>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-700 p-1 shrink-0">
            <X className="size-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="size-4 text-gray-400 shrink-0" />
          <input type="datetime-local" value={val}
            onChange={e => { setVal(e.target.value); setErr(""); }}
            min={new Date(Date.now() + 5 * 60 * 1000).toISOString().slice(0, 16)}
            className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-gray-400"
          />
        </div>

        {err && <p className="text-xs text-red-500">{err}</p>}

        <div className="flex gap-3">
          <button onClick={onCancel} disabled={saving}
            className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={save} disabled={saving}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {saving ? <><Loader2 className="size-4 animate-spin" />Saving…</> : "Reschedule"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const navigate = useNavigate();
  const today    = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [posts,   setPosts]   = useState<ZernioPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [reschedule, setReschedule] = useState<ZernioPost | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [sched, pub, draft] = await Promise.all([
        zernioApi.posts.list({ status: "scheduled", limit: 100 }),
        zernioApi.posts.list({ status: "published", limit: 100 }),
        zernioApi.posts.list({ status: "draft",     limit: 100 }),
      ]);
      setPosts([
        ...(sched.posts ?? []),
        ...(pub.posts   ?? []),
        ...(draft.posts ?? []),
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load posts.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }

  const days = getCalendarDays(year, month);

  const postsByDay = posts.reduce<Record<string, ZernioPost[]>>((acc, p) => {
    const k = postDateKey(p);
    acc[k] = [...(acc[k] ?? []), p];
    return acc;
  }, {});

  async function handleReschedule(iso: string) {
    const post = reschedule!;
    const platforms = post.platforms.map(p => ({ platform: p.platform, accountId: p.accountId }));
    await zernioApi.posts.delete(post._id);
    await zernioApi.posts.create({
      content: post.content, platforms,
      scheduledFor: new Date(iso).toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      ...(post.hashtags?.length   && { hashtags:   post.hashtags }),
      ...(post.mediaItems?.length && { mediaItems: post.mediaItems }),
      ...(post.tags?.length       && { tags:        post.tags }),
      ...(post.visibility         && { visibility:  post.visibility }),
    });
    setReschedule(null);
    await fetchPosts();
  }

  return (
    <div className="space-y-4">
      {reschedule && (
        <RescheduleModal post={reschedule}
          onConfirm={handleReschedule}
          onCancel={() => setReschedule(null)} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Content Calendar</h1>
          <p className="text-sm text-gray-500 mt-0.5">Click a post to reschedule or edit it</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchPosts} disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={() => navigate("/compose")}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
            <PenSquare className="size-4" /> New Post
          </button>
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">{error}</div>}

      {/* Calendar card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Month nav */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <button onClick={prevMonth}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
            <ChevronLeft className="size-4" />
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-gray-900">
              {MONTH_NAMES[month]} {year}
            </h2>
            <button onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); }}
              className="text-xs text-gray-400 hover:text-gray-700 border border-gray-200 hover:border-gray-400 px-2 py-0.5 rounded-md transition-colors">
              Today
            </button>
          </div>
          <button onClick={nextMonth}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {DAY_NAMES.map(d => (
            <div key={d} className="py-2 text-center text-xs font-medium text-gray-400 uppercase tracking-wide">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Loading…</div>
        ) : (
          <div className="grid grid-cols-7 divide-x divide-y divide-gray-100">
            {days.map((day, i) => {
              const isCurrentMonth = day.getMonth() === month;
              const isToday = isSameDay(day, today);
              const dayPosts = postsByDay[dayKey(day)] ?? [];

              return (
                <div key={i}
                  className={`min-h-[90px] p-1.5 ${isCurrentMonth ? "bg-white" : "bg-gray-50/50"}`}>
                  <div className={`text-xs w-6 h-6 flex items-center justify-center rounded-full mb-1 font-medium
                    ${isToday ? "bg-gray-900 text-white" : isCurrentMonth ? "text-gray-700" : "text-gray-300"}`}>
                    {day.getDate()}
                  </div>

                  <div className="space-y-0.5">
                    {dayPosts.slice(0, 3).map(post => {
                      const color = PLATFORM_COLORS[post.platforms?.[0]?.platform ?? ""] ?? "#9ca3af";
                      const isPublished = post.status === "published";
                      return (
                        <button key={post._id}
                          onClick={() => {
                            if (post.status === "scheduled") setReschedule(post);
                            else if (post.status === "draft")
                              navigate(`/compose?edit=${post._id}`, { state: { post } });
                          }}
                          title={post.content}
                          className="w-full text-left text-[10px] leading-tight px-1.5 py-0.5 rounded truncate text-white transition-opacity hover:opacity-80"
                          style={{ backgroundColor: color, opacity: isPublished ? 0.55 : 1 }}>
                          {post.content.slice(0, 22)}…
                        </button>
                      );
                    })}
                    {dayPosts.length > 3 && (
                      <p className="text-[10px] text-gray-400 pl-1">+{dayPosts.length - 3} more</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {[
          { label: "Scheduled", color: "#2563eb" },
          { label: "Published", color: "#9ca3af" },
          { label: "Draft",     color: "#6b7280" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-gray-500">{label}</span>
          </div>
        ))}
        <span className="text-gray-400 ml-1">· Color = platform</span>
      </div>
    </div>
  );
}
