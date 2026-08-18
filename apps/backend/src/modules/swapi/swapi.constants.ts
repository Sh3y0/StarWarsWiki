// Poster images live in apps/backend/public/films/ and are served by @fastify/static at
// /static/films/. Keyed by SWAPI's `episode_id` (not its `id`/url position), since that's
// how the source images are named.
export const FILM_IMAGES: Record<number, string> = {
  1: '/static/films/1.png',
  2: '/static/films/2.jpg',
  3: '/static/films/3.jpg',
  4: '/static/films/4.jpg',
  5: '/static/films/5.jpg',
  6: '/static/films/6.jpg',
};
