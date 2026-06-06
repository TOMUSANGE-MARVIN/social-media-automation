import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Send, Save, Clock, Hash, ImagePlus, X, Loader2, CheckCircle2,
    Sparkles, ChevronDown, Wand2, Image as ImageIcon, HardDrive,
} from "lucide-react";
import { SiTiktok, SiInstagram, SiFacebook, SiYoutube, SiWhatsapp, SiX, SiPinterest, SiThreads, SiReddit, SiTelegram, SiDiscord, SiBluesky, SiGoogle } from "@icons-pack/react-simple-icons";
import LinkedinIcon from "../components/icons/LinkedinIcon";
import { useApp } from "../context/AppContext";
import { zernioApi, aiApi, storageApi, type CreatePostBody, type StorageInfo } from "../services/api";

const PLATFORM_META: Record<string, { name: string; Icon: React.FC<{ size?: number; color?: string }>; bg: string }> = {
    instagram:      { name: "Instagram",       Icon: SiInstagram, bg: "bg-gradient-to-br from-pink-500 to-purple-600" },
    facebook:       { name: "Facebook",        Icon: SiFacebook,  bg: "bg-blue-600" },
    tiktok:         { name: "TikTok",          Icon: SiTiktok,    bg: "bg-slate-900" },
    youtube:        { name: "YouTube",         Icon: SiYoutube,   bg: "bg-red-600" },
    linkedin:       { name: "LinkedIn",        Icon: LinkedinIcon, bg: "bg-blue-700" },
    twitter:        { name: "X (Twitter)",     Icon: SiX,         bg: "bg-black" },
    threads:        { name: "Threads",         Icon: SiThreads,   bg: "bg-black" },
    pinterest:      { name: "Pinterest",       Icon: SiPinterest, bg: "bg-red-600" },
    reddit:         { name: "Reddit",          Icon: SiReddit,    bg: "bg-orange-600" },
    telegram:       { name: "Telegram",        Icon: SiTelegram,  bg: "bg-sky-500" },
    discord:        { name: "Discord",         Icon: SiDiscord,   bg: "bg-indigo-600" },
    bluesky:        { name: "Bluesky",         Icon: SiBluesky,   bg: "bg-sky-500" },
    whatsapp:       { name: "WhatsApp",        Icon: SiWhatsapp,  bg: "bg-green-600" },
    googlebusiness: { name: "Google Business", Icon: SiGoogle,    bg: "bg-blue-500" },
};

const TONES = [
    { value: "casual",       label: "Casual" },
    { value: "professional", label: "Professional" },
    { value: "funny",        label: "Funny 😄" },
    { value: "inspiring",    label: "Inspiring ✨" },
    { value: "educational",  label: "Educational 📚" },
];

const IMAGE_STYLES = [
    { value: "vivid",   label: "Vivid",   desc: "Hyper-real & dramatic" },
    { value: "natural", label: "Natural", desc: "Photorealistic & subtle" },
];

type PublishMode = "now" | "scheduled" | "draft";
type UploadState = "idle" | "uploading" | "done" | "error";
type AITab = "content" | "image";

