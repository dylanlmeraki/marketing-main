/**
 * API Client Abstraction Layer
 *
 * Central interface for backend calls.
 * - Public marketing site should not require auth.
 * - Base44 SDK is dynamically imported ONLY when a method needs it,
 *   so it won’t bloat your main bundle.
 */

async function getBase44() {
  // Lazy-load only when needed (creates separate Vite chunk)
  const mod = await import("@/api/base44Client");
  return mod.base44;
}

async function postJson(url, data) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data ?? {}),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
  return res.json();
}

export const apiClient = {
  // ========================================
  // ENTITY OPERATIONS
  // ========================================
  entities: {
    BlogPost: {
      list: async (sort = "-created_date", limit = 50, query = {}) => {
        const base44 = await getBase44();
        return base44.entities.BlogPost.filter(query, sort, limit);
      },
      get: async (slug) => {
        const base44 = await getBase44();
        const posts = await base44.entities.BlogPost.filter({ slug }, "-created_date", 1);
        return posts[0] || null;
      },
    },

    // Public marketing site: never call /User/me
    User: {
      me: async () => null,
    },

    Project: {
      list: async () => {
        // still local-only in this repo
        return [];
      },
      get: async () => null,
    },
  },

  // ========================================
  // INTEGRATIONS
  // ========================================
  integrations: {
    Core: {
      // Use Vercel function (service token server-side)
      InvokeLLM: async (params) => {
        return postJson("/functions/invokeLLM", params);
      },

      // If you still want uploads via Base44 directly from client, keep this.
      // It will only load Base44 when user actually uploads.
      UploadFile: async (payload) => {
        const base44 = await getBase44();
        return base44.integrations.Core.UploadFile(payload);
      },

      // If you still want Base44 direct email calls from client (generally not recommended),
      // keep this; otherwise remove it.
      SendEmail: async (params) => {
        const base44 = await getBase44();
        return base44.integrations.Core.SendEmail(params);
      },
    },
  },

  // ========================================
  // FUNCTION ENDPOINTS (Vercel)
  // ========================================
  functions: {
    sendContactFormEmail: async (data) => {
      return postJson("/functions/sendContactFormEmail", data);
    },

    sendSWPPPFormEmail: async (data) => {
      return postJson("/functions/sendSWPPPFormEmail", data);
    },

    logChatbotActivity: async (data) => {
      return postJson("/functions/logChatbotActivity", data);
    },
  },
};
