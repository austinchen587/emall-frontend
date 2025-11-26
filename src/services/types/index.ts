
export interface User {
  id: number
  name: string
  email: string
  created_at?: string
}
export interface HelloResponse {
  message: string
  status: string
}
export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}