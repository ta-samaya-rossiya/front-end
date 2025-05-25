import { api } from "@/api/api";
import { Region } from "@/types/map";

export const adminRegions = {
    searchRegionOPM: async (name: string) => {
        const response = await api.get<Region[]>(`/api/admin/regions/search?query=${name}`);
        return response.data;
    },

    addNewRegion: async (regionId: number, lineId: string|null = null) => {
        const response = await api.post('/api/admin/regions', {
            regionId,
            lineId
        });
        return response.data;
    },

    putRegion: async (id: number, region: Region) => {
        const response = await api.put(`/api/admin/regions/${id}`, region);
        return response.data;
    },

    deleteRegion: async (id: number) => {
        const response = await api.delete(`/api/admin/regions/${id}`);
        return response.data;
    },

    postRegionImage: async (id: number, image: FormData) => {
        const response = await api.post(`/api/admin/regions/${id}/image`, image);
        return response.data;
    },

    deleteRegionImage: async (id: number) => {
        const response = await api.delete(`/api/admin/regions/${id}/image`);
        return response.data;
    }
}