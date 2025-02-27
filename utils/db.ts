import mongoose from 'mongoose';

// MongoDB bağlantı URL'i
const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'MONGODB_URI ortam değişkeni tanımlanmamış. Lütfen .env.local dosyanızı kontrol edin.',
  );
}

/**
 * Global mongoose bağlantı önbelleği için tip tanımı
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Global değişkeni TypeScript için tanımla
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache;
}

// Geliştirme modunda hot-reload ile her seferinde yeni bağlantı açılmasını önlemek için
// global bir değişken kullanıyoruz
const cached: MongooseCache = globalThis.mongooseCache || {
  conn: null,
  promise: null,
};

// Global değişkeni güncelle
if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = cached;
}

/**
 * MongoDB'ye bağlanmak için asenkron fonksiyon
 * @returns MongoDB bağlantısı
 */
export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log('MongoDB bağlantısı başarılı');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB bağlantı hatası:', e);
    throw e;
  }

  return cached.conn;
}

/**
 * MongoDB bağlantısını kapatmak için asenkron fonksiyon
 * Genellikle test veya script çalıştırırken gereklidir
 */
export async function disconnectDB() {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('MongoDB bağlantısı kapatıldı');
  }
}
