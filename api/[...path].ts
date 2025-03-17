import type { NextApiRequest, NextApiResponse } from "next"
import { createProxyMiddleware } from "http-proxy-middleware"
import type { NextApiHandler } from "next"

// Configuração do proxy
const proxy = createProxyMiddleware({
  target: "https://controle-bc.bubbleapps.io",
  changeOrigin: true,
  pathRewrite: { "^/api": "" },
  onProxyRes: (proxyRes) => {
    // Adicionar cabeçalhos CORS à resposta
    proxyRes.headers["Access-Control-Allow-Origin"] = "*"
    proxyRes.headers["Access-Control-Allow-Methods"] = "GET,HEAD,PUT,PATCH,POST,DELETE"
    proxyRes.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
  },
})

// Função auxiliar para executar o middleware
const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

const handler: NextApiHandler = async (req, res) => {
  // Lidar com solicitações OPTIONS para CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    res.status(200).end()
    return
  }

  try {
    // Executar o proxy para todas as outras solicitações
    await runMiddleware(req, res, proxy)
  } catch (error) {
    console.error("Erro no proxy:", error)
    res.status(500).json({ error: "Erro ao processar a solicitação" })
  }
}

export default handler

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}

