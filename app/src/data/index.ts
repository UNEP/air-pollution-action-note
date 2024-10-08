import type {CartoRegionData} from '../types';
import {default as sectoralBDData} from './sectoralBDData.json';
import {default as differentFuelsData } from './differentFuels.json';

const data = {
  sectoralBD : sectoralBDData,
  differentFuels : differentFuelsData
};

function getMockData<DatumType>(dataset) {
  return data[dataset] as DatumType;
}

export const sectoralBD = getMockData<CartoRegionData>('sectoralBD');
export const differentFuels = getMockData<CartoRegionData>('differentFuels');

export const countriesWithArticle = [
  "BHS", "CAF", "COM", "COD", "COG", "DOM", "GMB", 
  "KOR", "PRK", "LAO", "MHL", "MDA", "NLD", "NER", 
  "PHL", "RUS", "SYR", "TZA", "ARE", "GBR", "USA"
];