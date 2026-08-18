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
}

// The backend's /api/characters endpoint returns Databank items directly, so this is
// an alias for now. Films/Starships/Vehicles/Planets get their own shapes once their
// screens are wired up to the API.
export type Character = DatabankItem;
