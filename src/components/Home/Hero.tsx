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

            {/* Animated node network */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 1200 700"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden
            >
                {/* Connection lines */}
                <g stroke="#AAFF00" strokeWidth="0.8" opacity="0.1">
                    <line x1="80"  y1="190" x2="360" y2="120" />
                    <line x1="360" y1="120" x2="630" y2="210" />
                    <line x1="630" y1="210" x2="890" y2="140" />
                    <line x1="890" y1="140" x2="1110" y2="270" />
                    <line x1="80"  y1="190" x2="230" y2="440" />
                    <line x1="630" y1="210" x2="730" y2="460" />
                    <line x1="890" y1="140" x2="840" y2="390" />
                    <line x1="230" y1="440" x2="530" y2="520" />
                    <line x1="530" y1="520" x2="730" y2="460" />
                    <line x1="730" y1="460" x2="1020" y2="530" />
                    <line x1="360" y1="120" x2="230" y2="440" />
                    <line x1="1110" y1="270" x2="1020" y2="530" />
                </g>

                {/* Floating nodes with SMIL animation */}
                <circle cx="80" cy="190" r="3.5" fill="#AAFF00" opacity="0.55">
                    <animateTransform attributeName="transform" type="translate" values="0,0; 4,-9; -2,5; 0,0" dur="7s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1" />
                </circle>
                <circle cx="360" cy="120" r="2.5" fill="#AAFF00" opacity="0.45">
                    <animateTransform attributeName="transform" type="translate" values="0,0; -5,7; 3,-4; 0,0" dur="9s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1" />
                </circle>
                <circle cx="630" cy="210" r="5" fill="#AAFF00" opacity="0.65">
                    <animateTransform attributeName="transform" type="translate" values="0,0; 7,-11; -4,6; 0,0" dur="6s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1" />
                </circle>
                <circle cx="890" cy="140" r="3" fill="#AAFF00" opacity="0.5">
                    <animateTransform attributeName="transform" type="translate" values="0,0; -4,8; 5,-3; 0,0" dur="8.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1" />
                </circle>
                <circle cx="1110" cy="270" r="3" fill="#AAFF00" opacity="0.4">
                    <animateTransform attributeName="transform" type="translate" values="0,0; 5,-6; -5,9; 0,0" dur="10s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1" />
                </circle>
                <circle cx="230" cy="440" r="2.5" fill="#AAFF00" opacity="0.4">
                    <animateTransform attributeName="transform" type="translate" values="0,0; 3,9; -4,-5; 0,0" dur="7.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1" />
                </circle>
                <circle cx="530" cy="520" r="4" fill="#AAFF00" opacity="0.45">
                    <animateTransform attributeName="transform" type="translate" values="0,0; -6,-8; 4,7; 0,0" dur="8s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1" />
                </circle>
                <circle cx="730" cy="460" r="3" fill="#AAFF00" opacity="0.5">
                    <animateTransform attributeName="transform" type="translate" values="0,0; 6,7; -4,-9; 0,0" dur="6.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1" />
                </circle>
                <circle cx="1020" cy="530" r="2.5" fill="#AAFF00" opacity="0.35">
                    <animateTransform attributeName="transform" type="translate" values="0,0; -3,10; 6,-5; 0,0" dur="9.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1" />
                </circle>
                <circle cx="840" cy="390" r="2" fill="#AAFF00" opacity="0.3">
                    <animateTransform attributeName="transform" type="translate" values="0,0; 8,-4; -5,8; 0,0" dur="11s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1" />
                </circle>

                {/* Pulse rings on two key nodes */}
                <circle cx="630" cy="210" r="7" fill="none" stroke="#AAFF00" strokeWidth="1">
                    <animate attributeName="r" values="7;30" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.35;0" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="360" cy="120" r="5" fill="none" stroke="#AAFF00" strokeWidth="1">
                    <animate attributeName="r" values="5;22" dur="3s" begin="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.25;0" dur="3s" begin="1.5s" repeatCount="indefinite" />
                </circle>
            </svg>

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
