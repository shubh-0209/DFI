const { storageService } = require('../contribution/storage.service');

class AiImageService {
  /**
   * Generates an image using OpenAI DALL-E 3 and uploads it permanently to Cloudinary.
   * 
   * @param {string} prompt - The prompt to generate the image
   * @returns {Promise<string>} The permanent URL of the generated image on Cloudinary
   */
  async generateAndUploadImage(prompt) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured in the environment.');
    }

    try {
      // 1. Call OpenAI DALL-E 3 API
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt,
          n: 1,
          size: '1024x1024',
          response_format: 'url'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData?.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const generatedUrl = data.data[0].url;

      if (!generatedUrl) {
        throw new Error('No image URL returned from OpenAI.');
      }

      // 2. Fetch the generated image buffer
      const imageResponse = await fetch(generatedUrl);
      if (!imageResponse.ok) {
        throw new Error('Failed to fetch the generated image from OpenAI.');
      }
      const arrayBuffer = await imageResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 3. Upload to Cloudinary using existing storage service
      const uploadResult = await storageService.uploadFile(buffer, {
        folder: 'disha/marketplace-rewards',
        resourceType: 'image'
      });

      return uploadResult.publicUrl;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[AiImageService] Image generation failed:', error.message);
      throw error;
    }
  }
}

module.exports = new AiImageService();
