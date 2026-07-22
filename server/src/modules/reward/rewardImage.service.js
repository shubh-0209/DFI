class RewardImageService {
  constructor() {
    this.baseUrl = 'https://pexztjeuxhbvlbitjxdm.supabase.co/storage/v1/object/public/marketplace-assets/';
    this.images = {
      bottle: this.baseUrl + 'product_bottle_1783670700671.png',
      certificate: this.baseUrl + 'product_certificate_1783670652184.png',
      coupon: this.baseUrl + 'product_coupon_1783670691237.png',
      course: this.baseUrl + 'product_course_1783670664367.png',
      ebook: this.baseUrl + 'product_ebook_1783670746190.png',
      voucher: this.baseUrl + 'product_gift_voucher_1783670720222.png',
      hoodie: this.baseUrl + 'product_hoodie_1783670830906.png',
      keychain: this.baseUrl + 'product_keychain_1783670787152.png',
      kit: this.baseUrl + 'product_kit_1783670642792.png',
      laptop: this.baseUrl + 'product_laptop_1783670755779.png',
      mug: this.baseUrl + 'product_mug_1783670765985.png',
      phone: this.baseUrl + 'product_phone_1783670812688.png',
      resume: this.baseUrl + 'product_resume_1783670737521.png',
      scholarship: this.baseUrl + 'product_scholarship_1783670710586.png',
      sleeve: this.baseUrl + 'product_sleeve_1783670821699.png',
      tshirt: this.baseUrl + 'product_tshirt_1783670796468.png',
    };
  }

  /**
   * Intelligently assigns an image based on title and category.
   * @param {string} title - The reward title
   * @param {string} category - The reward category
   * @returns {string} The URL of the assigned image
   */
  assignImage(title, category) {
    const text = `${title} ${category}`.toLowerCase();

    // Specific product matches first
    if (text.includes('laptop') && !text.includes('sleeve')) return this.images.laptop;
    if (text.includes('phone') || text.includes('smartphone')) return this.images.phone;
    if (text.includes('t-shirt') || text.includes('tshirt') || text.includes('shirt')) return this.images.tshirt;
    if (text.includes('hoodie') || text.includes('jacket') || text.includes('sweatshirt')) return this.images.hoodie;
    if (text.includes('bottle') || text.includes('flask')) return this.images.bottle;
    if (text.includes('mug') || text.includes('cup')) return this.images.mug;
    if (text.includes('keychain') || text.includes('key ring')) return this.images.keychain;
    if (text.includes('sleeve') || text.includes('case')) return this.images.sleeve;
    if (text.includes('kit') || text.includes('bag') || text.includes('backpack')) return this.images.kit;

    // Academic / Professional
    if (text.includes('scholarship') || text.includes('fee waiver')) return this.images.scholarship;
    if (text.includes('certificate') || text.includes('recognition')) return this.images.certificate;
    if (text.includes('resume') || text.includes('cv') || text.includes('interview')) return this.images.resume;
    if (text.includes('book') || text.includes('e-book') || text.includes('ebook')) return this.images.ebook;

    // Digital / Vouchers
    if (text.includes('amazon') || text.includes('voucher') || text.includes('gift card')) return this.images.voucher;
    if (text.includes('coupon') || text.includes('discount') || text.includes('off')) return this.images.coupon;
    if (text.includes('course') || text.includes('learning') || text.includes('upskill')) return this.images.course;

    // Category fallbacks
    const cat = category.toLowerCase();
    if (cat.includes('technology') || cat.includes('tech') || cat.includes('digital')) return this.images.laptop;
    if (cat.includes('education') || cat.includes('academic') || cat.includes('learning')) return this.images.course;
    if (cat.includes('merchandise') || cat.includes('apparel') || cat.includes('clothing')) return this.images.tshirt;
    if (cat.includes('recognition') || cat.includes('award')) return this.images.certificate;
    if (cat.includes('partner') || cat.includes('benefit') || cat.includes('lifestyle')) return this.images.voucher;

    // Ultimate fallback
    return this.images.kit;
  }
}

module.exports = new RewardImageService();
