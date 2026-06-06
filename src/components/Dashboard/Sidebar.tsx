import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard, PenSquare, CalendarDays, Link2, Settings,
  LogOut, Menu, X, BarChart2, Sun, Moon, Shield, Upload, CalendarRange,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const NAV = [
  { to: '/dashboard',   label: 'Dashboard',   Icon: LayoutDashboard },
  { to: '/compose',     label: 'Compose',     Icon: PenSquare },
  { to: '/posts',       label: 'Posts',       Icon: CalendarDays },
  { to: '/calendar',    label: 'Calendar',    Icon: CalendarRange },
  { to: '/bulk-upload', label: 'Bulk Upload', Icon: Upload },
  { to: '/analytics',   label: 'Analytics',   Icon: BarChart2 },
  { to: '/accounts',    label: 'Accounts',    Icon: Link2 },
  { to: '/settings',    label: 'Settings',    Icon: Settings },
];

function NavItems({ onNav }: { onNav?: () => void }) {
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAdmin = (user as any)?.isAdmin;
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5">
        <Link to="/dashboard" className="flex items-center gap-2.5" onClick={onNav}>
          <span className="size-7 rounded-lg bg-gray-900 flex items-center justify-center shrink-0">
            <span className="size-2.5 rounded-sm bg-[#AAFF00]" />
          </span>
          <span className="text-lg font-bold text-gray-900 tracking-tight">Postify</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        <p className="px-3 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Menu</p>
        {NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to} to={to} onClick={onNav}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`
            }
          >
            <Icon className="size-[17px] shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Admin link */}
      {isAdmin && (
        <div className="px-3 pb-2">
          <p className="px-3 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Admin</p>
          <NavLink to="/admin" onClick={onNav}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`
            }>
            <Shield className="size-[17px] shrink-0" />
            Admin Panel
          </NavLink>
        </div>
      )}

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-gray-100">
        {/* User */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1">
          <div className="size-8 rounded-full bg-gray-900 flex items-center justify-center text-white font-semibold text-xs shrink-0">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Theme toggle */}
        <button onClick={toggle}
          className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors mb-0.5">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Sun className="size-[17px]" /> : <Moon className="size-[17px]" />}
            <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </div>
          <div className={`relative flex items-center w-9 h-5 rounded-full transition-colors ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <span className={`absolute size-3.5 rounded-full bg-white shadow transition-all ${theme === 'dark' ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
          </div>
        </button>

        <button onClick={signOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors">
          <LogOut className="size-[17px]" /> Sign out
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-60 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 z-30">
        <NavItems />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3">
        <button onClick={() => setOpen(true)} className="text-gray-500 p-1">
          <Menu className="size-5" />
        </button>
        <Link to="/dashboard" className="flex items-center gap-2 flex-1">
          <span className="size-6 rounded-md bg-gray-900 flex items-center justify-center">
            <span className="size-2 rounded-sm bg-[#AAFF00]" />
          </span>
          <span className="text-base font-bold text-gray-900 tracking-tight">Postify</span>
        </Link>
        <button onClick={toggle} className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors">
          {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-200 flex flex-col shadow-2xl">
            <div className="flex justify-end p-3 border-b border-gray-100">
              <button onClick={() => setOpen(false)} className="text-gray-400 p-1 hover:text-gray-700 transition-colors">
                <X className="size-5" />
              </button>
            </div>
            <NavItems onNav={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
