import dotenv from 'dotenv';
import path from 'node:path';
import dns from 'node:dns';

// 1. DNS yaması: ECONNREFUSED hatasını engellemek için IPv4'e öncelik ver
dns.setDefaultResultOrder('ipv4first');

// 2. .env yapılandırması (Dosya yolunu kesinleştiriyoruz)
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

const bootstrap = async () => {
  try {
    console.log('--- Bağlantı Kontrolü ---');
    // .env dosyasının okunup okunmadığını kontrol ediyoruz
    if (!process.env.MONGODB_URI) {
      console.error('HATA: MONGODB_URI tanımlı değil! .env dosyasını kontrol et.');
      return;
    }
    
    console.log('URI bulundu, bağlantı kuruluyor...');
    
    // 3. Önce veritabanı bağlantısı
    await initMongoConnection();
    
    // 4. Bağlantı başarılıysa server'ı başlat
    setupServer();
    
  } catch (error) {
    console.error('Bootstrap sırasında kritik hata:', error);
    process.exit(1);
  }
};

bootstrap();