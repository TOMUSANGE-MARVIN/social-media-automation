import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Trash2, RefreshCw, RotateCcw, PenSquare, Pencil, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { zernioApi, type ZernioPost, type Pagination } from "../services/api";

type StatusTab = "all" | "scheduled" | "published" | "draft" | "failed";

const TABS: { label: string; value: StatusTab }[] = [
    { label: "All",       value: "all" },
    { label: "Scheduled", value: "scheduled" },
    { label: "Published", value: "published" },
    { label: "Drafts",    value: "draft" },
    { label: "Failed",    value: "failed" },
];

const STATUS_PILL: Record<string, string> = {
    scheduled: "bg-blue-50 text-blue-700",
    published:  "bg-green-50 text-green-700",
    draft:      "bg-slate-100 text-slate-600",
    failed:     "bg-red-50 text-red-600",
};

const PLATFORM_DOT: Record<string, string> = {
    instagram:      "bg-pink-500",
    facebook:       "bg-blue-600",
    tiktok:         "bg-slate-900",
    youtube:        "bg-red-600",
    linkedin:       "bg-blue-700",
    twitter:        "bg-black",
    threads:        "bg-black",
    pinterest:      "bg-red-600",
    reddit:         "bg-orange-600",
    telegram:       "bg-sky-500",
    discord:        "bg-indigo-600",
    bluesky:        "bg-sky-500",
    whatsapp:       "bg-green-600",
    googlebusiness: "bg-blue-500",
};

function DeleteModal({ post, onConfirm, onCancel, deleting }: {
    post: ZernioPost;
    onConfirm: () => void;
    onCancel: () => void;
    deleting: boolean;
}) {
    const preview = post.content.length > 80 ? post.content.slice(0, 80) + "…" : post.content;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4">
                <div className="flex items-start gap-4">
                    <div className="size-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                        <AlertTriangle className="size-5 text-red-500" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-900 text-base">Delete post?</h2>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">This action cannot be undone. The post will be permanently removed.</p>
                    </div>
                </div>

                {/* Post preview */}
                <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{preview}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize font-medium ${
                            post.status === "published" ? "bg-green-50 text-green-700" :
                            post.status === "scheduled" ? "bg-blue-50 text-blue-700" :
                            post.status === "failed"    ? "bg-red-50 text-red-600" :
                            "bg-slate-100 text-slate-600"
                        }`}>{post.status}</span>
                        <span className="text-[10px] text-gray-400">{post.platforms.length} platform{post.platforms.length !== 1 ? "s" : ""}</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={onCancel} disabled={deleting}
                        className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50">
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={deleting}
                        className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                        {deleting ? <><span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Deleting…</> : <><Trash2 className="size-4" /> Delete</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Posts() {
    const [tab, setTab] = useState<StatusTab>("all");
    const [posts, setPosts] = useState<ZernioPost[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<ZernioPost | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const params: Record<string, string | number> = { page, limit: 10 };
            if (tab !== "all") params.status = tab;
            const data = await zernioApi.posts.list(params);
            setPosts(data.posts ?? []);
            setPagination(data.pagination ?? null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load posts.");
        } finally {
            setLoading(false);
        }
    }, [tab, page]);

    useEffect(() => { fetchPosts(); }, [fetchPosts]);
    useEffect(() => { setPage(1); }, [tab]);

    async function confirmDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        setActionId(deleteTarget._id);
        try {
            await zernioApi.posts.delete(deleteTarget._id);
            setDeleteTarget(null);
            fetchPosts();
        } catch {
            setError("Failed to delete post.");
            setDeleteTarget(null);
        } finally {
            setDeleting(false);
            setActionId(null);
        }
    }

    async function handleRetry(id: string) {
        setActionId(id);
        try { await zernioApi.posts.retry(id); fetchPosts(); }
        catch { setError("Failed to retry post."); }
        finally { setActionId(null); }
    }

    return (
        <div>
            {deleteTarget && (
                <DeleteModal
                    post={deleteTarget}
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteTarget(null)}
                    deleting={deleting}
                />
            )}
            <div className="flex items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Posts</h1>
                    <p className="text-sm text-gray-500 mt-0.5">All your scheduled, published and draft content</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button onClick={fetchPosts} disabled={loading}
                        className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                        <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
                    </button>
                    <Link to="/compose"
                        className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
                        <PenSquare className="size-4" /> New Post
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-white rounded-xl border border-gray-200 p-1 mb-6 overflow-x-auto">
                {TABS.map((t) => (
                    <button key={t.value} onClick={() => setTab(t.value)}
                        className={`flex-1 min-w-fit px-4 py-2 text-sm rounded-lg transition-colors whitespace-nowrap ${tab === t.value
                            ? "bg-gray-900 text-white font-semibold"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">{error}</div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="py-20 text-center text-sm text-gray-400">Loading posts…</div>
                ) : posts.length === 0 ? (
                    <div className="py-20 text-center">
                        <p className="text-gray-500 text-sm">No {tab !== "all" ? tab : ""} posts yet</p>
                        <Link to="/compose" className="mt-1.5 inline-block text-sm font-medium text-gray-900 hover:text-gray-700">
                            Create a post →
                        </Link>
                    </div>
                ) : posts.map((post) => (
                    <div key={post._id}
                        className="flex items-start gap-4 p-5 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                        {/* Platform dots */}
                        <div className="flex flex-col gap-1.5 shrink-0 pt-0.5">
                            {post.platforms.map((p) => (
                                <div key={p.platform + p.accountId} title={p.platform}
                                    className={`size-6 rounded-md ${PLATFORM_DOT[p.platform] ?? "bg-slate-400"} flex items-center justify-center`}>
                                    <span className="text-white text-[8px] uppercase font-bold">{p.platform.slice(0, 2)}</span>
                                </div>
                            ))}
                        </div>

                        {/* Body */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 line-clamp-2">{post.content}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${STATUS_PILL[post.status] ?? STATUS_PILL.draft}`}>
                                    {post.status}
                                </span>
                                {post.scheduledFor && (
                                    <span className="text-xs text-gray-400">
                                        {new Date(post.scheduledFor).toLocaleDateString("en-US", {
                                            month: "short", day: "numeric", year: "numeric",
                                            hour: "2-digit", minute: "2-digit",
                                        })}
                                    </span>
                                )}
                                {(post.hashtags?.length ?? 0) > 0 && (
                                    <span className="text-xs text-gray-400">
                                        #{post.hashtags!.slice(0, 2).join(" #")}{post.hashtags!.length > 2 ? " …" : ""}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                            {post.status === "failed" && (
                                <button onClick={() => handleRetry(post._id)} disabled={actionId === post._id}
                                    title="Retry" className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50">
                                    <RotateCcw className="size-4" />
                                </button>
                            )}
                            {(post.status === "draft" || post.status === "scheduled") && (
                                <Link to={`/compose?edit=${post._id}`} state={{ post }}
                                    title="Edit" className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                                    <Pencil className="size-4" />
                                </Link>
                            )}
                            <button onClick={() => setDeleteTarget(post)} disabled={actionId === post._id}
                                title="Delete" className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                                <Trash2 className="size-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-slate-500">
                        Page {pagination.page} of {pagination.pages} ({pagination.total} posts)
                    </p>
                    <div className="flex gap-2">
                        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                            className="p-2 text-slate-600 rounded-xl hover:bg-white transition-colors disabled:opacity-40">
                            <ChevronLeft className="size-4" />
                        </button>
                        <button onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                            className="p-2 text-slate-600 rounded-xl hover:bg-white transition-colors disabled:opacity-40">
                            <ChevronRight className="size-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
