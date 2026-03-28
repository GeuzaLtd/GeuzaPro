'use server';

import cloudinary from '@/lib/cloudinary';

interface UploadResult {
  url:       string;
  publicId:  string;
  width:     number;
  height:    number;
}

/**
 * Upload a file (from a FormData field) to Cloudinary.
 * @param formData  FormData containing a "file" field
 * @param folder    Cloudinary folder name, e.g. "products", "blogs", "employees"
 */
export async function uploadImage(
  formData: FormData,
  folder = 'geuza'
): Promise<UploadResult> {
  const file = formData.get('file') as File;
  if (!file) throw new Error('No file provided.');

  const arrayBuffer = await file.arrayBuffer();
  const buffer      = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error('Upload failed.'));
        resolve({
          url:      result.secure_url,
          publicId: result.public_id,
          width:    result.width,
          height:   result.height,
        });
      }
    );
    stream.end(buffer);
  });
}

/**
 * Delete an image from Cloudinary by its public_id.
 */
export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
