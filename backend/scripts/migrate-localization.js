require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../src/models/Product');
const Category = require('../src/models/Category');

const getLocalizedObject = (value, fallbackValue = '') => {
  if (!value) return { ar: fallbackValue, en: fallbackValue };
  if (typeof value === 'string') {
    const text = value.trim();
    return { ar: text, en: text };
  }
  if (typeof value === 'object') {
    const next = {};
    if (typeof value.ar === 'string') next.ar = value.ar;
    if (typeof value.en === 'string') next.en = value.en;
    if (!next.ar && fallbackValue) next.ar = fallbackValue;
    if (!next.en && fallbackValue) next.en = fallbackValue;
    return next;
  }
  return { ar: String(value), en: String(value) };
};

const categoryTranslations = {
  'قمصان': { ar: 'قمصان', en: 'Shirts' },
  'معاطف وملابس خارجية': { ar: 'معاطف وملابس خارجية', en: 'Coats & Outerwear' },
  'تريكو': { ar: 'تريكو', en: 'Knitwear' },
  'بناطيل': { ar: 'بناطيل', en: 'Trousers' },
  'إكسسوارات': { ar: 'إكسسوارات', en: 'Accessories' },
};

const categoryDescriptions = {
  shirts: {
    ar: 'قمصان قطن وكتان بقصّات هادئة، للعمل والمناسبات اليومية',
    en: 'Cotton and linen shirts in quiet silhouettes, designed for everyday work and refined casual wear.'
  },
  'coats-outerwear': {
    ar: 'معاطف صوف وجاكيتات خفيفة، مصنوعة لتدوم مواسم طويلة',
    en: 'Wool coats and lightweight jackets built to last across seasons with ease and structure.'
  },
  knitwear: {
    ar: 'كنزات وسويترات ناعمة، دفء بلمسة أناقة هادئة',
    en: 'Soft knitwear with texture, warmth, and a quiet sense of elegance.'
  },
  trousers: {
    ar: 'بناطيل قماش وجينز بقصّات كلاسيكية مريحة',
    en: 'Tailored trousers and denim staples cut for comfort and everyday versatility.'
  },
  accessories: {
    ar: 'أحزمة، قبعات، ونظارات تكمل الإطلالة الكلاسيكية',
    en: 'Belts, hats, and finishing pieces that complete a clean, classic silhouette.'
  }
};

const productTranslations = {
  'قميص كتان أبيض كلاسيك': { ar: 'قميص كتان أبيض كلاسيك', en: 'Classic White Linen Shirt' },
  'قميص أكسفورد كحلي': { ar: 'قميص أكسفورد كحلي', en: 'Oxford Shirt in Navy' },
  'قميص سليم فت رمادي': { ar: 'قميص سليم فت رمادي', en: 'Gray Slim Fit Shirt' },
  'معطف صوف طويل': { ar: 'معطف صوف طويل', en: 'Long Wool Coat' },
  'جاكيت تويد كلاسيك': { ar: 'جاكيت تويد كلاسيك', en: 'Classic Tweed Jacket' },
  'تريتش كوت بيج': { ar: 'تريتش كوت بيج', en: 'Beige Trench Coat' },
  'كنزة كشمير ناعمة': { ar: 'كنزة كشمير ناعمة', en: 'Soft Cashmere Sweater' },
  'سويتر صوف رقبة عالية': { ar: 'سويتر صوف رقبة عالية', en: 'High-Neck Wool Sweater' },
  'كارديجان تريكو كلاسيك': { ar: 'كارديجان تريكو كلاسيك', en: 'Classic Knit Cardigan' },
  'بنطلون قماش مستقيم': { ar: 'بنطلون قماش مستقيم', en: 'Straight-Cut Cotton Trousers' },
  'جينز دنيم كلاسيك': { ar: 'جينز دنيم كلاسيك', en: 'Classic Denim Jeans' },
  'حزام جلد طبيعي': { ar: 'حزام جلد طبيعي', en: 'Natural Leather Belt' },
  'قبعة قماشية هادئة': { ar: 'قبعة قماشية هادئة', en: 'Quiet Cotton Cap' },
  'نظارة شمس كلاسيك': { ar: 'نظارة شمس كلاسيك', en: 'Classic Sunglasses' },
};

