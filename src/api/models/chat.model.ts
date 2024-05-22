export interface PostChatRequestBody {
  title: string
  user_id: string
  created_at: string
  chat_id: string
  industry: string
}

export interface PatchChatRequestBody {
  title: string
  user_id: string
}
