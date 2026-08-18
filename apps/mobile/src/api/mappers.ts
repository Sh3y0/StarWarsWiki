import { resolveMediaUrl } from './client';
import type { Character, Film, Planet, Starship, Vehicle } from './schemas';
import type {
  CatalogCategory,
  CatalogDetail,
  CatalogListItem,
  CatalogRelatedGroup,
  CatalogStat,
  CatalogStatGroup,
} from '../types/catalog';
import {
  databankImageUrl,
  displayValue,
  episodeLabel,
  formatHeight,
  formatMass,
  formatWithUnit,
  relatedIds,
  yearFromDate,
} from '../utils/format';

function stats(items: (CatalogStat | undefined)[], title?: string): CatalogStatGroup | undefined {
  const present = items.filter((item): item is CatalogStat => Boolean(item));
  if (present.length === 0) {
    return undefined;
  }
  return { title, items: present };
}

function stat(label: string, value: string | undefined): CatalogStat | undefined {
  return value ? { label, value } : undefined;
}

function related(
  title: string,
  category: CatalogCategory,
  ids: string[],
): CatalogRelatedGroup | undefined {
  const trimmed = relatedIds(ids);
  if (trimmed.length === 0) {
    return undefined;
  }
  return { title, category, ids: trimmed };
}

function compactGroups(groups: (CatalogStatGroup | undefined)[]): CatalogStatGroup[] {
  return groups.filter((group): group is CatalogStatGroup => Boolean(group));
}

function compactRelated(groups: (CatalogRelatedGroup | undefined)[]): CatalogRelatedGroup[] {
  return groups.filter((group): group is CatalogRelatedGroup => Boolean(group));
}

export function characterToListItem(character: Character): CatalogListItem {
  return {
    id: character.character_id,
    title: character.name,
    subtitle:
      displayValue(character.databank?.type) ?? displayValue(character.gender)?.toUpperCase(),
    imageUrl: databankImageUrl(character.databank, 'desktop_1x1'),
  };
}

export function filmToListItem(film: Film): CatalogListItem {
  return {
    id: film.film_id,
    title: film.title,
    subtitle: episodeLabel(film.episode_id),
    caption: yearFromDate(film.release_date),
    imageUrl: resolveMediaUrl(film.image),
  };
}

export function starshipToListItem(starship: Starship): CatalogListItem {
  const manufacturer = displayValue(starship.manufacturer);
  const model = displayValue(starship.model);
  return {
    id: starship.starship_id,
    title: starship.name,
    subtitle: displayValue(starship.starship_class)?.toUpperCase(),
    imageUrl: databankImageUrl(starship.databank, 'desktop_16x9'),
    meta: [
      ...(manufacturer ? [{ label: 'MFR', value: manufacturer }] : []),
      ...(model ? [{ label: 'CLASS', value: model }] : []),
    ],
  };
}

export function vehicleToListItem(vehicle: Vehicle): CatalogListItem {
  const manufacturer = displayValue(vehicle.manufacturer);
  const length = formatWithUnit(vehicle.length, 'm');
  return {
    id: vehicle.vehicle_id,
    title: vehicle.name,
    subtitle: displayValue(vehicle.vehicle_class)?.toUpperCase(),
    imageUrl: databankImageUrl(vehicle.databank, 'desktop_16x9'),
    meta: [
      ...(manufacturer ? [{ label: 'MANUFACTURER', value: manufacturer }] : []),
      ...(length ? [{ label: 'LENGTH', value: length }] : []),
    ],
  };
}

export function planetToListItem(planet: Planet): CatalogListItem {
  const climate = displayValue(planet.climate);
  const terrain = displayValue(planet.terrain);
  const subtitle = [climate, terrain].filter(Boolean).join(' / ').toUpperCase();
  return {
    id: planet.planet_id,
    title: planet.name,
    subtitle: subtitle || undefined,
    imageUrl: databankImageUrl(planet.databank, 'desktop_4x3'),
  };
}

export function characterToDetail(character: Character): CatalogDetail {
  return {
    id: character.character_id,
    title: character.name,
    subtitle: displayValue(character.gender)?.toUpperCase(),
    imageUrl: databankImageUrl(character.databank, 'desktop_16x9'),
    description: character.databank?.description ?? character.databank?.short_desc,
    stats: compactGroups([
      stats(
        [
          stat('GENDER', displayValue(character.gender)),
          stat('HEIGHT', formatHeight(character.height)),
          stat('WEIGHT', formatMass(character.mass)),
          stat('BIRTH YEAR', displayValue(character.birth_year)),
          stat('HAIR COLOR', displayValue(character.hair_color)),
          stat('SKIN COLOR', displayValue(character.skin_color)),
          stat('EYE COLOR', displayValue(character.eye_color)),
        ],
        'BIOMETRICS',
      ),
    ]),
    related: compactRelated([
      related('Homeworld', 'planets', [character.homeworld]),
      related('Appearances', 'films', character.films),
      related('Starships', 'starships', character.starships),
      related('Vehicles', 'vehicles', character.vehicles),
    ]),
  };
}

export function filmToDetail(film: Film): CatalogDetail {
  return {
    id: film.film_id,
    title: film.title,
    subtitle: episodeLabel(film.episode_id),
    kicker: episodeLabel(film.episode_id),
    imageUrl: resolveMediaUrl(film.image),
    description: displayValue(film.opening_crawl),
    stats: compactGroups([
      stats(
        [
          stat('DIRECTOR', displayValue(film.director)),
          stat('PRODUCER', displayValue(film.producer)),
          stat('RELEASE DATE', displayValue(film.release_date)),
        ],
        'CREDITS',
      ),
    ]),
    related: compactRelated([
      related('Key Characters', 'characters', film.characters),
      related('Featured Planets', 'planets', film.planets),
      related('Starships', 'starships', film.starships),
      related('Vehicles', 'vehicles', film.vehicles),
    ]),
  };
}

