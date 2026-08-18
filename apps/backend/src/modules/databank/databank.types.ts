export const DATABANK_CATEGORIES = [
  'characters',
  'creatures',
  'droids',
  'locations',
  'species',
  'vehicles',
] as const;

export type DatabankCategory = (typeof DATABANK_CATEGORIES)[number];

export interface DatabankImageSet {
  desktop_2x1?: string;
  desktop_16x9?: string;
  desktop_4x3?: string;
  desktop_1x1?: string;
}

export interface DatabankItem {
  id: string;
  slug: string;
  title: string;
  description?: string;
  short_desc?: string;
  dynamic_desc?: string;
  images?: {
    desktop?: DatabankImageSet;
  };
  alt_text?: string;
  is_encyclopedia_entry?: boolean;
  type?: string;
  href?: string;
  [key: string]: unknown;
}

export interface DatabankApiResponse {
  count: number;
  title?: string;
  data: DatabankItem[];
  [key: string]: unknown;
}

export interface DatabankFile {
  category: DatabankCategory;
  updatedAt: string | null;
  count: number;
  items: DatabankItem[];
}

export interface SyncResult {
  category: DatabankCategory;
  totalFetched: number;
  updatedAt: string;
  filePath: string;
}
