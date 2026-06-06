import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { RefreshCw, PenSquare, Clock, X, Loader2 } from "lucide-react";
import { zernioApi, type ZernioPost } from "../services/api";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales: { "en-US": enUS },
});

const PLATFORM_COLORS: Record<string, string> = {
  instagram:      "#ec4899",
  facebook:       "#2563eb",
  tiktok:         "#334155",
  youtube:        "#ef4444",
  linkedin:       "#1d4ed8",
  twitter:        "#374151",
  threads:        "#374151",
  pinterest:      "#e60023",
  reddit:         "#ea580c",
  telegram:       "#0ea5e9",
  discord:        "#4f46e5",
  bluesky:        "#0285ff",
  whatsapp:       "#16a34a",
  googlebusiness: "#3b82f6",
};

interface CalEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: ZernioPost;
}

function postToEvent(post: ZernioPost): CalEvent {
  const start = post.scheduledFor ? new Date(post.scheduledFor) : new Date(post.createdAt);
  const end   = new Date(start.getTime() + 30 * 60 * 1000);
  const title = post.content.length > 50 ? post.content.slice(0, 50) + "…" : post.content;
  return { id: post._id, title, start, end, resource: post };
}

function RescheduleModal({ post, onConfirm, onCancel }: {
  post: ZernioPost;
  onConfirm: (newDate: string) => Promise<void>;
  onCancel: () => void;
}) {
  const current = post.scheduledFor
    ? new Date(post.scheduledFor).toISOString().slice(0, 16)
    : "";
  const [newDate, setNewDate] = useState(current);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  async function handleSave() {
    if (!newDate) { setError("Pick a date and time."); return; }
    if (new Date(newDate) <= new Date()) { setError("Must be a future date."); return; }
    setSaving(true);
    try { await onConfirm(newDate); }
    catch (e) { setError(e instanceof Error ? e.message : "Failed"); setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="font-semibold text-gray-900">Reschedule post</h2>
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{post.content}</p>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-700 p-1">
            <X className="size-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="size-4 text-gray-400 shrink-0" />
          <input
            type="datetime-local"
            value={newDate}
            onChange={(e) => { setNewDate(e.target.value); setError(""); }}
            min={new Date(Date.now() + 5 * 60 * 1000).toISOString().slice(0, 16)}
            className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-gray-400"
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex gap-3">
          <button onClick={onCancel} disabled={saving}
            className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {saving ? <><Loader2 className="size-4 animate-spin" /> Saving…</> : "Reschedule"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const navigate = useNavigate();
  const [events,       setEvents]       = useState<CalEvent[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [reschedulePost, setReschedulePost] = useState<ZernioPost | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [scheduled, published] = await Promise.all([
        zernioApi.posts.list({ status: "scheduled", limit: 100 }),
        zernioApi.posts.list({ status: "published", limit: 100 }),
      ]);
      setEvents([...(scheduled.posts ?? []), ...(published.posts ?? [])].map(postToEvent));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load posts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  async function handleReschedule(newDateStr: string) {
    const post = reschedulePost!;
    const platforms = post.platforms.map((p) => ({ platform: p.platform, accountId: p.accountId }));
    await zernioApi.posts.delete(post._id);
    await zernioApi.posts.create({
      content: post.content,
      platforms,
      scheduledFor: new Date(newDateStr).toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      ...(post.hashtags?.length  && { hashtags:   post.hashtags }),
      ...(post.mediaItems?.length && { mediaItems: post.mediaItems }),
      ...(post.tags?.length       && { tags:        post.tags }),
      ...(post.visibility         && { visibility:  post.visibility }),
    });
    setReschedulePost(null);
    await fetchPosts();
  }

  function handleSelectEvent(event: object) {
    const e = event as CalEvent;
    if (e.resource.status === "scheduled") {
      setReschedulePost(e.resource);
    } else if (e.resource.status === "draft") {
      navigate(`/compose?edit=${e.id}`, { state: { post: e.resource } });
    }
  }

  function eventStyleGetter(event: object) {
    const e = event as CalEvent;
    const color = PLATFORM_COLORS[e.resource.platforms?.[0]?.platform ?? ""] ?? "#6b7280";
    const isPublished = e.resource.status === "published";
    return {
      style: {
        backgroundColor: color,
        opacity: isPublished ? 0.6 : 1,
        borderRadius: "5px",
        border: "none",
        color: "#fff",
        fontSize: "11px",
        padding: "2px 6px",
        cursor: isPublished ? "default" : "pointer",
      },
    };
  }

  return (
    <div className="space-y-4">
      {reschedulePost && (
        <RescheduleModal
          post={reschedulePost}
          onConfirm={handleReschedule}
          onCancel={() => setReschedulePost(null)}
        />
      )}

      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Content Calendar</h1>
          <p className="text-sm text-gray-500 mt-0.5">Click a scheduled post to reschedule it</p>
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

      {/* Platform legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {Object.entries(PLATFORM_COLORS).slice(0, 7).map(([p, c]) => (
          <div key={p} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full inline-block" style={{ backgroundColor: c }} />
            <span className="capitalize text-gray-500">{p}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4" style={{ height: 660 }}>
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">Loading…</div>
        ) : (
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor={(e) => (e as CalEvent).start}
            endAccessor={(e) => (e as CalEvent).end}
            titleAccessor={(e) => (e as CalEvent).title}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={handleSelectEvent}
            views={["month", "week", "day", "agenda"]}
            defaultView="month"
            popup
            style={{ height: "100%" }}
            tooltipAccessor={(e) => (e as CalEvent).resource.content}
          />
        )}
      </div>

      <p className="text-xs text-gray-400 text-center">
        Click a scheduled post to reschedule · Published posts are dimmed and read-only
      </p>
    </div>
  );
}
