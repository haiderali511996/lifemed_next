const mongoose = require('mongoose');
const Product = require('./models/Product');
const Blog = require('./models/Blog');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://clausiva2025_db_user:G8ZOWqiPoR2j9lmS@cluster0.dnhpyxp.mongodb.net/lifemed_pharma';

const products = [
  {
    name: 'LifeVit Multivitamin Tablets',
    slug: 'lifevit-multivitamin-tablets',
    shortDescription: 'Complete daily multivitamin with 23 essential nutrients for optimal health',
    description: 'LifeVit Multivitamin is a scientifically formulated blend of 23 essential vitamins and minerals designed to support overall health and wellbeing. Each tablet provides 100% of the daily recommended intake of key nutrients including Vitamin A, B-complex, C, D, E, and essential minerals.',
    price: 850,
    salePrice: 720,
    category: 'supplements',
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500'],
    isFeatured: true,
    ratings: 4.8,
    reviewCount: 124,
    sku: 'LMP-VIT-001',
    ingredients: ['Vitamin A', 'Vitamin C', 'Vitamin D3', 'Vitamin E', 'B-Complex', 'Zinc', 'Iron', 'Calcium'],
    usage: 'Take 1 tablet daily after meals with water',
    manufacturer: 'Lifemed Pharma',
    tags: ['vitamins', 'multivitamin', 'supplements', 'daily health']
  },
  {
    name: 'CalmFlex Pain Relief Gel',
    slug: 'calmflex-pain-relief-gel',
    shortDescription: 'Fast-acting topical gel for muscle and joint pain relief',
    description: 'CalmFlex Pain Relief Gel provides rapid, targeted relief from muscle aches, joint pain, and inflammation. The advanced formula with Diclofenac and menthol penetrates deep into tissues to deliver fast relief within minutes of application.',
    price: 420,
    salePrice: 380,
    category: 'creams',
    images: ['https://images.unsplash.com/photo-1559839914-17aae19cec71?w=500'],
    isFeatured: true,
    ratings: 4.6,
    reviewCount: 89,
    sku: 'LMP-CRM-001',
    ingredients: ['Diclofenac Sodium 1%', 'Menthol 5%', 'Methyl Salicylate', 'Linseed Oil'],
    usage: 'Apply thin layer to affected area 3-4 times daily. Massage gently.',
    tags: ['pain relief', 'gel', 'muscle pain', 'joint pain', 'topical']
  },
  {
    name: 'PharmaFlu Cough Syrup',
    slug: 'pharmaflu-cough-syrup',
    shortDescription: 'Effective cough suppressant and expectorant for dry and wet cough',
    description: 'PharmaFlu Cough Syrup combines Dextromethorphan and Guaifenesin for comprehensive cough relief. Suitable for both dry and productive cough, this honey-based formula soothes the throat while clearing mucus.',
    price: 280,
    salePrice: null,
    category: 'syrups',
    images: ['https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500'],
    isFeatured: true,
    ratings: 4.5,
    reviewCount: 211,
    sku: 'LMP-SYR-001',
    ingredients: ['Dextromethorphan HBr 10mg', 'Guaifenesin 100mg', 'Honey Extract', 'Menthol'],
    usage: 'Adults: 10ml every 6 hours. Children (6-12): 5ml every 6 hours. Do not exceed 4 doses/day.',
    tags: ['cough', 'syrup', 'expectorant', 'cold', 'flu']
  },
  {
    name: 'DermaClear Vitamin C Serum',
    slug: 'dermaclear-vitamin-c-serum',
    shortDescription: '20% Vitamin C brightening serum for radiant, even-toned skin',
    description: 'DermaClear Vitamin C Serum features a stabilized 20% L-Ascorbic Acid formula that visibly brightens skin, reduces dark spots, and boosts collagen production. Enriched with Hyaluronic Acid and Vitamin E for added hydration and antioxidant protection.',
    price: 1200,
    salePrice: 999,
    category: 'serums',
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'],
    isFeatured: true,
    ratings: 4.9,
    reviewCount: 178,
    sku: 'LMP-SRM-001',
    ingredients: ['L-Ascorbic Acid 20%', 'Hyaluronic Acid', 'Vitamin E', 'Ferulic Acid', 'Niacinamide'],
    usage: 'Apply 3-4 drops to cleansed face every morning. Follow with sunscreen.',
    tags: ['serum', 'vitamin c', 'brightening', 'anti-aging', 'skincare']
  },
  {
    name: 'CardioGuard Omega-3 Capsules',
    slug: 'cardioguard-omega3-capsules',
    shortDescription: 'High-purity fish oil capsules for heart and brain health',
    description: 'CardioGuard Omega-3 provides 1200mg of high-purity fish oil per capsule, delivering 720mg EPA and 480mg DHA. Molecularly distilled and tested for purity, these enteric-coated capsules support cardiovascular health, brain function, and reduce inflammation.',
    price: 1100,
    salePrice: 950,
    category: 'supplements',
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500'],
    isFeatured: false,
    ratings: 4.7,
    reviewCount: 95,
    sku: 'LMP-SUP-002',
    ingredients: ['Fish Oil 1200mg', 'EPA 720mg', 'DHA 480mg', 'Vitamin E (preservative)'],
    usage: 'Take 1-2 capsules daily with meals',
    tags: ['omega-3', 'fish oil', 'heart health', 'supplements']
  },
  {
    name: 'SkinGlow Hydra Cream',
    slug: 'skinglow-hydra-cream',
    shortDescription: 'Intensive moisturizing cream for dry and sensitive skin',
    description: 'SkinGlow Hydra Cream delivers 72-hour deep hydration using a unique blend of ceramides, shea butter, and hyaluronic acid. Clinically tested for sensitive skin, this fragrance-free formula restores the skin barrier and provides long-lasting moisture.',
    price: 680,
    salePrice: 599,
    category: 'creams',
    images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500'],
    isFeatured: false,
    ratings: 4.6,
    reviewCount: 143,
    sku: 'LMP-CRM-002',
    ingredients: ['Ceramides', 'Shea Butter', 'Hyaluronic Acid', 'Glycerin', 'Niacinamide'],
    usage: 'Apply to face and body morning and evening on cleansed skin',
    tags: ['moisturizer', 'cream', 'hydration', 'sensitive skin', 'ceramides']
  },
  {
    name: 'GastriCal Antacid Syrup',
    slug: 'gastrical-antacid-syrup',
    shortDescription: 'Fast-acting antacid for heartburn, acidity and gastric discomfort',
    description: 'GastriCal Antacid Syrup provides rapid relief from hyperacidity, heartburn, and gastric discomfort. The mint-flavored formula combines aluminum hydroxide and magnesium hydroxide for balanced, effective acid neutralization without constipation.',
    price: 180,
    salePrice: null,
    category: 'syrups',
    images: ['https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500'],
    isFeatured: false,
    ratings: 4.4,
    reviewCount: 67,
    sku: 'LMP-SYR-002',
    ingredients: ['Aluminum Hydroxide 200mg/5ml', 'Magnesium Hydroxide 200mg/5ml', 'Simethicone 25mg/5ml'],
    usage: 'Adults: 10-20ml after meals and at bedtime. Shake well before use.',
    tags: ['antacid', 'heartburn', 'acidity', 'gastric', 'syrup']
  },
  {
    name: 'RetinoClear Anti-Aging Serum',
    slug: 'retinoclear-anti-aging-serum',
    shortDescription: 'Retinol-based anti-aging serum for fine lines and wrinkles',
    description: 'RetinoClear features 0.3% encapsulated retinol that is gradually released for effective yet gentle anti-aging action. This serum visibly reduces fine lines, improves skin texture, and promotes cell turnover for a more youthful complexion.',
    price: 1450,
    salePrice: 1199,
    category: 'serums',
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'],
    isFeatured: false,
    ratings: 4.8,
    reviewCount: 112,
    sku: 'LMP-SRM-002',
    ingredients: ['Retinol 0.3%', 'Peptide Complex', 'Niacinamide 5%', 'Hyaluronic Acid', 'Squalane'],
    usage: 'Apply pea-sized amount at night to cleansed skin. Always use SPF in the morning.',
    tags: ['retinol', 'anti-aging', 'serum', 'wrinkles', 'skincare']
  }
];

