import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
    { label: "Features", to: "/features" },
    { label: "How it works", to: "/#how-it-works" },
    { label: "Pricing", to: "/pricing" },
    { label: "Blog", to: "/blog" },
    { label: "About", to: "/about" },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 shrink-0">
                        <div className="size-6 rounded-md bg-[#AAFF00] flex items-center justify-center">
                            <div className="size-2 rounded-sm bg-black" />
                        </div>
                        <span className="text-white font-bold text-base tracking-tight">Postify</span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-6">
                        {NAV.map(({ label, to }) => (
                            <NavLink key={to} to={to}
                                className={({ isActive }) =>
                                    `text-xs transition-colors ${isActive ? "text-white font-semibold" : "text-white/50 hover:text-white"}`
                                }>
                                {label}
                            </NavLink>
                        ))}
                    </div>

                    {/* CTA + mobile toggle */}
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="hidden sm:inline-flex text-xs text-white/60 hover:text-white transition-colors font-medium">
                            Sign in
                        </Link>
                        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#AAFF00] text-black px-4 py-1.5 rounded-full hover:bg-[#c8ff33] transition-colors">
                            Get started
                        </Link>
                        <button onClick={() => setOpen(true)} className="md:hidden text-white/60 hover:text-white transition-colors p-1">
                            <Menu className="size-5" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile drawer — sibling of nav so backdrop-filter doesn't clip it */}
            {open && (
                <div className="md:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
                    <div className="absolute top-0 right-0 bottom-0 w-72 bg-neutral-950 border-l border-white/10 flex flex-col p-6">
                        <div className="flex items-center justify-between mb-8">
                            <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                                <div className="size-6 rounded-md bg-[#AAFF00] flex items-center justify-center">
                                    <div className="size-2 rounded-sm bg-black" />
                                </div>
                                <span className="text-white font-bold text-base">Postify</span>
                            </Link>
                            <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white p-1">
                                <X className="size-5" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-1">
                            {NAV.map(({ label, to }) => (
                                <Link key={to} to={to} onClick={() => setOpen(false)}
                                    className="text-sm text-white/60 hover:text-white hover:bg-white/5 px-3 py-2.5 rounded-lg transition-colors">
                                    {label}
                                </Link>
                            ))}
                        </div>
                        <div className="mt-auto flex flex-col gap-3 pt-8 border-t border-white/10">
                            <Link to="/login" onClick={() => setOpen(false)}
                                className="text-center text-sm text-white/60 hover:text-white py-2 transition-colors">
                                Sign in
                            </Link>
                            <Link to="/login" onClick={() => setOpen(false)}
                                className="text-center text-sm font-bold bg-[#AAFF00] text-black px-4 py-2.5 rounded-full hover:bg-[#c8ff33] transition-colors">
                                Get started free
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
