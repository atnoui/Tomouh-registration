import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { DEPARTMENT_TELEGRAM_LINKS } from "@/lib/constants";

// Called by a Supabase Database trigger whenever an applicant's status is
// updated to "accepted". Not called by the browser directly.
export async function POST(request) {
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
  if (!applicant?.email) {
    return NextResponse.json({ error: "No applicant email in payload" }, { status: 400 });
  }

  const departments = applicant.departments || [];
  const links = [
    ...new Set(
      departments.map((d) => DEPARTMENT_TELEGRAM_LINKS[d]).filter(Boolean)
    ),
  ];

  const siteUrl = process.env.SITE_URL || "";
  const logoUrl = `${siteUrl}/logo.png`;

  const groupButtons = links
    .map(
      (link) =>
        `<a href="${link}" style="display:inline-block;margin:6px 6px 0 0;padding:12px 24px;background:#EF6C03;color:#ffffff;text-decoration:none;border-radius:999px;font-weight:bold;font-size:14px;">انضم إلى المجموعة</a>`
    )
    .join("");

  const html = `
  <div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;background:#FBF9F4;padding:32px 16px;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #eeeeee;">
      <div style="background:#17148C;padding:28px;text-align:center;">
        <img src="${logoUrl}" alt="طموح" width="56" height="56" style="border-radius:12px;display:inline-block;" />
      </div>
      <div style="padding:28px;">
        <h2 style="color:#14122E;margin:0 0 14px;font-size:22px;">
          مبروك يا ${applicant.full_name || "صديقنا"}! 🎉
        </h2>
        <p style="color:#333333;line-height:1.8;margin:0 0 16px;font-size:15px;">
          يسعدنا إعلامك بأنه تم قبولك ضمن فريق طموح. نحن متحمسون للعمل معك
          وترك أثر حقيقي سوياً.
        </p>
        <p style="color:#333333;line-height:1.8;margin:0 0 18px;font-size:15px;">
          الخطوة التالية: انضم إلى مجموعة فريقك على تيليجرام من هنا 👇
        </p>
        <div>${groupButtons}</div>
        <p style="color:#999999;font-size:13px;margin-top:28px;">فريق طموح</p>
      </div>
    </div>
  </div>`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"طموح" <${process.env.GMAIL_USER}>`,
      to: applicant.email,
      subject: "تم قبولك في فريق طموح 🎉",
      html,
    });
  } catch (err) {
    console.error("Email send failed:", err.message);
    return NextResponse.json(
      { error: "Email send failed", details: err.message },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
