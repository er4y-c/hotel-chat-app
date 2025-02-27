'use server';

import { MongoClient } from 'mongodb';
import { LangChain } from 'langchain';

const client = new MongoClient(process.env.MONGODB_URI!);

export async function getRelevantDocuments(query: string) {
  await client.connect();
  const db = client.db();
  const collection = db.collection('StockItems');

  const langchain = new LangChain({
    client,
    collection,
    embeddingModel: 'text-embedding-3-small',
  });

  const results = await langchain.retrieve(query, { topK: 5 });
  return results;
}
