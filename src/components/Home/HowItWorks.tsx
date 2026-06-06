import { Link } from "react-router-dom";
import { ArrowUpRight, UserPlus, Link2, Wand2, Eye, CalendarDays, BarChart3 } from "lucide-react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import PipelineFlow from "./PipelineFlow";

const steps = [
    {
        num: "01",
        icon: UserPlus,
        title: "Create your free account",
        desc: "Sign up in 30 seconds with your email or Google. No credit card needed — your first 4 GB of storage is free.",
        bg: "bg-white border border-black/[0.08]",
        textColor: "text-black",
        subColor: "text-black/50",
        numColor: "text-black/10",
        iconBg: "bg-[#AAFF00]",
        iconColor: "text-black",
    },
    {
        num: "02",
        icon: Link2,
        title: "Connect your social accounts",
        desc: "Go to Settings → Accounts. Link Instagram, TikTok, LinkedIn, Facebook, Bluesky, and 10+ other platforms in one click.",
        bg: "bg-black",
        textColor: "text-white",
        subColor: "text-white/45",
        numColor: "text-white/10",
        iconBg: "bg-[#AAFF00]",
        iconColor: "text-black",
    },
    {
        num: "03",
        icon: Wand2,
        title: "Compose your content",
        desc: "Open the Compose page. Write your own caption or let AI generate one. Add media or create an image with DALL-E — then pick your platforms.",
        bg: "bg-[#AAFF00]",
        textColor: "text-black",
        subColor: "text-black/55",
        numColor: "text-black/10",
        iconBg: "bg-black",
        iconColor: "text-[#AAFF00]",
    },
    {
        num: "04",
        icon: Eye,
        title: "Preview before publishing",
        desc: "Hit the Preview button to see a pixel-accurate mockup of how your post will look on each connected platform — Instagram, X, TikTok, LinkedIn and more.",
        bg: "bg-neutral-950",
        textColor: "text-white",
        subColor: "text-white/45",
        numColor: "text-white/10",
        iconBg: "bg-[#AAFF00]/15",
        iconColor: "text-[#AAFF00]",
    },
    {
        num: "05",
        icon: CalendarDays,
        title: "Schedule or post immediately",
        desc: "Click Post Now to publish across all platforms at once, or choose a future date and time. Use the Content Calendar to see and manage your entire posting schedule.",
        bg: "bg-white border border-black/[0.08]",
        textColor: "text-black",
        subColor: "text-black/50",
        numColor: "text-black/10",
        iconBg: "bg-black",
        iconColor: "text-[#AAFF00]",
    },
    {
        num: "06",
        icon: BarChart3,
        title: "Track your performance",
        desc: "Head to the Analytics dashboard. See impressions, engagement rates, and which posts resonated most — across every platform in one view.",
        bg: "bg-[#F4F4EE] border border-black/[0.06]",
        textColor: "text-black",
        subColor: "text-black/50",
        numColor: "text-black/10",
        iconBg: "bg-[#AAFF00]",
        iconColor: "text-black",
    },
];

export default function HowItWorks() {
    const header = useScrollAnimation();
    const grid   = useScrollAnimation();
    const cta    = useScrollAnimation();

    return (
        <section id="how-it-works" className="bg-[#F4F4EE] py-20">
            <div className="max-w-7xl mx-auto px-5 sm:px-8">

                {/* Section label + heading */}
                <div ref={header.ref as React.RefObject<HTMLDivElement>}
                    className={`text-center mb-12 sa-fade-up ${header.visible ? "sa-visible" : ""}`}>
                    <span className="inline-block text-[10px] font-black uppercase tracking-widest text-black/40 mb-4">
                        Step-by-step guide
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black leading-tight mb-4">
                        How to use Postify
                    </h2>
                    <p className="text-sm text-black/50 max-w-md mx-auto leading-relaxed">
                        From idea to published post across every social platform — in under two minutes.
                    </p>
                </div>

                {/* Pipeline flow visual */}
                <div className="mb-14">
                    <PipelineFlow />
                </div>

                {/* Steps grid */}
                <div ref={grid.ref as React.RefObject<HTMLDivElement>}
                    className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sa-fade-up sa-delay-100 ${grid.visible ? "sa-visible" : ""}`}>
                    {steps.map((step, i) => (
                        <div
                            key={step.num}
                            className={`rounded-2xl p-7 flex flex-col gap-5 relative overflow-hidden sa-fade-up sa-delay-${(i % 3 + 1) * 100} ${grid.visible ? "sa-visible" : ""} ${step.bg}`}
                        >
                            {/* Large background number */}
                            <span className={`absolute top-4 right-5 text-7xl font-black leading-none select-none pointer-events-none ${step.numColor}`}>
                                {step.num}
                            </span>

                            {/* Icon */}
                            <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${step.iconBg}`}>
                                <step.icon className={`size-5 ${step.iconColor}`} />
                            </div>

                            {/* Text */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-black tracking-widest opacity-40 ${step.textColor}`}>
                                        STEP {step.num}
                                    </span>
                                </div>
                                <h3 className={`font-bold text-base leading-snug ${step.textColor}`}>
                                    {step.title}
                                </h3>
                                <p className={`text-sm leading-relaxed ${step.subColor}`}>
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div ref={cta.ref as React.RefObject<HTMLDivElement>}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 sa-fade-up sa-delay-200 ${cta.visible ? "sa-visible" : ""}`}>
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 bg-black text-white font-bold text-sm px-7 py-3.5 rounded-full hover:bg-neutral-800 transition-colors"
                    >
                        Start for free <ArrowUpRight className="size-4" />
                    </Link>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-black/60 hover:text-black transition-colors underline underline-offset-4"
                    >
                        Already have an account? Sign in
                    </Link>
                </div>
            </div>
        </section>
    );
}
