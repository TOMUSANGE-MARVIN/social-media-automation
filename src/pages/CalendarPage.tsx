import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { RefreshCw, PenSquare } from "lucide-react";
import { zernioApi, type ZernioPost } from "../services/api";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales: { "en-US": enUS },
});

const DnDCalendar = withDragAndDrop(Calendar);

const PLATFORM_COLORS: Record<string, string> = {
  instagram:      "#ec4899",
  facebook:       "#2563eb",
  tiktok:         "#0f172a",
  youtube:        "#ef4444",
  linkedin:       "#1d4ed8",
  twitter:        "#000000",
  threads:        "#000000",
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
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const title = post.content.length > 50 ? post.content.slice(0, 50) + "…" : post.content;
  return { id: post._id, title, start, end, resource: post };
}

function eventStyleGetter(event: CalEvent) {
  const color = PLATFORM_COLORS[event.resource.platforms?.[0]?.platform ?? ""] ?? "#6b7280";
  return {
    style: {
      backgroundColor: color,
      borderRadius: "6px",
      border: "none",
      color: "#fff",
      fontSize: "11px",
      padding: "2px 6px",
    },
  };
}

export default function CalendarPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rescheduling, setRescheduling] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch scheduled posts (up to 200)
      const [scheduled, published] = await Promise.all([
        zernioApi.posts.list({ status: "scheduled", limit: 100 }),
        zernioApi.posts.list({ status: "published", limit: 100 }),
      ]);
      const all = [
        ...(scheduled.posts ?? []),
        ...(published.posts ?? []),
      ];
      setEvents(all.map(postToEvent));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  async function onEventDrop({ event, start }: { event: object; start: Date | string; end: Date | string }) {
    const calEvent = event as CalEvent;
    const post = calEvent.resource;
    if (post.status !== "scheduled") return; // can only reschedule scheduled posts

    const newStart = start instanceof Date ? start : new Date(start);
    if (newStart <= new Date()) {
      setError("Cannot reschedule to a past date.");
      return;
    }

    setRescheduling(true);
    try {
      // Recreate with new scheduled time
      const platforms = post.platforms.map((p) => ({ platform: p.platform, accountId: p.accountId }));
      await zernioApi.posts.delete(post._id);
      await zernioApi.posts.create({
        content: post.content,
        platforms,
        scheduledFor: newStart.toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        ...(post.hashtags?.length && { hashtags: post.hashtags }),
        ...(post.mediaItems?.length && { mediaItems: post.mediaItems }),
        ...(post.tags?.length && { tags: post.tags }),
        ...(post.visibility && { visibility: post.visibility }),
      });
      await fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reschedule failed.");
    } finally {
      setRescheduling(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Content Calendar</h1>
          <p className="text-sm text-gray-500 mt-0.5">Drag scheduled posts to reschedule them</p>
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

      {error && (
        <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">{error}</div>
      )}
      {rescheduling && (
        <div className="p-3 bg-blue-50 border border-blue-100 text-blue-600 text-sm rounded-xl">Rescheduling post…</div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {Object.entries(PLATFORM_COLORS).slice(0, 6).map(([p, c]) => (
          <div key={p} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full inline-block" style={{ backgroundColor: c }} />
            <span className="capitalize text-gray-500">{p}</span>
          </div>
        ))}
        <span className="text-gray-400">+ more</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4" style={{ height: 680 }}>
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">Loading…</div>
        ) : (
          <DnDCalendar
            localizer={localizer}
            events={events}
            startAccessor={(e) => (e as CalEvent).start}
            endAccessor={(e) => (e as CalEvent).end}
            eventPropGetter={eventStyleGetter as any}
            onEventDrop={onEventDrop as any}
            onSelectEvent={(event) => {
              const e = event as CalEvent;
              if (e.resource.status === "scheduled" || e.resource.status === "draft") {
                navigate(`/compose?edit=${e.id}`, { state: { post: e.resource } });
              }
            }}
            draggableAccessor={(event) => (event as CalEvent).resource.status === "scheduled"}
            resizable={false}
            views={["month", "week", "day"]}
            defaultView="month"
            popup
            style={{ height: "100%" }}
            tooltipAccessor={(event) => (event as CalEvent).resource.content}
          />
        )}
      </div>

      <p className="text-xs text-gray-400 text-center">
        Click a scheduled post to edit · Drag to reschedule · Published posts are read-only
      </p>
    </div>
  );
}
