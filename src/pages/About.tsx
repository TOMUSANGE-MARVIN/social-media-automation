import { ArrowUpRight, Zap, Heart, Globe, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const values = [
    { icon: Zap,    title: "Speed first",       desc: "We build fast, ship fast, and help our users move fast. Every feature is designed to save time." },
    { icon: Heart,  title: "Creator-centric",   desc: "We're built for the people who create. Every product decision starts with what makes your life easier." },
    { icon: Globe,  title: "Globally minded",   desc: "Social media is global. Postify supports creators and brands across every timezone and language." },
    { icon: Shield, title: "Privacy by design", desc: "We never sell your data. We never train AI on your content. Your accounts, your data." },
];

const milestones = [
    { year: "2023",    event: "Postify founded by two creators tired of juggling 5 different social media tools." },
    { year: "2024 Q1", event: "Launched private beta with 200 creators. Reached 1,000 scheduled posts in the first month." },
    { year: "2024 Q3", event: "Added AI content and image generation. Crossed 5,000 active users." },
    { year: "2025",    event: "Launched public SaaS. Serving 12,000+ creators, marketers, and agencies worldwide." },
];

export default function About() {
    const header     = useScrollAnimation();
    const missionAnim = useScrollAnimation();

    return (
        <>
            {/* Hero — black */}
            <section className="bg-black py-24 px-5 sm:px-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(170,255,0,0.07),transparent_60%)]" />
                <div ref={header.ref as React.RefObject<HTMLDivElement>}
                    className={`max-w-3xl mx-auto text-center relative z-10 sa-fade-up ${header.visible ? "sa-visible" : ""}`}>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-5">
                        Built by creators,<br /><span className="text-[#AAFF00]">for creators.</span>
                    </h1>
                    <p className="text-white/50 text-base leading-relaxed max-w-xl mx-auto">
                        Postify was born out of frustration. We were spending more time on tools than on creating. So we built the tool we always wanted.
                    </p>
                </div>
            </section>

            {/* Mission — white */}
            <section className="bg-white py-16 px-5 sm:px-8">
                <div ref={missionAnim.ref as React.RefObject<HTMLDivElement>}
                    className={`max-w-4xl mx-auto sa-fade-up ${missionAnim.visible ? "sa-visible" : ""}`}>
                    <div className="bg-[#F4F4EE] border border-black/[0.06] rounded-2xl p-10 text-center">
                        <p className="text-xs text-black/30 uppercase tracking-widest mb-4">Our mission</p>
                        <blockquote className="text-2xl sm:text-3xl font-black text-black leading-snug">
                            "To remove every barrier between a great idea and a published post — so creators can focus on creating."
                        </blockquote>
                    </div>
                </div>
            </section>

            {/* Values — cream */}
            <section className="bg-[#F4F4EE] py-16 px-5 sm:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-black text-black text-center mb-10">What we believe in</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {values.map((v, i) => {
                            const anim = useScrollAnimation();
                            return (
                                <div key={v.title}
                                    ref={anim.ref as React.RefObject<HTMLDivElement>}
                                    className={`bg-white border border-black/[0.07] rounded-2xl p-6 hover:shadow-md transition-all sa-fade-up sa-delay-${(i + 1) * 100} ${anim.visible ? "sa-visible" : ""}`}>
                                    <div className="size-10 rounded-xl bg-[#AAFF00] flex items-center justify-center mb-4">
                                        <v.icon className="size-5 text-black" />
                                    </div>
                                    <h3 className="font-bold text-black text-sm mb-2">{v.title}</h3>
                                    <p className="text-sm text-black/50 leading-relaxed">{v.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Timeline — black */}
            <section className="bg-black py-16 px-5 sm:px-8">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-black text-white text-center mb-10">Our journey</h2>
                    <div className="relative pl-6 border-l border-white/10 space-y-8">
                        {milestones.map((m) => (
                            <div key={m.year} className="relative">
                                <div className="absolute -left-[25px] size-4 rounded-full bg-[#AAFF00]/20 border border-[#AAFF00]/50 top-0.5" />
                                <div className="text-xs text-[#AAFF00] font-bold uppercase tracking-widest mb-1">{m.year}</div>
                                <p className="text-sm text-white/50 leading-relaxed">{m.event}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Hiring CTA — white */}
            <section id="careers" className="bg-white py-16 px-5 sm:px-8">
                <div className="max-w-xl mx-auto text-center p-10 bg-[#F4F4EE] border border-black/[0.06] rounded-2xl">
                    <h3 className="font-bold text-black text-xl mb-2">We're hiring</h3>
                    <p className="text-sm text-black/50 mb-6">Love social media and great software? We'd love to hear from you.</p>
                    <Link to="/contact"
                        className="inline-flex items-center gap-2 bg-black text-white font-black text-sm px-6 py-2.5 rounded-full hover:bg-neutral-800 transition-colors">
                        Get in touch <ArrowUpRight className="size-4" />
                    </Link>
                </div>
            </section>
        </>
    );
}
