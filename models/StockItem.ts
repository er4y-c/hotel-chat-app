import { Schema, model, models, Document } from 'mongoose';

// Stok öğesi için temel arayüz
export interface IStockItem extends Document {
  code: string;
  name: string;
  category: string;
  subCategory?: string;
  unit: string;
  description: string;
  embedding?: number[];
  price?: number;
  suppliers?: string[];
  substitutes?: string[]; // alternatif ürünlerin kodları
  minimumStock?: number;
  currentStock?: number;
}

// MongoDB Şeması
const StockItemSchema = new Schema<IStockItem>({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  unit: { type: String, required: true },
  description: { type: String, required: true },
  embedding: { type: [Number] }, // OpenAI embedding vektörü
  price: { type: Number },
  suppliers: { type: [String] },
  substitutes: { type: [String] },
  minimumStock: { type: Number },
  currentStock: { type: Number },
});

// Vektör bazlı arama için index
StockItemSchema.index({ embedding: '2dsphere' });

// Model oluşturma (Next.js hot reloading için kontrol)
export const StockItem = models.StockItem || model<IStockItem>('StockItem', StockItemSchema);
