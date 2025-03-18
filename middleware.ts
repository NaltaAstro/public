import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Obter a URL da solicitação
  const url = request.nextUrl.clone()
  const path = url.pathname
  const search = url.search

  // Construir a URL de destino
  const targetUrl = `https://controle-bc.bubbleapps.io${path}${search}`

  try {
    // Fazer a solicitação para o Bubble.io
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        ...Object.fromEntries(request.headers),
        host: "controle-bc.bubbleapps.io",
      },
      body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
    })

    // Obter o corpo da resposta
    const body = await response.text()

    // Criar uma nova resposta com cabeçalhos CORS
    const newResponse = new NextResponse(body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers),
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        "access-control-allow-headers": "Content-Type, Authorization",
      },
    })

    return newResponse
  } catch (error) {
    console.error("Erro ao fazer proxy:", error)
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}

export const config = {
  matcher: "/:path*",
}

