import { statusMeta } from "@/lib/constants";

export default function StatusBadge({ status }) {
  const meta = statusMeta(status);
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${meta.color}`}
    >
      {meta.label}
    </span>
  );
}
