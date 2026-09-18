require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Category = require('../src/models/Category');
const Product = require('../src/models/Product');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const clothingSizes = ['XS', 'S', 'M', 'L', 'XL'];
const accessorySizes = ['One size'];

const colors = {
  ink: { name: 'حبر', hex: '#2a2823' },
  cream: { name: 'كريمي', hex: '#f6f3ec' },
  clay: { name: 'طيني', hex: '#8b7355' },
  olive: { name: 'زيتوني', hex: '#5b6650' },
  stone: { name: 'حجري', hex: '#ddd5c0' },
  navy: { name: 'كحلي', hex: '#1e2a3a' },
  white: { name: 'أبيض', hex: '#f8f6f1' },
};

const seedDatabase = async () => {
  try {
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    console.log('Cleared existing data');

    await User.create({
      name: 'مدير فيلورا',
      email: 'admin@velora.com',
      password: 'password123',
      role: 'ADMIN',
    });

    await User.create({
      name: 'سارة علي',
      email: 'sara@example.com',
      password: 'password123',
      role: 'USER',
    });

    console.log('Created users');

    const categories = await Category.insertMany([
      {
        name: { ar: 'قمصان', en: 'Shirts' },
        slug: 'shirts',
        description: { ar: 'قمصان قطن وكتان بقصّات هادئة، للعمل والمناسبات اليومية', en: 'Cotton and linen shirts in quiet silhouettes, designed for everyday work and refined casual wear.' },
      },
      {
        name: { ar: 'معاطف وملابس خارجية', en: 'Outerwear' },
        slug: 'coats-outerwear',
        description: { ar: 'معاطف صوف وجاكيتات خفيفة، مصنوعة لتدوم مواسم طويلة', en: 'Wool coats and lightweight jackets built to last across seasons with ease and structure.' },
      },
      {
        name: { ar: 'تريكو', en: 'Knitwear' },
        slug: 'knitwear',
        description: { ar: 'كنزات وسويترات ناعمة، دفء بلمسة أناقة هادئة', en: 'Soft knitwear with texture, warmth, and a quiet sense of elegance.' },
      },
      {
        name: { ar: 'بناطيل', en: 'Trousers' },
        slug: 'trousers',
        description: { ar: 'بناطيل قماش وجينز بقصّات كلاسيكية مريحة', en: 'Tailored trousers and denim staples cut for comfort and everyday versatility.' },
      },
      {
        name: { ar: 'إكسسوارات', en: 'Accessories' },
        slug: 'accessories',
        description: { ar: 'أحزمة، قبعات، ونظارات تكمل الإطلالة الكلاسيكية', en: 'Belts, hats, and finishing pieces that complete a clean, classic silhouette.' },
      },
    ]);

    console.log('Created categories');

    const [shirts, coats, knitwear, trousers, accessories] = categories;

    const products = [
      {
        name: { ar: 'قميص كتان أبيض كلاسيك', en: 'Classic White Linen Shirt' },
        slug: 'classic-white-linen-shirt',
        description: { ar: 'قميص كتان طبيعي بقصة مستقيمة، خفيف ومسامي، أساسي لا غنى عنه في أي خزانة كلاسيكية.', en: 'A crisp white linen shirt in a clean straight cut, designed for breathable ease and timeless versatility.' },
        price: 1290,
        discountPrice: 990,
        images: [
          '/images/pexels-dayong-tien-681073045-22441291.jpg',
          '/images/pexels-dxaxoxfz-17251247.jpg',
        ],
        category: shirts._id,
        brand: 'VELORA',
        stock: 35,
        featured: true,
        sizes: clothingSizes,
        colors: [colors.white, colors.cream],
      },
      {
        name: { ar: 'قميص أكسفورد كحلي', en: 'Oxford Shirt in Navy' },
        slug: 'oxford-shirt-navy',
        description: { ar: 'قميص أكسفورد متين بنسيج كثيف، مناسب للمكتب والمناسبات الرسمية الخفيفة.', en: 'A structured poplin oxford shirt with dependable texture, suited to office days and polished everyday dressing.' },
        price: 1090,
        discountPrice: null,
        images: [
          '/images/pexels-dayong-tien-681073045-22441317.jpg',
          '/images/pexels-tima-miroshnichenko-6764952.jpg',
        ],
        category: shirts._id,
        brand: 'VELORA',
        stock: 28,
        featured: false,
        sizes: clothingSizes,
        colors: [colors.navy, colors.white],
      },
      {
        name: { ar: 'قميص سليم فت رمادي', en: 'Gray Slim Fit Shirt' },
        slug: 'slim-fit-shirt-grey',
        description: { ar: 'قميص بقصة سليم أنيقة، مناسب للعمل والمناسبات المسائية.', en: 'A tailored slim-fit shirt with a clean finish, ideal for workdays, evenings, and polished layering.' },
        price: 890,
        discountPrice: 690,
        images: [
          '/images/pexels-tima-miroshnichenko-5439171.jpg',
          '/images/pexels-shamaunmalik-36359724.jpg',
        ],
        category: shirts._id,
        brand: 'VELORA',
        stock: 30,
        featured: true,
        sizes: clothingSizes,
        colors: [colors.stone, colors.ink],
      },
      {
        name: { ar: 'معطف صوف طويل', en: 'Long Wool Coat' },
        slug: 'long-wool-coat',
        description: { ar: 'معطف صوف مزدوج الوجه، قصة كلاسيكية تدوم لعقود لا لمواسم.', en: 'A double-faced wool coat with a classic line, built to move effortlessly from season to season.' },
        price: 3200,
        discountPrice: 2600,
        images: [
          '/images/pexels-tima-miroshnichenko-6764923.jpg',
          '/images/man-home.png',
        ],
        category: coats._id,
        brand: 'VELORA',
        stock: 15,
        featured: true,
        sizes: clothingSizes,
        colors: [colors.clay, colors.ink],
      },
      {
        name: { ar: 'جاكيت تويد كلاسيك', en: 'Classic Tweed Jacket' },
        slug: 'classic-tweed-jacket',
        description: { ar: 'جاكيت تويد بنسيج تراثي، دفء وأناقة لخريف طويل.', en: 'A heritage tweed jacket with warmth and quiet character, perfectly suited to long autumn days.' },
        price: 2400,
        discountPrice: null,
        images: [
          '/images/pexels-olly-3755706.jpg',
          '/images/pexels-luisbecerrafotografo-6065984.jpg',
        ],
        category: coats._id,
        brand: 'VELORA',
        stock: 18,
        featured: false,
        sizes: clothingSizes,
        colors: [colors.olive, colors.clay],
      },
      {
        name: { ar: 'تريتش كوت بيج', en: 'Beige Trench Coat' },
        slug: 'beige-trench-coat',
        description: { ar: 'تريتش كوت بحزام خصر، قطعة انتقالية تناسب كل الفصول تقريبًا.', en: 'A belted trench coat in soft beige, designed as an easy transitional layer for changing weather.' },
        price: 2890,
        discountPrice: 2290,
        images: [
          '/images/pexels-mibernaa-31529647.jpg',
          '/images/pexels-rebornfilmes-32427323.jpg',
        ],
        category: coats._id,
        brand: 'VELORA',
        stock: 20,
        featured: true,
        sizes: clothingSizes,
        colors: [colors.stone, colors.cream],
      },
      {
        name: { ar: 'كنزة كشمير ناعمة', en: 'Soft Cashmere Sweater' },
        slug: 'soft-cashmere-sweater',
        description: { ar: 'كنزة كشمير خفيفة الوزن، دفء استثنائي بلمسة فاخرة.', en: 'A lightweight cashmere knit offering exceptional warmth with a refined, understated finish.' },
        price: 1890,
        discountPrice: 1490,
        images: [
          '/images/pexels-cottonbro-6975407.jpg',
          '/images/pexels-rebornfilmes-30005364.jpg',
        ],
        category: knitwear._id,
        brand: 'VELORA',
        stock: 25,
        featured: true,
        sizes: clothingSizes,
        colors: [colors.cream, colors.clay, colors.olive],
      },
      {
        name: { ar: 'سويتر صوف رقبة عالية', en: 'High-Neck Wool Sweater' },
        slug: 'wool-turtleneck-sweater',
        description: { ar: 'سويتر صوف بياقة عالية، أساسي شتوي هادئ يناسب كل شيء.', en: 'A high-neck wool sweater that delivers quiet warmth and easy layering for cool-weather wardrobes.' },
        price: 1190,
        discountPrice: 890,
        images: [
          '/images/women-hero.png',
          '/images/pexels-rebornfilmes-35865086.jpg',
        ],
        category: knitwear._id,
        brand: 'VELORA',
        stock: 32,
        featured: false,
        sizes: clothingSizes,
        colors: [colors.ink, colors.navy, colors.stone],
      },
      {
        name: { ar: 'كارديجان تريكو كلاسيك', en: 'Classic Knit Cardigan' },
        slug: 'classic-knit-cardigan',
        description: { ar: 'كارديجان بأزرار خشبية وقصة مريحة، يُلبس فوق القميص بسهولة.', en: 'A relaxed knit cardigan with wood-tone buttons, ideal for layering over shirts and lightweight staples.' },
        price: 1390,
        discountPrice: null,
        images: [
          '/images/pexels-rebornfilmes-37524688.jpg',
          '/images/pexels-beyzaa-yurtkuran-279977530-15976365.jpg',
        ],
        category: knitwear._id,
        brand: 'VELORA',
        stock: 22,
        featured: false,
        sizes: clothingSizes,
        colors: [colors.clay, colors.olive],
      },
      {
        name: { ar: 'بنطلون قماش مستقيم', en: 'Straight-Cut Cotton Trousers' },
        slug: 'straight-cut-trousers',
        description: { ar: 'بنطلون قماش بقصة مستقيمة كلاسيكية، يناسب القمصان والكنزات على حد سواء.', en: 'A classic straight-cut trouser in cotton, balancing ease, structure, and effortless everyday wear.' },
        price: 1090,
        discountPrice: 850,
        images: [
          '/images/pexels-robert-jeffrey-bonto-2439341-9218066.jpg',
          '/images/pexels-rimiscky-34968265.jpg',
        ],
        category: trousers._id,
        brand: 'VELORA',
        stock: 40,
        featured: true,
        sizes: clothingSizes,
        colors: [colors.ink, colors.stone, colors.navy],
      },
      {
        name: { ar: 'جينز دنيم كلاسيك', en: 'Classic Denim Jeans' },
        slug: 'classic-denim-jeans',
        description: { ar: 'جينز بقصة مستقيمة وخامة دنيم متينة تتحمّل اللبس اليومي.', en: 'A durable straight-leg denim jean built for daily wear with classic shape and lasting structure.' },
        price: 1290,
        discountPrice: 990,
        images: [
          '/images/pexels-rana-jenab-594484578-32479925.jpg',
          '/images/pexels-caio-63196.jpg',
        ],
        category: trousers._id,
        brand: 'VELORA',
        stock: 45,
        featured: false,
        sizes: clothingSizes,
        colors: [colors.navy, colors.ink],
      },
      {
        name: { ar: 'حزام جلد طبيعي', en: 'Natural Leather Belt' },
        slug: 'leather-belt',
        description: { ar: 'حزام جلد بمشبك معدني هادئ، يكمل القميص والبنطلون.', en: 'A polished leather belt with a minimal metallic buckle designed to finish a clean everyday outfit.' },
        price: 690,
        discountPrice: 550,
        images: [
          '/images/pexels-shivam-31367058.jpg',
          '/images/pexels-jay-noble-550487311-17286664.jpg',
        ],
        category: accessories._id,
        brand: 'VELORA',
        stock: 35,
        featured: false,
        sizes: ['85', '90', '95', '100'],
        colors: [colors.ink, colors.clay],
      },
      {
        name: { ar: 'قبعة قماشية هادئة', en: 'Quiet Cotton Cap' },
        description: { ar: 'قبعة قطنية خفيفة مع قماش مريح، مناسبة لتكملة الستايل اليومي.', en: 'A soft cotton cap with a simple silhouette, tailored to complete refined everyday styling.' },
        price: 890,
        discountPrice: 690,
        images: [
          '/images/pexels-badis-benkhelil-1135505371-26653386.jpg',
          '/images/pexels-mnzoutfits-1619655.jpg',
        ],
        category: accessories._id,
        brand: 'VELORA',
        stock: 45,
        featured: true,
        sizes: accessorySizes,
        colors: [colors.ink, colors.clay],
      },
      {
        name: { ar: 'نظارة شمس كلاسيك', en: 'Classic Sunglasses' },
        description: { ar: 'نظارة شمس بإطار كلاسيكي وعدسات حماية، تكمل الإطلالة الهادئة.', en: 'A classic-framed sunglass with protective lenses designed to finish a quiet, polished look.' },
        price: 890,
        discountPrice: 690,
        images: [
          '/images/pexels-badis-benkhelil-1135505371-26653386.jpg',
          '/images/pexels-mnzoutfits-1619655.jpg',
        ],
        category: accessories._id,
        brand: 'VELORA',
        stock: 45,
        featured: true,
        sizes: accessorySizes,
        colors: [colors.ink, colors.clay],
      },
    ];

    await Product.insertMany(products);

    console.log('Database seeded successfully!');
    console.log('\nTest Credentials:');
    console.log('Admin Email: admin@velora.com');
    console.log('Admin Password: password123');
    console.log('\nUser Email: sara@example.com');
    console.log('User Password: password123');

    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

connectDB().then(() => {
  seedDatabase();
});
