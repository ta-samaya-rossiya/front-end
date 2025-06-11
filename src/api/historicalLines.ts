import { api } from "@/api/api";
import { HistoricalLineCardData, HistoricalObject } from "@/types/historicalLines";

export const historicalLines = {
  // Добавление новой исторической линии
  addHistoricalLine: async (data: Partial<HistoricalLineCardData>) => {
    const response = await api.post('/api/admin/historical-lines', data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  // Обновление исторической линии
  updateHistoricalLine: async (lineId: string, data: Partial<HistoricalLineCardData>) => {
    const response = await api.put(`/api/admin/historical-lines/${lineId}`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  // Удаление исторической линии
  deleteHistoricalLine: async (lineId: string) => {
    const response = await api.delete(`/api/admin/historical-lines/${lineId}`);
    return response.data;
  },

  // Загрузка изображения маркера
  uploadMarkerImage: async (lineId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/api/admin/historical-lines/${lineId}/marker-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Получить список объектов в линии
  getObjects: async (lineId: string): Promise<{ objects: HistoricalObject[] }> => {
    const response = await api.get(`/api/admin/historical-lines/${lineId}/objects`);
    return response.data;
  },

  // Добавить объект в линию
  addObject: async (lineId: string, data: Partial<HistoricalObject>): Promise<HistoricalObject> => {
    const response = await api.post(`/api/admin/historical-lines/${lineId}/objects`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  // Обновить объект
  updateObject: async (lineId: string, objectId: string, data: Partial<HistoricalObject>): Promise<HistoricalObject> => {
    const response = await api.put(`/api/admin/historical-lines/${lineId}/objects/${objectId}`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  // Удалить объект
  deleteObject: async (lineId: string, objectId: string): Promise<HistoricalObject> => {
    const response = await api.delete(`/api/admin/historical-lines/${lineId}/objects/${objectId}`);
    return response.data;
  },

  // Получить все исторические линии
  getAllHistoricalLines: async (): Promise<{ lines: HistoricalLineCardData[] }> => {
    const response = await api.get('/api/historical-lines');
    return response.data;
  },

  // Получить краткую информацию по всем историческим линиям (с фильтром active)
  getBriefHistoricalLines: async (active?: boolean): Promise<{ lines: { id: string; title: string }[] }> => {
    const params = active !== undefined ? { active: active } : {};
    const response = await api.get('/api/historical-lines', { params });
    return response.data;
  },

  // Получить полную информацию по исторической линии по ID
  getHistoricalLineById: async (lineId: string): Promise<HistoricalLineCardData> => {
    const response = await api.get(`/api/historical-lines/${lineId}`);
    return response.data;
  },

  // Получить полную информацию по исторической линии по ID объекта
  getObjectById: async (objectId: string): Promise<HistoricalObject> => {
    const response = await api.get(`/api/historical-lines/objects/${objectId}`);
    return response.data;
  },
}; 