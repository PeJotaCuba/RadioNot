import { Station, NewsSource } from './types';

export const INITIAL_STATIONS: Station[] = [
  { id: '1', name: 'Radio Bayamo', slogan: 'La voz de la ciudad.', streamUrl: 'https://icecast.teveo.cu/7hdNcTbM', logo: 'radio' },
  { id: '2', name: 'Radio Rebelde', slogan: 'La emisora de la revolución.', streamUrl: 'https://icecast.teveo.cu/zrXXWK9F', logo: 'radio' },
  { id: '3', name: 'Radio Reloj', slogan: 'Información al instante.', streamUrl: 'https://icecast.teveo.cu/b3jbfThq', logo: 'radio' },
  { id: '4', name: 'Radio Progreso', slogan: 'La onda de la alegría.', streamUrl: 'https://icecast.teveo.cu/XjfW7qWN', logo: 'radio' },
  { id: '5', name: 'Radio COCO', slogan: 'El sonido de la capital.', streamUrl: 'https://icecast.teveo.cu/fvc4RVRz', logo: 'radio' },
];

export const INITIAL_NEWS_SOURCES: NewsSource[] = [
  { id: '1', name: 'Cubadebate', logo: 'CD', url: 'http://www.cubadebate.cu/', headlines: [] },
  { id: '2', name: 'Granma', logo: 'GR', url: 'https://www.granma.cu/', headlines: [] },
  { id: '5', name: 'La Demajagua', logo: 'LD', url: 'https://lademajagua.cu/', headlines: [] },
];
