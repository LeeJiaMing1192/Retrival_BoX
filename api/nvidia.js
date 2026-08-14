/**
 * Vercel production endpoint for all NVIDIA model calls.
 * Set NVIDIA_API_KEY in Vercel Project Settings → Environment Variables.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: { message: "Method not allowed" } });
  }

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: { message: "NVIDIA_API_KEY is not configured on this deployment." } });
  }

  const requestId = `nvidia-${Date.now().toString(36)}`;
  console.log(`[${requestId}] request received`, { model: req.body?.model, hasKey: true });

  try {
    const upstream = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(req.body)
    });
    res.status(upstream.status);
    const contentType = upstream.headers.get("content-type") || "application/json";
    res.setHeader("Content-Type", contentType);

    if (req.body?.stream && upstream.body) {
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("Connection", "keep-alive");
      for await (const chunk of upstream.body) res.write(chunk);
      return res.end();
    }

    const responseText = await upstream.text();
    console.log(`[${requestId}] NVIDIA response`, { status: upstream.status, bytes: responseText.length });
    return res.send(responseText);
  } catch (error) {
    console.error(`[${requestId}] NVIDIA request failed`, error);
    return res.status(502).json({ error: { message: "Unable to reach NVIDIA API from the Vercel function." } });
  }
}
