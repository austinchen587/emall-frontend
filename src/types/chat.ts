export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  session_id: string
}

export interface ChatSession {
  session_id: string
  title: string
  last_updated: string
  message_count: number
}

export interface ChatRequest {
  message: string
  message_type: 'normal_chat' | 'data_analysis'
  session_id: string
}

export interface ChatResponse {
  status: 'success' | 'error'
  message: string
  session_id?: string
}
