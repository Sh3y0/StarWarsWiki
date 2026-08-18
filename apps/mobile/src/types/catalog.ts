export const CATALOG_CATEGORIES = [
  'characters',
  'films',
  'starships',
  'vehicles',
  'planets',
] as const;

export type CatalogCategory = (typeof CATALOG_CATEGORIES)[number];

export interface CatalogMeta {
  label: string;
  value: string;
}

export interface CatalogListItem {
  id: string;
  title: string;
  subtitle?: string;
  caption?: string;
  imageUrl?: string;
  meta?: CatalogMeta[];
}

export interface CatalogStat {
  label: string;
  value: string;
}

export interface CatalogStatGroup {
  title?: string;
  items: CatalogStat[];
}

export interface CatalogRelatedGroup {
  title: string;
  category: CatalogCategory;
  ids: string[];
}

export interface CatalogDetail {
  id: string;
  title: string;
  subtitle?: string;
  kicker?: string;
  imageUrl?: string;
  description?: string;
  stats: CatalogStatGroup[];
  related: CatalogRelatedGroup[];
}

export interface CatalogPage {
  count: number;
  currentPage: number | null;
  nextPage: number | null;
  previousPage: number | null;
  items: CatalogListItem[];
}
