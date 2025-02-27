export type PromptRole = 'function' | 'user' | 'system' | 'developer' | 'assistant' | 'tool';

export interface SystemInstruction {
  role: PromptRole;
  content: string;
}
