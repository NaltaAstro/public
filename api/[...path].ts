import type { NextApiRequest, NextApiResponse } from "next"
import httpProxy from "http-proxy"

// Criar uma instância do proxy
const proxy = httpProxy.createProxyServer({
  target: "https://controle-bc.bubbleapps.io",
  changeOrigin: true,
})

// Adicionar um listener para o evento 'proxyRes'
proxy.on("proxyRes", (proxyRes, req, res) => {
  // Adicionar cabeçalhos CORS
  proxyRes.headers["access-control-allow-origin"] = "*"
  proxyRes.headers["access-control-allow-methods"] = "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
  proxyRes.headers["access-control-allow-headers"] = "Content-Type, Authorization"
})

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Lidar com solicitações OPTIONS para CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    res.status(200).end()
    return
  }

  // Remover o prefixo '/api' do caminho
  const path = req.url?.replace(/^\/api/, "") || "/"

  // Criar uma URL completa para o proxy
  const targetUrl = `https://controle-bc.bubbleapps.io${path}`

  // Proxy da solicitação
  return new Promise((resolve, reject) => {
    req.url = path

    proxy.web(req, res, { target: targetUrl }, (err) => {
      if (err) {
        console.error("Erro no proxy:", err)
        res.status(500).json({ error: "Erro ao processar a solicitação" })
        resolve()
      }
    })
  })
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}

