"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Sidebar from "../../../components/Sidebar";
import { supabase } from "../../../lib/supabase";
import {
  ShoppingCart,
  Clock3,
  PhoneCall,
  CheckCircle2,
  DollarSign,
  Globe,
  RefreshCw,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import CountUp from "react-countup";

/* ---------- Types ---------- */
interface Order {
  id: string;
  full_name?: string;
  email?: string;
  country?: string;
  plan: "basic" | "advance" | "premium";
  status: "pending" | "contacted" | "closed";
  created_at: string;
}

/* ---------- Constants ---------- */
const PLAN_PRICES: Record<string, number> = {
  basic: 9.99,
  advance: 24.99,
  premium: 69.99,
};

const STATUS_COLORS: Record<string, string> = {
  closed: "bg-red-500/20 text-red-400",
  contacted: "bg-green-500/20 text-green-400",
  pending: "bg-yellow-500/20 text-yellow-400",
};

const PLAN_COLORS: Record<string, string> = {
  premium: "bg-green-500/20 text-green-400",
  advance: "bg-yellow-500/20 text-yellow-400",
  basic: "bg-blue-500/20 text-blue-400",
};

/* ---------- Helpers ---------- */
const isSameDay = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
};

/* ---------- Page ---------- */
export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);

      setError(null);
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setOrders((data as Order[]) || []);
    } catch (err: any) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /* ---------- Derived data (memoized) ---------- */
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const contacted = orders.filter((o) => o.status === "contacted").length;
    const closed = orders.filter((o) => o.status === "closed").length;

    const premium = orders.filter((o) => o.plan === "premium").length;
    const advance = orders.filter((o) => o.plan === "advance").length;
    const basic = orders.filter((o) => o.plan === "basic").length;

    const revenue =
      basic * PLAN_PRICES.basic +
      advance * PLAN_PRICES.advance +
      premium * PLAN_PRICES.premium;

    const closedRevenue = orders
      .filter((o) => o.status === "closed")
      .reduce((sum, o) => sum + (PLAN_PRICES[o.plan] ?? 0), 0);

    const conversionRate = total > 0 ? (closed / total) * 100 : 0;
    const todayLeads = orders.filter((o) => isSameDay(o.created_at)).length;

    const countryStats = orders.reduce<Record<string, number>>(
      (acc, order) => {
        const country = order.country || "Unknown";
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      },
      {}
    );

    const topCountries = Object.entries(countryStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      total,
      pending,
      contacted,
      closed,
      premium,
      advance,
      basic,
      revenue,
      closedRevenue,
      conversionRate,
      todayLeads,
      topCountries,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return orders.slice(0, 5);
    return orders
      .filter(
        (o) =>
          o.full_name?.toLowerCase().includes(q) ||
          o.email?.toLowerCase().includes(q) ||
          o.country?.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [orders, search]);

  /* ---------- UI States ---------- */
  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#030712] text-white">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center pt-20 lg:pt-0">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
            <p className="text-slate-400">Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-[#030712] text-white">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center p-4 lg:p-10 pt-20 lg:pt-0">
          <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-6 lg:p-8 max-w-md text-center w-full">
            <h2 className="text-2xl font-bold text-red-400 mb-3">
              Something went wrong
            </h2>
            <p className="text-slate-400 mb-5">{error}</p>
            <button
              onClick={() => fetchOrders()}
              className="px-5 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-semibold transition w-full"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#030712] text-white">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 pt-20 lg:pt-10 overflow-x-hidden">
        {/* Header */}
        <div className="mb-8 lg:mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-5xl font-bold">Dashboard</h1>
            <p className="text-slate-400 mt-2 text-sm lg:text-base">
              Overview of your DreamStream leads and revenue.
            </p>
          </div>

          <button
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            aria-label="Refresh data"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl font-semibold transition disabled:opacity-50 w-full md:w-auto"
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Empty state */}
        {orders.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 lg:p-12 text-center">
            <Users size={48} className="mx-auto text-slate-600 mb-4" />
            <h3 className="text-2xl font-bold mb-2">No orders yet</h3>
            <p className="text-slate-400">When new leads come in, they'll appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT SIDE */}
            <div className="lg:col-span-2 space-y-6">
              {/* KPI CARDS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <KpiCard label="Total Orders" value={stats.total} icon={<ShoppingCart size={24} className="text-blue-400" />} gradient="from-slate-900 to-slate-800" border="border-slate-700" />
                <KpiCard label="Pending" value={stats.pending} icon={<Clock3 size={24} className="text-yellow-400" />} gradient="from-yellow-500/20 to-yellow-900/20" border="border-yellow-500/20" valueColor="text-yellow-400" />
                <KpiCard label="Contacted" value={stats.contacted} icon={<PhoneCall size={24} className="text-green-400" />} gradient="from-green-500/20 to-green-900/20" border="border-green-500/20" valueColor="text-green-400" />
                <KpiCard label="Closed" value={stats.closed} icon={<CheckCircle2 size={24} className="text-red-400" />} gradient="from-red-500/20 to-red-900/20" border="border-red-500/20" valueColor="text-red-400" />
              </div>

              {/* Search */}
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search name, email, country..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search orders"
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm lg:text-base"
                />
              </div>

              {/* Latest Orders - Mobile Card Layout */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 lg:p-6">
                <h3 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6">Latest Orders</h3>

                <div className="space-y-3 lg:space-y-4">
                  {filteredOrders.length === 0 ? (
                    <p className="text-slate-500 text-center py-6">No orders match your search.</p>
                  ) : (
                    filteredOrders.map((order) => (
                      <div key={order.id} className="bg-slate-800 hover:bg-slate-700 transition rounded-2xl p-4 border border-slate-700/50">
                        {/* Top Row: Avatar & Name */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold shrink-0 text-white">
                              {order.full_name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold truncate text-white text-sm lg:text-base">
                                {order.full_name || "Unnamed"}
                              </p>
                              <p className="text-xs text-slate-400 truncate">
                                {order.email}
                              </p>
                            </div>
                          </div>
                          
                          {/* Badges stacked on the right */}
                          <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${PLAN_COLORS[order.plan] || PLAN_COLORS.basic}`}>
                              {order.plan}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${STATUS_COLORS[order.status] || STATUS_COLORS.pending}`}>
                              {order.status || "pending"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-6">
              <Card title="Plans Distribution">
                <div className="space-y-4">
                  <PlanRow label="Premium" value={stats.premium} color="text-green-400" />
                  <PlanRow label="Advance" value={stats.advance} color="text-yellow-400" />
                  <PlanRow label="Basic" value={stats.basic} color="text-blue-400" />
                </div>
              </Card>

              <Card title="Conversion Rate" icon={<TrendingUp size={18} />}>
                <div className="text-3xl lg:text-4xl font-bold text-green-400">
                  <CountUp end={stats.conversionRate} duration={1.2} decimals={1} suffix="%" />
                </div>
                <p className="text-slate-400 mt-3 text-xs lg:text-sm">Closed orders / Total orders</p>
              </Card>

              <Card title="Today's Leads">
                <div className="text-3xl lg:text-4xl font-bold text-cyan-400">
                  <CountUp end={stats.todayLeads} duration={1} />
                </div>
                <p className="text-slate-400 mt-3 text-xs lg:text-sm">Leads created today</p>
              </Card>

              <Card title="Potential Revenue" icon={<DollarSign size={18} />}>
                <div className="text-3xl lg:text-4xl font-bold text-yellow-400">
                  €<CountUp end={stats.revenue} duration={1.5} decimals={2} separator="," />
                </div>
                <p className="text-slate-400 mt-3 text-xs lg:text-sm">Value of all leads</p>
              </Card>

              <Card title="Closed Revenue">
                <div className="text-3xl lg:text-4xl font-bold text-green-400">
                  €<CountUp end={stats.closedRevenue} duration={1.5} decimals={2} separator="," />
                </div>
                <p className="text-slate-400 mt-3 text-xs lg:text-sm">Revenue from closed deals</p>
              </Card>

              <Card title="Top Countries" icon={<Globe size={18} />}>
                <div className="space-y-3">
                  {stats.topCountries.length === 0 ? (
                    <p className="text-slate-500 text-sm">No data yet.</p>
                  ) : (
                    stats.topCountries.map(([country, count]) => (
                      <div key={country} className="flex justify-between items-center text-sm lg:text-base">
                        <span className="truncate pr-2">{country}</span>
                        <span className="text-blue-400 font-bold shrink-0">
                          <CountUp end={count} duration={1} />
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              <Card title="Recent Activity">
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="text-sm">
                      <p>
                        <span className="font-semibold">{order.full_name || "Someone"}</span>{" "}
                        created a <span className="text-blue-400">{order.plan}</span> lead
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ---------- Reusable components ---------- */
function Card({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 lg:p-6">
      <div className="flex items-center gap-2 mb-4 lg:mb-5">
        {icon && <span className="text-slate-400">{icon}</span>}
        <h3 className="text-lg lg:text-xl font-bold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function KpiCard({ label, value, icon, gradient, border, valueColor = "text-white" }: { label: string; value: number; icon: React.ReactNode; gradient: string; border: string; valueColor?: string }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} border ${border} rounded-2xl lg:rounded-3xl p-3 lg:p-5`}>
      <div className="flex justify-between items-start">
        <div className="min-w-0">
          <p className="text-slate-400 text-[10px] lg:text-sm truncate">{label}</p>
          <h2 className={`text-2xl lg:text-4xl font-bold mt-1 lg:mt-2 ${valueColor}`}>
            <CountUp end={value} duration={1} />
          </h2>
        </div>
        <div className="shrink-0 ml-2">{icon}</div>
      </div>
    </div>
  );
}

function PlanRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex justify-between items-center text-sm lg:text-base">
      <span>{label}</span>
      <span className={`${color} font-bold`}>
        <CountUp end={value} duration={1} />
      </span>
    </div>
  );
}