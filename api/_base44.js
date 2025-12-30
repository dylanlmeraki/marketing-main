import { createClient } from "@base44/sdk";

export function getBase44Service() {
  const appId = process.env.BASE44_APP_ID;
  const serviceToken = process.env.BASE44_SERVICE_TOKEN;
  if (!appId || !serviceToken) {
    throw new Error("Missing BASE44_APP_ID or BASE44_SERVICE_TOKEN");
  }

  const client = createClient({ appId, serviceToken });
  return client.asServiceRole; // service role access :contentReference[oaicite:3]{index=3}
}
