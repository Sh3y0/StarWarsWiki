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
  href?: string;
  type?: string;
}
