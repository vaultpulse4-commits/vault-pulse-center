/**
 * Image Compression Utility
 * Automatically compresses images to fit within size limits while maintaining quality
 */

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  initialQuality?: number;
  minQuality?: number;
}

/**
 * Compress image file to target size
 * @param file - Image file to compress
 * @param options - Compression options
 * @returns Promise<string> - Base64 encoded compressed image
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<string> {
  const {
    maxSizeMB = 2,
    maxWidthOrHeight = 1920,
    initialQuality = 0.9,
    minQuality = 0.6
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onerror = () => reject(new Error('Failed to load image'));
      
      img.onload = () => {
        try {
          // Calculate new dimensions while maintaining aspect ratio
          let { width, height } = img;
          
          if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
            if (width > height) {
              height = (height / width) * maxWidthOrHeight;
              width = maxWidthOrHeight;
            } else {
              width = (width / height) * maxWidthOrHeight;
              height = maxWidthOrHeight;
            }
          }

          // Create canvas for compression
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // Draw image on canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Compress iteratively until size is acceptable
          let quality = initialQuality;
          let compressed = canvas.toDataURL('image/jpeg', quality);
          
          // Calculate size in MB
          const getSize = (base64: string) => {
            const bytes = Math.ceil((base64.length * 3) / 4);
            return bytes / (1024 * 1024);
          };

          // Iteratively reduce quality until size is acceptable
          while (getSize(compressed) > maxSizeMB && quality > minQuality) {
            quality -= 0.1;
            compressed = canvas.toDataURL('image/jpeg', quality);
          }

          // If still too large, reduce dimensions
          if (getSize(compressed) > maxSizeMB) {
            const scale = Math.sqrt(maxSizeMB / getSize(compressed));
            canvas.width = Math.floor(width * scale);
            canvas.height = Math.floor(height * scale);
            
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            compressed = canvas.toDataURL('image/jpeg', minQuality);
          }

          resolve(compressed);
        } catch (error) {
          reject(error);
        }
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Validate and compress image if needed
 * @param file - Image file to process
 * @param maxSizeMB - Maximum size in MB (default 2MB)
 * @returns Promise with compressed base64 image and metadata
 */
export async function validateAndCompressImage(
  file: File,
  maxSizeMB: number = 2
): Promise<{
  success: boolean;
  data?: string;
  originalSize?: number;
  compressedSize?: number;
  wasCompressed?: boolean;
  error?: string;
}> {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'File is not an image'
      };
    }

    const originalSizeMB = file.size / (1024 * 1024);
    
    // If image is already small enough, just convert to base64
    if (originalSizeMB <= maxSizeMB) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            success: true,
            data: reader.result as string,
            originalSize: originalSizeMB,
            compressedSize: originalSizeMB,
            wasCompressed: false
          });
        };
        reader.readAsDataURL(file);
      });
    }

    // Compress image
    const compressed = await compressImage(file, { maxSizeMB });
    const compressedSizeMB = Math.ceil((compressed.length * 3) / 4) / (1024 * 1024);

    return {
      success: true,
      data: compressed,
      originalSize: originalSizeMB,
      compressedSize: compressedSizeMB,
      wasCompressed: true
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process image'
    };
  }
}
