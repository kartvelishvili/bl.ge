"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth";
import { useTheme } from "@/app/admin/ThemeProvider";

const navItems = [
  { href: "/admin/blogs", label: "ბლოგები", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
  { href: "/admin/contact-us", label: "ლიდები", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { href: "/admin/management-team", label: "მენეჯმენტის გუნდი", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  { href: "/admin/products", label: "პროდუქციის კატეგორია", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { href: "/admin/product-categories", label: "სასმელების კატეგორია", icon: "M4 6h16M4 10h16M4 14h16M4 18h16" },
  { href: "/admin/product-items", label: "სასმელები", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { href: "/admin/companies", label: "სავაჭრო ნიშნები", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { href: "/admin/foods", label: "კერძები", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" },
  { href: "/admin/users", label: "ადმინისტრატორები", icon: "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { href: "/admin/settings", label: "პარამეტრები", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

const bpgCaps = { fontFamily: '"BPG WEB 002 Caps", sans-serif' };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { ready, logout } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center">
        <div className="text-[#C9A84C] text-lg animate-pulse" style={bpgCaps}>იტვირთება...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e17] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0f1420] fixed h-full overflow-y-auto flex flex-col border-r border-[#C9A84C]/20">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-[#C9A84C]/15">
          <Link href="/admin/blogs" className="block">
            <h1
              className="text-xl text-[#C9A84C] tracking-widest"
              style={bpgCaps}
            >
              BOLERO ADMIN
            </h1>
            <div className="h-px bg-gradient-to-r from-[#C9A84C]/60 via-[#C9A84C]/20 to-transparent mt-3" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-[12.5px] tracking-wide transition-all duration-200 ${
                  isActive
                    ? "bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30 shadow-[0_0_12px_rgba(201,168,76,0.06)]"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent"
                }`}
                style={bpgCaps}
              >
                <svg className="w-4 h-4 flex-shrink-0 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-4 py-4 border-t border-[#C9A84C]/15 space-y-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] tracking-wide transition-all duration-200 border border-[#C9A84C]/20 text-[#C9A84C]/70 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C]"
            style={bpgCaps}
          >
            {theme === "dark" ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
            {theme === "dark" ? "ნათელი თემა" : "მუქი თემა"}
          </button>

          {/* Visit site */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] tracking-wide transition-all duration-200 border border-[#C9A84C]/20 text-[#C9A84C]/70 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C]"
            style={bpgCaps}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            საიტის ნახვა
          </a>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full py-2.5 rounded-lg text-[12px] tracking-wide font-medium transition-all duration-200 border border-[#C9A84C]/20 text-[#C9A84C]/60 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
            style={bpgCaps}
          >
            გასვლა
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-72 p-8">{children}</main>
    </div>
  );
}
