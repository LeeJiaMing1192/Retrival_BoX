/**
 * Vercel production endpoint for all NVIDIA model calls.
 * Set NVIDIA_API_KEY in Vercel Project Settings → Environment Variables.
 */
export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: { message: "Method not allowed" } }), {
        status: 405,
        headers: { "Content-Type": "application/json", Allow: "POST" }
      });
    }

    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      return Response.json({ error: { message: "NVIDIA_API_KEY is not configured on this deployment." } }, { status: 500 });
    }

    try {
      const upstream = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: await request.text()
      });

      return new Response(upstream.body, {
        status: upstream.status,
        headers: { "Content-Type": upstream.headers.get("content-type") || "application/json" }
      });
    } catch (error) {
      console.error("[NVIDIA proxy] Request failed", error);
      return Response.json({ error: { message: "Unable to reach NVIDIA API." } }, { status: 502 });
    }
  }
};
