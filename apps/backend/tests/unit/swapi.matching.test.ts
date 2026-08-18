import { findBestMatch } from '../../src/modules/swapi/swapi.matching';

interface Item {
  title: string;
}

function match(name: string, titles: string[]): string | null {
  const items: Item[] = titles.map((title) => ({ title }));
  return findBestMatch(name, items, (item) => item.title)?.title ?? null;
}

describe('findBestMatch', () => {
  it('prefers an exact match over a substring match', () => {
    const result = match('Republic Cruiser', [
      'Republic Attack Cruiser',
      'Republic Cruiser',
      'Republic Attack Shuttle',
    ]);
    expect(result).toBe('Republic Cruiser');
  });

  it('resolves an ambiguous substring by picking the exact match', () => {
    const result = match('Imperial shuttle', [
      "Krennic's Imperial Shuttle",
      'Imperial Shuttle',
      'Zeta-class Imperial Shuttle',
    ]);
    expect(result).toBe('Imperial Shuttle');
  });

  it('matches via token overlap when word order/extra words differ', () => {
    expect(match('Calamari Cruiser', ['Mon Calamari Star Cruiser', 'Republic Cruiser'])).toBe(
      'Mon Calamari Star Cruiser',
    );
  });

  it('matches a compound word containing the name token (fighter ⊂ starfighter)', () => {
    expect(
      match('Naboo fighter', [
        'Naboo N-1 Starfighter',
        'Naboo Royal Cruiser',
        'Antique N-1 starfighter',
      ]),
    ).toBe('Naboo N-1 Starfighter');
  });

  it('matches when the SWAPI name has extra words not in the title', () => {
    expect(match('EF76 Nebulon-B escort frigate', ['Nebulon-B Frigate'])).toBe('Nebulon-B Frigate');
  });

  it('returns null when no candidate shares enough tokens', () => {
    expect(match('CR90 corvette', ['Hammerhead Corvette', 'Millennium Falcon'])).toBeNull();
  });

  it('returns null for an empty candidate list', () => {
    expect(match('Slave 1', [])).toBeNull();
  });

  it('does not match on a single weak shared token after filtering numbers', () => {
    // "Slave 1" -> only "slave" survives token filtering; that alone is too weak a
    // signal to confidently match "Zygerrian Slave Ship".
    expect(match('Slave 1', ['Zygerrian Slave Ship', 'Millennium Falcon'])).toBeNull();
  });

  it('is case-insensitive', () => {
    expect(match('c-3po', ['C-3PO (See-Threepio)'])).toBe('C-3PO (See-Threepio)');
  });

  it('treats a spaced name and a compound-word title as an exact match', () => {
    expect(match('Sand Crawler', ['Sandcrawler', 'Turtle Tanker'])).toBe('Sandcrawler');
  });

  it('treats a roman numeral and its digit form as an exact match', () => {
    expect(match('Yavin IV', ['Yavin 4', 'Yavin System'])).toBe('Yavin 4');
  });

  it('does not let roman-numeral normalization break plain letter-prefixed names', () => {
    expect(match('X-wing', ['X-wing Starfighter', 'V-wing Fighter'])).toBe('X-wing Starfighter');
  });
});
