import * as cheerio from 'cheerio';

async function test(url: string) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3'
      }
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    let elements: cheerio.Cheerio<cheerio.Element>;
    if (url.includes('cubadebate.cu')) {
      elements = $('.title a, .note_title a, article h2 a');
    } else if (url.includes('lademajagua.cu')) {
      elements = $('.entry-title a, .td-module-title a, h3.entry-title');
    } else {
      elements = $('article h2, article h3, .main-content h2, .main-content h3');
      if (elements.length === 0) elements = $('h2, h3');
    }
    console.log(url, 'Found elements:', elements.length);
    elements.each((i, el) => {
      if (i < 2) console.log(' -', $(el).text().trim());
    });
  } catch (e: any) {
    console.error(url, 'Error:', e.message);
  }
}

async function run() {
  await test('http://www.cubadebate.cu/');
  await test('https://www.granma.cu/');
  await test('https://lademajagua.cu/');
}

run();
