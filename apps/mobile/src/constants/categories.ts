import type { CatalogCategory } from '../types/catalog';

export interface CategoryUiConfig {
  heroTitle: string;
  kicker: string;
  searchPlaceholder: string;
  layout: 'grid' | 'wide';
  imageAspect: number;
  tabLabel: string;
  tabIcon: 'people' | 'film' | 'rocket' | 'car' | 'planet';
}

export const CATEGORY_UI: Record<CatalogCategory, CategoryUiConfig> = {
  characters: {
    heroTitle: 'CHARACTERS',
    kicker: 'ARCHIVE > REGISTRY',
    searchPlaceholder: 'Search character...',
    layout: 'grid',
    imageAspect: 1,
    tabLabel: 'Characters',
    tabIcon: 'people',
  },
  films: {
    heroTitle: 'FILMS',
    kicker: 'DATABASE / ARCHIVE',
    searchPlaceholder: 'Search films...',
    layout: 'grid',
    imageAspect: 2 / 3,
    tabLabel: 'Films',
    tabIcon: 'film',
  },
  starships: {
    heroTitle: 'STARSHIPS',
    kicker: 'NAVAL REGISTRY // CLASS: ALL',
    searchPlaceholder: 'Search starships...',
    layout: 'grid',
    imageAspect: 16 / 9,
    tabLabel: 'Starships',
    tabIcon: 'rocket',
  },
  vehicles: {
    heroTitle: 'VEHICLE ARCHIVES',
    kicker: 'DATABASE ENTRIES // GROUND',
    searchPlaceholder: 'Search vehicles...',
    layout: 'wide',
    imageAspect: 16 / 9,
    tabLabel: 'Vehicles',
    tabIcon: 'car',
  },
  planets: {
    heroTitle: 'PLANETARY ARCHIVES',
    kicker: 'DATABASE / LOCATIONS',
    searchPlaceholder: 'Search planets...',
    layout: 'grid',
    imageAspect: 4 / 3,
    tabLabel: 'Planets',
    tabIcon: 'planet',
  },
};

export const CATEGORY_ROUTE: Record<CatalogCategory, `/${CatalogCategory}`> = {
  characters: '/characters',
  films: '/films',
  starships: '/starships',
  vehicles: '/vehicles',
  planets: '/planets',
};
