import { v2 as cloudinary } from 'cloudinary';

// Cloudinary ayarları
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Dosyayı Cloudinary'e yükleyen fonksiyon
export const saveFileToCloudinary = async (file) => {
  const result = await cloudinary.uploader.upload(
    `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
    {
      folder: 'contacts',
      resource_type: 'auto',
    },
  );

  return result.secure_url;
};