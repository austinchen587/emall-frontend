export interface ApiResponse<T = any> {
  status: 'success' | 'error'
  data?: T
  message?: string
  error?: string
}

export interface PaginationParams {
  page: number
  pageSize: number
  total: number
}

export interface PaginatedResponse<T> {
  results: T[]
  count: number
  next: string | null
  previous: string | null
}

export interface TableColumn {
  key: string
  title: string
  dataIndex?: string
  width?: number
  sorter?: boolean
  render?: (value: any, record: any, index: number) => React.ReactNode
}
