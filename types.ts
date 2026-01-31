export type ViewLevel = 'epoch' | 'millennium' | 'century' | 'decade' | 'year';

export interface HistoricalEvent {
  id: string;
  title: string;
  description: string;
  year: number; // Negative for BC, Positive for AD
  month?: number; // 0-11 for JS Date compatibility, or 1-12. Let's use 1-12 for user input, 0-11 for logic if needed.
  day?: number;
  link?: string;
  category?: 'war' | 'science' | 'art' | 'politics' | 'religion' | 'general';
}

export interface TimePeriod {
  start: number;
  end: number;
  label: string;
}

export interface Breadcrumb {
  level: ViewLevel;
  label: string;
  start: number;
  end: number;
}
