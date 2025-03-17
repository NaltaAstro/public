"use client"

import { useEffect } from "react"
import { useRouter } from "next/router"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirecionar para a página principal do Bubble
    router.push("/version-test/controle/burgers-culture/inicio")
  }, [router])

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      Redirecionando...
    </div>
  )
}

