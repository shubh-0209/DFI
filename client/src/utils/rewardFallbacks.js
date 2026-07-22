export const getCategoryFallbackImage = (category) => {
  const defaultImage = 'https://pexztjeuxhbvlbitjxdm.supabase.co/storage/v1/object/public/marketplace-assets/product_kit_1783670642792.png';
  if (!category) return defaultImage;
  
  const cat = category.toLowerCase();
  
  if (cat.includes('certificate')) {
    return 'https://pexztjeuxhbvlbitjxdm.supabase.co/storage/v1/object/public/marketplace-assets/product_certificate_1783670652184.png';
  }
  if (cat.includes('learning') || cat.includes('coupon') || cat.includes('scholarship') || cat.includes('course')) {
    return 'https://pexztjeuxhbvlbitjxdm.supabase.co/storage/v1/object/public/marketplace-assets/product_course_1783670664367.png';
  }
  if (cat.includes('merchandise') || cat.includes('limited')) {
    return 'https://pexztjeuxhbvlbitjxdm.supabase.co/storage/v1/object/public/marketplace-assets/product_tshirt_1783670796468.png';
  }
  if (cat.includes('partner') || cat.includes('digital') || cat.includes('tech')) {
    return 'https://pexztjeuxhbvlbitjxdm.supabase.co/storage/v1/object/public/marketplace-assets/product_laptop_1783670755779.png';
  }
  
  return defaultImage;
};
