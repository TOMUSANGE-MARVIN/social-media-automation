import { Check, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const plans = [
    { name: "Starter", price: "Free", period: "",    features: ["2 social accounts","10 posts/month","AI content (5 credits)","Basic analytics"],                                          cta: "Get started",   highlight: false },
    { name: "Pro",     price: "$29",  period: "/mo", features: ["Unlimited accounts","Unlimited scheduling","AI content (200 credits)","Advanced analytics","Priority support"],           cta: "Start free trial", highlight: true  },
    { name: "Agency",  price: "$79",  period: "/mo", features: ["Everything in Pro","5 team members","Unlimited AI credits","Custom personas","Dedicated support"],                       cta: "Contact sales", highlight: false },
];

export default function Pricing() {
    const header = useScrollAnimation();
    const cards  = useScrollAnimation(0.1);

    return (
        <section id="pricing" className="bg-[#F4F4EE] py-20">
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                <div ref={header.ref as React.RefObject<HTMLDivElement>}
                    className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 sa-fade-up ${header.visible ? "sa-visible" : ""}`}>
                    <h2 className="text-3xl sm:text-4xl font-black text-black leading-tight">
                        Simple, transparent
                        <br />
                        <span className="relative inline-block">
                            pricing
                            <span className="absolute inset-x-0 -bottom-1 h-2 bg-[#AAFF00] -z-10" />
                        </span>
                    </h2>
                    <p className="text-sm text-black/50 max-w-xs">Start free. Upgrade when you're ready. Cancel anytime.</p>
                </div>

                <div ref={cards.ref as React.RefObject<HTMLDivElement>}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan, i) => (
                        <div key={plan.name}
                            className={`rounded-2xl p-7 flex flex-col gap-6 relative sa-fade-up sa-delay-${(i + 1) * 100} ${cards.visible ? "sa-visible" : ""} ${
                                plan.highlight ? "bg-black text-white" : "bg-white text-black border border-black/[0.08]"
                            }`}>
                            {plan.highlight && <div className="absolute top-5 right-5 size-4 bg-[#AAFF00]" />}
                            <div>
                                <div className={`text-xs font-black uppercase tracking-widest mb-3 ${plan.highlight ? "text-[#AAFF00]" : "text-black/40"}`}>{plan.name}</div>
                                <div className="flex items-end gap-1">
                                    <span className="text-4xl font-black">{plan.price}</span>
                                    <span className={`text-sm mb-1.5 ${plan.highlight ? "text-white/40" : "text-black/30"}`}>{plan.period}</span>
                                </div>
                            </div>
                            <ul className="space-y-2.5 flex-1">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-center gap-2.5 text-sm">
                                        <div className={`size-4 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? "bg-[#AAFF00]" : "bg-black"}`}>
                                            <Check className={`size-2.5 ${plan.highlight ? "text-black" : "text-[#AAFF00]"}`} />
                                        </div>
                                        <span className={plan.highlight ? "text-white/70" : "text-black/60"}>{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link to="/login"
                                className={`inline-flex items-center justify-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-colors ${
                                    plan.highlight ? "bg-[#AAFF00] text-black hover:bg-[#c8ff33]" : "bg-black text-white hover:bg-neutral-800"
                                }`}>
                                {plan.cta} <ArrowUpRight className="size-4" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
