import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()

  // Se a solicitação não for para a API, redirecione para a API
  if (!url.pathname.startsWith("/api")) {
    // Preservar o caminho original
    const path = url.pathname
    const search = url.search

    // Redirecionar para a API com o mesmo caminho
    return NextResponse.rewrite(new URL(`/api${path}${search}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Excluir arquivos estáticos e rotas da API
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
}

