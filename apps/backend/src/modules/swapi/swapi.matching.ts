const EXACT_MATCH_SCORE = 2;
const SUBSTRING_MATCH_SCORE = 1.5;
const MIN_TOKEN_LENGTH = 3;
const MIN_TOKENS_FOR_OVERLAP_MATCH = 2;

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function tokenize(value: string): string[] {
  return normalize(value)
    .split(' ')
    .filter((token) => token.length >= MIN_TOKEN_LENGTH);
}

/**
 * Fraction of `shorterTokens` that appear (as substrings) in `longerNormalized`.
 * Requires all of the shorter side's significant tokens to be present to count as a match,
 * which is what lets "Naboo fighter" resolve to "Naboo N-1 Starfighter" (fighter ⊂ starfighter)
 * without also matching unrelated titles that only share one token.
 */
function tokenSubsetScore(shorterTokens: string[], longerNormalized: string): number {
  if (shorterTokens.length === 0) {
    return 0;
  }
  const matched = shorterTokens.filter((token) => longerNormalized.includes(token)).length;
  return matched / shorterTokens.length;
}

/**
 * Finds the best-matching item for `name` among `items`, comparing against each item's title
 * (via `getTitle`). Handles the naming drift between SWAPI's `name` and the Databank's `title`
 * (e.g. "Calamari Cruiser" vs "Mon Calamari Star Cruiser") using three tiers, most confident first:
 *   1. exact match (normalized)
 *   2. one string fully contains the other (normalized)
 *   3. all significant tokens (length >= 3) of the shorter string are found in the longer string
 * Ties within a tier are broken by picking the title whose length is closest to the name's,
 * which favors the more specific/plain match over a longer compound title.
 * Returns null when no item reaches even the token-overlap tier.
 */
export function findBestMatch<T>(
  name: string,
  items: T[],
  getTitle: (item: T) => string | undefined,
): T | null {
  const normalizedName = normalize(name);
  if (!normalizedName) {
    return null;
  }

  let bestItem: T | null = null;
  let bestScore = 0;
  let bestLengthDiff = Infinity;

  for (const item of items) {
    const title = getTitle(item);
    if (!title) {
      continue;
    }
    const normalizedTitle = normalize(title);

    let score: number;
    if (normalizedTitle === normalizedName) {
      score = EXACT_MATCH_SCORE;
    } else if (
      normalizedTitle.includes(normalizedName) ||
      normalizedName.includes(normalizedTitle)
    ) {
      score = SUBSTRING_MATCH_SCORE;
    } else {
      const nameTokens = tokenize(name);
      const titleTokens = tokenize(title);
      const [shorterTokens, longerNormalized] =
        nameTokens.length <= titleTokens.length
          ? [nameTokens, normalizedTitle]
          : [titleTokens, normalizedName];
      // A single shared token (e.g. "slave" in "Slave 1" vs "Zygerrian Slave Ship") is too
      // weak a signal to trust; require at least two agreeing tokens for this tier.
      if (shorterTokens.length < MIN_TOKENS_FOR_OVERLAP_MATCH) {
        continue;
      }
      const overlap = tokenSubsetScore(shorterTokens, longerNormalized);
      if (overlap < 1) {
        continue;
      }
      score = overlap;
    }

    const lengthDiff = Math.abs(normalizedTitle.length - normalizedName.length);
    if (score > bestScore || (score === bestScore && lengthDiff < bestLengthDiff)) {
      bestScore = score;
      bestItem = item;
      bestLengthDiff = lengthDiff;
    }
  }

  return bestScore > 0 ? bestItem : null;
}
