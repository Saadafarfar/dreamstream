"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  function logout() {
    localStorage.removeItem("admin-auth");
    router.push("/admin/login");
  }

  return (
    <aside className="w56 min-h-screen bg-slate-900 border-r border-slate-800 p-6">
      <h2 className="text-2xl font-bold text-white mb-10">
        DreamStream
      </h2>

      <nav className="flex flex-col gap-3">
        
<nav className="flex flex-col gap-3">

 <Link
    href="/admin"
    className="bg-slate-800 hover:bg-slate-700 rounded-xl px-4 py-3"
  >
    📦 Orders
  </Link>

  <Link
    href="/admin/dashboard"
    className="bg-slate-800 hover:bg-slate-700 rounded-xl px-4 py-3"
  >
    📊 Dashboard
  </Link>

  

</nav>
      </nav>

      <button
        onClick={logout}
        className="mt-10 w-full bg-red-600 hover:bg-red-700 rounded-xl py-3"
      >
        Logout
      </button>
    </aside>
    
  );
}