"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import {
  WILAYAS,
  WEEKLY_HOURS_OPTIONS,
  DEPARTMENTS,
} from "@/lib/constants";

const STEPS = ["البيانات الشخصية", "تجربتك ودوافعك", "التوفر والانضمام"];

const initialData = {
  full_name: "",
  age: "",
  email: "",
  phone: "",
  wilaya: "",
  contribution: "",
  portfolio_link: "",
  field_of_study: "",
  motivation: "",
  weekly_hours: "",
  ready_to_commit: null,
  departments: [],
};

function Field({ label, error, children, hint }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-ink/50">{hint}</span>}
      {error && <span className="mt-1 block text-xs font-medium text-rose-600">{error}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-ink placeholder:text-ink/35 transition focus:border-flame-500 focus:outline-none focus:ring-2 focus:ring-flame-500/20";

export default function RegistrationForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [done, setDone] = useState(false);

  function set(field, value) {
    setData((d) => ({ ...d, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function toggleDepartment(value) {
    setData((d) => {
      const has = d.departments.includes(value);
      return {
        ...d,
        departments: has
          ? d.departments.filter((v) => v !== value)
          : [...d.departments, value],
      };
    });
    if (errors.departments) setErrors((e) => ({ ...e, departments: undefined }));
  }

  function validateStep(current) {
    const next = {};
    if (current === 0) {
      if (!data.full_name.trim()) next.full_name = "الرجاء إدخال الاسم الكامل";
      if (!data.age || Number(data.age) < 10 || Number(data.age) > 100)
        next.age = "الرجاء إدخال عمر صحيح";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
        next.email = "الرجاء إدخال بريد إلكتروني صحيح";
      if (!data.wilaya) next.wilaya = "الرجاء اختيار ولاية الإقامة";
    }
    if (current === 1) {
      if (!data.contribution.trim()) next.contribution = "هذا الحقل مطلوب";
      if (!data.field_of_study.trim()) next.field_of_study = "هذا الحقل مطلوب";
      if (!data.motivation.trim()) next.motivation = "هذا الحقل مطلوب";
    }
    if (current === 2) {
      if (!data.weekly_hours) next.weekly_hours = "الرجاء اختيار إجابة";
      if (data.ready_to_commit === null) next.ready_to_commit = "الرجاء اختيار إجابة";
      if (data.departments.length === 0) next.departments = "اختر فرعاً واحداً على الأقل";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateStep(2)) return;
    setSubmitting(true);
    setSubmitError("");

    const { error } = await supabase.from("applicants").insert([
      {
        full_name: data.full_name.trim(),
        age: Number(data.age),
        email: data.email.trim(),
        phone: data.phone.trim() || null,
        wilaya: data.wilaya,
        contribution: data.contribution.trim(),
        portfolio_link: data.portfolio_link.trim() || null,
        field_of_study: data.field_of_study.trim(),
        motivation: data.motivation.trim(),
        weekly_hours: data.weekly_hours,
        ready_to_commit: data.ready_to_commit,
        departments: data.departments,
      },
    ]);

    setSubmitting(false);
    if (error) {
      setSubmitError("تعذر إرسال طلبك. تحقق من اتصالك بالإنترنت وحاول مجدداً.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center rounded-3xl border border-ink/10 bg-white px-8 py-14 text-center shadow-card">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-flame-500/10">
          <Check className="h-8 w-8 text-flame-500" strokeWidth={2.5} />
        </div>
        <h3 className="mt-6 text-2xl font-bold text-ink">تم استلام طلبك</h3>
        <p className="mt-3 text-ink/60">
          شكراً لك على وقتك. سيراجع فريق طموح إجاباتك وسنتواصل معك على بريدك
          الإلكتروني قريباً.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-ink/10 bg-white p-6 shadow-card sm:p-10">
      {/* Step indicator */}
      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${
                i <= step ? "bg-flame-500 text-white" : "bg-ink/5 text-ink/40"
              }`}
            >
              {i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 rounded-full transition ${
                  i < step ? "bg-flame-500" : "bg-ink/10"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <p className="mb-6 text-sm font-semibold text-flame-600">{STEPS[step]}</p>

      <form onSubmit={handleSubmit}>
        {step === 0 && (
          <div className="flex flex-col gap-5">
            <Field label="الإسم الكامل" error={errors.full_name}>
              <input
                className={inputClass}
                value={data.full_name}
                onChange={(e) => set("full_name", e.target.value)}
                placeholder="مثال: أمينة بلحاج"
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="العمر" error={errors.age}>
                <input
                  type="number"
                  className={inputClass}
                  value={data.age}
                  onChange={(e) => set("age", e.target.value)}
                  placeholder="مثال: 22"
                />
              </Field>
              <Field label="رقم الهاتف" hint="اختياري">
                <input
                  type="tel"
                  className={inputClass}
                  value={data.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="0555 12 34 56"
                />
              </Field>
            </div>
            <Field label="البريد الإلكتروني" error={errors.email}>
              <input
                type="email"
                className={inputClass}
                value={data.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="name@example.com"
              />
            </Field>
            <Field label="ولاية الإقامة" error={errors.wilaya}>
              <select
                className={inputClass}
                value={data.wilaya}
                onChange={(e) => set("wilaya", e.target.value)}
              >
                <option value="">اختر ولايتك</option>
                {WILAYAS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-5">
            <Field label="تخصص دراسي" error={errors.field_of_study}>
              <input
                className={inputClass}
                value={data.field_of_study}
                onChange={(e) => set("field_of_study", e.target.value)}
                placeholder="مثال: هندسة معلوماتية"
              />
            </Field>
            <Field label="ماذا يمكنك أن تقدّم لطموح؟" error={errors.contribution}>
              <textarea
                rows={3}
                className={inputClass}
                value={data.contribution}
                onChange={(e) => set("contribution", e.target.value)}
                placeholder="المهارات أو الخبرات التي تجلبها معك"
              />
            </Field>
            <Field
              label="رابط أعمالك وتجاربك"
              hint="اختياري — Drive, GitHub, Figma, Canva..."
              error={errors.portfolio_link}
            >
              <input
                className={inputClass}
                value={data.portfolio_link}
                onChange={(e) => set("portfolio_link", e.target.value)}
                placeholder="https://"
              />
            </Field>
            <Field label="لماذا تريد الانضمام لفريق طموح؟" error={errors.motivation}>
              <textarea
                rows={4}
                className={inputClass}
                value={data.motivation}
                onChange={(e) => set("motivation", e.target.value)}
                placeholder="شاركنا دوافعك بصدق"
              />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">
            <Field label="كم ساعة يمكنك تخصيصها أسبوعياً؟" error={errors.weekly_hours}>
              <div className="flex flex-wrap gap-2">
                {WEEKLY_HOURS_OPTIONS.map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => set("weekly_hours", opt.value)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      data.weekly_hours === opt.value
                        ? "border-flame-500 bg-flame-500 text-white"
                        : "border-ink/15 bg-white text-ink/70 hover:border-flame-500/50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </Field>

            <Field
              label="هل أنت مستعد للالتزام والعمل الجاد مع فريق طموح؟"
              error={errors.ready_to_commit}
            >
              <div className="flex gap-2">
                {[
                  { value: true, label: "نعم" },
                  { value: false, label: "لا" },
                ].map((opt) => (
                  <button
                    type="button"
                    key={String(opt.value)}
                    onClick={() => set("ready_to_commit", opt.value)}
                    className={`rounded-full border px-6 py-2 text-sm font-medium transition ${
                      data.ready_to_commit === opt.value
                        ? "border-flame-500 bg-flame-500 text-white"
                        : "border-ink/15 bg-white text-ink/70 hover:border-flame-500/50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </Field>

            <Field
              label="أين ترى نفسك تعمل مع طموح؟"
              hint="يمكنك اختيار أكثر من فرع"
              error={errors.departments}
            >
              <div className="flex flex-wrap gap-2">
                {DEPARTMENTS.map((dep) => {
                  const active = data.departments.includes(dep.value);
                  return (
                    <button
                      type="button"
                      key={dep.value}
                      onClick={() => toggleDepartment(dep.value)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        active
                          ? "border-navy-800 bg-navy-800 text-white"
                          : "border-ink/15 bg-white text-ink/70 hover:border-navy-800/40"
                      }`}
                    >
                      {dep.label}
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>
        )}

        {submitError && (
          <p className="mt-6 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
            {submitError}
          </p>
        )}

        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-ink/60 transition hover:text-ink disabled:invisible"
          >
            <ChevronRight className="h-4 w-4" />
            السابق
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="flex items-center gap-1 rounded-xl bg-navy-800 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700"
            >
              التالي
              <ChevronLeft className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-flame-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-flame-600 disabled:opacity-70"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "جارِ الإرسال..." : "إرسال الطلب"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
