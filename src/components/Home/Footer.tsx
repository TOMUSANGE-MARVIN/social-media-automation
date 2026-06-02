import { Link } from "react-router-dom";
import { SiTiktok, SiInstagram, SiX } from "@icons-pack/react-simple-icons";
import LinkedinIcon from "../icons/LinkedinIcon";

const links = {
    Product: [
        { label: "Features", to: "/features" },
        { label: "Pricing",  to: "/pricing" },
        { label: "How it works", to: "/#how-it-works" },
        { label: "Changelog", to: "/changelog" },
    ],
    Company: [
        { label: "About",   to: "/about" },
        { label: "Blog",    to: "/blog" },
        { label: "Contact", to: "/contact" },
        { label: "Careers", to: "/about#careers" },
    ],
    Legal: [
        { label: "Privacy",  to: "/privacy" },
        { label: "Terms",    to: "/terms" },
        { label: "Security", to: "/privacy#security" },
        { label: "Cookies",  to: "/privacy#cookies" },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-black border-t border-white/5">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
                    <div className="lg:col-span-2">
                        <Link to="/" className="inline-flex items-center gap-2 mb-5">
                            <div className="size-6 rounded-md bg-[#AAFF00] flex items-center justify-center">
                                <div className="size-2 rounded-sm bg-black" />
                            </div>
                            <span className="text-white font-bold text-base">Postify</span>
                        </Link>
                        <p className="text-sm text-white/30 leading-relaxed max-w-xs mb-6">
                            AI-powered social media automation for creators and teams who want to grow without burning out.
                        </p>
                        <div className="flex items-center gap-3">
                            {[SiX, SiInstagram, SiTiktok].map((Icon, i) => (
                                <a key={i} href="#"
                                    className="size-8 rounded-lg border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/30 transition-colors">
                                    <Icon size={14} color="currentColor" />
                                </a>
                            ))}
                            <a href="#" className="size-8 rounded-lg border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/30 transition-colors">
                                <LinkedinIcon size={14} color="currentColor" />
                            </a>
                        </div>
                    </div>
                    {Object.entries(links).map(([cat, items]) => (
                        <div key={cat}>
                            <div className="text-[10px] font-black uppercase tracking-widest mb-5 text-white/25">{cat}</div>
                            <ul className="space-y-2.5">
                                {items.map(({ label, to }) => (
                                    <li key={label}>
                                        <Link to={to} className="text-sm text-white/40 hover:text-white transition-colors">
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
                    <p className="text-xs text-white/20">© {new Date().getFullYear()} Postify. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link to="/privacy" className="text-xs text-white/20 hover:text-white/50 transition-colors">Privacy</Link>
                        <Link to="/terms"   className="text-xs text-white/20 hover:text-white/50 transition-colors">Terms</Link>
                        <Link to="/login"   className="text-xs text-[#AAFF00] hover:text-[#c8ff33] transition-colors font-semibold">Sign in →</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
