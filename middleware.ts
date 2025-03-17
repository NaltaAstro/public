import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const { pathname, search } = url

  // Construir a URL de destino mantendo o caminho e os parâmetros de consulta
  const targetUrl = new URL(pathname + search, "https://controle-bc.bubbleapps.io")

  return NextResponse.redirect(targetUrl)
}

export const config = {
  matcher: "/:path*",
}

