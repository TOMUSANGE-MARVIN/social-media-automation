import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

export default function CTA() {
    const section = useScrollAnimation(0.2);

    return (
        <section className="bg-black py-24 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-[#AAFF00]/5 blur-3xl" />
                <div className="absolute bottom-0 left-0 size-40 bg-[#AAFF00]/10 blur-2xl" />
                <div className="absolute top-0 right-0 size-40 bg-[#AAFF00]/10 blur-2xl" />
            </div>

            <div ref={section.ref as React.RefObject<HTMLDivElement>}
                className={`relative z-10 max-w-3xl mx-auto px-5 sm:px-8 text-center sa-fade-up ${section.visible ? "sa-visible" : ""}`}>
                <div className="inline-block bg-[#AAFF00] text-black text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
                    Start for free today
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-6">
                    Stop posting manually.<br />
                    <span className="text-[#AAFF00]">Start growing faster.</span>
                </h2>
                <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-10 max-w-xl mx-auto">
                    Join 12,000+ creators and brands using Postify to automate their content across TikTok, Instagram, Facebook, and LinkedIn.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/login"
                        className="inline-flex items-center justify-center gap-2 bg-[#AAFF00] text-black font-black text-sm px-8 py-4 rounded-full hover:bg-[#c8ff33] transition-all hover:scale-105">
                        Create free account <ArrowUpRight className="size-5" />
                    </Link>
                    <Link to="#how-it-works"
                        className="inline-flex items-center justify-center gap-2 border border-white/20 text-white/70 font-bold text-sm px-8 py-4 rounded-full hover:border-white/40 hover:text-white transition-all">
                        See how it works
                    </Link>
                </div>
                <p className="text-white/20 text-xs mt-6">No credit card required · Cancel anytime</p>
            </div>
        </section>
    );
}