const blogs = [
  {
    title: 'Understanding the Importance of Daily Vitamins and Supplements',
    slug: 'importance-daily-vitamins-supplements',
    excerpt: 'Discover why daily vitamins are essential for maintaining optimal health and preventing nutritional deficiencies in our modern lifestyle.',
    content: `<p>In today's fast-paced world, getting all the nutrients we need from diet alone can be challenging. Daily vitamins and supplements bridge nutritional gaps and support overall health. Here's what you need to know:</p>
    <h2>Why We Need Supplements</h2>
    <p>Modern agricultural practices, food processing, and busy lifestyles mean that many people don't get adequate nutrition from food alone. Studies show that up to 92% of the population is deficient in at least one vitamin or mineral.</p>
    <h2>Key Vitamins for Daily Health</h2>
    <p>Vitamin D supports bone health and immune function. Vitamin C boosts immunity and collagen production. B-complex vitamins support energy metabolism and brain function. Vitamin E provides antioxidant protection.</p>
    <h2>When to Take Supplements</h2>
    <p>Most vitamins are best taken with meals to enhance absorption. Fat-soluble vitamins (A, D, E, K) should be taken with fatty foods. Water-soluble vitamins like C and B-complex can be taken anytime.</p>`,
    author: 'Dr. Amina Khalid, PharmD',
    category: 'Health Tips',
    tags: ['vitamins', 'supplements', 'health', 'nutrition'],
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800',
    readTime: 5,
    views: 1234
  },
  {
    title: 'Top 5 Natural Remedies for Common Cold and Flu Season',
    slug: 'natural-remedies-cold-flu',
    excerpt: 'Learn effective natural remedies and pharmaceutical approaches to prevent and treat cold and flu symptoms this season.',
    content: `<p>Cold and flu season brings discomfort that can significantly impact daily life. While rest and hydration are fundamental, several remedies can help speed recovery and reduce symptom severity.</p>
    <h2>1. Honey and Ginger</h2>
    <p>This combination has powerful antimicrobial and anti-inflammatory properties. Ginger reduces nausea and inflammation while honey soothes sore throats.</p>
    <h2>2. Zinc Supplements</h2>
    <p>Studies show zinc can reduce the duration of colds by up to 33%. Take zinc lozenges at the first sign of symptoms for best results.</p>
    <h2>3. Steam Inhalation</h2>
    <p>Breathing steam helps loosen congestion and relieve sinus pressure. Add eucalyptus oil for additional antimicrobial benefits.</p>`,
    author: 'Dr. Hassan Malik, MD',
    category: 'Medical Advice',
    tags: ['cold', 'flu', 'natural remedies', 'immunity'],
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800',
    readTime: 4,
    views: 892
  },
  {
    title: 'Complete Guide to Skin Care: Building Your Perfect Routine',
    slug: 'complete-guide-skin-care-routine',
    excerpt: 'A dermatologist-approved guide to building an effective skincare routine using the right serums, creams, and treatments.',
    content: `<p>A consistent skincare routine is the foundation of healthy, radiant skin. Whether you're a beginner or looking to optimize your existing routine, this guide provides evidence-based recommendations.</p>
    <h2>Morning Routine Essentials</h2>
    <p>Start with a gentle cleanser, followed by a Vitamin C serum for antioxidant protection. Apply moisturizer and always finish with SPF 30+ sunscreen.</p>
    <h2>Evening Routine</h2>
    <p>Double cleanse to remove makeup and sunscreen. Apply treatment serums like retinol or AHAs. Finish with a rich night cream or face oil.</p>
    <h2>Key Ingredients to Look For</h2>
    <p>Retinoids for anti-aging, Vitamin C for brightening, Hyaluronic Acid for hydration, Niacinamide for pores and pigmentation, and Ceramides for barrier repair.</p>`,
    author: 'Dr. Sana Ahmed, Dermatologist',
    category: 'Skin Care',
    tags: ['skincare', 'serum', 'moisturizer', 'routine', 'dermatology'],
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800',
    readTime: 6,
    views: 2156
  },
  {
    title: 'Heart Health: The Role of Omega-3 and Cardiovascular Supplements',
    slug: 'heart-health-omega3-cardiovascular',
    excerpt: 'Explore the science-backed benefits of Omega-3 fatty acids and other supplements for maintaining a healthy heart.',
    content: `<p>Cardiovascular disease remains the leading cause of mortality worldwide. Alongside lifestyle changes, certain supplements have demonstrated significant cardioprotective benefits.</p>
    <h2>Omega-3 Fatty Acids</h2>
    <p>EPA and DHA from fish oil reduce triglycerides, lower blood pressure, and decrease inflammation. The American Heart Association recommends 1g of EPA+DHA daily for those with heart disease.</p>
    <h2>Coenzyme Q10 (CoQ10)</h2>
    <p>Essential for cellular energy production, CoQ10 levels decline with age and statin use. Supplementation supports heart muscle function and may improve outcomes in heart failure.</p>`,
    author: 'Dr. Tariq Hussain, Cardiologist',
    category: 'Medical Advice',
    tags: ['heart health', 'omega-3', 'cardiovascular', 'supplements'],
    image: 'https://images.unsplash.com/photo-1559839914-17aae19cec71?w=800',
    readTime: 7,
    views: 743
  },
  {
    title: 'Managing Gastric Issues: Lifestyle Changes and Medical Solutions',
    slug: 'managing-gastric-issues-solutions',
    excerpt: 'Comprehensive guide to understanding and managing common gastric problems including acidity, GERD, and digestive disorders.',
    content: `<p>Gastric disorders affect millions of people and can significantly impact quality of life. Understanding the causes and available treatments helps manage these conditions effectively.</p>
    <h2>Common Gastric Conditions</h2>
    <p>Gastroesophageal Reflux Disease (GERD), peptic ulcers, gastritis, and irritable bowel syndrome are among the most common digestive disorders affecting Pakistanis.</p>
    <h2>Dietary Modifications</h2>
    <p>Avoid trigger foods like spicy foods, citrus, and caffeine. Eat smaller, more frequent meals. Don't lie down immediately after eating.</p>`,
    author: 'Dr. Fatima Raza, Gastroenterologist',
    category: 'Health Tips',
    tags: ['gastric', 'acidity', 'digestive health', 'GERD'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    readTime: 5,
    views: 1089
  },
  {
    title: 'Pain Management: From OTC Medications to Professional Care',
    slug: 'pain-management-medications-care',
    excerpt: 'A practical guide to understanding different types of pain and the most effective treatments from topical solutions to professional medical care.',
    content: `<p>Pain is one of the most common reasons people seek medical attention. Whether acute or chronic, understanding your pain and the available treatments helps achieve better outcomes.</p>
    <h2>Types of Pain</h2>
    <p>Nociceptive pain from tissue damage, neuropathic pain from nerve damage, and inflammatory pain each respond differently to treatments. Proper diagnosis is key to effective management.</p>
    <h2>Topical Treatments</h2>
    <p>Topical NSAIDs like diclofenac gel provide localized pain relief with fewer systemic side effects than oral medications. Ideal for joint and muscle pain.</p>`,
    author: 'Dr. Imran Shah, Pain Specialist',
    category: 'Medical Advice',
    tags: ['pain relief', 'medication', 'chronic pain', 'NSAIDs'],
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
    readTime: 6,
    views: 876
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await Blog.deleteMany({});
    console.log('Cleared existing data');

    // Insert products
    await Product.insertMany(products);
    console.log(`Inserted ${products.length} products`);

    // Insert blogs
    await Blog.insertMany(blogs);
    console.log(`Inserted ${blogs.length} blog posts`);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seedDatabase();

