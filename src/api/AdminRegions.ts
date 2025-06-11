// adminRegions.ts
// Этот файл содержит функции для взаимодействия с API административных операций над регионами.
import { api } from "@/api/api";
import { Region } from "@/types/map";

// Вспомогательная функция для извлечения данных из ответа промиса
const getData = (promise: Promise<any>) => promise.then(res => res.data);

export const adminRegions = {
    // Поиск регионов по названию в OPM
    searchRegionOPM: (name: string) =>
        getData(api.get<Region[]>(`/api/admin/regions/search?query=${name}`)),

    // Добавление нового региона, опционально привязывая его к линии
    addNewRegion: (regionId: number, lineId: string|null = null) =>
        getData(api.post('/api/admin/regions', { regionId, lineId })),

    // Обновление существующего региона
    putRegion: (id: number, region: Region) =>
        getData(api.put(`/api/admin/regions/${id}`, region)),

    // Удаление региона по ID
    deleteRegion: (id: number) =>
        getData(api.delete(`/api/admin/regions/${id}`)),

    // Загрузка изображения для региона
    postRegionImage: (id: number, image: FormData) =>
        getData(api.post(`/api/admin/regions/${id}/image`, image)),

    // Удаление изображения региона
    deleteRegionImage: (id: number) =>
        getData(api.delete(`/api/admin/regions/${id}/image`)),
}