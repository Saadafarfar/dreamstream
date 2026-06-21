"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { Check, AlertCircle, Loader2, Shield, Clock } from "lucide-react";

export default function FormPage() {
  const searchParams = useSearchParams();
  const defaultPlan = searchParams.get("plan") || "basic";

  const [selectedPlan, setSelectedPlan] = useState(defaultPlan);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const plans = {
    basic: { name: "Basic", price: "€9.99" },
    advance: { name: "Advance", price: "€24.99" },
    premium: { name: "Premium", price: "€69.99" },
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Get IP
      let ip = "";
      let country = "";
      let countryCode = "";

      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();
        ip = ipData.ip;

        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
        const geoData = await geoRes.json();
        country = geoData.country_name || "";
        countryCode = geoData.country_code || "";
      } catch (err) {
        console.log("IP detection failed");
      }

      // Insert to Supabase
      const { error: dbError } = await supabase.from("orders").insert({
        full_name: fullName,
        email: email,
        whatsapp: whatsapp,
        plan: selectedPlan,
        ip_address: ip,
        country: country,
        country_code: countryCode,
        status: "pending",
      });

      if (dbError) {
        console.error("Database error:", dbError);
        throw dbError;
      }

      // Send Telegram notification (optional)
      try {
        await fetch("/api/telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name: fullName,
            email,
            whatsapp,
            plan: selectedPlan,
            country,
            ip_address: ip,
          }),
        });
      } catch (err) {
        console.log("Telegram notification failed");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#030712] text-white flex items-center justify-center px-6">
        <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <Check size={40} className="text-green-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
          <p className="text-gray-400 mb-6">
            Your <span className="text-blue-400 font-semibold">{plans[selectedPlan as keyof typeof plans].name}</span> subscription has been received.
          </p>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 mb-8">
            <p className="text-blue-400 font-semibold mb-2">🎁 24-Hour Free Trial Activated</p>
            <p className="text-gray-400 text-sm">We'll contact you within 24 hours via WhatsApp or Email.</p>
          </div>
          <a
            href="https://wa.me/212700000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl font-semibold transition"
          >
            Contact on WhatsApp
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#030712] text-white flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-2xl">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Image
            src="/logo.png"
            alt="DreamStream"
            width={80}
            height={80}
            className="mx-auto mb-6 rounded-xl"
            priority
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Start Your Free Trial</h1>
          <p className="text-gray-400 text-lg">24 hours free • No credit card required</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Plan Selection */}
            <div>
              <label className="block mb-3 font-semibold text-lg">Select Plan</label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(plans).map(([key, plan]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedPlan(key)}
                    className={`p-4 rounded-xl border-2 transition text-center ${
                      selectedPlan === key
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-700 bg-slate-800 hover:border-slate-600"
                    }`}
                  >
                    <div className="font-bold">{plan.name}</div>
                    <div className="text-blue-400 mt-1">{plan.price}</div>
                    <div className="text-xs text-gray-500">/year</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block mb-2 font-medium">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 font-medium">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                placeholder="john@example.com"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block mb-2 font-medium">WhatsApp Number *</label>
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                placeholder="+32 470 12 34 56"
              />
              <p className="text-xs text-gray-500 mt-1">Include country code (e.g., +32 for Belgium)</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed rounded-xl py-4 font-bold text-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>Start Free 24h Trial</>
              )}
            </button>

            {/* Trust Badges */}
            <div className="flex justify-center gap-6 pt-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-green-500" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-blue-500" />
                <span>24h Free Trial</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}