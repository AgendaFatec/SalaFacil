import { v2 as cloudinary } from 'cloudinary';
import { ImageProcessor } from '../../utils/imageProcessor.js';
import 'dotenv/config';

export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET
    });
  }

  async uploadImage(fileBuffer: Buffer): Promise<string> {
    const processedBuffer = await ImageProcessor.handleUploadImage(fileBuffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'sala-facil/inventarios',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(new Error("Falha no upload Cloudinary"));
          resolve(result?.secure_url || '');
        }
      );
      uploadStream.end(processedBuffer);
    });
  }
  public getPlaceholderUrl(publicId: string = 'sala_exemplo'): string {
    return cloudinary.url(publicId, {
      width: 1080,
      crop: "fill",
      quality: "auto",
      fetch_format: "auto"
    });
  }

  public async deletePhoto(imageUrl: string): Promise<void> {
  const match = imageUrl.match(/\/v\d+\/(.+)\.[a-z]+$/);
    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(publicId);
    }
  }

}