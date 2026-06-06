import { ArrowUpRight, Wand2, CalendarDays, Share2, BarChart3, Image, Hash, Bell,
  RefreshCw, Layers, ShieldCheck, Upload, Eye, HardDrive, Trash2, CalendarRange, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { SiTiktok, SiInstagram, SiFacebook, SiYoutube, SiWhatsapp, SiX, SiPinterest,
  SiThreads, SiReddit, SiTelegram, SiDiscord, SiBluesky, SiGoogle } from "@icons-pack/react-simple-icons";
import LinkedinIcon from "../components/icons/LinkedinIcon";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const coreFeatures = [
    { icon: Wand2,        title: "AI Content Generation",    desc: "GPT-4o writes platform-native captions, hooks, and CTAs that match your brand voice. Generate a week of content in minutes.",        points: ["Platform-specific tone", "Custom brand voice", "Bulk generation", "Caption + hashtag combo"] },
    { icon: Image,        title: "AI Image Creation",        desc: "Generate scroll-stopping visuals with DALL-E. Describe what you want — get a post-ready image in seconds.",                          points: ["Vivid & natural modes", "1:1, 4:5, 16:9 ratios", "No design skills needed", "Consistent brand aesthetics"] },
    { icon: Share2,       title: "Multi-Platform Publishing", desc: "Write once, publish everywhere. One composer sends your content to TikTok, Instagram, Facebook, LinkedIn, and more simultaneously.", points: ["14 platforms supported", "Per-platform customization", "Unified inbox", "Single composer"] },
    { icon: CalendarDays, title: "Smart Scheduling",         desc: "Schedule posts at the exact right time. Set it and forget it — Postify handles delivery across every timezone.",                     points: ["Timezone aware", "Queue management", "Instant publish", "Draft saving"] },
    { icon: BarChart3,    title: "Advanced Analytics",       desc: "Track what matters. Impressions, engagement, reach and follower growth — all in one dashboard.",                                    points: ["Cross-platform metrics", "Engagement rate", "Best time insights", "Exportable reports"] },
    { icon: Hash,         title: "Hashtag Intelligence",     desc: "Stop guessing hashtags. Our AI finds the optimal mix of trending and niche tags for maximum reach.",                                points: ["Trend-aware suggestions", "Niche + broad mix", "Platform limits", "Performance tracking"] },
];

const newFeatures = [
    {
        icon: Eye,
        title: "Platform Preview",
        badge: "New",
        desc: "See exactly how your post will look on Instagram, X, LinkedIn, TikTok, Facebook and more before it goes live. Includes per-platform character limit meters.",
        points: ["Pixel-accurate mockups", "280 / 2200 char limits", "Hashtag rendering", "Image crop preview"],
    },
    {
        icon: CalendarRange,
        title: "Content Calendar",
        badge: "New",
        desc: "A full monthly calendar view of all your scheduled and published posts. Click any post to instantly reschedule it — no drag-and-drop frustration.",
        points: ["Month / week / day views", "Click-to-reschedule modal", "Platform colour coding", "Agenda view"],
    },
    {
        icon: Upload,
        title: "Bulk CSV Upload",
        badge: "New",
        desc: "Schedule 50 posts at once by uploading a spreadsheet. Map platforms, times, and hashtags in bulk — perfect for agencies and content-heavy weeks.",
        points: ["CSV template download", "Per-row validation", "Progress tracking", "Error reporting"],
    },
    {
        icon: HardDrive,
        title: "Storage Management",
        badge: "New",
        desc: "Every account gets 4 GB of free media storage. Track usage from the dashboard and free space instantly by deleting old posts.",
        points: ["4 GB free per account", "Paid storage add-ons", "Dashboard storage bar", "Auto-reclaim on delete"],
    },
    {
        icon: Trash2,
        title: "Auto-Delete Scheduling",
        badge: "New",
        desc: "Set a post to automatically disappear at a chosen time — ideal for limited-time offers, flash sales, or time-sensitive announcements.",
        points: ["Optional per-post toggle", "Minute-level precision", "Server-side cron execution", "Zero manual effort"],
    },
    {
        icon: Pencil,
        title: "Edit & Delete Posts",
        badge: "New",
        desc: "Changed your mind? Edit any draft or scheduled post in full, or delete published content you no longer want live — with a confirmation modal so nothing is lost by accident.",
        points: ["Full edit in Compose", "Delete any status", "Custom confirm modal", "Storage auto-reclaim"],
    },
];

const reliabilityFeatures = [
    { icon: Bell,      title: "Smart Notifications",  desc: "Never miss a beat. Get notified when posts publish, fail, or when your audience is most active.",                  points: ["Publish confirmations", "Failure alerts", "Activity peaks", "Weekly digest"] },
    { icon: RefreshCw, title: "Auto-Retry & Recovery", desc: "When a post fails due to network or API issues, Postify automatically retries so you never lose scheduled content.", points: ["Automatic retry", "Failure diagnostics", "Manual retry", "Audit trail"] },
    { icon: Layers,    title: "Team Collaboration",    desc: "Invite team members, assign roles, and review content before it goes live. Built for agencies and growing teams.",   points: ["Role-based permissions", "Approval workflow", "Activity log", "Multi-account"] },
];

const platforms = [
    { name: "Instagram",       Icon: SiInstagram, color: "#E1306C", bg: "bg-pink-50",   text: "text-pink-600" },
    { name: "Facebook",        Icon: SiFacebook,  color: "#1877F2", bg: "bg-blue-50",   text: "text-blue-600" },
    { name: "TikTok",          Icon: SiTiktok,    color: "#ffffff", bg: "bg-black",     text: "text-white" },
    { name: "YouTube",         Icon: SiYoutube,   color: "#FF0000", bg: "bg-red-50",    text: "text-red-600" },
    { name: "LinkedIn",        Icon: null,        color: "#0A66C2", bg: "bg-blue-50",   text: "text-blue-700", custom: true },
    { name: "X (Twitter)",     Icon: SiX,         color: "#000000", bg: "bg-gray-100",  text: "text-black" },
    { name: "Threads",         Icon: SiThreads,   color: "#000000", bg: "bg-gray-100",  text: "text-black" },
    { name: "Pinterest",       Icon: SiPinterest, color: "#E60023", bg: "bg-red-50",    text: "text-red-600" },
    { name: "Reddit",          Icon: SiReddit,    color: "#FF4500", bg: "bg-orange-50", text: "text-orange-600" },
    { name: "Telegram",        Icon: SiTelegram,  color: "#2AABEE", bg: "bg-sky-50",    text: "text-sky-600" },
    { name: "Discord",         Icon: SiDiscord,   color: "#5865F2", bg: "bg-indigo-50", text: "text-indigo-600" },
    { name: "Bluesky",         Icon: SiBluesky,   color: "#0285FF", bg: "bg-sky-50",    text: "text-sky-600" },
    { name: "WhatsApp",        Icon: SiWhatsapp,  color: "#25D366", bg: "bg-green-50",  text: "text-green-600" },
    { name: "Google Business", Icon: SiGoogle,    color: "#4285F4", bg: "bg-blue-50",   text: "text-blue-500" },
];

function FeatureCard({ f, dark, accent }: { f: typeof coreFeatures[0]; dark?: boolean; accent?: boolean }) {
    return (
        <div className={`rounded-2xl p-6 hover:shadow-md transition-all h-full flex flex-col ${
            dark   ? "bg-white/[0.04] border border-white/10 hover:border-[#AAFF00]/30" :
            accent ? "bg-neutral-50 border border-black/[0.07]" :
                     "bg-white border border-black/[0.07]"
        }`}>
            <div className={`size-10 rounded-xl flex items-center justify-center mb-4 ${
                dark ? "bg-[#AAFF00]/15" : accent ? "bg-black" : "bg-[#AAFF00]"
            }`}>
                <f.icon className={`size-5 ${dark ? "text-[#AAFF00]" : accent ? "text-[#AAFF00]" : "text-black"}`} />
            </div>
            <h3 className={`font-bold text-base mb-2 ${dark ? "text-white" : "text-black"}`}>{f.title}</h3>
            <p className={`text-sm leading-relaxed mb-4 flex-1 ${dark ? "text-white/40" : "text-black/50"}`}>{f.desc}</p>
            <ul className="space-y-1.5">
                {f.points.map((pt) => (
                    <li key={pt} className={`flex items-center gap-2 text-xs ${dark ? "text-white/35" : "text-black/45"}`}>
                        <ShieldCheck className={`size-3 shrink-0 ${dark ? "text-[#AAFF00]" : accent ? "text-black" : "text-[#AAFF00]"}`} />
                        {pt}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function NewFeatureCard({ f, i }: { f: typeof newFeatures[0]; i: number }) {
    const accents = ["#AAFF00","#AAFF00","#AAFF00","#AAFF00","#AAFF00","#AAFF00"];
    return (
        <div className="bg-white rounded-2xl border border-black/[0.07] p-6 hover:shadow-lg transition-all flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `${accents[i]}20`, transform: "translate(50%,-50%)" }} />
            <div className="flex items-start justify-between mb-4">
                <div className="size-10 rounded-xl bg-black flex items-center justify-center">
                    <f.icon className="size-5 text-[#AAFF00]" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-[#AAFF00] text-black rounded-full">
                    {f.badge}
                </span>
            </div>
            <h3 className="font-bold text-black text-base mb-2">{f.title}</h3>
            <p className="text-sm text-black/50 leading-relaxed mb-4 flex-1">{f.desc}</p>
            <ul className="space-y-1.5">
                {f.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2 text-xs text-black/45">
                        <span className="size-1.5 rounded-full bg-[#AAFF00] shrink-0" />{pt}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function FeaturesPage() {
    const header  = useScrollAnimation();
    const grid1   = useScrollAnimation(0.1);
    const newGrid = useScrollAnimation(0.08);
    const grid2   = useScrollAnimation(0.1);
    const grid3   = useScrollAnimation(0.1);

    return (
        <>
            {/* Hero */}
            <section className="bg-black py-24 px-5 sm:px-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(170,255,0,0.07),transparent_60%)]" />
                <div ref={header.ref as React.RefObject<HTMLDivElement>}
                    className={`max-w-3xl mx-auto text-center relative z-10 sa-fade-up ${header.visible ? "sa-visible" : ""}`}>
                    <div className="inline-flex items-center gap-2 bg-[#AAFF00]/10 border border-[#AAFF00]/20 rounded-full px-4 py-1.5 mb-6">
                        <span className="size-1.5 rounded-full bg-[#AAFF00] animate-pulse" />
                        <span className="text-[#AAFF00] text-xs font-semibold uppercase tracking-widest">6 new features shipped</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-5">
                        Powerful features.<br />
                        <span className="text-[#AAFF00]">Simple to use.</span>
                    </h1>
                    <p className="text-white/50 text-base leading-relaxed mb-8 max-w-xl mx-auto">
                        Everything a modern creator or brand needs to automate, schedule, and grow their social presence — now with platform previews, bulk upload, a content calendar, and more.
                    </p>
                    <Link to="/login" className="inline-flex items-center gap-2 bg-[#AAFF00] text-black font-black text-sm px-8 py-3.5 rounded-full hover:bg-[#c8ff33] transition-all hover:scale-105">
                        Start for free <ArrowUpRight className="size-4" />
                    </Link>
                </div>
            </section>

            {/* Platform strip */}
            <section className="bg-white border-y border-black/[0.06] py-10">
                <div className="max-w-7xl mx-auto px-5 sm:px-8">
                    <p className="text-center text-xs text-black/30 uppercase tracking-widest mb-6">Supported platforms</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {platforms.map((p) => (
                            <div key={p.name} className={`flex items-center gap-2.5 border border-black/10 rounded-full px-5 py-2.5 ${p.bg} hover:shadow-sm transition-all`}>
                                {p.custom
                                    ? <LinkedinIcon size={16} color={p.color} />
                                    : p.Icon && <p.Icon size={16} color={p.color} />}
                                <span className={`text-sm font-semibold ${p.text}`}>{p.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core features — cream */}
            <section className="bg-[#F4F4EE] py-20 px-5 sm:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-black text-black mb-2">AI-powered creation & publishing</h2>
                    <p className="text-sm text-black/40 mb-8">The foundation — write, generate, and distribute across every platform.</p>
                    <div ref={grid1.ref as React.RefObject<HTMLDivElement>}
                        className={`grid grid-cols-1 md:grid-cols-3 gap-5 sa-fade-up ${grid1.visible ? "sa-visible" : ""}`}>
                        {coreFeatures.map((f, i) => (
                            <div key={f.title} className={`sa-delay-${(i % 3 + 1) * 100} ${grid1.visible ? "sa-visible" : ""}`}>
                                <FeatureCard f={f} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* NEW features — black with lime accent */}
            <section className="bg-black py-20 px-5 sm:px-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(170,255,0,0.05),transparent_60%)]" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex items-start justify-between gap-6 mb-2 flex-wrap">
                        <h2 className="text-2xl font-black text-white">What's new in Postify</h2>
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-[#AAFF00] text-black rounded-full self-start">
                            Just shipped
                        </span>
                    </div>
                    <p className="text-sm text-white/30 mb-10">Six new features built around real creator pain points.</p>
                    <div ref={newGrid.ref as React.RefObject<HTMLDivElement>}
                        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sa-fade-up ${newGrid.visible ? "sa-visible" : ""}`}>
                        {newFeatures.map((f, i) => (
                            <div key={f.title} className={`sa-delay-${(i % 3 + 1) * 100} ${newGrid.visible ? "sa-visible" : ""}`}>
                                <NewFeatureCard f={f} i={i} />
                            </div>
                        ))}
                    </div>

                    {/* Feature spotlight strip */}
                    <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden">
                        {[
                            { stat: "14",   label: "Platforms supported",         sub: "From TikTok to Google Business" },
                            { stat: "4 GB", label: "Free storage per account",    sub: "Paid add-ons available anytime" },
                            { stat: "50+",  label: "Posts from one CSV upload",   sub: "Bulk schedule in minutes" },
                        ].map(({ stat, label, sub }) => (
                            <div key={label} className="bg-white/[0.03] px-8 py-8 text-center">
                                <p className="text-4xl font-black text-[#AAFF00] mb-1">{stat}</p>
                                <p className="text-sm font-semibold text-white mb-1">{label}</p>
                                <p className="text-xs text-white/30">{sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Scheduling section — white */}
            <section className="bg-white py-20 px-5 sm:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-black text-black mb-2">Scheduling & distribution</h2>
                    <p className="text-sm text-black/40 mb-8">Put your content on autopilot and reach the right audience at the right time.</p>
                    <div ref={grid2.ref as React.RefObject<HTMLDivElement>}
                        className={`grid grid-cols-1 md:grid-cols-3 gap-5 sa-fade-up ${grid2.visible ? "sa-visible" : ""}`}>
                        {[
                            { icon: CalendarRange, title: "Visual Content Calendar", desc: "A monthly calendar showing all your posts colour-coded by platform. Click any scheduled post to reschedule it in seconds.", points: ["Monthly & weekly views", "Click-to-reschedule", "Draft management", "Platform colours"] },
                            { icon: Upload,        title: "Bulk CSV Upload",         desc: "Upload a spreadsheet and schedule dozens of posts at once. Download the template, fill it in, and hit go.", points: ["CSV template included", "Per-row validation", "Multi-platform rows", "Instant feedback"] },
                            { icon: Trash2,        title: "Auto-Delete on Schedule", desc: "Set a post to self-delete at a specific time — perfect for flash sales, limited offers, or time-sensitive content.", points: ["Optional per post", "Server-side cron", "Minute precision", "Frees storage automatically"] },
                        ].map((f, i) => (
                            <div key={f.title} className={`sa-delay-${(i + 1) * 100} ${grid2.visible ? "sa-visible" : ""}`}>
                                <FeatureCard f={f} dark />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Wait — dark section uses dark cards, let me change it to bg-black */}
            {/* Reliability section — cream */}
            <section className="bg-[#F4F4EE] py-20 px-5 sm:px-8 border-t border-black/[0.06]">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-black text-black mb-2">Reliability & teams</h2>
                    <p className="text-sm text-black/40 mb-8">Built to keep running even when things go wrong.</p>
                    <div ref={grid3.ref as React.RefObject<HTMLDivElement>}
                        className={`grid grid-cols-1 md:grid-cols-3 gap-5 sa-fade-up ${grid3.visible ? "sa-visible" : ""}`}>
                        {reliabilityFeatures.map((f, i) => (
                            <div key={f.title} className={`sa-delay-${(i + 1) * 100} ${grid3.visible ? "sa-visible" : ""}`}>
                                <FeatureCard f={f} accent />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="bg-black py-20 px-5 sm:px-8">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to automate your growth?</h2>
                    <p className="text-white/40 text-sm mb-8">Join creators already using Postify. No credit card required.</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link to="/login" className="inline-flex items-center justify-center gap-2 bg-[#AAFF00] text-black font-black text-sm px-8 py-3.5 rounded-full hover:bg-[#c8ff33] transition-all hover:scale-105">
                            Get started free <ArrowUpRight className="size-4" />
                        </Link>
                        <Link to="/pricing" className="inline-flex items-center justify-center gap-2 border border-white/20 text-white/60 text-sm px-8 py-3.5 rounded-full hover:border-white/40 hover:text-white transition-colors">
                            View pricing
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
