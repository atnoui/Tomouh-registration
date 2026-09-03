"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogOut, Search, Loader2, Inbox } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { departmentLabel } from "@/lib/constants";
import AuthGuard from "@/components/AuthGuard";
import StatusBadge from "@/components/StatusBadge";

const FILTERS = [
  { value: "all", label: "الكل" },
  { value: "pending", label: "قيد المراجعة" },
  { value: "reviewed", label: "تمت المراجعة" },
  { value: "accepted", label: "مقبول" },
  { value: "rejected", label: "مرفوض" },
];

function DashboardContent() {
  const router = useRouter();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let active = true;
    async function load() {
      const { data, error } = await supabase
        .from("applicants")
        .select("*")
        .order("created_at", { ascending: false });
      if (active && !error) setApplicants(data || []);
      if (active) setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return applicants.filter((a) => {
      const matchesFilter = filter === "all" || a.status === filter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        a.full_name?.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q) ||
        a.wilaya?.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [applicants, query, filter]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="طموح" width={32} height={32} />
            <span className="font-display text-lg font-extrabold text-ink">
              لوحة تحكم طموح
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink/60 transition hover:bg-ink/5 hover:text-ink"
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-ink">
              الطلبات المستلمة
            </h1>
            <p className="mt-1 text-sm text-ink/50">
              {applicants.length} طلب إجمالي
            </p>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث بالاسم أو البريد أو الولاية"
              className="w-full rounded-xl border border-ink/15 bg-white py-2.5 pe-4 ps-9 text-sm focus:border-flame-500 focus:outline-none focus:ring-2 focus:ring-flame-500/20 sm:w-72"
            />
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                filter === f.value
                  ? "border-navy-800 bg-navy-800 text-white"
                  : "border-ink/15 bg-white text-ink/60 hover:border-navy-800/40"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-navy-800" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Inbox className="h-8 w-8 text-ink/25" />
              <p className="mt-3 text-sm text-ink/50">لا توجد طلبات مطابقة</p>
            </div>
          ) : (
            <div className="styled-scroll overflow-x-auto">
              <table className="w-full min-w-[720px] text-right text-sm">
                <thead className="border-b border-ink/10 bg-ink/[0.02] text-xs uppercase tracking-wide text-ink/45">
                  <tr>
                    <th className="px-5 py-3 font-semibold">الاسم</th>
                    <th className="px-5 py-3 font-semibold">العمر</th>
                    <th className="px-5 py-3 font-semibold">الولاية</th>
                    <th className="px-5 py-3 font-semibold">التخصص</th>
                    <th className="px-5 py-3 font-semibold">الفروع المختارة</th>
                    <th className="px-5 py-3 font-semibold">تاريخ التقديم</th>
                    <th className="px-5 py-3 font-semibold">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr
                      key={a.id}
                      onClick={() => router.push(`/admin/dashboard/${a.id}`)}
                      className="cursor-pointer border-b border-ink/5 transition last:border-0 hover:bg-flame-500/[0.04]"
                    >
                      <td className="px-5 py-4 font-medium text-ink">{a.full_name}</td>
                      <td className="px-5 py-4 text-ink/70">{a.age}</td>
                      <td className="px-5 py-4 text-ink/70">{a.wilaya}</td>
                      <td className="px-5 py-4 text-ink/70">{a.field_of_study}</td>
                      <td className="px-5 py-4 text-ink/70">
                        {(a.departments || []).map(departmentLabel).join("، ")}
                      </td>
                      <td className="px-5 py-4 text-ink/50">
                        {new Date(a.created_at).toLocaleDateString("ar-DZ")}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={a.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