export function starshipToDetail(starship: Starship): CatalogDetail {
  return {
    id: starship.starship_id,
    title: starship.name,
    subtitle: displayValue(starship.starship_class)?.toUpperCase(),
    kicker: displayValue(starship.model)?.toUpperCase(),
    imageUrl: databankImageUrl(starship.databank, 'desktop_16x9'),
    description: starship.databank?.description ?? starship.databank?.short_desc,
    stats: compactGroups([
      stats(
        [
          stat('CLASS', displayValue(starship.starship_class)),
          stat('COST', formatWithUnit(starship.cost_in_credits, ' credits')),
        ],
        'CLASSIFICATION & COST',
      ),
      stats(
        [
          stat('HYPERDRIVE', displayValue(starship.hyperdrive_rating)),
          stat('MGLT', displayValue(starship.MGLT)),
          stat('MAX ATMOS SPEED', displayValue(starship.max_atmosphering_speed)),
        ],
        'FLIGHT PERFORMANCE',
      ),
      stats(
        [
          stat('LENGTH', formatWithUnit(starship.length, 'm')),
          stat('CARGO', displayValue(starship.cargo_capacity)),
          stat('CREW', displayValue(starship.crew)),
          stat('PASSENGERS', displayValue(starship.passengers)),
          stat('CONSUMABLES', displayValue(starship.consumables)),
        ],
        'DIMENSIONS & CAPACITY',
      ),
    ]),
    related: compactRelated([
      related('Notable Pilots', 'characters', starship.pilots),
      related('Appearances', 'films', starship.films),
    ]),
  };
}

export function vehicleToDetail(vehicle: Vehicle): CatalogDetail {
  return {
    id: vehicle.vehicle_id,
    title: vehicle.name,
    subtitle: displayValue(vehicle.vehicle_class)?.toUpperCase(),
    kicker: displayValue(vehicle.model)?.toUpperCase(),
    imageUrl: databankImageUrl(vehicle.databank, 'desktop_16x9'),
    description: vehicle.databank?.description ?? vehicle.databank?.short_desc,
    stats: compactGroups([
      stats(
        [
          stat('MODEL', displayValue(vehicle.model)),
          stat('VEHICLE CLASS', displayValue(vehicle.vehicle_class)),
          stat('MANUFACTURER', displayValue(vehicle.manufacturer)),
        ],
        'CLASSIFICATION',
      ),
      stats(
        [
          stat('MAX SPEED', displayValue(vehicle.max_atmosphering_speed)),
          stat('CREW', displayValue(vehicle.crew)),
        ],
        'PERFORMANCE',
      ),
      stats(
        [
          stat('LENGTH', formatWithUnit(vehicle.length, 'm')),
          stat('PASSENGERS', displayValue(vehicle.passengers)),
          stat('CARGO CAPACITY', displayValue(vehicle.cargo_capacity)),
          stat('CONSUMABLES', displayValue(vehicle.consumables)),
        ],
        'DIMENSIONS & CAPACITY',
      ),
    ]),
    related: compactRelated([
      related('Notable Pilots', 'characters', vehicle.pilots),
      related('Appearances', 'films', vehicle.films),
    ]),
  };
}

export function planetToDetail(planet: Planet): CatalogDetail {
  return {
    id: planet.planet_id,
    title: planet.name,
    subtitle: displayValue(planet.climate)?.toUpperCase(),
    kicker: 'PLANET ORIGIN',
    imageUrl: databankImageUrl(planet.databank, 'desktop_16x9'),
    description: planet.databank?.description ?? planet.databank?.short_desc,
    stats: compactGroups([
      stats(
        [
          stat('ROTATION PERIOD', formatWithUnit(planet.rotation_period, ' hours')),
          stat('ORBITAL PERIOD', formatWithUnit(planet.orbital_period, ' days')),
          stat('DIAMETER', formatWithUnit(planet.diameter, ' km')),
          stat('CLIMATE', displayValue(planet.climate)),
          stat('GRAVITY', displayValue(planet.gravity)),
          stat('TERRAIN', displayValue(planet.terrain)),
          stat('SURFACE WATER', formatWithUnit(planet.surface_water, '%')),
          stat('POPULATION', displayValue(planet.population)),
        ],
        'TECHNICAL SPECIFICATIONS',
      ),
    ]),
    related: compactRelated([
      related('Notable Residents', 'characters', planet.residents),
      related('Film Appearances', 'films', planet.films),
    ]),
  };
}

export function toListItem(category: CatalogCategory, raw: unknown): CatalogListItem {
  switch (category) {
    case 'characters':
      return characterToListItem(raw as Character);
    case 'films':
      return filmToListItem(raw as Film);
    case 'starships':
      return starshipToListItem(raw as Starship);
    case 'vehicles':
      return vehicleToListItem(raw as Vehicle);
    case 'planets':
      return planetToListItem(raw as Planet);
  }
}

export function toDetail(category: CatalogCategory, raw: unknown): CatalogDetail {
  switch (category) {
    case 'characters':
      return characterToDetail(raw as Character);
    case 'films':
      return filmToDetail(raw as Film);
    case 'starships':
      return starshipToDetail(raw as Starship);
    case 'vehicles':
      return vehicleToDetail(raw as Vehicle);
    case 'planets':
      return planetToDetail(raw as Planet);
  }
}
