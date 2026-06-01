import fs from 'fs';
import path from 'path';
import { CloudinaryService } from '../services/storage/cloudinaryService.js';
import 'dotenv/config';

export async function migrateLocalImages() {
  const cloudinary = new CloudinaryService();
  const uploadsDir = path.join(process.cwd(), 'uploads');
  const mapping: Record<string, string> = {}; 

  if (!fs.existsSync(uploadsDir)) return mapping;

  // Pega todas as pastas dentro de /uploads
  const subFolders = fs.readdirSync(uploadsDir).filter(f => 
    fs.statSync(path.join(uploadsDir, f)).isDirectory()
  );

  for (const folder of subFolders) {
    const folderPath = path.join(uploadsDir, folder);
    const files = fs.readdirSync(folderPath);
    // Pega a primeira imagem que encontrar na pasta
    const image = files.find(f => /\.(jpg|jpeg|png)$/i.test(f));
    
    if (image) {
      console.log(`Migrando imagem da pasta ${folder}...`);
      const buffer = fs.readFileSync(path.join(folderPath, image));
      
      try {
        // Usa seu método de upload existente
        const url = await cloudinary.uploadImage(buffer);
        mapping[folder] = url; 
      } catch (err) {
        console.error(`Erro ao subir ${image}:`, err);
      }
    }
  }
  return mapping;
}

// import fs from 'fs';
// import path from 'path';
// import { CloudinaryService } from '../services/storage/cloudinaryService.js';
// import 'dotenv/config';

// export async function migrateLocalImages() {
//   const cloudinary = new CloudinaryService();
//   const uploadsDir = path.join(process.cwd(), 'uploads');
  
//   if (!fs.existsSync(uploadsDir)) return [];

//   const files = fs.readdirSync(uploadsDir);
//   const uploadedUrls: string[] = [];

//   console.log(`found ${files.length} images to migrate...`);

//   for (const file of files) {
//     if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
//       const filePath = path.join(uploadsDir, file);
//       const buffer = fs.readFileSync(filePath);
      
//       try {
//         console.log(`Uploading ${file}...`);
//         const url = await cloudinary.uploadImage(buffer);
//         uploadedUrls.push(url);
//       } catch (err) {
//         console.error(`Failed to upload ${file}:`, err);
//       }
//     }
//   }

//   return uploadedUrls;
// }