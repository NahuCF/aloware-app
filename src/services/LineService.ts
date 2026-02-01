import Http from '@/config/http'
import type { Line, PaginatedResponse } from '@/types'

export default {
  async index(page = 1) {
    return Http.get<PaginatedResponse<Line>>('/lines', { params: { page } })
  },

  async show(id: number) {
    return Http.get<{ data: Line }>(`/lines/${id}`)
  },

  async store(data: Partial<Line>) {
    return Http.post<{ data: Line }>('/lines', data)
  },

  async update(id: number, data: Partial<Line>) {
    return Http.put<{ data: Line }>(`/lines/${id}`, data)
  },

  async destroy(id: number) {
    return Http.delete(`/lines/${id}`)
  }
}
