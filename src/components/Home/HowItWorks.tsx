import { Link } from "react-router-dom";
import { ArrowUpRight, Wand2, CalendarDays, Share2, BarChart3 } from "lucide-react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import PipelineFlow from "./PipelineFlow";

const services = [
    { icon: Wand2,        title: "AI Content Generation",    items: ["Caption writing","Image creation","Hashtag suggestions"], highlight: false },
    { icon: Share2,       title: "Multi-Platform Publishing", items: ["TikTok","Instagram","Facebook","LinkedIn"],               highlight: true  },
    { icon: CalendarDays, title: "Smart Scheduling",          items: ["Visual calendar","Bulk queue","Timezone support"],       highlight: false },
    { icon: BarChart3,    title: "Analytics & Insights",      items: ["Impressions","Engagement rate","Best time to post"],    highlight: false },
];

export default function HowItWorks() {
    const left  = useScrollAnimation();
    const right = useScrollAnimation();

    return (
        <section id="how-it-works" className="bg-[#F4F4EE] py-20">
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                {/* Scroll-triggered pipeline SVG */}
                <PipelineFlow />

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 items-start mt-16">
                    {/* Left */}
                    <div ref={left.ref as React.RefObject<HTMLDivElement>}
                        className={`sa-slide-left ${left.visible ? "sa-visible" : ""}`}>
                        <div className="size-5 bg-black mb-6" />
                        <h2 className="text-3xl sm:text-4xl font-black text-black leading-tight mb-4">
                            Explore our unique
                            <br />automation services
                        </h2>
                        <p className="text-sm text-black/50 leading-relaxed mb-6 max-w-xs">
                            Everything you need to go from idea to published post across all your social platforms — powered by AI.
                        </p>
                        <div className="rounded-2xl overflow-hidden mb-6 aspect-[4/3]">
                            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&auto=format&fit=crop&q=80" alt="Team working" className="w-full h-full object-cover" />
                        </div>
                        <Link to="/login" className="inline-flex items-center gap-2 bg-black text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-neutral-800 transition-colors">
                            Get started free <ArrowUpRight className="size-4" />
                        </Link>
                    </div>

                    {/* Right: 2×2 service cards */}
                    <div ref={right.ref as React.RefObject<HTMLDivElement>}
                        className={`grid grid-cols-1 sm:grid-cols-2 gap-4 relative sa-slide-right sa-delay-100 ${right.visible ? "sa-visible" : ""}`}>
                        <div className="absolute -top-3 -right-3 size-6 bg-[#AAFF00] hidden sm:block" />
                        <div className="absolute -bottom-3 -left-3 size-4 bg-black hidden sm:block" />

                        {services.map((s, i) => (
                            <div key={s.title}
                                className={`rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden sa-fade-up sa-delay-${(i + 1) * 100} ${right.visible ? "sa-visible" : ""} ${
                                    s.highlight ? "bg-black text-white" : "bg-white text-black border border-black/[0.07]"
                                }`}>
                                {s.highlight && <div className="absolute top-4 right-4 size-16 rounded-full bg-[#AAFF00]/10 blur-xl" />}
                                <div className="size-9 rounded-xl bg-[#AAFF00] flex items-center justify-center">
                                    <s.icon className="size-4 text-black" />
                                </div>
                                <div>
                                    <h3 className={`font-bold text-sm mb-2 ${s.highlight ? "text-white" : "text-black"}`}>{s.title}</h3>
                                    <ul className="space-y-1">
                                        {s.items.map((item) => (
                                            <li key={item} className={`text-xs flex items-center gap-2 ${s.highlight ? "text-white/50" : "text-black/40"}`}>
                                                <span className={`size-1 rounded-full shrink-0 ${s.highlight ? "bg-[#AAFF00]" : "bg-black/30"}`} />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