const productDescriptions = {
  'قميص كتان أبيض كلاسيك': { ar: 'قميص كتان طبيعي بقصة مستقيمة، خفيف ومسامي، أساسي لا غنى عنه في أي خزانة كلاسيكية.', en: 'A crisp white linen shirt in a clean straight cut, designed for breathable ease and timeless versatility.' },
  'قميص أكسفورد كحلي': { ar: 'قميص أكسفورد متين بنسيج كثيف، مناسب للمكتب والمناسبات الرسمية الخفيفة.', en: 'A structured poplin oxford shirt with dependable texture, suited to office days and polished everyday dressing.' },
  'قميص سليم فت رمادي': { ar: 'قميص بقصة سليم أنيقة، مناسب للعمل والمناسبات المسائية.', en: 'A tailored slim-fit shirt with a clean finish, ideal for workdays, evenings, and polished layering.' },
  'معطف صوف طويل': { ar: 'معطف صوف مزدوج الوجه، قصة كلاسيكية تدوم لعقود لا لمواسم.', en: 'A double-faced wool coat with a classic line, built to move effortlessly from season to season.' },
  'جاكيت تويد كلاسيك': { ar: 'جاكيت تويد بنسيج تراثي، دفء وأناقة لخريف طويل.', en: 'A heritage tweed jacket with warmth and quiet character, perfectly suited to long autumn days.' },
  'تريتش كوت بيج': { ar: 'تريتش كوت بحزام خصر، قطعة انتقالية تناسب كل الفصول تقريبًا.', en: 'A belted trench coat in soft beige, designed as an easy transitional layer for changing weather.' },
  'كنزة كشمير ناعمة': { ar: 'كنزة كشمير خفيفة الوزن، دفء استثنائي بلمسة فاخرة.', en: 'A lightweight cashmere knit offering exceptional warmth with a refined, understated finish.' },
  'سويتر صوف رقبة عالية': { ar: 'سويتر صوف بياقة عالية، أساسي شتوي هادئ يناسب كل شيء.', en: 'A high-neck wool sweater that delivers quiet warmth and easy layering for cool-weather wardrobes.' },
  'كارديجان تريكو كلاسيك': { ar: 'كارديجان بأزرار خشبية وقصة مريحة، يُلبس فوق القميص بسهولة.', en: 'A relaxed knit cardigan with wood-tone buttons, ideal for layering over shirts and lightweight staples.' },
  'بنطلون قماش مستقيم': { ar: 'بنطلون قماش بقصة مستقيمة كلاسيكية، يناسب القمصان والكنزات على حد سواء.', en: 'A classic straight-cut trouser in cotton, balancing ease, structure, and effortless everyday wear.' },
  'جينز دنيم كلاسيك': { ar: 'جينز بقصة مستقيمة وخامة دنيم متينة تتحمّل اللبس اليومي.', en: 'A durable straight-leg denim jean built for daily wear with classic shape and lasting structure.' },
  'حزام جلد طبيعي': { ar: 'حزام جلد بمشبك معدني هادئ، يكمل القميص والبنطلون.', en: 'A polished leather belt with a minimal metallic buckle designed to finish a clean everyday outfit.' },
  'قبعة قماشية هادئة': { ar: 'قبعة قطنية خفيفة مع قماش مريح، مناسبة لتكملة الستايل اليومي.', en: 'A soft cotton cap with a simple silhouette, tailored to complete refined everyday styling.' },
  'نظارة شمس كلاسيك': { ar: 'نظارة شمس بإطار كلاسيكي وعدسات حماية، تكمل الإطلالة الهادئة.', en: 'A classic-framed sunglass with protective lenses designed to finish a quiet, polished look.' },
};

const migrate = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const categories = await Category.find({});
  for (const category of categories) {
    const sourceName = typeof category.name === 'string' ? category.name : (category.name && category.name.ar) || '';
    const sourceDescription = typeof category.description === 'string' ? category.description : (category.description && category.description.ar) || '';
    const nextName = categoryTranslations[sourceName] || { ar: sourceName, en: sourceName };
    const nextDescription = categoryDescriptions[category.slug] || { ar: sourceDescription, en: sourceDescription };

    if (!category.name || typeof category.name === 'string' || !category.name.en || category.name.en === category.name.ar) {
      await Category.updateOne({ _id: category._id }, { name: nextName, description: nextDescription });
    }
  }

  const products = await Product.find({});
  for (const product of products) {
    const sourceName = typeof product.name === 'string' ? product.name : (product.name && product.name.ar) || '';
    const sourceDescription = typeof product.description === 'string' ? product.description : (product.description && product.description.ar) || '';
    const nextName = productTranslations[sourceName] || { ar: sourceName, en: sourceName };
    const nextDescription = productDescriptions[sourceName] || { ar: sourceDescription, en: sourceDescription };

    if (!product.name || typeof product.name === 'string' || !product.name.en || product.name.en === product.name.ar) {
      await Product.updateOne({ _id: product._id }, { name: nextName, description: nextDescription });
    }
  }

  console.log('Localization migration completed');
  await mongoose.disconnect();
};

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
