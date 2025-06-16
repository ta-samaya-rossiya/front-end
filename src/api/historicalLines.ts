// historicalLines.ts
// Этот файл содержит функции для взаимодействия с API исторических линий и связанными с ними объектами и маркерами.
import { api } from "@/api/api";
import { HistoricalLineCardData, HistoricalObject } from "@/types/historicalLines";
const jsonHeaders = { headers: { 'Content-Type': 'application/json' } };
const getData = <T>(promise: Promise<{ data: T }>) => promise.then(res => res.data);

export const historicalLines = {
  // Добавление новой исторической линии в систему
  addHistoricalLine: () =>
    getData(api.post('/api/admin/historical-lines', jsonHeaders)),

  // Обновление существующей исторической линии по ее ID
  updateHistoricalLine: (lineId: string, data: Partial<HistoricalLineCardData>) =>
    getData(api.put(`/api/admin/historical-lines/${lineId}`, data, jsonHeaders)),

  // Удаление исторической линии по ее ID
  deleteHistoricalLine: (lineId: string) =>
    getData(api.delete(`/api/admin/historical-lines/${lineId}`)),

  // Загрузка изображения маркера для исторической линии
  uploadMarkerImage: (lineId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return getData(api.post(`/api/admin/historical-lines/${lineId}/marker-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }));
  },

  // Получение списка объектов (городов) для конкретной исторической линии
  getObjects: (lineId: string): Promise<{ objects: HistoricalObject[] }> =>
    getData(api.get(`/api/admin/historical-lines/${lineId}/objects`)),

  // Добавление нового объекта (города) к исторической линии
  addObject: (lineId: string, data: Partial<HistoricalObject>): Promise<HistoricalObject> =>
    getData(api.post(`/api/admin/historical-lines/${lineId}/objects`, data, jsonHeaders)),

  // Обновление существующего объекта (города) в исторической линии
  updateObject: (lineId: string, objectId: string, data: Partial<HistoricalObject>): Promise<HistoricalObject> =>
    getData(api.put(`/api/admin/historical-lines/${lineId}/objects/${objectId}`, data, jsonHeaders)),

  // Удаление объекта (города) из исторической линии
  deleteObject: (lineId: string, objectId: string): Promise<HistoricalObject> =>
    getData(api.delete(`/api/admin/historical-lines/${lineId}/objects/${objectId}`)),

  // Получение всех исторических линий в системе
  getAllHistoricalLines: (): Promise<{ lines: HistoricalLineCardData[] }> =>
    getData(api.get('/api/historical-lines')),

  // Получение краткой информации по всем историческим линиям, опционально фильтруя по активности
  getBriefHistoricalLines: (active?: boolean): Promise<{ lines: { id: string; title: string }[] }> => {
    const params = active !== undefined ? { active } : {};
    return getData(api.get('/api/historical-lines', { params }));
  },

  // Получение полной информации об исторической линии по ее ID
  getHistoricalLineById: (lineId: string): Promise<HistoricalLineCardData> =>
    getData(api.get(`/api/historical-lines/${lineId}`)),

  // Получение полной информации об объекте (городе) по его ID
  getObjectById: (objectId: string): Promise<HistoricalObject> =>
    getData(api.get(`/api/historical-lines/objects/${objectId}`)),
}; 