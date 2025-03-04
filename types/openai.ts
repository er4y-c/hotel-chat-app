export type PromptRole = 'function' | 'user' | 'system' | 'developer' | 'assistant' | 'tool';

export interface SystemInstruction {
  role: PromptRole;
  content: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
