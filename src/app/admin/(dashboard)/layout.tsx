"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth";

const navItems = [
  { href: "/admin/blogs", label: "ბლოგები" },
  { href: "/admin/contact-us", label: "ლიდები" },
  { href: "/admin/management-team", label: "მენეჯმენტის გუნდი" },
  { href: "/admin/products", label: "პროდუქციის კატეგორია" },
  { href: "/admin/product-categories", label: "სასმელების კატეგორია" },
  { href: "/admin/product-items", label: "სასმელები" },
  { href: "/admin/companies", label: "სავაჭრო ნიშნები" },
  { href: "/admin/foods", label: "კერძები" },
  { href: "/admin/users", label: "ადმინისტრატორები" },
];

const bpgCaps = { fontFamily: '"BPG WEB 002 Caps", sans-serif' };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { ready, logout } = useAdminAuth();

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
        <div className="px-6 py-7 border-b border-[#C9A84C]/15">
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
        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 rounded-lg text-[13px] tracking-wide transition-all duration-200 ${
                  isActive
                    ? "bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30 shadow-[0_0_12px_rgba(201,168,76,0.06)]"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent"
                }`}
                style={bpgCaps}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 py-5 border-t border-[#C9A84C]/15">
          <button
            onClick={logout}
            className="w-full py-3 rounded-lg text-[13px] tracking-wide font-medium transition-all duration-200 border border-[#C9A84C]/20 text-[#C9A84C]/60 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
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
