// ── Email Templates (Phase 27) ───────────────────────
// HTML templates for newsletter double opt-in, welcome and unsubscribe.
// Phase 29 will plug in a real provider (Resend/SendGrid); for now we log
// and return the HTML so the API can record delivery status without
// requiring external secrets.

export interface EmailTemplate {
  subject: string;
  subjectBn?: string;
  html: string;
  text: string;
}

function layout(content: string, preheader?: string): string {
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<style>
  body{margin:0;padding:0;background:#050a15;color:#e5e7eb;font-family:Inter,Hind Siliguri,system-ui,sans-serif}
  .container{max-width:600px;margin:0 auto;background:#0a1628;border-radius:16px;overflow:hidden;border:1px solid rgba(245,158,11,.15)}
  .header{padding:32px 28px;background:linear-gradient(135deg,#f59e0b 0%,#f97316 60%,#ef4444 100%);color:#050a15}
  .header h1{margin:0;font-size:20px;letter-spacing:-.02em}
  .body{padding:28px}
  .btn{display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#f59e0b,#f97316);color:#050a15 !important;text-decoration:none;border-radius:999px;font-weight:700}
  .muted{color:#94a3b8;font-size:13px}
  .footer{padding:20px 28px;border-top:1px solid rgba(255,255,255,.06);font-size:12px;color:#64748b}
  a{color:#f59e0b}
</style>
</head>
<body>
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${preheader}</div>` : ""}
  <div style="padding:24px;background:#050a15">
    <div class="container">
      <div class="header"><h1>RahatVerse — রাহাতভার্স</h1></div>
      <div class="body">${content}</div>
      <div class="footer">
        <p style="margin:0">Rahat Ahmed • Sunamganj, Bangladesh • <a href="https://rahatverse01.vercel.app">rahatverse01.vercel.app</a></p>
        <p class="muted" style="margin:8px 0 0">You receive this because you interacted with RahatVerse.</p>
      </div>
    </div>
  </div>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
}

export function confirmationEmail(params: {
  name?: string | null;
  confirmUrl: string;
  unsubscribeUrl: string;
  locale?: string;
}): EmailTemplate {
  const isBn = params.locale === "bn";
  const displayName = params.name ? escapeHtml(params.name) : isBn ? "বন্ধু" : "friend";
  const contentEn = `
    <p>Hi ${displayName},</p>
    <p>Thanks for subscribing to <strong>RahatVerse</strong> newsletter — stories on education, technology and social service, straight from Sunamganj.</p>
    <p>Please confirm your email to complete the subscription:</p>
    <p style="text-align:center;margin:28px 0"><a class="btn" href="${escapeHtml(params.confirmUrl)}">Confirm my email</a></p>
    <p class="muted">Link expires in 48 hours. If you did not request this, you can ignore it or <a href="${escapeHtml(params.unsubscribeUrl)}">unsubscribe</a>.</p>
    <p class="muted">Or copy: <br><span style="word-break:break-all">${escapeHtml(params.confirmUrl)}</span></p>
  `;
  const contentBn = `
    <p>হ্যালো ${displayName},</p>
    <p><strong>RahatVerse</strong> নিউজলেটারে সাবস্ক্রাইব করার জন্য ধন্যবাদ — শিক্ষা, প্রযুক্তি ও সমাজসেবা নিয়ে লেখা সরাসরি সুনামগঞ্জ থেকে।</p>
    <p>সাবস্ক্রিপশন সম্পূর্ণ করতে আপনার ইমেইল নিশ্চিত করুন:</p>
    <p style="text-align:center;margin:28px 0"><a class="btn" href="${escapeHtml(params.confirmUrl)}">ইমেইল নিশ্চিত করুন</a></p>
    <p class="muted">লিংকটি ৪৮ ঘণ্টা পর মেয়াদোত্তীর্ণ হবে। আপনি অনুরোধ না করে থাকলে উপেক্ষা করুন বা <a href="${escapeHtml(params.unsubscribeUrl)}">আনসাবস্ক্রাইব</a> করুন।</p>
    <p class="muted">লিংক কপি করুন: <br><span style="word-break:break-all">${escapeHtml(params.confirmUrl)}</span></p>
  `;
  const chosen = isBn ? contentBn : contentEn;
  return {
    subject: isBn ? "RahatVerse — ইমেইল নিশ্চিত করুন" : "Confirm your RahatVerse subscription",
    subjectBn: "RahatVerse — ইমেইল নিশ্চিত করুন",
    html: layout(chosen, isBn ? "আপনার ইমেইল নিশ্চিত করুন" : "Confirm your subscription"),
    text: isBn
      ? `হ্যালো ${params.name || "বন্ধু"}, RahatVerse নিশ্চিতকরণ লিংক: ${params.confirmUrl} (৪৮ ঘণ্টা) — আনসাবস্ক্রাইব: ${params.unsubscribeUrl}`
      : `Hi ${params.name || "friend"}, confirm your RahatVerse subscription: ${params.confirmUrl} (48h) — unsubscribe: ${params.unsubscribeUrl}`,
  };
}

export function welcomeEmail(params: {
  name?: string | null;
  preferencesUrl: string;
  unsubscribeUrl: string;
  locale?: string;
}): EmailTemplate {
  const isBn = params.locale === "bn";
  const displayName = params.name ? escapeHtml(params.name) : isBn ? "বন্ধু" : "friend";
  const content = isBn
    ? `
    <p>হ্যালো ${displayName}, স্বাগতম! 🎉</p>
    <p>আপনার ইমেইল সফলভাবে নিশ্চিত হয়েছে। এখন থেকে RahatVerse এর নতুন লেখা, প্রজেক্ট আপডেট ও বিশেষ ঘোষণা সরাসরি পাবেন।</p>
    <p style="text-align:center;margin:24px 0">
      <a class="btn" href="${escapeHtml(params.preferencesUrl)}">পছন্দ সেট করুন</a>
    </p>
    <p class="muted">যেকোনো সময় <a href="${escapeHtml(params.unsubscribeUrl)}">আনসাবস্ক্রাইব</a> করতে পারেন।</p>
  `
    : `
    <p>Hi ${displayName}, welcome! 🎉</p>
    <p>Your email is confirmed. You'll now receive RahatVerse stories, project updates and announcements.</p>
    <p style="text-align:center;margin:24px 0">
      <a class="btn" href="${escapeHtml(params.preferencesUrl)}">Manage preferences</a>
    </p>
    <p class="muted">You can <a href="${escapeHtml(params.unsubscribeUrl)}">unsubscribe</a> anytime.</p>
  `;
  return {
    subject: isBn ? "স্বাগতম — RahatVerse এ আপনাকে স্বাগতম!" : "Welcome to RahatVerse!",
    html: layout(content, "Welcome to RahatVerse"),
    text: isBn
      ? `স্বাগতম ${params.name || "বন্ধু"}! RahatVerse নিশ্চিত হয়েছে। পছন্দ: ${params.preferencesUrl} — আনসাবস্ক্রাইব: ${params.unsubscribeUrl}`
      : `Welcome ${params.name || "friend"}! Confirmed. Preferences: ${params.preferencesUrl} — unsubscribe: ${params.unsubscribeUrl}`,
  };
}

export function unsubscribeEmail(params: {
  resubscribeUrl: string;
  locale?: string;
}): EmailTemplate {
  const isBn = params.locale === "bn";
  const content = isBn
    ? `
    <p>আপনি সফলভাবে আনসাবস্ক্রাইব করেছেন।</p>
    <p>আবার সাবস্ক্রাইব করতে চাইলে:</p>
    <p style="text-align:center;margin:24px 0"><a class="btn" href="${escapeHtml(params.resubscribeUrl)}">পুনরায় সাবস্ক্রাইব করুন</a></p>
    <p class="muted">ভুল করে আনসাবস্ক্রাইব করলে উপরের লিংকে ক্লিক করুন।</p>
  `
    : `
    <p>You have been unsubscribed.</p>
    <p>Resubscribe anytime:</p>
    <p style="text-align:center;margin:24px 0"><a class="btn" href="${escapeHtml(params.resubscribeUrl)}">Resubscribe</a></p>
    <p class="muted">If this was a mistake, click above to rejoin.</p>
  `;
  return {
    subject: isBn ? "আপনি আনসাবস্ক্রাইব করেছেন" : "You have been unsubscribed",
    html: layout(content, "Unsubscribed"),
    text: `Unsubscribed. Resubscribe: ${params.resubscribeUrl}`,
  };
}

export function newsletterCampaignEmail(params: {
  subject: string;
  htmlContent: string;
  textContent?: string;
  name?: string | null;
  unsubscribeUrl: string;
  preferencesUrl: string;
  locale?: string;
}): EmailTemplate {
  const displayName = params.name ? escapeHtml(params.name) : params.locale === "bn" ? "বন্ধু" : "friend";
  const content = `
    <p>Hi ${displayName},</p>
    <div>${params.htmlContent}</div>
    <hr style="border:none;border-top:1px solid rgba(255,255,255,.08);margin:24px 0">
    <p class="muted" style="text-align:center">
      <a href="${escapeHtml(params.preferencesUrl)}">Preferences</a> • <a href="${escapeHtml(params.unsubscribeUrl)}">Unsubscribe</a>
    </p>
  `;
  return {
    subject: params.subject,
    html: layout(content, params.subject),
    text: params.textContent || `${params.subject}\n\n${stripHtml(params.htmlContent)}\n\nUnsubscribe: ${params.unsubscribeUrl} | Preferences: ${params.preferencesUrl}`,
  };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 2000);
}

export function contactNotificationEmail(params: { name: string; email: string; subject: string; message: string }): EmailTemplate {
  const content = `<p>New contact message from <strong>${escapeHtml(params.name)}</strong> (${escapeHtml(params.email)}).</p><p><strong>Topic:</strong> ${escapeHtml(params.subject)}</p><p>${escapeHtml(params.message).replace(/\n/g, "<br>")}</p>`;
  return { subject: `New RahatVerse contact: ${params.subject}`, html: layout(content, "New contact form submission"), text: `From: ${params.name} <${params.email}>\nTopic: ${params.subject}\n\n${params.message}` };
}

export function orderConfirmationEmail(params: { name: string; orderId: string; locale?: string }): EmailTemplate {
  const bn = params.locale === "bn";
  const content = bn ? `<p>হ্যালো ${escapeHtml(params.name)},</p><p>আপনার অর্ডার অনুরোধটি সফলভাবে পেয়েছি। রেফারেন্স: <strong>${escapeHtml(params.orderId)}</strong></p><p>শিগগিরই আপনার সঙ্গে যোগাযোগ করা হবে।</p>` : `<p>Hi ${escapeHtml(params.name)},</p><p>Your order request has been received. Reference: <strong>${escapeHtml(params.orderId)}</strong></p><p>We will be in touch soon.</p>`;
  return { subject: bn ? "আপনার অর্ডার অনুরোধ গ্রহণ করা হয়েছে" : "Your RahatVerse order request was received", html: layout(content), text: bn ? `আপনার অর্ডার অনুরোধ গ্রহণ করা হয়েছে। রেফারেন্স: ${params.orderId}` : `Your order request was received. Reference: ${params.orderId}` };
}
