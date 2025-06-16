// historicalLines.ts
// Этот файл содержит определения типов данных для исторических линий, объектов, событий и связанных с ними элементов.
import { BaseRegionInfo, Region } from "./map";

// Интерфейс для данных точки на карте (город или регион)
export interface PointData {
  id?: string; // Опциональный ID точки
  name: string; // Название точки
  coordinates: [number, number]; // Координаты [широта, долгота]
  type: 'city' | 'region'; // Тип точки: город или регион
  icon: string; // Ссылка на иконку точки
  description: string; // Описание точки
}

// Интерфейс для данных исторического события
export interface HistoricalEventData {
  id?: string; // Опциональный ID события
  date: string; // Дата события
  description: string; // Описание события
  points: string[]; // Массив ID точек, связанных с событием
  connections: [string, string][]; // Массив связей между точками [fromPointId, toPointId]
}

// Интерфейс для данных маркера, используемого на линии
export interface ServerMarker {
  id: string;
  title: string;
  coords: [number, number];
  order: number;
  description: string;
  videoUrl: string;
}

// Интерфейс для информации о отображении заголовка региона
export interface ServerRegionDisplayTitle {
  text: string; // Текст заголовка
  position: [number, number]; // Позиция заголовка [широта, долгота]
  fontSize: number; // Размер шрифта заголовка
}

// Интерфейс для информации о регионе на сервере, расширяющий BaseRegionInfo
export interface ServerRegionInfo extends BaseRegionInfo {
  displayTitle: ServerRegionDisplayTitle; // Информация для отображения заголовка
  color: string; // Цвет региона
}

// Интерфейс для основной информации о исторической линии (карточка или полные данные)
export interface HistoricalLineCardData {
  id: string; // ID исторической линии
  title: string; // Название исторической линии
  markerImage?: string; // Опциональная ссылка на изображение маркера
  lineColor?: string; // Опциональный цвет линии
  lineStyle?: string; // Опциональный стиль линии (например, 'solid', 'dashed')
  markerLegend?: string; // Опциональная легенда для маркера
  isActive: boolean; // Флаг активности линии
  markers: ServerMarker[]; // Массив маркеров, связанных с линией
  addedRegions: ServerRegionInfo[]; // Массив регионов, добавленных к линии
  activeRegions: Region[]; // Изменяем тип на Region[]
  description?: string; // Опциональное описание линии
  videoLink?: string; // Опциональная ссылка на видео
}

// Интерфейс для исторического объекта (например, город), связанного с линией
export interface HistoricalObject {
  id: string; // ID объекта
  order: number; // Порядок отображения объекта
  title: string; // Название объекта
  image?: string; // Опциональная ссылка на изображение объекта
  description: string; // Описание объекта
  videoUrl: string; // URL видео, связанного с объектом
  coords: [number, number]; // Координаты объекта [широта, долгота]
} 