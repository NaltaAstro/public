export default function Home() {
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
      Carregando...
    </div>
  )
}

export async function getServerSideProps(context) {
  return {
    redirect: {
      destination: "/version-test/controle/burgers-culture/inicio",
      permanent: false,
    },
  }
}

