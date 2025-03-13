// netlify/functions/proxy.js
exports.handler = async (event, context) => {
  // Define o endpoint fixo do Bubble (ajuste se necessário)
  const targetUrl = "https://controle-bc.bubbleapps.io/version-test/api/1.1/init/data";
  
  // Reconstrua a query string a partir dos parâmetros passados na URL da função
  let queryString = "";
  if (event.queryStringParameters) {
    queryString = "?" + Object.keys(event.queryStringParameters)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(event.queryStringParameters[key])}`)
      .join("&");
  }
  
  // Monta a URL completa para a requisição
  const fullUrl = targetUrl + queryString;
  
  try {
    // Faz a requisição para o endpoint do Bubble
    const response = await fetch(fullUrl);
    const responseBody = await response.text(); // Se for JSON, você pode usar response.json()
    
    // Retorna a resposta com o cabeçalho CORS definido
    return {
      statusCode: 200,
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/json",
        "Access-Control-Allow-Origin": "https://tenhopedido.netlify.app" // ou use "*" se preferir liberar para qualquer origem
      },
      body: responseBody
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "https://tenhopedido.netlify.app"
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
