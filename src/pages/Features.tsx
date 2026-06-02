import { ArrowUpRight, Wand2, CalendarDays, Share2, BarChart3, Image, Hash, Bell, RefreshCw, Layers, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { SiTiktok, SiInstagram, SiFacebook, SiYoutube, SiWhatsapp, SiX } from "@icons-pack/react-simple-icons";
import LinkedinIcon from "../components/icons/LinkedinIcon";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const features = [
    { icon: Wand2,        title: "AI Content Generation",    desc: "GPT-4o writes platform-native captions, hooks, and CTAs that match your brand voice. Generate a week of content in minutes.",        points: ["Platform-specific tone", "Custom brand voice", "Bulk generation", "Caption + hashtag combo"] },
    { icon: Image,        title: "AI Image Creation",        desc: "Generate scroll-stopping visuals with DALL-E. Describe what you want — get a post-ready image in seconds.",                          points: ["Vivid & natural modes", "1:1, 4:5, 16:9 ratios", "No design skills needed", "Consistent brand aesthetics"] },
    { icon: Share2,       title: "Multi-Platform Publishing", desc: "Write once, publish everywhere. One composer sends your content to TikTok, Instagram, Facebook, and LinkedIn simultaneously.",      points: ["7 platforms supported", "Per-platform customization", "Unified inbox", "Single composer"] },
    { icon: CalendarDays, title: "Visual Content Calendar",  desc: "Drag-and-drop scheduling with a clear visual calendar. See your entire content strategy at a glance.",                              points: ["Monthly & weekly views", "Bulk scheduling", "Best-time recommendations", "Timezone support"] },
    { icon: BarChart3,    title: "Advanced Analytics",       desc: "Track what matters. Impressions, engagement, reach and follower growth — all in one dashboard.",                                    points: ["Cross-platform metrics", "Engagement rate", "Best time insights", "Exportable reports"] },
    { icon: Hash,         title: "Hashtag Intelligence",     desc: "Stop guessing hashtags. Our AI finds the optimal mix of trending and niche tags for maximum reach.",                                points: ["Trend-aware suggestions", "Niche + broad mix", "Platform limits", "Performance tracking"] },
    { icon: Bell,         title: "Smart Notifications",      desc: "Never miss a beat. Get notified when posts publish, fail, or when your audience is most active.",                                   points: ["Publish confirmations", "Failure alerts", "Activity peaks", "Weekly digest"] },
    { icon: RefreshCw,    title: "Auto-Retry & Recovery",    desc: "When a post fails due to network or API issues, Postify automatically retries so you never lose scheduled content.",               points: ["Automatic retry", "Failure diagnostics", "Manual retry", "Audit trail"] },
    { icon: Layers,       title: "Team Collaboration",       desc: "Invite team members, assign roles, and review content before it goes live. Built for agencies and growing teams.",                 points: ["Role-based permissions", "Approval workflow", "Activity log", "Multi-account"] },
];

const platforms = [
    { name: "TikTok",    Icon: SiTiktok,    color: "#000000", bg: "bg-black",       text: "text-white" },
    { name: "Instagram", Icon: SiInstagram, color: "#E1306C", bg: "bg-pink-50",     text: "text-pink-600" },
    { name: "Facebook",  Icon: SiFacebook,  color: "#1877F2", bg: "bg-blue-50",     text: "text-blue-600" },
    { name: "LinkedIn",  Icon: null,        color: "#0A66C2", bg: "bg-blue-50",     text: "text-blue-700", custom: true },
    { name: "YouTube",   Icon: SiYoutube,   color: "#FF0000", bg: "bg-red-50",      text: "text-red-600" },
    { name: "X",         Icon: SiX,         color: "#000000", bg: "bg-gray-100",    text: "text-black" },
    { name: "WhatsApp",  Icon: SiWhatsapp,  color: "#25D366", bg: "bg-green-50",    text: "text-green-600" },
];

export default function FeaturesPage() {
    const header   = useScrollAnimation();
    const grid1    = useScrollAnimation(0.1);
    const grid2    = useScrollAnimation(0.1);
    const grid3    = useScrollAnimation(0.1);

    return (
        <>
            {/* Hero — black */}
            <section className="bg-black py-24 px-5 sm:px-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(170,255,0,0.07),transparent_60%)]" />
                <div ref={header.ref as React.RefObject<HTMLDivElement>}
                    className={`max-w-3xl mx-auto text-center relative z-10 sa-fade-up ${header.visible ? "sa-visible" : ""}`}>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-5">
                        Powerful features.<br />
                        <span className="text-[#AAFF00]">Simple to use.</span>
                    </h1>
                    <p className="text-white/50 text-base leading-relaxed mb-8 max-w-xl mx-auto">
                        Everything a modern creator or brand needs to automate, schedule, and grow their social presence across every platform.
                    </p>
                    <Link to="/login" className="inline-flex items-center gap-2 bg-[#AAFF00] text-black font-black text-sm px-8 py-3.5 rounded-full hover:bg-[#c8ff33] transition-all hover:scale-105">
                        Start for free <ArrowUpRight className="size-4" />
                    </Link>
                </div>
            </section>

            {/* Platform strip — white */}
            <section className="bg-white border-y border-black/[0.06] py-10">
                <div className="max-w-7xl mx-auto px-5 sm:px-8">
                    <p className="text-center text-xs text-black/30 uppercase tracking-widest mb-6">Supported platforms</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {platforms.map((p) => (
                            <div key={p.name} className={`flex items-center gap-2.5 border border-black/10 rounded-full px-5 py-2.5 ${p.bg} hover:shadow-sm transition-all`}>
                                {p.custom
                                    ? <LinkedinIcon size={16} color={p.color} />
                                    : p.Icon && <p.Icon size={16} color={p.color} />
                                }
                                <span className={`text-sm font-semibold ${p.text}`}>{p.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* First 3 features — cream */}
            <section className="bg-[#F4F4EE] py-20 px-5 sm:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-black text-black mb-8">AI-powered creation</h2>
                    <div ref={grid1.ref as React.RefObject<HTMLDivElement>}
                        className={`grid grid-cols-1 md:grid-cols-3 gap-5 sa-fade-up ${grid1.visible ? "sa-visible" : ""}`}>
                        {features.slice(0, 3).map((f, i) => (
                            <div key={f.title} className={`bg-white border border-black/[0.07] rounded-2xl p-6 hover:shadow-md transition-all sa-delay-${(i + 1) * 100} ${grid1.visible ? "sa-visible" : ""}`}>
                                <div className="size-10 rounded-xl bg-[#AAFF00] flex items-center justify-center mb-4">
                                    <f.icon className="size-5 text-black" />
                                </div>
                                <h3 className="font-bold text-black text-base mb-2">{f.title}</h3>
                                <p className="text-sm text-black/50 leading-relaxed mb-4">{f.desc}</p>
                                <ul className="space-y-1.5">
                                    {f.points.map((pt) => (
                                        <li key={pt} className="flex items-center gap-2 text-xs text-black/45">
                                            <ShieldCheck className="size-3 text-[#AAFF00] shrink-0" />{pt}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Next 3 features — black */}
            <section className="bg-black py-20 px-5 sm:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-black text-white mb-8">Scheduling & distribution</h2>
                    <div ref={grid2.ref as React.RefObject<HTMLDivElement>}
                        className={`grid grid-cols-1 md:grid-cols-3 gap-5 sa-fade-up ${grid2.visible ? "sa-visible" : ""}`}>
                        {features.slice(3, 6).map((f, i) => (
                            <div key={f.title} className={`bg-white/[0.04] border border-white/10 rounded-2xl p-6 hover:border-[#AAFF00]/30 transition-all sa-delay-${(i + 1) * 100} ${grid2.visible ? "sa-visible" : ""}`}>
                                <div className="size-10 rounded-xl bg-[#AAFF00]/15 flex items-center justify-center mb-4">
                                    <f.icon className="size-5 text-[#AAFF00]" />
                                </div>
                                <h3 className="font-bold text-white text-base mb-2">{f.title}</h3>
                                <p className="text-sm text-white/40 leading-relaxed mb-4">{f.desc}</p>
                                <ul className="space-y-1.5">
                                    {f.points.map((pt) => (
                                        <li key={pt} className="flex items-center gap-2 text-xs text-white/35">
                                            <ShieldCheck className="size-3 text-[#AAFF00] shrink-0" />{pt}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Last 3 features — white */}
            <section className="bg-white py-20 px-5 sm:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-black text-black mb-8">Reliability & teams</h2>
                    <div ref={grid3.ref as React.RefObject<HTMLDivElement>}
                        className={`grid grid-cols-1 md:grid-cols-3 gap-5 sa-fade-up ${grid3.visible ? "sa-visible" : ""}`}>
                        {features.slice(6, 9).map((f, i) => (
                            <div key={f.title} className={`bg-neutral-50 border border-black/[0.07] rounded-2xl p-6 hover:shadow-md transition-all sa-delay-${(i + 1) * 100} ${grid3.visible ? "sa-visible" : ""}`}>
                                <div className="size-10 rounded-xl bg-black flex items-center justify-center mb-4">
                                    <f.icon className="size-5 text-[#AAFF00]" />
                                </div>
                                <h3 className="font-bold text-black text-base mb-2">{f.title}</h3>
                                <p className="text-sm text-black/50 leading-relaxed mb-4">{f.desc}</p>
                                <ul className="space-y-1.5">
                                    {f.points.map((pt) => (
                                        <li key={pt} className="flex items-center gap-2 text-xs text-black/45">
                                            <ShieldCheck className="size-3 text-black shrink-0" />{pt}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA — cream */}
            <section className="bg-[#F4F4EE] py-20 px-5 sm:px-8 border-t border-black/[0.06]">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-black text-black mb-4">Ready to automate your growth?</h2>
                    <p className="text-black/50 text-sm mb-8">Join 12,000+ creators already using Postify. No credit card required.</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link to="/login" className="inline-flex items-center justify-center gap-2 bg-black text-white font-black text-sm px-8 py-3.5 rounded-full hover:bg-neutral-800 transition-colors">
                            Get started free <ArrowUpRight className="size-4" />
                        </Link>
                        <Link to="/pricing" className="inline-flex items-center justify-center gap-2 border border-black/20 text-black/60 text-sm px-8 py-3.5 rounded-full hover:border-black/40 hover:text-black transition-colors">
                            View pricing
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
