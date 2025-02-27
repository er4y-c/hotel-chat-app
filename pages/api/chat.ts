import type { NextApiRequest, NextApiResponse } from 'next';
import { generateChatResponse } from '@/utils/openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { messages, query } = req.body;

  try {
    const response = await generateChatResponse(messages, query);
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}
