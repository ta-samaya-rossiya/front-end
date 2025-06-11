// api.ts
// Этот файл настраивает экземпляр Axios для взаимодействия с серверным API, используя базовый URL из env.ts
import axios from 'axios';
import { API_BASE_URL } from '@/constants/env';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});