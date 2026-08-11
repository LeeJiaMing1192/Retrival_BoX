import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function nvidiaGateway(key: string): Plugin {
  return { name: 'nvidia-gateway', configureServer(server) { server.middlewares.use('/api/nvidia', (req, res, next) => {
    if (req.method !== 'POST') return next(); const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk)); req.on('end', async () => { try {
      const upstream = await fetch(`https://integrate.api.nvidia.com${req.url || ''}`, { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: Buffer.concat(chunks) });
      res.statusCode = upstream.status; res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json'); res.end(await upstream.text());
    } catch (error) { res.statusCode = 502; res.end(JSON.stringify({ error: { message: error instanceof Error ? error.message : 'NVIDIA gateway error' } })); } });
  }) } }
}
export default defineConfig(({ mode }) => { const env = loadEnv(mode, process.cwd(), ''); let example = ''; try { example = readFileSync(resolve(process.cwd(), 'api-works.js'), 'utf8') } catch {} const key = example.match(/apiKey:\s*['"]([^'"]+)['"]/ )?.[1] || env.NVIDIA_API_KEY || env.VITE_NVIDIA_API_KEY || ''; return { plugins: [react(), nvidiaGateway(key)] } })
