"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Loader2, Link as LinkIcon } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import {
  departmentLabel,
  STATUS_OPTIONS,
  WEEKLY_HOURS_OPTIONS,
} from "@/lib/constants";
import AuthGuard from "@/components/AuthGuard";
import StatusBadge from "@/components/StatusBadge";

function Row({ label, children }) {
  return (
    <div className="border-b border-ink/5 py-4 last:border-0">
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink/40">
        {label}
      </dt>
      <dd className="mt-1.5 text-ink">{children}</dd>
    </div>
  );
}

function hoursLabel(value) {
  return WEEKLY_HOURS_OPTIONS.find((o) => o.value === value)?.label || value;
}

function ApplicantDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      const { data } = await supabase
        .from("applicants")
        .select("*")
        .eq("id", id)
        .single();
      if (active) {
        setApplicant(data);
        setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [id]);

  async function updateStatus(status) {
    setUpdating(true);
    const { error } = await supabase
      .from("applicants")
      .update({ status })
      .eq("id", id);
    if (!error) setApplicant((a) => ({ ...a, status }));
    setUpdating(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-50">
        <Loader2 className="h-6 w-6 animate-spin text-navy-800" />
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream-50">
        <p className="text-ink/60">لم يتم العثور على هذا الطلب.</p>
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="rounded-lg bg-navy-800 px-4 py-2 text-sm font-semibold text-white"
        >
          العودة للوحة التحكم
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 pb-16">
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="flex items-center gap-1.5 text-sm font-medium text-ink/60 transition hover:text-ink"
          >
            <ArrowRight className="h-4 w-4" />
            العودة لقائمة الطلبات
          </button>
          <StatusBadge status={applicant.status} />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-1">
          <h1 className="font-display text-2xl font-extrabold text-ink">
            {applicant.full_name}
          </h1>
          <p className="text-sm text-ink/50">
            قدّم الطلب في{" "}
            {new Date(applicant.created_at).toLocaleDateString("ar-DZ", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Status actions */}
        <div className="mb-8 flex flex-wrap items-center gap-2 rounded-2xl border border-ink/10 bg-white p-4 shadow-card">
          <span className="me-2 text-sm font-medium text-ink/60">تحديث الحالة:</span>
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              disabled={updating}
              onClick={() => updateStatus(opt.value)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition disabled:opacity-50 ${
                applicant.status === opt.value
                  ? "border-flame-500 bg-flame-500 text-white"
                  : "border-ink/15 bg-white text-ink/60 hover:border-flame-500/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <section className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card">
            <h2 className="mb-2 font-display text-base font-bold text-ink">
              البيانات الشخصية
            </h2>
            <dl>
              <Row label="العمر">{applicant.age}</Row>
              <Row label="البريد الإلكتروني">
                <a href={`mailto:${applicant.email}`} className="text-flame-600 hover:underline">
                  {applicant.email}
                </a>
              </Row>
              <Row label="رقم الهاتف">{applicant.phone || "—"}</Row>
              <Row label="ولاية الإقامة">{applicant.wilaya}</Row>
              <Row label="تخصص دراسي">{applicant.field_of_study}</Row>
            </dl>
          </section>

          <section className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card">
            <h2 className="mb-2 font-display text-base font-bold text-ink">
              التوفر والانضمام
            </h2>
            <dl>
              <Row label="الساعات المتاحة أسبوعياً">
                {hoursLabel(applicant.weekly_hours)}
              </Row>
              <Row label="مستعد للالتزام">
                {applicant.ready_to_commit ? "نعم" : "لا"}
              </Row>
              <Row label="الفروع المختارة">
                <div className="flex flex-wrap gap-1.5">
                  {(applicant.departments || []).map((d) => (
                    <span
                      key={d}
                      className="rounded-full bg-navy-800/5 px-2.5 py-1 text-xs font-medium text-navy-800"
                    >
                      {departmentLabel(d)}
                    </span>
                  ))}
                </div>
              </Row>
            </dl>
          </section>

          <section className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card sm:col-span-2">
            <h2 className="mb-2 font-display text-base font-bold text-ink">
              تجربته ودوافعه
            </h2>
            <dl>
              <Row label="ماذا يمكنه أن يقدّم لطموح">{applicant.contribution}</Row>
              <Row label="رابط الأعمال والتجارب">
                {applicant.portfolio_link ? (
                  <a
                    href={applicant.portfolio_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-flame-600 hover:underline"
                  >
                    <LinkIcon className="h-3.5 w-3.5" />
                    {applicant.portfolio_link}
                  </a>
                ) : (
                  "—"
                )}
              </Row>
              <Row label="لماذا يريد الانضمام">{applicant.motivation}</Row>
            </dl>
          </section>
        </div>
      </main>
    </div>
  );
}

export default function ApplicantDetailPage() {
  return (
    <AuthGuard>
      <ApplicantDetail />
    </AuthGuard>
  );
}
