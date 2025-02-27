'use client';

import React, { useState } from 'react';
import OpenAI from 'openai';

import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleQuerySubmit = async () => {
    try {
      const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
        dangerouslyAllowBrowser: true,
      });
      const completion = await openai.chat.completions.create({
        model: process.env.NEXT_PUBLIC_AI_MODEL as string,
        messages: [{ role: 'user', content: query }],
        max_tokens: 150,
      });
      const messageContent = completion.choices[0]?.message?.content?.trim() ?? '';
      setResponse(messageContent);
    } catch (error) {
      toast.error((error as Error).message, {
        duration: 5000,
        position: 'top-right',
      });
      setResponse('');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Otel Stok Yönetimi Sohbet Botu</h1>
      <div className="mb-4">
        <Input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder="Sorunuzu buraya yazın..."
          className="mb-2"
        />
        <Button onClick={handleQuerySubmit}>Gönder</Button>
      </div>
      {response && (
        <div className="mt-4 p-4 border rounded-md bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Yanıt:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
