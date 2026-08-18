import { characterToListItem, filmToDetail, planetToListItem } from '@/api/mappers';
import { displayValue, episodeLabel, formatHeight, yearFromDate } from '@/utils/format';
import type { Character, Film, Planet } from '@/api/schemas';

describe('format helpers', () => {
  it('hides unknown SWAPI placeholders', () => {
    expect(displayValue('unknown')).toBeUndefined();
    expect(displayValue('n/a')).toBeUndefined();
    expect(displayValue('Blond')).toBe('Blond');
  });

  it('converts height in cm to meters', () => {
    expect(formatHeight('172')).toBe('1.72m');
  });

  it('maps episode numbers to roman numerals', () => {
    expect(episodeLabel(4)).toBe('EPISODE IV');
  });

  it('extracts the year from a release date', () => {
    expect(yearFromDate('1977-05-25')).toBe('1977');
  });
});

describe('mappers', () => {
  it('maps a character list card from SWAPI + Databank fields', () => {
    const character = {
      character_id: '1',
      name: 'Luke Skywalker',
      height: '172',
      mass: '77',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
      birth_year: '19BBY',
      gender: 'male',
      homeworld: '1',
      films: [],
      species: [],
      vehicles: [],
      starships: [],
      databank: {
        id: 'luke',
        slug: 'luke-skywalker',
        title: 'Luke Skywalker',
        type: 'Human / Jedi',
        images: { desktop: { desktop_1x1: 'https://example.com/luke.jpg' } },
      },
    } as Character;

    expect(characterToListItem(character)).toEqual({
      id: '1',
      title: 'Luke Skywalker',
      subtitle: 'Human / Jedi',
      imageUrl: 'https://example.com/luke.jpg',
    });
  });

  it('maps a film detail including the opening crawl and related ids', () => {
    const film = {
      film_id: '1',
      title: 'A New Hope',
      episode_id: 4,
      opening_crawl: 'It is a period of civil war.',
      director: 'George Lucas',
      producer: 'Gary Kurtz',
      release_date: '1977-05-25',
      characters: ['1', '2'],
      planets: ['1'],
      starships: [],
      vehicles: [],
      species: [],
      image: '/static/films/4.jpg',
    } as Film;

    const detail = filmToDetail(film);
    expect(detail.subtitle).toBe('EPISODE IV');
    expect(detail.description).toBe('It is a period of civil war.');
    expect(detail.related[0]).toEqual({
      title: 'Key Characters',
      category: 'characters',
      ids: ['1', '2'],
    });
  });

  it('builds a planet subtitle from climate and terrain', () => {
    const planet = {
      planet_id: '1',
      name: 'Tatooine',
      rotation_period: '23',
      orbital_period: '304',
      diameter: '10465',
      climate: 'arid',
      gravity: '1 standard',
      terrain: 'desert',
      surface_water: '1',
      population: '200000',
      residents: [],
      films: [],
      databank: null,
    } as Planet;

    expect(planetToListItem(planet).subtitle).toBe('ARID / DESERT');
  });
});
