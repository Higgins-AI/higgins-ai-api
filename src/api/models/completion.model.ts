export interface CompletionPostRequest {
  user_id?: string
  chat_id?: string
  user_input?: string
  messages: UserMessage[]
}

export interface UserMessage {
  role: string
  content: string
}

export interface PostCompletionResponse {
  ok: boolean
  data: any[]
  message: string
}