export default function Compose() {
    const { accounts } = useApp();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── Compose state ──────────────────────────────────────────────────────────
    const [content, setContent] = useState("");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [mode, setMode] = useState<PublishMode>("now");
    const [scheduledFor, setScheduledFor] = useState("");
    const [hashtagInput, setHashtagInput] = useState("");
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string>("");
    const [mediaPublicUrl, setMediaPublicUrl] = useState<string>("");
    const [uploadState, setUploadState] = useState<UploadState>("idle");
    const [uploadError, setUploadError] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [storage, setStorage] = useState<StorageInfo | null>(null);

    useEffect(() => {
        storageApi.get().then(setStorage).catch(() => {});
    }, []);

    // ── AI panel state ─────────────────────────────────────────────────────────
    const [showAI, setShowAI] = useState(false);
    const [aiTab, setAiTab] = useState<AITab>("content");
    const [aiTopic, setAiTopic] = useState("");
    const [aiPlatform, setAiPlatform] = useState("instagram");
    const [aiTone, setAiTone] = useState("casual");
    const [aiHashtags, setAiHashtags] = useState(true);
    const [aiImagePrompt, setAiImagePrompt] = useState("");
    const [aiImageStyle, setAiImageStyle] = useState<"vivid" | "natural">("vivid");
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState("");

    const knownAccounts = useMemo(
        () => accounts.filter((a) => a.platform in PLATFORM_META),
        [accounts]
    );

    function toggle(id: string) {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }

    // ── AI handlers ────────────────────────────────────────────────────────────
    async function handleGenerateContent() {
        if (!aiTopic.trim()) { setAiError("Enter a topic first."); return; }
        setAiError("");
        setAiLoading(true);
        try {
            const { content: generated } = await aiApi.content(aiTopic, aiPlatform, aiTone, aiHashtags);
            setContent(generated);
            setShowAI(false);
        } catch (err) {
            setAiError(err instanceof Error ? err.message : "Failed to generate content.");
        } finally {
            setAiLoading(false);
        }
    }

    async function handleGenerateImage() {
        if (!aiImagePrompt.trim()) { setAiError("Describe the image first."); return; }
        setAiError("");
        setAiLoading(true);
        try {
            const { publicUrl } = await aiApi.image(aiImagePrompt, aiImageStyle);
            // Drop into media slot (no File object since it's already on CDN)
            setMediaFile(null);
            setMediaPreview(publicUrl);
            setMediaPublicUrl(publicUrl);
            setUploadState("done");
            setShowAI(false);
        } catch (err) {
            setAiError(err instanceof Error ? err.message : "Failed to generate image.");
        } finally {
            setAiLoading(false);
        }
    }

    // ── File upload ────────────────────────────────────────────────────────────
    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setMediaFile(file);
        setMediaPublicUrl("");
        setUploadState("uploading");
        setUploadError("");
        if (file.type.startsWith("image/")) setMediaPreview(URL.createObjectURL(file));
        else setMediaPreview("");

        try {
            const { uploadUrl, publicUrl } = await zernioApi.media.presign(file.name, file.type, file.size);
            const uploadRes = await fetch(uploadUrl, {
                method: "PUT",
                headers: { "Content-Type": file.type },
                body: file,
            });
            if (!uploadRes.ok) throw new Error(`Upload failed (${uploadRes.status})`);
            setMediaPublicUrl(publicUrl);
            setUploadState("done");
            // Refresh storage usage after successful upload
            storageApi.get().then(setStorage).catch(() => {});
        } catch (err) {
            setUploadState("error");
            const msg = err instanceof Error ? err.message : "Upload failed";
            setUploadError(msg.includes("Storage limit") ? "Storage limit reached — upgrade for more space." : msg);
        }
    }

    function removeMedia() {
        setMediaFile(null);
        setMediaPreview("");
        setMediaPublicUrl("");
        setUploadState("idle");
        setUploadError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    // ── Submit ─────────────────────────────────────────────────────────────────
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(""); setSuccess("");
        if (!content.trim()) { setError("Please write some content."); return; }

        const platforms = knownAccounts
            .filter((a) => selectedIds.has(a._id))
            .map((a) => ({ platform: a.platform, accountId: a._id }));

        if (platforms.length === 0) { setError("Select at least one platform."); return; }
        if (mode === "scheduled" && !scheduledFor) { setError("Pick a date and time to schedule."); return; }
        if (mediaFile && uploadState !== "done") {
            setError(uploadState === "uploading" ? "Please wait for the upload to finish." : "Media upload failed — remove it or try again.");
            return;
        }

        const hashtags = hashtagInput.split(/[\s,]+/).map((t) => t.replace(/^#/, "")).filter(Boolean);

        const body: CreatePostBody = {
            content: content.trim(),
            platforms,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            ...(mode === "now"       && { publishNow: true }),
            ...(mode === "scheduled" && { scheduledFor: new Date(scheduledFor).toISOString() }),
            ...(mode === "draft"     && { isDraft: true }),
            ...(hashtags.length > 0  && { hashtags }),
            ...(mediaPublicUrl       && { mediaItems: [{ type: mediaFile?.type.startsWith("video/") ? "video" : "image", url: mediaPublicUrl }] }),
        };

        setLoading(true);
        try {
            await zernioApi.posts.create(body);
            setSuccess(mode === "now" ? "Post published!" : mode === "draft" ? "Draft saved!" : "Post scheduled!");
            setTimeout(() => navigate("/posts"), 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create post.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Compose Post</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Create and schedule content across your platforms</p>
                </div>
                <button
                    type="button"
                    onClick={() => { setShowAI((v) => !v); setAiError(""); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all shrink-0 ${
                        showAI
                            ? "bg-violet-600 text-white border-violet-600 shadow-md"
                            : "bg-white text-violet-600 border-violet-200 hover:border-violet-400 hover:bg-violet-50"
                    }`}>
                    <Sparkles className="size-4" />
                    AI Assistant
                    <ChevronDown className={`size-3.5 transition-transform ${showAI ? "rotate-180" : ""}`} />
                </button>
            </div>

            {/* ── AI Panel ───────────────────────────────────────────────────── */}
            {showAI && (
                <div className="mb-4 bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="size-4 text-violet-600" />
                        <span className="text-sm font-semibold text-violet-700">AI Generator</span>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-4">
                        {(["content", "image"] as AITab[]).map((tab) => (
                            <button key={tab} type="button" onClick={() => { setAiTab(tab); setAiError(""); }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    aiTab === tab
                                        ? "bg-black text-[#AAFF00] shadow-sm"
                                        : "bg-white text-gray-600 border border-gray-200 hover:border-violet-300"
                                }`}>
                                {tab === "content" ? <Wand2 className="size-3.5" /> : <ImageIcon className="size-3.5" />}
                                {tab === "content" ? "Write Content" : "Generate Image"}
                            </button>
                        ))}
                    </div>

                    {aiTab === "content" ? (
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={aiTopic}
                                onChange={(e) => setAiTopic(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleGenerateContent()}
                                placeholder="What is the post about? e.g. 'our new product launch'"
                                className="w-full text-sm bg-white border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Platform</label>
                                    <select
                                        value={aiPlatform}
                                        onChange={(e) => setAiPlatform(e.target.value)}
                                        className="w-full text-sm bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-violet-400">
                                        {Object.entries(PLATFORM_META).map(([key, m]) => (
                                            <option key={key} value={key}>{m.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Tone</label>
                                    <select
                                        value={aiTone}
                                        onChange={(e) => setAiTone(e.target.value)}
                                        className="w-full text-sm bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-violet-400">
                                        {TONES.map((t) => (
                                            <option key={t.value} value={t.value}>{t.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={aiHashtags}
                                    onChange={(e) => setAiHashtags(e.target.checked)}
                                    className="rounded accent-violet-600"
                                />
                                Include hashtags
                            </label>
                            {aiError && <p className="text-xs text-red-600">{aiError}</p>}
                            <button
                                type="button"
                                onClick={handleGenerateContent}
                                disabled={aiLoading}
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-black hover:bg-neutral-800 text-[#AAFF00] rounded-xl text-sm font-medium transition-colors disabled:opacity-60">
                                {aiLoading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
                                {aiLoading ? "Generating…" : "Generate Content"}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <textarea
                                value={aiImagePrompt}
                                onChange={(e) => setAiImagePrompt(e.target.value)}
                                rows={3}
                                placeholder="Describe the image… e.g. 'A vibrant flat-lay of coffee and a laptop on a wooden desk, morning light'"
                                className="w-full text-sm bg-white border border-gray-200 rounded-xl px-3 py-2.5 resize-none outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                            />
                            <div>
                                <label className="block text-xs text-gray-500 mb-2">Style</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {IMAGE_STYLES.map((s) => (
                                        <button key={s.value} type="button"
                                            onClick={() => setAiImageStyle(s.value as "vivid" | "natural")}
                                            className={`p-3 rounded-xl border text-left transition-all ${
                                                aiImageStyle === s.value
                                                    ? "border-violet-400 bg-violet-50"
                                                    : "border-gray-200 bg-white hover:border-violet-300"
                                            }`}>
                                            <p className="text-xs font-medium text-gray-700">{s.label}</p>
                                            <p className="text-xs text-gray-400">{s.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {aiError && <p className="text-xs text-red-600">{aiError}</p>}
                            <button
                                type="button"
                                onClick={handleGenerateImage}
                                disabled={aiLoading}
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-black hover:bg-neutral-800 text-[#AAFF00] rounded-xl text-sm font-medium transition-colors disabled:opacity-60">
                                {aiLoading ? <Loader2 className="size-4 animate-spin" /> : <ImageIcon className="size-4" />}
                                {aiLoading ? "Generating image… (up to 30s)" : "Generate Image"}
                            </button>
                            <p className="text-xs text-gray-400 text-center">Powered by DALL-E 2 · ~$0.02 per image</p>
                        </div>
                    )}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Content */}
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <textarea
                        value={content} onChange={(e) => setContent(e.target.value)}
                        rows={6} placeholder="What do you want to share?"
                        className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl p-3 resize-none outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
                    />
                    <div className="flex items-center justify-between mt-2 gap-4">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Hash className="size-3.5 text-gray-400 shrink-0" />
                            <input
                                type="text" value={hashtagInput} onChange={(e) => setHashtagInput(e.target.value)}
                                placeholder="hashtags separated by space or comma"
                                className="text-xs text-gray-600 bg-transparent outline-none w-full placeholder-slate-400"
                            />
                        </div>
                        <span className={`text-xs shrink-0 ${content.length > 2200 ? "text-red-500" : "text-gray-400"}`}>
                            {content.length} chars
                        </span>
                    </div>
                </div>

                {/* Media Upload */}
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <ImagePlus className="size-4 text-gray-400" /> Media <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        {storage && <StorageBar storage={storage} />}
                    </div>

                    {uploadState === "idle" ? (
                        <button type="button" onClick={() => fileInputRef.current?.click()}
                            className="w-full border-2 border-dashed border-gray-200 rounded-xl py-8 flex flex-col items-center gap-2 text-gray-400 hover:border-red-300 hover:text-red-400 transition-colors">
                            <ImagePlus className="size-6" />
                            <span className="text-sm">Click to upload image or video</span>
                            <span className="text-xs">JPG, PNG, GIF, MP4 up to 5GB</span>
                        </button>
                    ) : (
                        <div className="relative">
                            {mediaPreview && (
                                <img src={mediaPreview} alt="preview"
                                    className="w-full max-h-48 object-cover rounded-xl mb-2" />
                            )}
                            <div className={`flex items-center gap-3 p-3 rounded-xl border ${
                                uploadState === "done"     ? "bg-green-50 border-green-200" :
                                uploadState === "error"    ? "bg-red-50 border-red-200" :
                                "bg-gray-50 border-gray-200"}`}>
                                {uploadState === "uploading" && <Loader2 className="size-4 text-gray-400 animate-spin shrink-0" />}
                                {uploadState === "done"      && <CheckCircle2 className="size-4 text-green-600 shrink-0" />}
                                {uploadState === "error"     && <X className="size-4 text-red-500 shrink-0" />}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-700 truncate">
                                        {mediaFile ? mediaFile.name : "AI-generated image"}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {uploadState === "uploading" ? "Uploading…" :
                                         uploadState === "done"      ? "Ready ✓" :
                                         uploadError}
                                    </p>
                                </div>
                                <button type="button" onClick={removeMedia}
                                    className="p-1 rounded-full hover:bg-gray-200 text-gray-400 shrink-0">
                                    <X className="size-3.5" />
                                </button>
                            </div>
                        </div>
                    )}

                    <input ref={fileInputRef} type="file" accept="image/*,video/*"
                        onChange={handleFileChange} className="hidden" />
                </div>

                {/* Platform selector */}
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <p className="text-sm font-medium text-gray-700 mb-3">Publish to</p>
                    {knownAccounts.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            No accounts connected.{" "}
                            <a href="/accounts" className="text-red-500 hover:underline">Connect one first →</a>
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            {knownAccounts.map((account) => {
                                const meta = PLATFORM_META[account.platform];
                                if (!meta) return null;
                                const selected = selectedIds.has(account._id);
                                return (
                                    <button key={account._id} type="button" onClick={() => toggle(account._id)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${selected
                                            ? "border-red-400 bg-red-50"
                                            : "border-gray-200 hover:border-gray-300 bg-white"}`}>
                                        <div className={`size-8 rounded-lg ${meta.bg} flex items-center justify-center shrink-0`}>
                                            <meta.Icon size={16} color="white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-gray-700">{meta.name}</p>
                                            <p className="text-xs text-gray-400 truncate">@{account.username || account.displayName}</p>
                                        </div>
                                        {selected && (
                                            <div className="size-4 rounded-full bg-red-500 shrink-0 flex items-center justify-center">
                                                <X className="size-2.5 text-white" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Schedule */}
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <p className="text-sm font-medium text-gray-700 mb-3">When to publish</p>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        {(["now", "scheduled", "draft"] as PublishMode[]).map((m) => (
                            <button key={m} type="button" onClick={() => setMode(m)}
                                className={`py-2 text-xs font-medium rounded-xl border transition-all ${mode === m
                                    ? "border-red-400 bg-red-50 text-red-700"
                                    : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                                {m === "now" ? "Post Now" : m === "scheduled" ? "Schedule" : "Save Draft"}
                            </button>
                        ))}
                    </div>
                    {mode === "scheduled" && (
                        <div className="flex items-center gap-2">
                            <Clock className="size-4 text-gray-400 shrink-0" />
                            <input type="datetime-local" value={scheduledFor}
                                onChange={(e) => setScheduledFor(e.target.value)}
                                min={new Date(Date.now() + 5 * 60 * 1000).toISOString().slice(0, 16)}
                                className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-red-300"
                            />
                        </div>
                    )}
                </div>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">{error}</div>
                )}
                {success && (
                    <div className="p-3 bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl">{success}</div>
                )}

                <button type="submit" disabled={loading || uploadState === "uploading"}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-black hover:bg-neutral-800 text-[#AAFF00] rounded-full text-sm font-semibold transition-colors disabled:opacity-60">
                    {mode === "draft"
                        ? <><Save className="size-4" /> Save Draft</>
                        : mode === "scheduled"
                        ? <><Clock className="size-4" /> Schedule Post</>
                        : <><Send className="size-4" /> {loading ? "Publishing…" : "Publish Now"}</>}
                </button>
            </form>
        </div>
    );
}

function fmtBytes(bytes: number): string {
    if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
    if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(0)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
}

function StorageBar({ storage }: { storage: StorageInfo }) {
    const pct     = Math.min((storage.used / storage.total) * 100, 100);
    const warning = pct >= 80;
    const danger  = pct >= 95;

    return (
        <div className="flex items-center gap-2">
            <HardDrive className={`size-3.5 shrink-0 ${danger ? "text-red-500" : warning ? "text-amber-500" : "text-gray-400"}`} />
            <div className="flex flex-col gap-0.5 min-w-[120px]">
                <div className="flex justify-between text-[10px] text-gray-400">
                    <span>{fmtBytes(storage.used)}</span>
                    <span>{fmtBytes(storage.total)}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden w-28">
                    <div
                        className={`h-full rounded-full transition-all ${danger ? "bg-red-500" : warning ? "bg-amber-400" : "bg-[#AAFF00]"}`}
                        style={{ width: `${pct}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

