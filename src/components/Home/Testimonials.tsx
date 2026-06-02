import { Star } from "lucide-react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const testimonials = [
    { name: "Sarah K.",  role: "Marketing Manager",        avatar: "S", text: "Postify saved our team 10+ hours a week. The AI writes content that sounds exactly like us." },
    { name: "Marcus L.", role: "Creator · 280K followers", avatar: "M", text: "I queue up a full week of content in 20 minutes. Game-changing for solo creators." },
    { name: "Priya D.",  role: "Startup Founder",          avatar: "P", text: "Publishing to all 4 platforms at once completely changed our content strategy." },
    { name: "Jake R.",   role: "Social Media Agency",      avatar: "J", text: "Managing 12 client accounts without losing my mind. The multi-platform dashboard is a lifesaver." },
    { name: "Aiko T.",   role: "E-commerce Brand",         avatar: "A", text: "Our TikTok and Instagram both grew 40% after we started posting consistently with Postify." },
    { name: "Leo M.",    role: "Podcast Host",              avatar: "L", text: "AI writes different captions per platform. LinkedIn-professional, TikTok-casual. It just gets it." },
];

export default function Testimonials() {
    const banner = useScrollAnimation(0.2);
    const cards  = useScrollAnimation(0.1);

    return (
        <>
            {/* Full-bleed photo banner */}
            <div ref={banner.ref as React.RefObject<HTMLDivElement>}
                className={`relative h-64 overflow-hidden sa-scale ${banner.visible ? "sa-visible" : ""}`}>
                <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&auto=format&fit=crop&q=80" alt="creators" className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-[#AAFF00] text-xs font-black uppercase tracking-widest mb-2">Loved by 12,000+ users</p>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">Real results. Real people.</h2>
                    </div>
                </div>
            </div>

            {/* Testimonial cards */}
            <section className="bg-black py-16">
                <div className="max-w-7xl mx-auto px-5 sm:px-8">
                    <div ref={cards.ref as React.RefObject<HTMLDivElement>}
                        className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                        {testimonials.map((t, i) => (
                            <div key={i}
                                className={`break-inside-avoid bg-neutral-950 border border-white/[0.06] rounded-2xl p-6 hover:border-[#AAFF00]/30 transition-all sa-fade-up sa-delay-${Math.min((i % 3) * 100 + 100, 400)} ${cards.visible ? "sa-visible" : ""}`}>
                                <div className="flex gap-0.5 mb-4">
                                    {[...Array(5)].map((_, j) => <Star key={j} className="size-3.5 text-[#AAFF00] fill-[#AAFF00]" />)}
                                </div>
                                <p className="text-white/50 text-sm leading-relaxed mb-5">"{t.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded-full bg-[#AAFF00] flex items-center justify-center text-black text-sm font-black shrink-0">{t.avatar}</div>
                                    <div>
                                        <div className="text-sm font-bold text-white">{t.name}</div>
                                        <div className="text-xs text-white/30">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
