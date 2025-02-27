import { connectDB, disconnectDB } from '../utils/db';
import { StockItem } from '../models/StockItem';
import dummyData from '../constants/dummyData.json';

async function seedDatabase() {
  try {
    await connectDB();
    console.log('Veritabanına bağlanıldı.');

    // Mevcut verileri temizle
    await StockItem.deleteMany({});
    console.log('Mevcut veriler temizlendi.');

    // Yeni verileri ekle
    await StockItem.insertMany(dummyData);
    console.log('Dummy veriler başarıyla eklendi.');
  } catch (error) {
    console.error('Veritabanı işlemleri sırasında hata oluştu:', error);
  } finally {
    await disconnectDB();
    console.log('Veritabanı bağlantısı kapatıldı.');
  }
}

seedDatabase();
