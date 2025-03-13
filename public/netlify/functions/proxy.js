const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Remove o prefixo do caminho para montar a URL na Bubble
  const path = event.path.replace('/.netlify/functions/proxy', '');
  const bubbleUrl = 'https://sua-aplicacao.bubbleapps.io' + path;

  try {
    // Encaminha a requisição para a Bubble
    const response = await fetch(bubbleUrl, {
      method: event.httpMethod,
      headers: event.headers,
      body: (event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD') ? event.body : undefined
    });
    
    const data = await response.text();

    // Retorna a resposta com os cabeçalhos CORS desejados
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': 'https://seu-dominio.com',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization'
      },
      body: data
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Erro interno: ${error.toString()}`
    };
  }
};
