"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  function logout() {
    localStorage.removeItem("admin-auth");
    router.push("/admin/login");
  }

  function closeSidebar() {
    setIsOpen(false);
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-800 text-white shadow-lg"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay - only shows on mobile when sidebar is open */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 min-h-screen bg-slate-900 border-r border-slate-800 p-6
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <h2 className="text-2xl font-bold text-white mb-10">
          DreamStream
        </h2>

        <nav className="flex flex-col gap-3">
          <Link
            href="/admin"
            onClick={closeSidebar}
            className="bg-slate-800 hover:bg-slate-700 rounded-xl px-4 py-3 text-white"
          >
            📦 Orders
          </Link>

          <Link
            href="/admin/dashboard"
            onClick={closeSidebar}
            className="bg-slate-800 hover:bg-slate-700 rounded-xl px-4 py-3 text-white"
          >
            📊 Dashboard
          </Link>
        </nav>

        <button
          onClick={logout}
          className="mt-10 w-full bg-red-600 hover:bg-red-700 rounded-xl py-3 text-white"
        >
          Logout
        </button>
      </aside>
    </>
  );
}