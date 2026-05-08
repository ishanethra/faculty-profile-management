"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50">
      {/* Official Top Banner */}
      <div className="bg-[#002147] border-b border-white/5">
        <img
          src="/logo.png"
          alt="NIT Trichy Banner"
          className="w-full h-auto block object-contain"
        />
      </div>

      {/* Secondary App Bar */}
      <div className="bg-[#001021] border-t border-white/5 py-3 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-12 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center text-sm tracking-tighter">
              <span className="text-white font-black">FACULTY</span>
              <span className="text-blue-500 font-black">PORTAL</span>
            </Link>

            <div className="hidden sm:flex items-center gap-6">
              <Link
                href="/directory"
                className={`text-xs font-bold uppercase tracking-widest transition-all ${pathname === '/directory' ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
              >
                Faculty Profiles
              </Link>
              {session && (
                <Link
                  href="/dashboard"
                  className={`text-xs font-bold uppercase tracking-widest transition-all ${pathname.startsWith('/dashboard') ? 'text-white' : 'text-slate-400 hover:text-white'
                    }`}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            {session ? (
              <div className="flex items-center gap-6">
                <div className="hidden md:block text-right">
                  <p className="text-[10px] font-black text-white uppercase tracking-tight">{session.user.name}</p>
                  <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{session.user.role}</p>
                </div>
                <SignOutButton
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Sign Out
                </SignOutButton>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <Link href="/login" className="text-[10px] font-black text-slate-300 hover:text-white uppercase tracking-widest transition-all">
                  Login
                </Link>
                <Link href="/register" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
