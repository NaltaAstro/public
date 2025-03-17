import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Obter o caminho e os parâmetros de consulta da URL original
  const url = request.nextUrl
  const pathname = url.pathname
  const search = url.search

  // Construir a URL de destino completa
  const destinationUrl = `https://controle-bc.bubbleapps.io${pathname}${search}`

  // Criar um redirecionamento 307 (Temporary Redirect) que preserva o método HTTP
  return NextResponse.redirect(destinationUrl, {
    status: 307,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  })
}

export const config = {
  matcher: "/:path*",
}

