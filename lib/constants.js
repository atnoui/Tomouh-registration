// The 58 wilayas (provinces) of Algeria, in official numbering order.
export const WILAYAS = [
  "أدرار", "الشلف", "الأغواط", "أم البواقي", "باتنة", "بجاية", "بسكرة",
  "بشار", "البليدة", "البويرة", "تمنراست", "تبسة", "تلمسان", "تيارت",
  "تيزي وزو", "الجزائر", "الجلفة", "جيجل", "سطيف", "سعيدة", "سكيكدة",
  "سيدي بلعباس", "عنابة", "قالمة", "قسنطينة", "المدية", "مستغانم",
  "المسيلة", "معسكر", "ورقلة", "وهران", "البيض", "إليزي", "برج بوعريريج",
  "بومرداس", "الطارف", "تندوف", "تيسمسيلت", "الوادي", "خنشلة", "سوق أهراس",
  "تيبازة", "ميلة", "عين الدفلى", "النعامة", "عين تموشنت", "غرداية",
  "غليزان", "تيميمون", "برج باجي مختار", "أولاد جلال", "بني عباس",
  "عين صالح", "عين قزام", "تقرت", "جانت", "المغير", "المنيعة",
];

// Value/label pairs keep the DB storing a stable English-ish key while the UI shows Arabic.
export const WEEKLY_HOURS_OPTIONS = [
  { value: "less_than_6", label: "أقل من 6 ساعات" },
  { value: "6_to_10", label: "6 - 10 ساعات" },
  { value: "more_than_10", label: "أكثر من 10 ساعات" },
];

export const COMMITMENT_OPTIONS = [
  { value: true, label: "نعم" },
  { value: false, label: "لا" },
];

export const DEPARTMENTS = [
  { value: "design", label: "فرع ديزاين" },
  { value: "volunteers", label: "فرع متطوعين" },
  { value: "editing", label: "فرع مونتاج" },
  { value: "media", label: "فرع ميديا" },
  { value: "technical", label: "فريق تقني" },
  { value: "script", label: "فرع كتابة السكريبت" },
  { value: "voiceover", label: "فرع التعليق الصوتي" },
  { value: "monitoring", label: "فرع الرصد والتقييم" },
];

// Telegram group each accepted applicant gets invited to, per department.
// Script and voiceover intentionally point at the same shared group.
export const DEPARTMENT_TELEGRAM_LINKS = {
  design: "https://t.me/designtomouh",
  volunteers: "https://t.me/+TEXEtCombmxhZmQ0",
  media: "https://t.me/+_VuCb1BdUlk1ZWJk",
  monitoring: "https://t.me/+Pn0ehTa-_fdmNzg0",
  editing: "https://t.me/+Rk1wFAvWXDQ0OTg0",
  technical: "https://t.me/+ISV5ulN6OjwxMmRk",
  script: "https://t.me/+S1Ja_hRJ1kI0ZDI0",
  voiceover: "https://t.me/+S1Ja_hRJ1kI0ZDI0",
};

export const STATUS_OPTIONS = [
  { value: "pending", label: "قيد المراجعة", color: "bg-amber-100 text-amber-800 border-amber-200" },
  { value: "reviewed", label: "تمت المراجعة", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { value: "accepted", label: "مقبول", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  { value: "rejected", label: "مرفوض", color: "bg-rose-100 text-rose-800 border-rose-200" },
];

export function departmentLabel(value) {
  return DEPARTMENTS.find((d) => d.value === value)?.label || value;
}

export function statusMeta(value) {
  return STATUS_OPTIONS.find((s) => s.value === value) || STATUS_OPTIONS[0];
}
