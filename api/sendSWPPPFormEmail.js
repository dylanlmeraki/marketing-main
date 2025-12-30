import { getBase44Service } from "./_base44.js";

const ALLOWED_ORIGINS = new Set([
  "https://pacificengineeringsf.com",
  "https://www.pacificengineeringsf.com"
]);

function cors(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
}

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  try {
    const base44 = getBase44Service();

    const { formData, emailBody, userConfirmationEmail } = req.body || {};
    if (!formData?.email || !formData?.name) {
      return res.status(400).json({ ok: false, error: "Missing name/email" });
    }

    const toTeam = process.env.CONSULTATION_INBOX || process.env.CONTACT_INBOX;

    await base44.integrations.Core.SendEmail({
      to: toTeam,
      subject: `New Consultation Request: ${formData.name}`,
      body: emailBody || "New consultation request received.",
    });

    await base44.integrations.Core.SendEmail({
      to: formData.email,
      subject: "Consultation request received — Pacific Engineering",
      body: userConfirmationEmail || "Thanks — we received your request and will contact you soon.",
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || "Server error" });
  }
}
