import { NextResponse } from "next/server";
import { departmentLabel } from "@/lib/constants";

// This endpoint is called by a Supabase Database Webhook whenever a new row
// is inserted into `applicants`. It is NOT called by the browser directly.
export async function POST(request) {
  // Shared-secret check so a stranger who finds this URL can't spam your bot.
  const providedSecret = request.headers.get("x-webhook-secret");
  if (!process.env.NOTIFY_SECRET || providedSecret !== process.env.NOTIFY_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const applicant = payload?.record;
  if (!applicant) {
    return NextResponse.json({ error: "No record in payload" }, { status: 400 });
  }

  const departments = (applicant.departments || [])
    .map(departmentLabel)
    .join("، ") || "—";

  const text = [
    "📥 طلب انضمام جديد لطموح",
    "",
    `👤 الاسم: ${applicant.full_name || "—"}`,
    `📍 الولاية: ${applicant.wilaya || "—"}`,
    `🎓 التخصص: ${applicant.field_of_study || "—"}`,
    `🏷️ الفروع: ${departments}`,
    `📧 البريد: ${applicant.email || "—"}`,
    applicant.phone ? `📱 الهاتف: ${applicant.phone}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID env vars");
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  const telegramRes = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    }
  );

  if (!telegramRes.ok) {
    const errBody = await telegramRes.text();
    console.error("Telegram API error:", errBody);
    return NextResponse.json(
      { error: "Telegram send failed", details: errBody },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
