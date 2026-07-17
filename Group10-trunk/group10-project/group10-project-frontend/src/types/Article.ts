export interface Article {
  id: number;
  imageUrl: string;
  slug: string;
  title: string;
  subtitle: string;
  blurb: string;
  author: string;
  content: ArticleSection[]; // Changed to ArticleSection[]
  gifs: ArticleGifs[];
  References: Reference[];
}

export interface ArticleGifs{
    id: number;
    url?: string;
}

export interface Paragraph {
    text: string;
    gifId?: number | null;
}

export interface ArticleSection {
    title: string;
    paragraphs: Paragraph[];
}

export interface Reference {
  id?: number;
  title: string;
  url: string;
  source?: string;
  year?: string;
}
