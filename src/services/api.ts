import axios from 'axios';
import { MapLayer, Point, Region, Country, HistoricalEvent } from '../types/map';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const mapApi = {
  // Получение слоев карты
  getLayers: () => api.get<MapLayer[]>('/layers'),
  getLayer: (id: string) => api.get<MapLayer>(`/layers/${id}`),
  createLayer: (layer: Omit<MapLayer, 'id'>) => api.post<MapLayer>('/layers', layer),
  updateLayer: (id: string, layer: Partial<MapLayer>) => api.patch<MapLayer>(`/layers/${id}`, layer),
  deleteLayer: (id: string) => api.delete(`/layers/${id}`),

  // Работа с точками
  createPoint: (layerId: string, point: Omit<Point, 'id'>) => 
    api.post<Point>(`/layers/${layerId}/points`, point),
  updatePoint: (layerId: string, pointId: string, point: Partial<Point>) =>
    api.patch<Point>(`/layers/${layerId}/points/${pointId}`, point),
  deletePoint: (layerId: string, pointId: string) =>
    api.delete(`/layers/${layerId}/points/${pointId}`),

  // Работа с регионами
  createRegion: (layerId: string, region: Omit<Region, 'id'>) =>
    api.post<Region>(`/layers/${layerId}/regions`, region),
  updateRegion: (layerId: string, regionId: string, region: Partial<Region>) =>
    api.patch<Region>(`/layers/${layerId}/regions/${regionId}`, region),
  deleteRegion: (layerId: string, regionId: string) =>
    api.delete(`/layers/${layerId}/regions/${regionId}`),

  // Работа со странами
  getCountries: () => api.get<Country[]>('/countries'),
  createCountry: (country: Omit<Country, 'id'>) => 
    api.post<Country>('/countries', country),
  updateCountry: (id: string, country: Partial<Country>) =>
    api.patch<Country>(`/countries/${id}`, country),

  // Работа с историческими событиями
  createHistoricalEvent: (layerId: string, event: Omit<HistoricalEvent, 'id'>) =>
    api.post<HistoricalEvent>(`/layers/${layerId}/events`, event),
  updateHistoricalEvent: (layerId: string, eventId: string, event: Partial<HistoricalEvent>) =>
    api.patch<HistoricalEvent>(`/layers/${layerId}/events/${eventId}`, event),
  deleteHistoricalEvent: (layerId: string, eventId: string) =>
    api.delete(`/layers/${layerId}/events/${eventId}`),

  // Загрузка иконок
  uploadIcon: (file: File) => {
    const formData = new FormData();
    formData.append('icon', file);
    return api.post<{ url: string }>('/upload/icon', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
}; 