import { Wand2, CalendarDays, Share2, Eye, Upload, HardDrive } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

export default function Features() {
    const header  = useScrollAnimation();
    const row1    = useScrollAnimation();
    const row2    = useScrollAnimation();
    const row3    = useScrollAnimation();
    const ticker  = useScrollAnimation();

    return (
        <>
            <section id="features" className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-5 sm:px-8">
                    {/* Header */}
                    <div ref={header.ref as React.RefObject<HTMLDivElement>}
                        className={`flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12 sa-fade-up ${header.visible ? "sa-visible" : ""}`}>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black leading-tight max-w-sm">
                            Social media problems
                            <br />and their best solutions
                        </h2>
                        <div className="flex flex-col gap-2 shrink-0 mt-2">
                            <div className="hidden md:block size-6 bg-[#AAFF00]" />
                            <div className="hidden md:block size-3 bg-black" />
                            <Link to="/features"
                                className="text-xs font-semibold text-black/50 hover:text-black underline underline-offset-4 transition-colors">
                                See all features →
                            </Link>
                        </div>
                    </div>

                    {/* Row 1 — original cards */}
                    <div ref={row1.ref as React.RefObject<HTMLDivElement>}
                        className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 sa-fade-up sa-delay-100 ${row1.visible ? "sa-visible" : ""}`}>
                        <div className="rounded-2xl overflow-hidden relative min-h-[240px]">
                            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&auto=format&fit=crop&q=80" alt="Team" className="w-full h-full object-cover absolute inset-0" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                                <p className="text-white font-bold text-sm">Content overload?</p>
                                <p className="text-white/60 text-xs mt-1">AI handles your creative workflow end-to-end.</p>
                            </div>
                        </div>
                        <div className="rounded-2xl bg-neutral-950 text-white p-7 flex flex-col justify-between min-h-[240px]">
                            <div className="size-10 rounded-xl bg-[#AAFF00] flex items-center justify-center">
                                <Wand2 className="size-5 text-black" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base mb-2">No time to create content?</h3>
                                <p className="text-sm text-white/50 leading-relaxed">GPT-4 writes scroll-stopping captions and DALL-E generates images — tailored to each platform, in seconds.</p>
                            </div>
                        </div>
                        <div className="rounded-2xl overflow-hidden relative min-h-[240px]">
                            <img src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=80" alt="Social" className="w-full h-full object-cover absolute inset-0" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                                <p className="text-white font-bold text-sm">Scattered across 4 apps?</p>
                                <p className="text-white/60 text-xs mt-1">One dashboard. Every platform. Zero tab-switching.</p>
                            </div>
                        </div>
                    </div>

                    {/* Row 2 — original + updated */}
                    <div ref={row2.ref as React.RefObject<HTMLDivElement>}
                        className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 sa-fade-up sa-delay-200 ${row2.visible ? "sa-visible" : ""}`}>
                        <div className="rounded-2xl bg-[#AAFF00] text-black p-7 flex flex-col justify-between min-h-[220px]">
                            <div className="size-10 rounded-xl bg-black flex items-center justify-center">
                                <CalendarDays className="size-5 text-[#AAFF00]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base mb-2">Missing best posting times?</h3>
                                <p className="text-sm text-black/60 leading-relaxed">Smart scheduling picks optimal times per platform. Set it once, posts go out automatically.</p>
                            </div>
                        </div>
                        <div className="rounded-2xl overflow-hidden relative min-h-[220px]">
                            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80" alt="Analytics" className="w-full h-full object-cover absolute inset-0" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                                <p className="text-white font-bold text-sm">No visibility into what works?</p>
                                <p className="text-white/60 text-xs mt-1">Real-time analytics from all platforms in one view.</p>
                            </div>
                        </div>
                        <div className="rounded-2xl bg-neutral-100 text-black p-7 flex flex-col justify-between min-h-[220px]">
                            <div className="size-10 rounded-xl bg-black flex items-center justify-center">
                                <Share2 className="size-5 text-[#AAFF00]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base mb-2">Managing 4 platforms separately?</h3>
                                <p className="text-sm text-black/50 leading-relaxed">Compose once, publish to TikTok, Instagram, Facebook, and LinkedIn simultaneously.</p>
                            </div>
                        </div>
                    </div>

                    {/* Row 3 — NEW features */}
                    <div ref={row3.ref as React.RefObject<HTMLDivElement>}
                        className={`grid grid-cols-1 md:grid-cols-3 gap-4 sa-fade-up sa-delay-300 ${row3.visible ? "sa-visible" : ""}`}>

                        {/* Platform Preview */}
                        <div className="rounded-2xl bg-black text-white p-7 flex flex-col justify-between min-h-[220px] relative overflow-hidden">
                            <div className="absolute top-0 right-0 size-32 rounded-full bg-[#AAFF00]/10 blur-2xl -translate-y-1/2 translate-x-1/2" />
                            <div className="flex items-start justify-between">
                                <div className="size-10 rounded-xl bg-[#AAFF00]/15 flex items-center justify-center">
                                    <Eye className="size-5 text-[#AAFF00]" />
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest bg-[#AAFF00] text-black px-2 py-0.5 rounded-full">New</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-base mb-2">Unsure how it'll look?</h3>
                                <p className="text-sm text-white/50 leading-relaxed">Platform Preview shows pixel-accurate mockups for Instagram, X, LinkedIn, TikTok and more — before you publish.</p>
                            </div>
                        </div>

                        {/* Bulk Upload */}
                        <div className="rounded-2xl bg-[#F4F4EE] text-black p-7 flex flex-col justify-between min-h-[220px] relative overflow-hidden">
                            <div className="flex items-start justify-between">
                                <div className="size-10 rounded-xl bg-black flex items-center justify-center">
                                    <Upload className="size-5 text-[#AAFF00]" />
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest bg-black text-[#AAFF00] px-2 py-0.5 rounded-full">New</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-base mb-2">Scheduling 50 posts one by one?</h3>
                                <p className="text-sm text-black/55 leading-relaxed">Upload a CSV and schedule an entire week of content in one click. Download the template and go.</p>
                            </div>
                        </div>

                        {/* Storage + Calendar combined */}
                        <div className="rounded-2xl border border-black/[0.07] p-7 flex flex-col gap-6 min-h-[220px]">
                            <div className="flex items-start gap-4">
                                <div className="size-10 rounded-xl bg-[#AAFF00] flex items-center justify-center shrink-0">
                                    <HardDrive className="size-5 text-black" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-sm text-black">Storage Management</h3>
                                        <span className="text-[9px] font-black uppercase tracking-widest bg-[#AAFF00] text-black px-2 py-0.5 rounded-full">New</span>
                                    </div>
                                    <p className="text-xs text-black/50 leading-relaxed">4 GB free per account. Track usage on the dashboard and free space by deleting old posts.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="size-10 rounded-xl bg-black flex items-center justify-center shrink-0">
                                    <CalendarDays className="size-5 text-[#AAFF00]" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-sm text-black">Content Calendar</h3>
                                        <span className="text-[9px] font-black uppercase tracking-widest bg-black text-[#AAFF00] px-2 py-0.5 rounded-full">New</span>
                                    </div>
                                    <p className="text-xs text-black/50 leading-relaxed">Full monthly calendar view. Click any post to reschedule it instantly.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Divider ticker — updated with new features */}
            <div ref={ticker.ref as React.RefObject<HTMLDivElement>}
                className={`bg-black overflow-hidden whitespace-nowrap border-y border-white/5 py-6 sa-fade-in ${ticker.visible ? "sa-visible" : ""}`}>
                <div className="inline-flex animate-[marquee_28s_linear_infinite] py-1">
                    {[
                        "Schedule Posts","AI Captions","Image Generation","Multi-Platform","Analytics","Auto Publish",
                        "Platform Preview","Bulk CSV Upload","Content Calendar","Storage Management","Auto-Delete","Edit Posts",
                        "TikTok","Instagram","Facebook","LinkedIn","Bluesky","Discord",
                        "Schedule Posts","AI Captions","Image Generation","Multi-Platform","Analytics","Auto Publish",
                        "Platform Preview","Bulk CSV Upload","Content Calendar","Storage Management","Auto-Delete","Edit Posts",
                    ].map((item, i) => (
                        <span key={i} className="inline-flex items-center gap-3 px-5 text-white/40 font-semibold text-xs uppercase tracking-widest">
                            <span className="size-1.5 rounded-full bg-[#AAFF00] shrink-0" />
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </>
    );
}
