import { NextResponse } from "next/server"

export function middleware(request) {
  // Não fazer nada, deixar o sistema de rewrites do Next.js lidar com isso
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Excluir arquivos estáticos e rotas da API
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}

