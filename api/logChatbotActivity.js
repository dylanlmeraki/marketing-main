import { getBase44Service } from "./_base44.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  try {
    const base44 = getBase44Service();
    const payload = req.body || {};

    // If you have a Base44 function, call it; otherwise email yourself the log
    try {
      await base44.functions.logChatbotActivity(payload);
    } catch {
      await base44.integrations.Core.SendEmail({
        to: process.env.CONTACT_INBOX,
        subject: `Chatbot log: ${payload.sessionId || "unknown"}`,
        body: JSON.stringify(payload, null, 2),
      });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || "Server error" });
  }
}
