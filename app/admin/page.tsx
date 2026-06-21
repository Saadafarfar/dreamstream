"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Sidebar from "../../components/Sidebar";
import {
  Download,
  LogOut,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  MessageCircle,
  Mail,
  ExternalLink,
} from "lucide-react";

/* ---------- Types ---------- */
interface Order {
  id: number;
  full_name: string;
  email: string;
  whatsapp: string;
  plan: "basic" | "advance" | "premium";
  status: "pending" | "contacted" | "closed";
  country: string;
  country_code?: string;
  ip_address: string;
  created_at: string;
}

/* ---------- Constants ---------- */
const PLAN_COLORS: Record<string, string> = {
  premium: "bg-green-500/20 text-green-400 border-green-500/30",
  advance: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  basic: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const STATUS_COLORS: Record<string, string> = {
  closed: "bg-red-500/20 text-red-400 border-red-500/30",
  contacted: "bg-green-500/20 text-green-400 border-green-500/30",
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

/* ---------- Helpers ---------- */
const escapeCSV = (value: string | number | undefined): string => {
  if (value === undefined || value === null) return '""';
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* ---------- Page ---------- */
export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  // Auth check
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin-auth") === "true";
    if (!isLoggedIn) {
      router.push("/admin/login");
      return;
    }
    setAuthorized(true);
    fetchOrders();
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
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
    }
  }, []);

  const updateStatus = useCallback(
    async (id: number, newStatus: string) => {
      const order = orders.find((o) => o.id === id);
      if (!order) return;

      const confirmed = window.confirm(
        `Change status for ${order.full_name} from "${order.status}" to "${newStatus}"?`
      );

      if (!confirmed) {
        fetchOrders(); // Reset dropdown
        return;
      }

      try {
        setUpdatingId(id);
        const { error } = await supabase
          .from("orders")
          .update({ status: newStatus })
          .eq("id", id);

        if (error) throw error;

        // Optimistic update
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: newStatus as Order["status"] } : o))
        );
      } catch (err: any) {
        alert(`Failed to update status: ${err.message}`);
        fetchOrders();
      } finally {
        setUpdatingId(null);
      }
    },
    [orders]
  );

  const exportCSV = useCallback(() => {
    const headers = ["Name", "Email", "WhatsApp", "Plan", "Status", "Country", "IP", "Date"];

    const rows = orders.map((order) => [
      escapeCSV(order.full_name),
      escapeCSV(order.email),
      escapeCSV(order.whatsapp),
      escapeCSV(order.plan),
      escapeCSV(order.status),
      escapeCSV(order.country),
      escapeCSV(order.ip_address),
      escapeCSV(order.created_at),
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `dreamstream-leads-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show success feedback
    alert(`Exported ${orders.length} orders to CSV!`);
  }, [orders]);

  const logout = useCallback(() => {
    localStorage.removeItem("admin-auth");
    router.push("/admin/login");
  }, []);

  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return orders;
    return orders.filter(
      (order) =>
        order.full_name?.toLowerCase().includes(q) ||
        order.email?.toLowerCase().includes(q) ||
        order.whatsapp?.toLowerCase().includes(q) ||
        order.ip_address?.toLowerCase().includes(q) ||
        order.country?.toLowerCase().includes(q) ||
        order.plan?.toLowerCase().includes(q)
    );
  }, [orders, search]);

  // Stats
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const contacted = orders.filter((o) => o.status === "contacted").length;
    const closed = orders.filter((o) => o.status === "closed").length;
    return { total, pending, contacted, closed };
  }, [orders]);

  if (!authorized) return null;

  return (
    <div className="flex min-h-screen bg-[#030712] text-white">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">Orders Dashboard</h1>
            <p className="text-slate-400 mt-2">
              Manage and track all your DreamStream leads
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={exportCSV}
              disabled={orders.length === 0}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:cursor-not-allowed px-5 py-3 rounded-xl font-medium transition"
            >
              <Download size={18} />
              Export CSV
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-medium transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Orders" value={stats.total} color="text-blue-400" />
          <StatCard label="Pending" value={stats.pending} color="text-yellow-400" />
          <StatCard label="Contacted" value={stats.contacted} color="text-green-400" />
          <StatCard label="Closed" value={stats.closed} color="text-red-400" />
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            placeholder="Search name, email, WhatsApp, IP, country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="text-red-400" size={20} />
            <div>
              <p className="font-semibold text-red-400">Error loading orders</p>
              <p className="text-sm text-slate-400">{error}</p>
            </div>
            <button
              onClick={fetchOrders}
              className="ml-auto px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="animate-spin text-blue-400" size={40} />
            <p className="ml-3 text-slate-400">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          /* Empty State */
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <AlertCircle size={48} className="mx-auto text-slate-600 mb-4" />
            <h3 className="text-2xl font-bold mb-2">
              {search ? "No results found" : "No orders yet"}
            </h3>
            <p className="text-slate-400">
              {search
                ? "Try adjusting your search terms"
                : "New leads will appear here automatically"}
            </p>
          </div>
        ) : (
          /* Table */
          <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl">
            <table className="w-full">
              <thead className="bg-slate-950">
                <tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>WhatsApp</Th>
                  <Th>Plan</Th>
                  <Th>Status</Th>
                  <Th>Country</Th>
                  <Th>IP</Th>
                  <Th>Date</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-800/50 transition"
                  >
                    <Td>
                      <div className="font-medium">{order.full_name || "—"}</div>
                    </Td>
                    <Td>
                      <a
                        href={`mailto:${order.email}`}
                        className="text-blue-400 hover:underline"
                      >
                        {order.email}
                      </a>
                    </Td>
                    <Td>{order.whatsapp || "—"}</Td>
                    <Td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          PLAN_COLORS[order.plan]
                        }`}
                      >
                        {order.plan}
                      </span>
                    </Td>
                    <Td>
                      <select
                        value={order.status || "pending"}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        disabled={updatingId === order.id}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium bg-transparent cursor-pointer disabled:opacity-50 ${
                          STATUS_COLORS[order.status || "pending"]
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        {order.country_code && (
                          <img
                            src={`https://flagcdn.com/w40/${order.country_code.toLowerCase()}.png`}
                            alt={order.country}
                            className="w-6 h-4 rounded"
                            loading="lazy"
                          />
                        )}
                        <span className="text-sm">{order.country || "Unknown"}</span>
                      </div>
                    </Td>
                    <Td className="font-mono text-xs">{order.ip_address}</Td>
                    <Td className="text-sm text-slate-400">
                      {formatDate(order.created_at)}
                    </Td>
                    <Td>
                      <div className="flex gap-2">
                        <a
                          href={`https://wa.me/${order.whatsapp?.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg text-xs font-medium transition"
                        >
                          <MessageCircle size={14} />
                          Chat
                        </a>
                        <a
                          href={`mailto:${order.email}`}
                          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-xs font-medium transition"
                        >
                          <Mail size={14} />
                          Email
                        </a>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Info */}
        {!loading && filteredOrders.length > 0 && (
          <div className="mt-4 text-sm text-slate-400 text-center">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        )}
      </main>
    </div>
  );
}

/* ---------- Subcomponents ---------- */
function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <p className="text-slate-400 text-sm">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-4 ${className}`}>{children}</td>;
}