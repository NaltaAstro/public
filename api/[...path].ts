import type { NextApiRequest, NextApiResponse } from "next"
import httpProxyMiddleware from "next-http-proxy-middleware"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Lidar com solicitações OPTIONS para CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    res.status(200).end()
    return
  }

  return httpProxyMiddleware(req, res, {
    target: "https://controle-bc.bubbleapps.io",
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
    // Não podemos modificar facilmente o corpo da resposta com este middleware
    // Vamos focar em resolver o problema de CORS primeiro
  })
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}

