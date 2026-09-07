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
  const firstName = applicant.full_name || "صديقنا";

  const groupButtonRows = links
    .map(
      (link) => `
        <tr>
          <td align="center" style="padding:0 0 12px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td bgcolor="#EF6C03" class="btn-bg" style="border-radius:999px;background-color:#EF6C03;">
                  <a href="${link}" target="_blank" class="btn-text"
                     style="display:inline-block;padding:14px 32px;color:#ffffff;
                            text-decoration:none;font-weight:bold;font-size:15px;
                            font-family:Tahoma,Arial,sans-serif;">
                    انضم إلى المجموعة
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>تم قبولك في فريق طموح</title>
  <style>
    /* Some mail clients auto-invert colors in dark mode. These rules force
       our own palette to stay exactly as designed either way. */
    @media (prefers-color-scheme: dark) {
      .bg-page   { background-color:#FBF9F4 !important; }
      .bg-card   { background-color:#ffffff !important; }
      .bg-header { background-color:#17148C !important; }
      .text-heading { color:#14122E !important; }
      .text-body    { color:#333333 !important; }
      .text-footer  { color:#999999 !important; }
      .btn-bg   { background-color:#EF6C03 !important; }
      .btn-text { color:#ffffff !important; }
    }
    @media screen and (max-width: 480px) {
      .outer-pad { padding:20px 10px !important; }
      .card-pad  { padding:24px 20px 8px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#FBF9F4;" bgcolor="#FBF9F4">
  <!-- Preheader: hidden preview text shown next to the subject in the inbox -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    تم قبولك ضمن فريق طموح — انضم الآن إلى مجموعة فريقك على تيليجرام.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#FBF9F4" class="bg-page" style="background-color:#FBF9F4;">
    <tr>
      <td align="center" class="outer-pad" style="padding:32px 16px;">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" bgcolor="#ffffff" class="bg-card"
               style="max-width:480px;width:100%;background-color:#ffffff;border-radius:16px;
                      overflow:hidden;border:1px solid #eeeeee;">
          <!-- Header / logo -->
          <tr>
            <td align="center" bgcolor="#17148C" class="bg-header" style="background-color:#17148C;padding:32px;">
              <img src="${logoUrl}" width="64" height="64" alt="طموح"
                   style="display:block;border-radius:14px;border:0;outline:none;" />
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td bgcolor="#ffffff" class="bg-card card-pad" style="background-color:#ffffff;padding:32px 28px 8px;text-align:right;direction:rtl;">
              <h1 class="text-heading" style="margin:0 0 16px;color:#14122E;font-size:23px;line-height:1.4;
                         font-family:Tahoma,Arial,sans-serif;">
                مبروك يا ${firstName}! 🎉
              </h1>
              <p class="text-body" style="margin:0 0 16px;color:#333333;font-size:15px;line-height:1.8;
                        font-family:Tahoma,Arial,sans-serif;">
                يسعدنا إعلامك بأنه تم قبولك ضمن فريق طموح. نحن متحمسون للعمل معك
                وترك أثر حقيقي سوياً.
              </p>
              <p class="text-body" style="margin:0 0 24px;color:#333333;font-size:15px;line-height:1.8;
                        font-family:Tahoma,Arial,sans-serif;">
                الخطوة التالية: انضم إلى مجموعة فريقك على تيليجرام من الزر أدناه.
              </p>
            </td>
          </tr>
          <!-- Buttons -->
          <tr>
            <td bgcolor="#ffffff" class="bg-card" style="background-color:#ffffff;padding:0 28px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${groupButtonRows}
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td bgcolor="#ffffff" class="bg-card" style="background-color:#ffffff;padding:16px 28px 32px;text-align:right;direction:rtl;">
              <p class="text-footer" style="margin:0;color:#999999;font-size:13px;
                        font-family:Tahoma,Arial,sans-serif;">
                فريق طموح
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const groupUrlsPlain = links.length ? links.join("\n") : "—";
  const text = [
    `مبروك يا ${applicant.full_name || "صديقنا"}!`,
    "",
    "يسعدنا إعلامك بأنه تم قبولك ضمن فريق طموح. نحن متحمسون للعمل معك وترك أثر حقيقي سوياً.",
    "",
    "انضم إلى مجموعة فريقك على تيليجرام من الرابط/الروابط التالية:",
    groupUrlsPlain,
    "",
    "فريق طموح",
  ].join("\n");

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
      replyTo: process.env.GMAIL_USER,
      to: applicant.email,
      subject: "تم قبولك في فريق طموح 🎉",
      text,
      html,
    });
  } catch (err) {
    console.error("Email send failed:", err.message);
    return NextResponse.json(
      { error: "Email send failed", details: err.message },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, source: "notify-accepted" });
}
