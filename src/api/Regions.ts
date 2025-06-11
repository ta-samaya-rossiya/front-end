// regions.ts
// Этот файл содержит функции для взаимодействия с общедоступным API регионов.
import { api } from "@/api/api";

const getData = (promise: Promise<any>) => promise.then(res => res.data);

export const regions = {
    // Получает все регионы, опционально фильтруя по ID линии
    getAllRegions: (lineId: string|null = null) =>
        getData(api.get(lineId ? `/api/regions?line_id=${lineId}` : '/api/regions')),

    // Получает краткую информацию по всем регионам, опционально фильтруя по ID линии
    getBriefAllRegions: (lineId: string|null = null) =>
        getData(api.get(lineId ? `/api/regions/brief?line_id=${lineId}` : '/api/regions/brief')),

    // Получает информацию о регионе по его ID, опционально по ID линии
    getRegionById: (id: number, lineId: string|null = null) =>
        getData(api.get(lineId ? `/api/regions/${id}?line_id=${lineId}` : `/api/regions/${id}`)),

    // Получает границы региона по ID
    getRegionBorder: (id: number) =>
        getData(api.get(`/api/regions/${id}/border`)),

    // Получает показатели региона по ID
    getRegionIndicators: (id: number) =>
        getData(api.get(`/api/regions/${id}/indicators`)),
}
