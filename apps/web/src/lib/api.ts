import axios from 'axios'
import type { Template, SavedDork } from '@dorkly/shared'

const http = axios.create({ baseURL: '/api', timeout: 10000 })

http.interceptors.response.use(
  r => r,
  e => Promise.reject(e?.response?.data?.error || 'Something went wrong')
)

export interface ScanDork      { title: string; query: string }
export interface ScanCategory  { id: string; label: string; description: string; dorks: ScanDork[] }
export interface ScanResult    { domain: string; categories: ScanCategory[]; total: number }
export interface GithubResult  { query: string; categories: ScanCategory[]; total: number }

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
  scanner: {
    scan: (domain: string) =>
      http.post<{ data: ScanResult }>('/scanner/scan', { domain }).then(r => r.data.data),
  },
  github: {
    scan: (query: string) =>
      http.post<{ data: GithubResult }>('/github/scan', { query }).then(r => r.data.data),
  },
}
