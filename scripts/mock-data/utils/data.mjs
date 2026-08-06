import { readFile } from 'node:fs/promises';

const DATA_DIRECTORY = new URL('../data/', import.meta.url);
const BOARD_FILES = [
  'weekly-reset.json',
  'dream-wishlist.json',
  'kyoto-autumn-trip.json',
  'weekly-meal-prep.json',
  'job-search.json',
];

async function readJson(filename) {
  const contents = await readFile(new URL(filename, DATA_DIRECTORY), 'utf8');
  return JSON.parse(contents);
}

export async function loadMockData() {
  const [imageAssets, ...boards] = await Promise.all([
    readJson('images.json'),
    ...BOARD_FILES.map(readJson),
  ]);
  return { boards, imageAssets };
}
