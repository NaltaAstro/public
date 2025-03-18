// Este é um arquivo de API do Next.js que funciona como proxy reverso
import { createProxyMiddleware } from "http-proxy-middleware"
import nextConnect from "next-connect"

// Configuração do proxy
const proxy = createProxyMiddleware({
  target: "https://controle-bc.bubbleapps.io",
  changeOrigin: true,
  pathRewrite: { "^/api": "" },
  onProxyRes: (proxyRes, req, res) => {
    // Adicionar cabeçalhos CORS
    proxyRes.headers["Access-Control-Allow-Origin"] = "*"
    proxyRes.headers["Access-Control-Allow-Methods"] = "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
    proxyRes.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"

    // Modificar o conteúdo da resposta para substituir URLs
    if (
      proxyRes.headers["content-type"] &&
      (proxyRes.headers["content-type"].includes("application/json") ||
        proxyRes.headers["content-type"].includes("text/html") ||
        proxyRes.headers["content-type"].includes("text/javascript"))
    ) {
      let body = ""
      const originalWrite = res.write
      const originalEnd = res.end

      // Capturar o corpo da resposta
      res.write = (chunk) => {
        body += chunk.toString("utf8")
        return true
      }

      // Modificar o corpo antes de enviá-lo
      res.end = (chunk) => {
        if (chunk) {
          body += chunk.toString("utf8")
        }

        // Substituir todas as ocorrências de controle-bc.bubbleapps.io por tenhopedido.com
        body = body.replace(/https:\/\/controle-bc\.bubbleapps\.io/g, "https://tenhopedido.com")

        // Restaurar os métodos originais
        res.write = originalWrite
        res.end = originalEnd

        // Enviar o corpo modificado
        res.write(Buffer.from(body))
        res.end()
      }
    }
  },
})

// Função auxiliar para executar o middleware
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

// Handler da API
const handler = nextConnect().all(async (req, res) => {
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
})

export default handler

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}

