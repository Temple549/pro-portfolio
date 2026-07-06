import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from './config';

const storage = getStorage(app);

export interface UploadResult {
  url: string;
  path: string;
}

export const storageService = {
  async uploadFile(
    file: File,
    folder: string,
    fileName?: string
  ): Promise<UploadResult> {
    try {
      const timestamp = Date.now();
      const sanitizedName = (fileName || file.name)
        .toLowerCase()
        .replace(/[^a-z0-9.-]/g, '-')
        .replace(/-+/g, '-');
      
      const fullPath = `${folder}/${timestamp}-${sanitizedName}`;
      const storageRef = ref(storage, fullPath);

      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      return { url, path: fullPath };
    } catch (error: any) {
      console.error('Storage Upload Error:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  },

  async deleteFile(path: string): Promise<void> {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error: any) {
      console.error('Storage Delete Error:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  },

  async uploadBlogImage(file: File, fileName?: string): Promise<UploadResult> {
    return this.uploadFile(file, 'blog-images', fileName);
  },
};