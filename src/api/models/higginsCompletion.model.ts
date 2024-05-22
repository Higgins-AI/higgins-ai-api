import {UserMessage} from "./completion.model";

export interface HigginsCompletionPostRequestBody {
  user_input: string
  user_id: string
  chat_id: string
  temperature: string
  organization: string
  system_directive?: string
  messages?: UserMessage[]
}
