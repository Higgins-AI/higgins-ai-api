export interface OpenAiCompletion {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: [
    {
      index: number;
      message: {
        role: string;
        content: string;
      };
      finish_reason: string;
    }
  ];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenAiCompletion {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: [
    {
      index: number;
      message: {
        role: string;
        content: string;
      };
      finish_reason: string;
    }
  ];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface SuggestedPrompts {
  content: string;
  prompt_1: {
    id: number;
    label: string;
    value: string;
  };
  prompt_2: { id: number; label: string; value: string };
  prompt_3: {
    id: number;
    label: string;
    value: string;
  };
  prompt_4: {
    id: number;
    label: string;
    value: string;
  };
}
