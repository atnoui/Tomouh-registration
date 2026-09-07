import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { DEPARTMENT_TELEGRAM_LINKS, departmentLabel } from "@/lib/constants";

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
  const departmentNames = departments.map(departmentLabel).join("، ") || "—";

  const siteUrl = process.env.SITE_URL || "";
  // logo-hero.png is the self-contained navy-badge version of the mark (used
  // on dark backgrounds); logo.png is the navy-on-transparent version (used
  // on light backgrounds, e.g. the footer band which is also dark here so we
  // actually want logo-hero.png again there too).
  const heroLogoUrl = `${siteUrl}/logo-hero.png`;
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
                     style="display:inline-block;padding:14px 36px;color:#ffffff;
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
      .bg-page    { background-color:#FBF9F4 !important; }
      .bg-card    { background-color:#ffffff !important; }
      .bg-header  { background-color:#17148C !important; }
      .bg-footer  { background-color:#0A0933 !important; }
      .bg-callout { background-color:#FBF9F4 !important; }
      .text-heading { color:#14122E !important; }
      .text-body     { color:#333333 !important; }
      .text-footer   { color:#B9B7D9 !important; }
      .text-white    { color:#ffffff !important; }
      .text-orange   { color:#EF6C03 !important; }
      .btn-bg   { background-color:#EF6C03 !important; }
      .btn-text { color:#ffffff !important; }
    }
    @media screen and (max-width: 480px) {
      .outer-pad  { padding:20px 10px !important; }
      .card-pad   { padding:24px 20px 8px !important; }
      .footer-pad { padding:28px 20px !important; }
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
      <td align="center" class="outer-pad" style="padding:40px 16px;">
        <table role="presentation" width="520" cellpadding="0" cellspacing="0" bgcolor="#ffffff" class="bg-card"
               style="max-width:520px;width:100%;background-color:#ffffff;border-radius:20px;
                      overflow:hidden;border:1px solid #eeeeee;table-layout:fixed;">

          <!-- Hero -->
          <tr>
            <td align="center" bgcolor="#17148C" class="bg-header"
                style="background-color:#17148C;background-image:linear-gradient(160deg,#0A0933 0%,#17148C 55%,#221CA8 100%);padding:44px 32px 36px;">
              <img src="${heroLogoUrl}" width="76" height="76" alt="طموح"
                   style="display:block;margin:0 auto 14px;border-radius:18px;border:0;outline:none;" />
              <div class="text-white" style="color:#ffffff;font-size:20px;font-weight:bold;
                          font-family:Tahoma,Arial,sans-serif;word-wrap:break-word;overflow-wrap:break-word;letter-spacing:0.5px;">
                طموح
              </div>
              <div class="text-white" style="color:#c9c7f0;font-size:12px;margin-top:4px;
                          font-family:Tahoma,Arial,sans-serif;word-wrap:break-word;overflow-wrap:break-word;">
                من فكرة إلى أثر
              </div>
            </td>
          </tr>

          <!-- Headline + body -->
          <tr>
            <td bgcolor="#ffffff" class="bg-card card-pad" style="background-color:#ffffff;padding:36px 32px 8px;text-align:right;direction:rtl;">
              <h1 class="text-heading" style="margin:0 0 18px;color:#14122E;font-size:24px;line-height:1.4;
                         font-family:Tahoma,Arial,sans-serif;word-wrap:break-word;overflow-wrap:break-word;">
                🎉 مبروك يا <span class="text-orange" style="color:#EF6C03;">${firstName}</span>!
              </h1>
              <p class="text-body" style="margin:0 0 16px;color:#333333;font-size:15px;line-height:1.9;
                        font-family:Tahoma,Arial,sans-serif;word-wrap:break-word;overflow-wrap:break-word;">
                يسعدنا إعلامك بأنه تم قبولك ضمن فريق طموح. نحن متحمسون للعمل معك
                وترك أثر حقيقي سوياً.
              </p>
            </td>
          </tr>

          <!-- Department callout -->
          <tr>
            <td bgcolor="#ffffff" class="bg-card" style="background-color:#ffffff;padding:0 32px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#FBF9F4" class="bg-callout"
                     style="background-color:#FBF9F4;border-radius:14px;table-layout:fixed;width:100%;">
                <tr>
                  <td style="padding:16px 20px;text-align:right;direction:rtl;">
                    <div class="text-orange" style="color:#EF6C03;font-size:12px;font-weight:bold;
                                letter-spacing:0.3px;font-family:Tahoma,Arial,sans-serif;word-wrap:break-word;overflow-wrap:break-word;">
                      الفرع المقبول فيه
                    </div>
                    <div class="text-heading" style="color:#14122E;font-size:15px;font-weight:bold;
                                margin-top:4px;font-family:Tahoma,Arial,sans-serif;word-wrap:break-word;overflow-wrap:break-word;">
                      ${departmentNames}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA lead-in -->
          <tr>
            <td bgcolor="#ffffff" class="bg-card" style="background-color:#ffffff;padding:22px 32px 8px;text-align:right;direction:rtl;">
              <p class="text-body" style="margin:0;color:#333333;font-size:15px;line-height:1.9;
                        font-family:Tahoma,Arial,sans-serif;word-wrap:break-word;overflow-wrap:break-word;">
                الخطوة التالية: انضم إلى مجموعة فريقك على تيليجرام من الزر أدناه.
              </p>
            </td>
          </tr>

          <!-- Buttons -->
          <tr>
            <td bgcolor="#ffffff" class="bg-card" style="background-color:#ffffff;padding:12px 32px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${groupButtonRows}
              </table>
            </td>
          </tr>

          <!-- Spacer -->
          <tr>
            <td bgcolor="#ffffff" class="bg-card" style="background-color:#ffffff;padding:12px 32px 0;">
              <div style="border-top:1px solid #eeeeee;"></div>
            </td>
          </tr>

          <!-- Footer band -->
          <tr>
            <td align="center" bgcolor="#0A0933" class="bg-footer footer-pad"
                style="background-color:#0A0933;padding:32px;">
              <img src="${heroLogoUrl}" width="40" height="40" alt="طموح"
                   style="display:block;margin:0 auto 12px;border-radius:10px;border:0;outline:none;" />
              <div class="text-white" style="color:#ffffff;font-size:14px;font-weight:bold;
                          font-family:Tahoma,Arial,sans-serif;word-wrap:break-word;overflow-wrap:break-word;">
                فريق طموح
              </div>
              <div class="text-footer" style="color:#B9B7D9;font-size:12px;line-height:1.8;
                          margin-top:10px;font-family:Tahoma,Arial,sans-serif;word-wrap:break-word;overflow-wrap:break-word;">
                أنت تستلم هذا البريد لأنك تقدمت بطلب انضمام إلى طموح.
              </div>
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
    `مبروك يا ${firstName}!`,
    "",
    "يسعدنا إعلامك بأنه تم قبولك ضمن فريق طموح. نحن متحمسون للعمل معك وترك أثر حقيقي سوياً.",
    "",
    `الفرع المقبول فيه: ${departmentNames}`,
    "",
    "انضم إلى مجموعة فريقك على تيليجرام من الرابط/الروابط التالية:",
    groupUrlsPlain,
    "",
    "فريق طموح",
    "أنت تستلم هذا البريد لأنك تقدمت بطلب انضمام إلى طموح.",
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
