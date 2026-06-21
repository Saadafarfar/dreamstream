"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (password === "DreamStream2026") {
      localStorage.setItem("admin-auth", "true");
      router.push("/admin");
    } else {
      alert("Wrong password");
    }
  }

  return (
    <main className="min-h-screen bg-[#030712] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8">
        <h1 className="text-3xl font-bold text-white mb-6">
          Admin Login
        </h1>

        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white mb-4"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-4 text-white font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}