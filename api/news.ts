import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as cheerio from 'cheerio';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3'
      }
    });
    clearTimeout(timeout);
    const html = await response.text();
    const $ = cheerio.load(html);
    const headlines: any[] = [];
    
    let elements: cheerio.Cheerio<cheerio.Element>;
    
    if (url.includes('cubadebate.cu')) {
      elements = $('.title a, .note_title a, article h2 a');
    } else if (url.includes('juventudrebelde.cu')) {
      elements = $('.title a, article h2 a, article h3 a');
    } else if (url.includes('lademajagua.cu')) {
      elements = $('.entry-title a, .td-module-title a, h3.entry-title');
    } else {
      // Default for Granma, Trabajadores, etc.
      elements = $('article h2, article h3, .main-content h2, .main-content h3');
      if (elements.length === 0) {
        elements = $('h2, h3'); // fallback
      }
    }

    elements.each((i, el) => {
      if (headlines.length >= 5) return;
      
      const title = $(el).text().trim();
      if (title && title.length > 15) {
        // Try to find summary
        let summary = $(el).closest('article, .post, .note, .td_module_wrap').find('p').first().text().trim();
        if (!summary) summary = $(el).parent().next('p').text().trim();
        if (!summary) summary = 'Visita el sitio para leer más.';
        
        let link = $(el).attr('href') || url;
        if (link.startsWith('/')) {
          const urlObj = new URL(url);
          link = `${urlObj.origin}${link}`;
        }

        // avoid duplicates
        if (!headlines.find(h => h.title === title)) {
          headlines.push({
            id: i.toString(),
            title: title,
            summary: summary,
            link: link
          });
        }
      }
    });
    
    if (headlines.length === 0) {
      headlines.push({
        id: 'empty',
        title: 'No se encontraron titulares recientes',
        summary: 'El formato del sitio puede haber cambiado.',
        link: url
      });
    }
    
    res.status(200).json(headlines);
  } catch (error) {
    clearTimeout(timeout);
    res.status(200).json([{
      id: 'error',
      title: 'Conexión interrumpida',
      summary: 'No se pudo establecer conexión con el servidor de noticias. Es posible que el sitio esté bloqueando el acceso o tardando demasiado en responder.',
      link: url
    }]);
  }
}
