import { Mail, MapPin, MessageCircle, ArrowUpRight } from "lucide-react";
import { SiX, SiInstagram } from "@icons-pack/react-simple-icons";
import LinkedinIcon from "../components/icons/LinkedinIcon";
import { useState } from "react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const methods = [
    { icon: Mail,          title: "Email us",    detail: "hello@postify.app",  desc: "We reply within 24 hours." },
    { icon: MessageCircle, title: "Live chat",   detail: "In-app chat",        desc: "Available Mon–Fri, 9am–5pm GMT." },
    { icon: MapPin,        title: "Location",    detail: "Kampala, Uganda",    desc: "Remote-first team." },
];

export default function Contact() {
    const [sent, setSent] = useState(false);
    const header = useScrollAnimation();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSent(true);
    }

    return (
        <>
            {/* Header — cream */}
            <section className="bg-[#F4F4EE] py-24 px-5 sm:px-8">
                <div ref={header.ref as React.RefObject<HTMLDivElement>}
                    className={`max-w-2xl mx-auto text-center sa-fade-up ${header.visible ? "sa-visible" : ""}`}>
                    <h1 className="text-4xl sm:text-5xl font-black text-black leading-tight mb-4">Get in touch</h1>
                    <p className="text-black/50 text-base">Whether you have a question, feature request, or just want to say hi — we'd love to hear from you.</p>
                </div>
            </section>

            {/* Form + info — white */}
            <section className="bg-white py-16 px-5 sm:px-8">
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left info */}
                    <div className="lg:col-span-2 space-y-4">
                        {methods.map((m) => (
                            <div key={m.title} className="bg-neutral-50 border border-black/[0.07] rounded-2xl p-5">
                                <div className="flex items-start gap-4">
                                    <div className="size-9 rounded-xl bg-[#AAFF00] flex items-center justify-center shrink-0">
                                        <m.icon className="size-4 text-black" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-black/30 uppercase tracking-widest mb-0.5">{m.title}</div>
                                        <div className="font-bold text-black text-sm">{m.detail}</div>
                                        <div className="text-xs text-black/40 mt-0.5">{m.desc}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="bg-neutral-50 border border-black/[0.07] rounded-2xl p-5">
                            <div className="text-xs text-black/30 uppercase tracking-widest mb-3">Follow us</div>
                            <div className="flex gap-3">
                                {[SiX, SiInstagram].map((Icon, i) => (
                                    <a key={i} href="#" className="size-9 rounded-xl border border-black/10 flex items-center justify-center text-black/35 hover:text-black hover:border-black/30 transition-colors">
                                        <Icon size={14} color="currentColor" />
                                    </a>
                                ))}
                                <a href="#" className="size-9 rounded-xl border border-black/10 flex items-center justify-center text-black/35 hover:text-black hover:border-black/30 transition-colors">
                                    <LinkedinIcon size={14} color="currentColor" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-3 bg-neutral-50 border border-black/[0.07] rounded-2xl p-8">
                        {sent ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-10">
                                <div className="size-12 rounded-full bg-[#AAFF00] flex items-center justify-center mb-4">
                                    <ArrowUpRight className="size-6 text-black" />
                                </div>
                                <h3 className="font-black text-black text-lg mb-2">Message sent!</h3>
                                <p className="text-sm text-black/40">We'll get back to you within 24 hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-black/40 uppercase tracking-widest block mb-2">Name</label>
                                        <input required type="text" placeholder="Your name"
                                            className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm text-black placeholder-black/25 focus:outline-none focus:border-black/30 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-black/40 uppercase tracking-widest block mb-2">Email</label>
                                        <input required type="email" placeholder="you@example.com"
                                            className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm text-black placeholder-black/25 focus:outline-none focus:border-black/30 transition-colors" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-black/40 uppercase tracking-widest block mb-2">Subject</label>
                                    <select className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm text-black/70 focus:outline-none focus:border-black/30 transition-colors">
                                        <option>General question</option>
                                        <option>Billing & plans</option>
                                        <option>Technical support</option>
                                        <option>Feature request</option>
                                        <option>Partnership</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-black/40 uppercase tracking-widest block mb-2">Message</label>
                                    <textarea required rows={5} placeholder="How can we help you?"
                                        className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm text-black placeholder-black/25 focus:outline-none focus:border-black/30 transition-colors resize-none" />
                                </div>
                                <button type="submit"
                                    className="w-full bg-black text-white font-black text-sm py-3.5 rounded-full hover:bg-neutral-800 transition-all hover:scale-[1.02]">
                                    Send message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
