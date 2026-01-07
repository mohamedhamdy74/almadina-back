require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/database');

const accessories = [
    {
        name: "استيكر حروف كيبورد",
        brand: "Generic",
        description: "استيكر حروف عربية وانجليزية للكيبورد عالية الجودة",
        price: 25,
        category: "Accessories",
        subCategory: "Misc",
        thumbnail: "https://images.unsplash.com/photo-1587829741301-dc798b83aca2?q=80&w=1000&auto=format&fit=crop"
    },
    {
        name: "شنطة لابتوب مرسوم",
        brand: "Generic",
        description: "شنطة لابتوب مرسومة أشكال عصرية مقاسات مختلفة",
        price: 120,
        category: "Accessories",
        subCategory: "Bags",
        thumbnail: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop"
    },
    {
        name: "شنطة ظهر سيفتي",
        brand: "Safety",
        description: "شنطة ظهر سيفتي ضد السرقة مع منفذ USB للشحن",
        price: 300,
        category: "Accessories",
        subCategory: "Bags",
        thumbnail: "https://m.media-amazon.com/images/I/61NfT+7I4LL._AC_SY879_.jpg"
    },
    {
        name: "شنطة ظهر لابتوب",
        brand: "Generic",
        description: "شنطة ظهر مريحة للابتوب والملحقات",
        price: 250,
        category: "Accessories",
        subCategory: "Bags",
        thumbnail: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?q=80&w=1000&auto=format&fit=crop"
    },
    {
        name: "شنطة كتف لابتوب",
        brand: "Generic",
        description: "شنطة كتف لابتوب كلاسيكية",
        price: 250,
        category: "Accessories",
        subCategory: "Bags",
        thumbnail: "https://m.media-amazon.com/images/I/71uK-Vv5F+L._AC_SL1500_.jpg"
    },
    {
        name: "شنطة كتف ثقيل لابتوب",
        brand: "Generic",
        description: "شنطة كتف ثقيلة حماية عالية للابتوب",
        price: 300,
        category: "Accessories",
        subCategory: "Bags",
        thumbnail: "https://m.media-amazon.com/images/I/81I-uH1p+7L._AC_SL1500_.jpg"
    },
    {
        name: "ماوس ZR 1720/1730",
        brand: "ZR",
        model: "1720/1730",
        description: "ماوس سلكي ZR موديل 1720/1730 دقة عالية",
        price: 100,
        category: "Accessories",
        subCategory: "Mice",
        thumbnail: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1000&auto=format&fit=crop"
    },
    {
        name: "ماوس crash",
        brand: "Crash",
        description: "ماوس سلكي Crash مريح لليد",
        price: 70,
        category: "Accessories",
        subCategory: "Mice",
        thumbnail: "https://m.media-amazon.com/images/I/61lS+x62EHL._AC_SL1500_.jpg"
    },
    {
        name: "ماوس hp w 3100",
        brand: "HP",
        model: "W3100",
        description: "ماوس لاسلكي HP W3100 تصميم أنيق",
        price: 100,
        category: "Accessories",
        subCategory: "Mice",
        thumbnail: "https://m.media-amazon.com/images/I/51v1zV5Q8lL._AC_SL1000_.jpg"
    },
    {
        name: "ماوس hp w10",
        brand: "HP",
        model: "W10",
        description: "ماوس لاسلكي HP W10 عملي جداً",
        price: 130,
        category: "Accessories",
        subCategory: "Mice",
        thumbnail: "https://m.media-amazon.com/images/I/61u92NIdG5L._AC_SL1500_.jpg"
    },
    {
        name: "ماوس crash gaming",
        brand: "Crash",
        description: "ماوس جيمنج Crash Gaming مع إضاءة RGB",
        price: 350,
        category: "Accessories",
        subCategory: "Mice",
        thumbnail: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1000&auto=format&fit=crop"
    },
    {
        name: "باده ماوس سادة",
        brand: "Generic",
        description: "باده ماوس سادة مريحة للاستخدام اليومي",
        price: 30,
        category: "Accessories",
        subCategory: "Mice",
        thumbnail: "https://m.media-amazon.com/images/I/61+9E-p+dUL._AC_SL1500_.jpg"
    },
    {
        name: "باده ماوس مرسوم",
        brand: "Generic",
        description: "باده ماوس مرسومة أشكال مختلفة",
        price: 30,
        category: "Accessories",
        subCategory: "Mice",
        thumbnail: "https://m.media-amazon.com/images/I/71N-E6GvGRL._AC_SL1500_.jpg"
    },
    {
        name: "باده ماوس جيمنج صغير RGB",
        brand: "Generic",
        description: "باده ماوس جيمنج صغيرة بإضاءة RGB متغيرة",
        price: 300,
        category: "Accessories",
        subCategory: "Mice",
        thumbnail: "https://m.media-amazon.com/images/I/71m4-P6I7DL._AC_SL1500_.jpg"
    },
    {
        name: "باده ماوس جيمنج كبير RGB",
        brand: "Generic",
        description: "باده ماوس جيمنج كبيرة بإضاءة RGB تغطي المكتب",
        price: 350,
        category: "Accessories",
        subCategory: "Mice",
        thumbnail: "https://m.media-amazon.com/images/I/81D7mG+mC-L._AC_SL1500_.jpg"
    },
    {
        name: "كيبورد جلد",
        brand: "Generic",
        description: "كيبورد جلد مرن قابل للطي ومقاوم للماء",
        price: 250,
        category: "Accessories",
        subCategory: "Keyboards",
        thumbnail: "https://m.media-amazon.com/images/I/71zN0-YvY+L._AC_SL1500_.jpg"
    },
    {
        name: "كيبورد آلة حاسبة",
        brand: "Generic",
        description: "كيبورد رقمي خارجي (Numpad) للابتوب",
        price: 150,
        category: "Accessories",
        subCategory: "Keyboards",
        thumbnail: "https://m.media-amazon.com/images/I/71N-X0pE+xL._AC_SL1500_.jpg"
    },
    {
        name: "كيبورد gaming",
        brand: "Generic",
        description: "كيبورد جيمنج للألعاب مع إضاءة خلفية",
        price: 250,
        category: "Accessories",
        subCategory: "Keyboards",
        thumbnail: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=1000&auto=format&fit=crop"
    },
    {
        name: "كيبورد عادي سلكي",
        brand: "Generic",
        description: "كيبورد عادي سلكي USB للاستخدام المكتبي",
        price: 150,
        category: "Accessories",
        subCategory: "Keyboards",
        thumbnail: "https://m.media-amazon.com/images/I/71m4A+K1qJL._AC_SL1500_.jpg"
    },
    {
        name: "كيبورد مالتي ميديا",
        brand: "Generic",
        description: "كيبورد مالتي ميديا سلكي مع أزرار اختصار",
        price: 180,
        category: "Accessories",
        subCategory: "Keyboards",
        thumbnail: "https://m.media-amazon.com/images/I/61vYV-G-qEL._AC_SL1500_.jpg"
    },
    {
        name: "هيدفون p9 بلوتوث",
        brand: "P9",
        model: "P9",
        description: "سماعة بلوتوث P9 تصميم أنيق وصوت نقي",
        price: 200,
        category: "Accessories",
        subCategory: "Audio",
        thumbnail: "https://m.media-amazon.com/images/I/51N-9C-7FLL._AC_SL1000_.jpg"
    },
    {
        name: "هيد فون بابجي جيمنج",
        brand: "PUBG",
        description: "سماعة جيمنج بابجي مع ميكروفون احترافي",
        price: 200,
        category: "Accessories",
        subCategory: "Audio",
        thumbnail: "https://m.media-amazon.com/images/I/61N+pX+cKSL._AC_SL1000_.jpg"
    },
    {
        name: "هيدفون ملون عصرية",
        brand: "Generic",
        description: "سماعة هيدفون ملونة للشباب",
        price: 200,
        category: "Accessories",
        subCategory: "Audio",
        thumbnail: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop"
    },
    {
        name: "فلاشة 64 جيجا",
        brand: "Generic",
        description: "فلاشة مساحة 64 جيجا نقل سريع للبيانات",
        price: 230,
        category: "Accessories",
        subCategory: "Storage",
        thumbnail: "https://images.unsplash.com/photo-1533282250202-09252bc5a695?q=80&w=1000&auto=format&fit=crop"
    },
    {
        name: "راك هارد USB 3.0",
        brand: "Generic",
        description: "راك هارد خارجي USB 3.0 سرعة عالية",
        price: 280,
        category: "Accessories",
        subCategory: "Storage",
        thumbnail: "https://m.media-amazon.com/images/I/71N-E6GvGRL._AC_SL1500_.jpg"
    },
    {
        name: "دراعات كمبيوتر هزاز",
        brand: "Generic",
        description: "جوز دراعات هزاز للكمبيوتر والبلايستيشن",
        price: 250,
        category: "Accessories",
        subCategory: "Gaming",
        thumbnail: "https://m.media-amazon.com/images/I/61+9E-p+dUL._AC_SL1500_.jpg"
    },
    {
        name: "كابل 1.5 HD",
        brand: "Generic",
        description: "كابل HDMI طول 1.5 متر جودة 4K",
        price: 40,
        category: "Accessories",
        subCategory: "Cables",
        thumbnail: "https://m.media-amazon.com/images/I/71v1zV5Q8lL._AC_SL1500_.jpg"
    },
    {
        name: "تحويلة HDMI to VGA",
        brand: "Generic",
        description: "تحويلة HDMI إلى VGA مع مخرج صوت",
        price: 100,
        category: "Accessories",
        subCategory: "Adapters",
        thumbnail: "https://m.media-amazon.com/images/I/61vYV-G-qEL._AC_SL1500_.jpg"
    },
    {
        name: "حامل لاب معدن",
        brand: "Generic",
        description: "حامل لابتوب معدني قابل للطي لتبريد أفضل",
        price: 150,
        category: "Accessories",
        subCategory: "Stands",
        thumbnail: "https://m.media-amazon.com/images/I/71uK-Vv5F+L._AC_SL1500_.jpg"
    },
    {
        name: "حامل شاشة متحرك",
        brand: "Generic",
        description: "حامل شاشة حائطي متحرك لجميع الزوايا",
        price: 270,
        category: "Accessories",
        subCategory: "Stands",
        thumbnail: "https://m.media-amazon.com/images/I/81I-uH1p+7L._AC_SL1500_.jpg"
    },
    {
        name: "طقم كيبورد وماوس لاسلكي S7300",
        brand: "Generic",
        model: "S7300",
        description: "طقم كيبورد وماوس لاسلكي S7300 مريح وعملي",
        price: 450,
        category: "Accessories",
        subCategory: "Keyboards",
        thumbnail: "https://m.media-amazon.com/images/I/71zN0-YvY+L._AC_SL1500_.jpg"
    }
];

