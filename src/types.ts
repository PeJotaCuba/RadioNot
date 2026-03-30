export interface Station {
  id: string;
  name: string;
  slogan: string;
  streamUrl: string;
  logo: string;
}

export interface Headline {
  id: string;
  title: string;
  summary: string;
  link: string;
  time: string;
}

export interface NewsSource {
  id: string;
  name: string;
  logo: string;
  url: string;
  headlines: Headline[];
}

export interface AppConfig {
  stations: Station[];
  newsSources: NewsSource[];
}
