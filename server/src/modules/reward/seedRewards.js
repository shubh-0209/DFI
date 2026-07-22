require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const sampleRewards = [
  {
    name: 'Disha Official T-Shirt',
    description: 'Premium cotton Disha for India branded t-shirt. Show your volunteer pride with this comfortable, high-quality tee available in sizes S to XXL.',
    category: 'Disha Merchandise',
    coinCost: 500,
    image: "https://pexztjeuxhbvlbitjxdm.supabase.co/storage/v1/object/public/marketplace-assets/product_tshirt_1783670796468.png",
    stock: 100,
    popularity: 120,
    isFeatured: true,
    eligibility: 'All active volunteers',
    termsAndConditions: 'One per volunteer while stocks last. Size subject to availability.',
    estimatedDelivery: '2-3 weeks',
    status: 'active',
    tags: ['merchandise', 'clothing', 'featured'],
  },
  {
    name: 'Volunteer Recognition Certificate',
    description: 'A beautifully designed framed certificate recognizing your volunteer service. Perfect for your portfolio, CV, or wall of fame.',
    category: 'Certificates',
    coinCost: 300,
    image: "https://pexztjeuxhbvlbitjxdm.supabase.co/storage/v1/object/public/marketplace-assets/product_certificate_1783670652184.png",
    stock: 200,
    popularity: 95,
    isFeatured: true,
    eligibility: 'Minimum 50 hours of volunteer service',
    termsAndConditions: 'Digital and physical copy included. Delivery within India only.',
    estimatedDelivery: '1-2 weeks',
    status: 'active',
    tags: ['certificate', 'recognition'],
  },
  {
    name: 'TalentGrow Learning Coupon - 25% Off',
    description: 'Get 25% off any course on the TalentGrow platform. Upskill yourself with courses in technology, business, design, and more.',
    category: 'TalentGrow Coupons',
    coinCost: 750,
    image: "https://pexztjeuxhbvlbitjxdm.supabase.co/storage/v1/object/public/marketplace-assets/product_coupon_1783670691237.png",
    stock: 50,
    popularity: 88,
    isFeatured: false,
    eligibility: 'All volunteers',
    termsAndConditions: 'Valid for 3 months from issuance. Cannot be combined with other offers.',
    estimatedDelivery: 'Instant (digital)',
    status: 'active',
    tags: ['coupon', 'learning', 'upskilling'],
  },
  {
    name: 'Online Course Access - Python for Beginners',
    description: 'Full access to a 6-week self-paced Python programming course. Includes video lectures, coding exercises, and a completion certificate.',
    category: 'Learning Resources',
    coinCost: 1200,
    image: "https://pexztjeuxhbvlbitjxdm.supabase.co/storage/v1/object/public/marketplace-assets/product_course_1783670664367.png",
    stock: 30,
    popularity: 76,
    isFeatured: true,
    eligibility: 'All volunteers with basic computer knowledge',
    termsAndConditions: 'Access valid for 6 months. Non-transferable.',
    estimatedDelivery: 'Instant (digital)',
    status: 'active',
    tags: ['course', 'python', 'programming'],
  },
  {
    name: 'DFI Branded Water Bottle',
    description: 'Stay hydrated while volunteering! High-quality stainless steel water bottle with Disha for India branding. 750ml capacity.',
    category: 'Disha Merchandise',
    coinCost: 400,
    image: "https://pexztjeuxhbvlbitjxdm.supabase.co/storage/v1/object/public/marketplace-assets/product_bottle_1783670700671.png",
    stock: 75,
    popularity: 65,
    isFeatured: false,
    eligibility: 'All active volunteers',
    termsAndConditions: 'One per volunteer while stocks last. Available in blue and white.',
    estimatedDelivery: '2-3 weeks',
    status: 'active',
    tags: ['merchandise', 'bottle', 'hydration'],
  },
  {
    name: 'Scholarship Application Fee Waiver',
    description: 'Get a full waiver on application fees for participating in Disha Foundation partner scholarship programs across India.',
    category: 'Scholarships',
    coinCost: 2000,
    image: "https://pexztjeuxhbvlbitjxdm.supabase.co/storage/v1/object/public/marketplace-assets/product_scholarship_1783670710586.png",
    stock: 20,
    popularity: 92,
    isFeatured: true,
    eligibility: 'Volunteers with 100+ hours of service',
    termsAndConditions: 'Applicable only to partner institutions. Must apply within 6 months of redemption.',
    estimatedDelivery: 'Instant (digital code)',
    status: 'active',
    tags: ['scholarship', 'education', 'waiver'],
  },
  {
    name: 'Amazon Gift Voucher - Rs. 500',
    description: 'Rs. 500 Amazon gift voucher delivered to your email. Use it for anything you need!',
    category: 'Partner Benefits',
    coinCost: 600,
    image: "https://pexztjeuxhbvlbitjxdm.supabase.co/storage/v1/object/public/marketplace-assets/product_gift_voucher_1783670720222.png",
    stock: 40,
    popularity: 150,
    isFeatured: true,
    eligibility: 'All active volunteers',
    termsAndConditions: 'Valid for 12 months from issuance. Non-transferable and non-refundable.',
    estimatedDelivery: 'Instant (email)',
    status: 'active',
    tags: ['gift', 'voucher', 'amazon'],
  },
  {
    name: 'Limited Edition Disha Hoodie',
    description: 'Premium fleece hoodie with exclusive Disha for India design. Warm, comfortable, and perfect for volunteer events.',
    category: 'Limited Time Rewards',
    coinCost: 1500,
    image: "https://pexztjeuxhbvlbitjxdm.supabase.co/storage/v1/object/public/marketplace-assets/product_hoodie_1783670830906.png",
    stock: 25,
    popularity: 110,
    isFeatured: true,
    eligibility: 'Volunteers with 200+ hours of service',
    termsAndConditions: 'Limited edition. One per volunteer while stocks last. Available in sizes M to XXL.',
    estimatedDelivery: '2-3 weeks',
    status: 'active',
    tags: ['limited', 'hoodie', 'merchandise', 'premium'],
  },
  {
    name: 'Professional Resume Review',
    description: 'Get your resume reviewed by a panel of industry professionals from our partner organizations. Includes a detailed feedback report.',
    category: 'Partner Benefits',
    coinCost: 800,
    image: "https://pexztjeuxhbvlbitjxdm.supabase.co/storage/v1/object/public/marketplace-assets/product_resume_1783670737521.png",
    stock: 15,
    popularity: 70,
    isFeatured: false,
    eligibility: 'All volunteers',
    termsAndConditions: 'Feedback delivered within 5 business days via email.',
    estimatedDelivery: 'Instant (schedule within 7 days)',
    status: 'active',
    tags: ['resume', 'career', 'review'],
  },
  {
    name: 'E-Book: The Art of Volunteering',
    description: 'A comprehensive e-book on effective volunteering strategies, community engagement, and making lasting social impact.',
    category: 'Digital Rewards',
    coinCost: 250,
    image: "https://pexztjeuxhbvlbitjxdm.supabase.co/storage/v1/object/public/marketplace-assets/product_ebook_1783670746190.png",
    stock: 999,
    popularity: 55,
    isFeatured: false,
    eligibility: 'All volunteers',
    termsAndConditions: 'PDF format. Non-transferable.',
    estimatedDelivery: 'Instant (digital download)',
    status: 'active',
    tags: ['ebook', 'digital', 'learning'],
  },
  {
    name: 'Disha Volunteering Kit',
    description: 'A complete volunteering kit containing a premium Disha notebook, metallic pen, volunteer badge, sticker pack, and a durable drawstring bag.',
    category: 'Disha Merchandise',
    coinCost: 800,
    image: "https://pexztjeuxhbvlbitjxdm.supabase.co/storage/v1/object/public/marketplace-assets/product_kit_1783670642792.png",
    stock: 50,
    popularity: 90,
    isFeatured: true,
    eligibility: 'All active volunteers',
    termsAndConditions: 'One kit per volunteer. Subject to stock availability.',
    estimatedDelivery: '1-2 weeks',
    status: 'active',
    tags: ['merchandise', 'kit', 'volunteer', 'featured'],
  },
  {
    name: 'Premium Study Laptop',
    description: 'A high-performance laptop powered by our educational sponsors to assist dedicated volunteers with their academic studies, coursework, and online research.',
    category: 'Partner Benefits',
    coinCost: 25000,
    image: "https://pexztjeuxhbvlbitjxdm.supabase.co/storage/v1/object/public/marketplace-assets/product_laptop_1783670755779.png",
    stock: 5,
    popularity: 200,
    isFeatured: true,
    eligibility: 'Volunteers with 300+ hours of service and exceptional records',
    termsAndConditions: 'Subject to academic performance review and verification of service hours.',
    estimatedDelivery: '3-4 weeks',
    status: 'active',
    tags: ['laptop', 'device', 'education', 'featured'],
  },
  {
    name: 'Smart Study Phone',
    description: 'A modern smartphone provided by corporate partners to support digital learning, communication, and coordinate local volunteer drives.',
    category: 'Partner Benefits',
    coinCost: 12000,
    image: "https://pexztjeuxhbvlbitjxdm.supabase.co/storage/v1/object/public/marketplace-assets/product_phone_1783670812688.png",
    stock: 10,
    popularity: 140,
    isFeatured: false,
    eligibility: 'Volunteers with 150+ hours of service',
    termsAndConditions: 'Provided for educational and communication purposes.',
    estimatedDelivery: '2-3 weeks',
    status: 'active',
    tags: ['phone', 'device', 'communication'],
  },
  {
    name: 'DFI Premium Laptop Sleeve',
    description: 'Water-resistant, padded neoprene laptop sleeve with sleek Disha For India logo embroidery. Fits laptops up to 15.6 inches.',
    category: 'Disha Merchandise',
    coinCost: 600,
    image: "https://pexztjeuxhbvlbitjxdm.supabase.co/storage/v1/object/public/marketplace-assets/product_sleeve_1783670821699.png",
    stock: 40,
    popularity: 80,
    isFeatured: false,
    eligibility: 'All active volunteers',
    termsAndConditions: 'Compatible with standard 15.6 inch laptops or smaller.',
    estimatedDelivery: '1-2 weeks',
    status: 'active',
    tags: ['merchandise', 'sleeve', 'accessory'],
  },
  {
    name: 'Disha Official Keychain',
    description: 'Metallic keychain featuring the engraved logo of Disha for India. A durable and elegant token of your volunteering journey.',
    category: 'Disha Merchandise',
    coinCost: 150,
    image: "https://pexztjeuxhbvlbitjxdm.supabase.co/storage/v1/object/public/marketplace-assets/product_keychain_1783670787152.png",
    stock: 150,
    popularity: 50,
    isFeatured: false,
    eligibility: 'All active volunteers',
    termsAndConditions: 'Available while stocks last.',
    estimatedDelivery: '1-2 weeks',
    status: 'active',
    tags: ['merchandise', 'keychain', 'accessory'],
  },
  {
    name: 'Disha Ceramic Coffee Mug',
    description: 'Beautifully crafted ceramic coffee mug with the motivational slogan: "Make an Impact Every Day" and the Disha For India branding.',
    category: 'Disha Merchandise',
    coinCost: 250,
    image: "https://pexztjeuxhbvlbitjxdm.supabase.co/storage/v1/object/public/marketplace-assets/product_mug_1783670765985.png",
    stock: 100,
    popularity: 75,
    isFeatured: false,
    eligibility: 'All active volunteers',
    termsAndConditions: 'Microwave and dishwasher safe.',
    estimatedDelivery: '1-2 weeks',
    status: 'active',
    tags: ['merchandise', 'mug', 'cup'],
  },
];

const seedRewards = async () => {
  try {
    console.log('Connected to Supabase');

    const { data: allRewards, error: fetchErr } = await supabase.from('rewardcatalogs').select('document');
    if (fetchErr) throw fetchErr;
    
    console.log(`Existing rewards in catalog: ${allRewards.length}`);

    for (const reward of sampleRewards) {
      const existing = allRewards.find(r => r.document.name === reward.name);
      if (!existing) {
        const id = uuidv4();
        const document = { ...reward, _id: id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        
        await supabase.from('rewardcatalogs').insert([{
          _id: id,
          document
        }]);
        console.log(`Created reward: ${reward.name}`);
      } else {
        console.log(`Reward already exists: ${reward.name}`);
      }
    }

    const { count } = await supabase.from('rewardcatalogs').select('*', { count: 'exact', head: true });
    console.log(`Total rewards in catalog: ${count}`);
    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedRewards();
