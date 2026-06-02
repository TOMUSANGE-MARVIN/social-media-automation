import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

export default function Hero() {
    const headline = useScrollAnimation(0.1);
    const desc     = useScrollAnimation(0.1);
    const ticker   = useScrollAnimation(0.1);

    return (
        <section className="relative bg-black overflow-hidden min-h-[88vh] flex flex-col justify-between">
            {/* Real photo background */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&auto=format&fit=crop&q=80"
                    alt=""
                    className="w-full h-full object-cover object-center opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
            </div>

            {/* Faint grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-20 pb-12 flex-1 flex flex-col justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-end">
                    {/* Headline */}
                    <div ref={headline.ref as React.RefObject<HTMLDivElement>}
                        className={`sa-fade-up ${headline.visible ? "sa-visible" : ""}`}>
                        <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-[88px] font-black text-white leading-[1.0] tracking-tighter">
                            Automate your{" "}
                            <span className="inline-block bg-[#AAFF00] text-black px-4 py-1 rounded-xl -skew-x-1 mx-1">
                                content
                            </span>
                            <br />
                            and social media
                            <br />
                            <span className="inline-block bg-[#AAFF00] text-black px-5 py-1 rounded-xl -skew-x-1 mt-2">
                                growth.
                            </span>
                        </h1>
                    </div>

                    {/* Right: description + CTA */}
                    <div ref={desc.ref as React.RefObject<HTMLDivElement>}
                        className={`lg:max-w-xs flex flex-col gap-6 lg:pb-4 sa-slide-right sa-delay-200 ${desc.visible ? "sa-visible" : ""}`}>
                        <p className="text-white/60 text-sm leading-relaxed">
                            We build AI-powered tools for creators, brands, and agencies to schedule, publish, and grow across TikTok, Instagram, Facebook, and LinkedIn.
                        </p>
                        <div className="flex items-center gap-3">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 bg-[#AAFF00] hover:bg-[#c8ff33] text-black font-bold text-sm px-6 py-3 rounded-full transition-colors shadow-lg shadow-[#AAFF00]/20"
                            >
                                Get started <ArrowUpRight className="size-4" />
                            </Link>
                            <div className="relative size-14 shrink-0">
                                <div className="size-14 rounded-full border-2 border-[#AAFF00]/40 flex items-center justify-center">
                                    <ArrowUpRight className="size-5 text-[#AAFF00]" />
                                </div>
                                <svg className="absolute inset-0 size-14" viewBox="0 0 56 56" style={{ animation: "spin 12s linear infinite" }}>
                                    <circle cx="28" cy="28" r="24" fill="none" stroke="#AAFF00" strokeWidth="1" strokeDasharray="4 6" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ticker bar */}
            <div ref={ticker.ref as React.RefObject<HTMLDivElement>}
                className={`relative z-10 bg-[#AAFF00] overflow-hidden whitespace-nowrap sa-fade-in sa-delay-400 ${ticker.visible ? "sa-visible" : ""}`}>
                <div className="inline-flex animate-[marquee_18s_linear_infinite] py-4">
                    {[
                        "TikTok Automation","Instagram Scheduling","Facebook Publishing","LinkedIn Growth",
                        "AI Content Generation","Smart Scheduling","Multi-Platform","Analytics Dashboard",
                        "TikTok Automation","Instagram Scheduling","Facebook Publishing","LinkedIn Growth",
                        "AI Content Generation","Smart Scheduling","Multi-Platform","Analytics Dashboard",
                    ].map((item, i) => (
                        <span key={i} className="inline-flex items-center gap-3 px-5 text-black font-semibold text-xs uppercase tracking-widest">
                            <span className="size-1.5 rounded-full bg-black/40 shrink-0" />
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
