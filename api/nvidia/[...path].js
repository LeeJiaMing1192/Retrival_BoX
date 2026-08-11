/**
 * Same-origin NVIDIA gateway for Vercel.
 * Keep NVIDIA_API_KEY in Vercel Environment Variables; never expose it to Vite.
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

  const routeParts = Array.isArray(req.query.path) ? req.query.path : [req.query.path].filter(Boolean);
  const upstreamPath = routeParts.join("/");

  try {
    const upstream = await fetch(`https://integrate.api.nvidia.com/${upstreamPath}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: req.headers.accept || "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const responseText = await upstream.text();
    res.status(upstream.status);
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
    return res.send(responseText);
  } catch (error) {
    console.error("[NVIDIA proxy] Request failed", error);
    return res.status(502).json({ error: { message: "Unable to reach NVIDIA API." } });
  }
}
