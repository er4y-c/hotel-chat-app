import { OpenAI } from 'openai';

import { SystemInstruction } from '@/types/openai';
import { StockItem } from '@/models/StockItem';
import { connectDB } from '@/utils/db';
// import { getRelevantDocuments } from '@/utils/langchain';

// OpenAI istemcisi
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
  dangerouslyAllowBrowser: true,
});

// Metin için embedding oluşturma
export async function createEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });

  return response.data[0].embedding;
}

// Kullanıcı sorgusu için benzer stok öğelerini bulma
export async function findSimilarItems(query: string, limit: number = 2) {
  if (typeof window !== 'undefined') {
    throw new Error('findSimilarItems should only be called on the server side');
  }

  await connectDB();

  // Sorgu için embedding oluştur
  const queryEmbedding = await createEmbedding(query);

  // En yakın öğeleri bul (vektör benzerliği)
  const items = await StockItem.aggregate([
    {
      $search: {
        knnBeta: {
          vector: queryEmbedding,
          path: 'embedding',
          k: limit,
        },
      },
    },
    {
      $project: {
        _id: 0,
        code: 1,
        name: 1,
        category: 1,
        description: 1,
        unit: 1,
        price: 1,
        substitutes: 1,
        currentStock: 1,
        score: { $meta: 'searchScore' },
      },
    },
  ]);
  return items;
}

// Kullanıcı sorusuna yanıt oluşturma
export async function generateChatResponse(
  messages: Array<{ role: string; content: string }>,
  query: string,
): Promise<string> {
  if (typeof window !== 'undefined') {
    throw new Error('generateChatResponse should only be called on the server side');
  }

  // İlgili stok öğelerini bul
  const relevantItems = await findSimilarItems(query);

  // Langchain ile ilgili belgeleri al
  // const relevantDocuments = await getRelevantDocuments(query);

  // OpenAI için sistem talimatı oluştur
  const systemInstruction: SystemInstruction = {
    role: 'system',
    content: `Sen otel stok yönetimi için bir AI asistanısın. Aşağıdaki stok bilgilerini ve belgeleri kullanarak kullanıcının sorgusuna 
    yanıt ver. Stok öğesi kodlarını her zaman belirt. Eğer kullanıcı belirli bir stok öğesi hakkında bilgi istiyorsa, 
    o öğeyi ve varsa alternatiflerini de öner. Yanıtını Türkçe olarak ver.
    
    Elimizdeki stok bilgileri:
    ${relevantItems
      .map(
        (item) =>
          `Kod: ${item.code}, Ad: ${item.name}, Kategori: ${item.category}, Birim: ${item.unit}, 
      Açıklama: ${item.description}, Mevcut Stok: ${item.currentStock || 'Bilgi yok'}, 
      Alternatifler: ${item.substitutes?.join(', ') || 'Yok'}`,
      )
      .join('\n\n')}
    `,
  };
  // OpenAI yanıtı oluştur
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL!,
    messages: [
      { role: 'system', content: systemInstruction.content },
      ...messages.map((msg) => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
      })),
      { role: 'user', content: query },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return response.choices[0].message.content || 'Yanıt oluşturulamadı.';
}
