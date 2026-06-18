import axios from 'axios'
import type { Template, SavedDork } from '@dorkly/shared'

const http = axios.create({ baseURL: '/api', timeout: 10000 })

http.interceptors.response.use(
  r => r,
  e => Promise.reject(e?.response?.data?.error || 'Something went wrong')
)

export const api = {
  templates: {
    list: (params?: { category?: string; search?: string; difficulty?: string }) =>
      http.get<{ data: Template[] }>('/templates', { params }).then(r => r.data.data),
    categories: () =>
      http.get<{ data: string[] }>('/templates/categories').then(r => r.data.data),
    trackUse: (id: string) =>
      http.post(`/templates/${id}/use`),
  },
  dorks: {
    list: () =>
      http.get<{ data: SavedDork[] }>('/dorks').then(r => r.data.data),
    save: (payload: { title: string; query: string; description?: string; category?: string; tags?: string[] }) =>
      http.post<{ data: SavedDork }>('/dorks', payload).then(r => r.data.data),
    delete: (id: string) =>
      http.delete(`/dorks/${id}`),
  },
}
