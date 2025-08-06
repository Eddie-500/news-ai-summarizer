const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const fetchNews = require('./fetchNews');

const app = express();
const PORT = process.env.PORT || 3000;
const NEWS_FILE = path.join(__dirname, 'news.json');

app.use(cors());

// Endpoint para obtener las noticias
app.get('/news', (req, res) => {
  if (fs.existsSync(NEWS_FILE)) {
    const data = fs.readFileSync(NEWS_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } else {
    res.status(404).json({ error: 'No news available yet.' });
  }
});

// Ejecutar fetch cada minuto
setInterval(fetchNews, 60 * 1000);
fetchNews(); // correr al iniciar

app.listen(PORT, () => {
  console.log(`🟢 Backend corriendo en http://localhost:${PORT}`);
});
