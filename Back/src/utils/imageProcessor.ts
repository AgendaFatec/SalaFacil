import sharp from 'sharp';

export class ImageProcessor {
  public static async handleUploadImage(buffer: Buffer): Promise<Buffer> {
    return await sharp(buffer)
      .resize(1080, null, { 
        withoutEnlargement: true,
      })
      .webp({ quality: 75 })
      .toBuffer();
  }
}