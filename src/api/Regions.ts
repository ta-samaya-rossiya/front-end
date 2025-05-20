import { api } from "@/api/api";

export const regions = {
    getAllRegions: async (lineId: string|null = null) => {
        if (lineId) {
            const response = await api.get(`/api/regions?line_id=${lineId}`);
            return response.data;
        } else {
            const response = await api.get('/api/regions');
            return response.data;
        }
    },

    getBriefAllRegions: async (lineId: string|null = null) => {
        if (lineId) {
            const response = await api.get(`/api/regions/brief?line_id=84d1e0fa-9bfd-488d-95e1-59b58172c2bf`);
            return response.data;
        } else {
            const response = await api.get('/api/regions/brief');
            return response.data;
        }
    },

    getRegionById: async (id: number, lineId: string|null = null) => {
        if (lineId) {
            const response = await api.get(`/api/regions/${id}?line_id=${lineId}`);
            return response.data;
        } else {
            const response = await api.get(`/api/regions/${id}`);
            return response.data;
        }
    },

    getRegionBorder: async (id: number) => {
      const response = await api.get(`/api/regions/${id}/border`)
      return response.data  
    },

    getRegionIndicators: async (id: number) => {
        const response = await api.get(`/api/regions/${id}/indicators`)
        return response.data  
      },
}
