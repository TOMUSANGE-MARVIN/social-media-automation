import { ArrowUpRight, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const plans = [
    {
        name: "Free", price: { monthly: 0, yearly: 0 },
        description: "Try Postify risk-free.",
        highlight: false, badge: null,
        features: ["2 social accounts","10 scheduled posts/month","AI content (5 generations/mo)","Basic analytics (7-day)",null,null,null,null],
    },
    {
        name: "Pro", price: { monthly: 29, yearly: 23 },
        description: "For serious creators and solopreneurs.",
        highlight: true, badge: "Most popular",
        features: ["6 social accounts","Unlimited scheduled posts","AI content (unlimited)","AI image generation (50/mo)","Full analytics (90-day)","Best-time scheduling","Priority support",null],
    },
    {
        name: "Agency", price: { monthly: 79, yearly: 63 },
        description: "For teams and marketing agencies.",
        highlight: false, badge: null,
        features: ["15 social accounts","Unlimited scheduled posts","AI content (unlimited)","AI image generation (unlimited)","Full analytics (365-day)","Best-time scheduling","Priority support","Team collaboration (5 seats)"],
    },
];

const faqs = [
    { q: "Can I change plans anytime?",      a: "Yes. Upgrade or downgrade at any time. Upgrades are charged the prorated difference immediately. Downgrades take effect at next billing cycle." },
    { q: "What counts as a 'social account'?", a: "A social account is one connected profile — e.g. one TikTok account or one Instagram page. A Facebook page and group count as two separate accounts." },
    { q: "Is there a free trial?",            a: "Pro and Agency include a 14-day free trial. No credit card required to start." },
    { q: "What happens if I hit my account limit?", a: "You won't be charged automatically. Postify prompts you to upgrade. Existing accounts and posts continue to work." },
    { q: "Do you offer refunds?",             a: "Yes — if you're not satisfied within 7 days of your first paid charge, we'll refund you in full, no questions asked." },
    { q: "How does AI generation work?",      a: "We use OpenAI GPT-4o for captions and DALL-E for images. You provide a topic or brief and Postify returns ready-to-post content tailored per platform." },
];

export default function PricingPage() {
    const [yearly, setYearly] = useState(false);
    const header = useScrollAnimation();

    return (
        <>
            {/* Hero — cream */}
            <section className="bg-[#F4F4EE] py-24 px-5 sm:px-8">
                <div ref={header.ref as React.RefObject<HTMLDivElement>}
                    className={`max-w-2xl mx-auto text-center sa-fade-up ${header.visible ? "sa-visible" : ""}`}>
                    <h1 className="text-4xl sm:text-5xl font-black text-black leading-tight mb-4">
                        Grow your audience.<br />Not your expenses.
                    </h1>
                    <p className="text-black/50 text-base mb-8">All plans include a 14-day free trial. No credit card required.</p>
                    {/* Toggle */}
                    <div className="inline-flex items-center bg-white border border-black/10 rounded-full p-1 gap-1 shadow-sm">
                        <button onClick={() => setYearly(false)}
                            className={`text-xs font-bold px-5 py-2 rounded-full transition-colors ${!yearly ? "bg-black text-white" : "text-black/40 hover:text-black"}`}>
                            Monthly
                        </button>
                        <button onClick={() => setYearly(true)}
                            className={`text-xs font-bold px-5 py-2 rounded-full transition-colors flex items-center gap-2 ${yearly ? "bg-black text-white" : "text-black/40 hover:text-black"}`}>
                            Yearly
                            <span className="text-[10px] font-black bg-[#AAFF00] text-black px-2 py-0.5 rounded-full">−20%</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Plans — white */}
            <section className="bg-white py-16 px-5 sm:px-8">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
                    {plans.map((plan) => (
                        <div key={plan.name}
                            className={`relative rounded-2xl p-6 border flex flex-col transition-all ${plan.highlight
                                ? "bg-black border-black text-white shadow-xl"
                                : "bg-neutral-50 border-black/[0.08] text-black hover:shadow-md"}`}>
                            {plan.badge && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#AAFF00] text-black text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full">
                                    {plan.badge}
                                </div>
                            )}
                            <div className={`text-sm font-black uppercase tracking-widest mb-2 ${plan.highlight ? "text-white/40" : "text-black/40"}`}>{plan.name}</div>
                            <div className="mb-2">
                                <span className={`text-4xl font-black ${plan.highlight ? "text-white" : "text-black"}`}>
                                    {plan.price.monthly === 0 ? "Free" : `$${yearly ? plan.price.yearly : plan.price.monthly}`}
                                </span>
                                {plan.price.monthly > 0 && (
                                    <span className={`text-sm ml-1 ${plan.highlight ? "text-white/40" : "text-black/30"}`}>/mo</span>
                                )}
                            </div>
                            <p className={`text-sm mb-6 ${plan.highlight ? "text-white/50" : "text-black/50"}`}>{plan.description}</p>
                            <ul className="space-y-2.5 mb-8 flex-1">
                                {plan.features.map((feat, i) => feat ? (
                                    <li key={i} className="flex items-start gap-2.5 text-sm">
                                        <Check className={`size-4 shrink-0 mt-0.5 ${plan.highlight ? "text-[#AAFF00]" : "text-black"}`} />
                                        <span className={plan.highlight ? "text-white/65" : "text-black/60"}>{feat}</span>
                                    </li>
                                ) : (
                                    <li key={i} className="flex items-start gap-2.5 text-sm opacity-25">
                                        <X className="size-4 shrink-0 mt-0.5" />
                                        <span>—</span>
                                    </li>
                                ))}
                            </ul>
                            <Link to="/login"
                                className={`w-full text-center text-sm font-black py-3 rounded-full transition-all hover:scale-105 ${plan.highlight
                                    ? "bg-[#AAFF00] text-black hover:bg-[#c8ff33]"
                                    : "bg-black text-white hover:bg-neutral-800"}`}>
                                {plan.price.monthly === 0 ? "Start free" : "Start 14-day trial"}
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ — cream */}
            <section className="bg-[#F4F4EE] py-20 px-5 sm:px-8">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-black text-black text-center mb-12">Frequently asked questions</h2>
                    <div className="space-y-6">
                        {faqs.map((faq) => (
                            <div key={faq.q} className="bg-white rounded-2xl p-6 border border-black/[0.06]">
                                <h3 className="font-bold text-black text-sm mb-2">{faq.q}</h3>
                                <p className="text-sm text-black/50 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <p className="text-sm text-black/40 mb-4">Still have questions?</p>
                        <Link to="/contact" className="inline-flex items-center gap-2 bg-black text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-neutral-800 transition-colors">
                            Contact us <ArrowUpRight className="size-3.5" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