// Add more items from the list to cover most important ones
const remainingAccessories = [
    { name: "فلاشة 32 جيجا", price: 200, category: "Accessories", subCategory: "Storage", brand: "Generic", description: "فلاشة 32 جيجا مساحة تخزين مناسبة", thumbnail: "https://m.media-amazon.com/images/I/61lS+x62EHL._AC_SL1500_.jpg" },
    { name: "راك 3 usb", price: 200, category: "Accessories", subCategory: "Storage", brand: "Generic", description: "راك هارد USB 3", thumbnail: "https://m.media-amazon.com/images/I/71m4-P6I7DL._AC_SL1500_.jpg" },
    { name: "otg type c mbl", price: 35, category: "Accessories", subCategory: "Adapters", brand: "Generic", description: "وصلة OTG تايب سي للموبايل", thumbnail: "https://m.media-amazon.com/images/I/51N-9C-7FLL._AC_SL1000_.jpg" },
    { name: "كابل 3 hd", price: 80, category: "Accessories", subCategory: "Cables", brand: "Generic", description: "كابل HDMI طول 3 متر", thumbnail: "https://m.media-amazon.com/images/I/71v1zV5Q8lL._AC_SL1500_.jpg" },
    { name: "كابل 5 hd", price: 100, category: "Accessories", subCategory: "Cables", brand: "Generic", description: "كابل HDMI طول 5 متر", thumbnail: "https://m.media-amazon.com/images/I/71v1zV5Q8lL._AC_SL1500_.jpg" },
    { name: "كابل شاشة VGA", price: 40, category: "Accessories", subCategory: "Cables", brand: "Generic", description: "كابل شاشة VGA أصلي", thumbnail: "https://m.media-amazon.com/images/I/61vYV-G-qEL._AC_SL1500_.jpg" },
    { name: "وصله ساتا 3 usb", price: 150, category: "Accessories", subCategory: "Adapters", brand: "Generic", description: "وصلة تحويل ساتا إلى USB", thumbnail: "https://m.media-amazon.com/images/I/71N-E6GvGRL._AC_SL1500_.jpg" },
    { name: "hd to dvi تحويلة", price: 100, category: "Accessories", subCategory: "Adapters", brand: "Generic", description: "تحويلة HDMI to DVI", thumbnail: "https://m.media-amazon.com/images/I/51v1zV5Q8lL._AC_SL1000_.jpg" },
    { name: "حامل شاشة ثابت كبير", price: 150, category: "Accessories", subCategory: "Stands", brand: "Generic", description: "حامل شاشة حائطي ثابت مقاس كبير", thumbnail: "https://m.media-amazon.com/images/I/81I-uH1p+7L._AC_SL1500_.jpg" },
    { name: "مشترك كهرباء 1.5 م", price: 80, category: "Accessories", subCategory: "Misc", brand: "Generic", description: "مشترك كهرباء 1.5 متر جودة عالية", thumbnail: "https://m.media-amazon.com/images/I/61u92NIdG5L._AC_SL1500_.jpg" },
    { name: "شاحن لابتوب متعدد الرؤوس", price: 200, category: "Accessories", subCategory: "Misc", brand: "Generic", description: "شاحن لابتوب متعدد يناسب جميع الأنواع", thumbnail: "https://m.media-amazon.com/images/I/71uK-Vv5F+L._AC_SL1500_.jpg" },
    { name: "smile سماعة بلوتوث", price: 250, category: "Accessories", subCategory: "Audio", brand: "Smile", description: "سماعة بلوتوث Smile صوت نقي", thumbnail: "https://m.media-amazon.com/images/I/51N-9C-7FLL._AC_SL1000_.jpg" },
    { name: "واي فاي بلوتوث للكمبيوتر", price: 60, category: "Accessories", subCategory: "Networking", brand: "Generic", description: "فلاشة واي فاي وبلوتوث للكمبيوتر", thumbnail: "https://m.media-amazon.com/images/I/61N+pX+cKSL._AC_SL1000_.jpg" },
    { name: "p47 سماعة بلوتوث", price: 200, category: "Accessories", subCategory: "Audio", brand: "P47", description: "سماعة بلوتوث P47 ألوان متعددة", thumbnail: "https://m.media-amazon.com/images/I/51N-9C-7FLL._AC_SL1000_.jpg" },
    { name: "keyboard gaming fx230 مضيئ", price: 300, category: "Accessories", subCategory: "Keyboards", brand: "Generic", model: "FX230", description: "كيبورد جيمنج موديل FX230 مضيئ", thumbnail: "https://m.media-amazon.com/images/I/71zN0-YvY+L._AC_SL1500_.jpg" }
];

const allProducts = [...accessories, ...remainingAccessories];

async function seedProducts() {
    try {
        await connectDB();
        console.log('Connected to MongoDB');

        // Optional: Clear existing accessories to avoid duplicates
        // await Product.deleteMany({ category: 'Accessories' });
        // console.log('Deleted existing accessories');

        console.log(`Starting to add ${allProducts.length} accessories...`);

        let count = 0;
        for (const productData of allProducts) {
            try {
                // We use save() or create() one by one to avoid memory issues with embeddings
                const product = new Product(productData);
                await product.save();
                count++;
                console.log(`[${count}/${allProducts.length}] Added: ${productData.name}`);
            } catch (err) {
                console.error(`Failed to add ${productData.name}:`, err.message);
            }
        }

        console.log(`Successfully added ${count} accessories to the database!`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding accessories:', error);
        process.exit(1);
    }
}

seedProducts();
