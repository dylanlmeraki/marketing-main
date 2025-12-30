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

    const { formData, uploadedFiles = [], htmlEmail, userConfirmationEmail } = req.body || {};
    if (!formData?.email || !formData?.name) {
      return res.status(400).json({ ok: false, error: "Missing name/email" });
    }

    const toTeam = process.env.CONTACT_INBOX;

    await base44.integrations.Core.SendEmail({
      to: toTeam,
      subject: `New Contact: ${formData.name}`,
      body:
        htmlEmail ||
        `From: ${formData.name} <${formData.email}>\n\nMessage:\n${formData.message || ""}\n\nFiles:\n${uploadedFiles
          .map((f) => `- ${f.name}: ${f.url}`)
          .join("\n")}`,
    });

    await base44.integrations.Core.SendEmail({
      to: formData.email,
      subject: "We received your message — Pacific Engineering",
      body: userConfirmationEmail || "Thanks — we received your message and will reply soon.",
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || "Server error" });
  }
}
