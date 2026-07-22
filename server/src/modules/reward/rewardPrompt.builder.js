/**
 * Generates a context-aware image generation prompt for a reward,
 * adhering to Disha For India branding and Indian context rules.
 * 
 * @param {Object} reward
 * @param {string} reward.title - The title of the reward
 * @param {string} reward.category - The category of the reward
 * @param {string} reward.description - The description of the reward
 * @returns {string} The generated prompt
 */
function generateRewardImagePrompt(reward) {
  const { title, category, description } = reward;

  return `Create an authentic e-commerce product photograph for a marketplace.

Reward:
${title}

Category: ${category}
Description context: ${description || 'A premium reward.'}

Style & Requirements:
- Authentic e-commerce product photography (like Amazon/Flipkart).
- Clean, minimal background (white or light grey).
- Real-world lighting, highly realistic, NOT a surreal or cinematic AI-art style.
- Subtle "DISHA FOR INDIA" branding MUST be included naturally (e.g. small sticker, tag, watermark).

STRICT RESTRICTIONS:
- DO NOT hallucinate text. If the title contains a specific value (e.g., ₹500, 25% Off), the image MUST show EXACTLY that value and nothing else.
- NO foreign currency symbols ($100, $50, US dollars, etc.). Only use the Indian Rupee symbol (₹) if money is involved.
- NO fake book titles, fake company logos, or random text paragraphs.
- Keep text minimal and restricted ONLY to the reward title.
- Authentic Indian context only. No western aesthetics.`;
}

module.exports = {
  generateRewardImagePrompt
};
