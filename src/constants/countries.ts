import { LatLngBoundsLiteral } from 'leaflet';

interface Country {
  id: string;
  name: string;
  bounds: LatLngBoundsLiteral;
}

export const FORMER_USSR_COUNTRIES: Country[] = [
  {
    id: 'ru',
    name: 'Россия',
    bounds: [[41.1850968, 19.6389], [82.0586232, 180]] as LatLngBoundsLiteral,
  },
  {
    id: 'ua',
    name: 'Украина',
    bounds: [[44.184598, 22.085608], [52.379147, 40.227580]] as LatLngBoundsLiteral,
  },
  {
    id: 'by',
    name: 'Беларусь',
    bounds: [[51.262196, 23.178334], [56.17218, 32.762681]] as LatLngBoundsLiteral,
  },
  {
    id: 'kz',
    name: 'Казахстан',
    bounds: [[40.568647, 46.493217], [55.442170, 87.312622]] as LatLngBoundsLiteral,
  },
  {
    id: 'uz',
    name: 'Узбекистан',
    bounds: [[37.182116, 55.998255], [45.590068, 73.139736]] as LatLngBoundsLiteral,
  },
  {
    id: 'az',
    name: 'Азербайджан',
    bounds: [[38.392025, 44.765015], [41.905638, 50.370655]] as LatLngBoundsLiteral,
  },
  {
    id: 'am',
    name: 'Армения',
    bounds: [[38.840477, 43.44978], [41.300835, 46.633308]] as LatLngBoundsLiteral,
  },
  {
    id: 'ge',
    name: 'Грузия',
    bounds: [[41.055367, 40.007155], [43.586299, 46.72578]] as LatLngBoundsLiteral,
  },
  {
    id: 'kg',
    name: 'Кыргызстан',
    bounds: [[39.172843, 69.264311], [43.266797, 80.229579]] as LatLngBoundsLiteral,
  },
  {
    id: 'tj',
    name: 'Таджикистан',
    bounds: [[36.671115, 67.387138], [41.045093, 75.137115]] as LatLngBoundsLiteral,
  },
  {
    id: 'tm',
    name: 'Туркменистан',
    bounds: [[35.129093, 52.335076], [42.795555, 66.684303]] as LatLngBoundsLiteral,
  },
  {
    id: 'md',
    name: 'Молдова',
    bounds: [[45.467666, 26.618944], [48.491958, 30.135445]] as LatLngBoundsLiteral,
  },
  {
    id: 'lt',
    name: 'Литва',
    bounds: [[53.896335, 20.653783], [56.450421, 26.835519]] as LatLngBoundsLiteral,
  },
  {
    id: 'lv',
    name: 'Латвия',
    bounds: [[55.674929, 20.971389], [58.082306, 28.241490]] as LatLngBoundsLiteral,
  },
  {
    id: 'ee',
    name: 'Эстония',
    bounds: [[57.509299, 21.814601], [59.676674, 28.209972]] as LatLngBoundsLiteral,
  },
]; 