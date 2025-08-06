const axios = require('axios');
const fs = require('fs');
const path = require('path');
const keys = require('./api_keys.json');

const OUTPUT_FILE = path.join(__dirname, 'news.json');

async function fetchNews() {
  for (let key of keys.gnews_keys) {
    try {
      const response = await axios.get('https://gnews.io/api/v4/top-headlines', {
        params: {
          lang: 'en',
          max: 20,
          token: key
        }
      });

      if (response.status === 200 && response.data.articles) {
        const news = response.data.articles.map(article => ({
          title: article.title,
          description: article.description,
          content: article.content,
          image: article.image,
          publishedAt: article.publishedAt,
          url: article.url,
          source: article.source.name
        }));

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(news, null, 2));
        console.log(`✅ Noticias guardadas con la clave: ${key}`);
        return;

      } else {
        console.log(`⚠️ Respuesta inesperada con clave ${key}:`, response.status);
      }

    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log(`❌ Límite excedido para la clave: ${key}`);
        continue;
      } else {
        console.error(`🛑 Error inesperado con clave ${key}:`, err.message);
        break;
      }
    }
  }

  console.log("⛔ No se pudo obtener noticias con ninguna clave.");
}

module.exports = fetchNews;
