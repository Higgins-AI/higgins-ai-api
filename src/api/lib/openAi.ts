import axios from "axios";
import {OpenAiCompletion} from "../../types/types";
import {UserMessage} from "../models/completion.model";

const openAiKey = process.env.OPENAI_API_KEY ?? ''
const openAiUrl = 'https://api.openai.com/v1/chat/completions'
const model = 'gpt-4-turbo-preview'
const DEFAULT_PROMPT = `
Your name is Higgins. You are a helpful AI assistant. 
You may be provided with some supporting context that you can use to help you respond to the user's next prompt. 
If the supporting context does not closely relate to the user's prompt, ignore it as you formulate a response. 
If the user's prompt refers to any previous messages, ignore the supporting context as you formulate a response. 
Your response should always be in markdown format. 
The supporting context will be in the following format: <context>supporting context</context>. 
You may also be provided an array of touples containing display links and links. 
If you are provided this array, tell the user that they may find more information about their question by checking out the links. 
The display link should be the text that is shown to the user, and the link url should be the link in the touple. 
The array of links will be in the following format: <linksArray>[array]</linksArray> 
A touple in this array will have the following format: '{displayLink: "example.com", link: "https://example.com"}
`

export const generatePrompt = (
  messages: UserMessage[],
  userInput: string,
  supportingDocs?: (string | undefined)[] | undefined,
  directive?: string,
  completionTemp?: number,
  searchResults?: { displayLink: string | null | undefined; link: string | null | undefined }[] | undefined,
) => {
  const supportingDocsStr = supportingDocs ? `<context>${JSON.stringify(supportingDocs)}</context>` : '';
  const searchResultsStr = searchResults ? `<linksArray>${JSON.stringify(searchResults)}</linksArray>` : ''

  return axios.post<OpenAiCompletion>(
    openAiUrl,
    {
      model,
      messages: [
        ...messages,
        {
          role: 'system',
          content: `${directive ?? DEFAULT_PROMPT}` + supportingDocsStr + searchResultsStr
        },
        {
          role: 'user',
          content: userInput,
        }
      ],
      temperature: completionTemp ?? 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${openAiKey}`
      }
    }
  )
}