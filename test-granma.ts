import * as cheerio from 'cheerio';

async function test() {
  const res = await fetch('https://www.granma.cu/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  });
  const html = await res.text();
  const $ = cheerio.load(html);
  const elements = $('article h2, article h3, .main-content h2, .main-content h3');
  const headlines: any[] = [];
  
  elements.each((i, el) => {
    if (headlines.length >= 5) return;
    const title = $(el).text().trim();
    if (title && title.length > 15) {
      let summary = $(el).closest('article, .post, .note, .td_module_wrap').find('p').first().text().trim();
      if (!summary) summary = $(el).parent().next('p').text().trim();
      if (!summary) summary = 'Visita el sitio para leer más.';
      
      let link = $(el).attr('href') || 'https://www.granma.cu/';
      if (link.startsWith('/')) {
        link = `https://www.granma.cu${link}`;
      }
      if (!headlines.find(h => h.title === title)) {
        headlines.push({ title, summary, link });
      }
    }
  });
  console.log(headlines);
}
test();
