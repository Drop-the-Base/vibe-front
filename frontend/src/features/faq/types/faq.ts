export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  answeredBy?: string;
  askedBy?: string;
  date?: string;
  helpful: number;
}

export interface FaqLoadResult {
  items: FaqItem[];
}

export interface FaqCategory {
  id: string;
  name: string;
  description?: string;
}
