export interface PostFeedbackRequestBody {
  user_id: string
  completion_id: string
  chat_id: string
  rating_id: string
  rating: string
  prompt: string
  completion: string
}
