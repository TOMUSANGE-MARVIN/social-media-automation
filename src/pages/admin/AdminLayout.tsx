import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, LogOut, ChevronRight, Shield, Sun, Moon } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";

const NAV = [
  { to: "/admin",       label: "Overview", Icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Users",    Icon: Users },
];

export default function AdminLayout() {
  const { admin, signOut, theme, toggleTheme } = useAdminAuth();
  const navigate = useNavigate();
  const dark = theme === "dark";

  function handleSignOut() { signOut(); navigate("/admin/login"); }

  const sidebar = dark
    ? "bg-slate-900 border-slate-800"
    : "bg-white border-slate-200";
  const sidebarText   = dark ? "text-white" : "text-slate-900";
  const mutedText     = dark ? "text-slate-400" : "text-slate-500";
  const hoverBg       = dark ? "hover:bg-slate-800 hover:text-white" : "hover:bg-slate-100 hover:text-slate-900";
  const activeStyle   = dark
    ? "bg-[#AAFF00]/10 text-[#AAFF00] border border-[#AAFF00]/20"
    : "bg-[#AAFF00]/20 text-slate-900 border border-[#AAFF00]/40";
  const inactiveStyle = `${mutedText} ${hoverBg}`;
  const mainBg        = dark ? "bg-slate-950" : "bg-slate-50";
  const divider       = dark ? "border-slate-800" : "border-slate-200";

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-200 ${mainBg}`}>
      {/* Sidebar */}
      <aside className={`w-56 flex-shrink-0 flex flex-col border-r transition-colors duration-200 ${sidebar} ${dark ? "" : "shadow-sm"}`}>
        {/* Logo */}
        <div className={`px-5 py-5 border-b ${divider}`}>
          <Link to="/admin" className="flex items-center gap-2.5">
            <span className="size-7 rounded-lg bg-[#AAFF00] flex items-center justify-center shadow-sm">
              <Shield className="size-3.5 text-black" />
            </span>
            <div>
              <p className={`text-sm font-bold leading-none ${sidebarText}`}>Postify</p>
              <p className={`text-[10px] leading-none mt-0.5 ${mutedText}`}>Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest ${dark ? "text-slate-500" : "text-slate-400"}`}>
            Management
          </p>
          {NAV.map(({ to, label, Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive ? activeStyle : inactiveStyle
                }`
              }
            >
              <Icon className="size-[17px] shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className={`px-3 py-4 border-t ${divider} space-y-1`}>
          {/* Theme toggle */}
          <button onClick={toggleTheme}
            className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-colors ${inactiveStyle}`}>
            <div className="flex items-center gap-3">
              {dark ? <Sun className="size-[17px]" /> : <Moon className="size-[17px]" />}
              <span>{dark ? "Light mode" : "Dark mode"}</span>
            </div>
            <div className={`relative flex items-center w-9 h-5 rounded-full transition-colors ${dark ? "bg-[#AAFF00]/30" : "bg-slate-200"}`}>
              <span className={`absolute size-3.5 rounded-full shadow transition-all ${dark ? "bg-[#AAFF00] translate-x-[18px]" : "bg-white translate-x-0.5"}`} />
            </div>
          </button>

          <Link to="/dashboard"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${inactiveStyle}`}>
            <ChevronRight className="size-[17px] rotate-180" />
            Back to App
          </Link>

          {/* User */}
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border ${dark ? "border-slate-800 bg-slate-800/50" : "border-slate-100 bg-slate-50"}`}>
            <div className="size-7 rounded-full bg-[#AAFF00] flex items-center justify-center text-black font-bold text-xs shrink-0">
              {admin?.name?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-semibold truncate ${sidebarText}`}>{admin?.name}</p>
              <p className={`text-[10px] truncate ${mutedText}`}>Super Admin</p>
            </div>
          </div>

          <button onClick={handleSignOut}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
              dark ? "text-slate-500 hover:text-red-400 hover:bg-red-500/10" : "text-slate-400 hover:text-red-500 hover:bg-red-50"
            }`}>
            <LogOut className="size-[15px]" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={`flex-1 overflow-y-auto transition-colors duration-200 ${mainBg}`}>
        <Outlet />
      </main>
    </div>
  );
}
