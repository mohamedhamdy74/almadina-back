require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/database');

const batch2 = [
    { name: "حجر بطارية بورده CR2032", price: 15, category: "Accessories", subCategory: "Misc", brand: "Generic", description: "حجر بطارية بورده CR2032 للأجهزة", thumbnail: "https://m.media-amazon.com/images/I/61vYV-G-qEL._AC_SL1500_.jpg" },
    { name: "راك هارد داخلي للابتوب", price: 150, category: "Accessories", subCategory: "Storage", brand: "Generic", description: "راك هارد داخلي (Caddy) لزيادة مساحة الابتوب", thumbnail: "https://m.media-amazon.com/images/I/71N-E6GvGRL._AC_SL1500_.jpg" },
    { name: "وصلة OTG موبايل", price: 30, category: "Accessories", subCategory: "Adapters", brand: "Generic", description: "وصلة OTG لتوصيل الفلاشة بالموبايل", thumbnail: "https://m.media-amazon.com/images/I/51N-9C-7FLL._AC_SL1000_.jpg" },
    { name: "وصله داتا ساتا 2", price: 125, category: "Accessories", subCategory: "Cables", brand: "Generic", description: "وصلة داتا ساتا 2 داخلية", thumbnail: "https://m.media-amazon.com/images/I/71v1zV5Q8lL._AC_SL1500_.jpg" },
    { name: "كابل بلايستيشن 2", price: 120, category: "Accessories", subCategory: "Cables", brand: "Generic", description: "كابل فيديو بلايستيشن 2", thumbnail: "https://m.media-amazon.com/images/I/61N+pX+cKSL._AC_SL1000_.jpg" },
    { name: "تحويله AV to HDMI", price: 200, category: "Accessories", subCategory: "Adapters", brand: "Generic", description: "تحويلة من AV إلى HDMI", thumbnail: "https://m.media-amazon.com/images/I/61vYV-G-qEL._AC_SL1500_.jpg" },
    { name: "أراجه كابلات شبكة", price: 10, category: "Accessories", subCategory: "Tools", brand: "Generic", description: "أراجه كابلات نت وتليفون احترافية", thumbnail: "https://m.media-amazon.com/images/I/71uK-Vv5F+L._AC_SL1500_.jpg" },
    { name: "لاصق الصاروخ قوي", price: 150, category: "Accessories", subCategory: "Misc", brand: "Generic", description: "لاصق الصاروخ القوي للإصلاحات", thumbnail: "https://m.media-amazon.com/images/I/61u92NIdG5L._AC_SL1500_.jpg" },
    { name: "ريموت متعدد الأجهزة", price: 25, category: "Accessories", subCategory: "Misc", brand: "Generic", description: "ريموت كنترول متعدد يعمل على معظم الأجهزة", thumbnail: "https://m.media-amazon.com/images/I/51v1zV5Q8lL._AC_SL1000_.jpg" },
    { name: "اكسس بوينت (سويتش)", price: 35, category: "Accessories", subCategory: "Networking", brand: "Generic", description: "اكسس بوينت سويتش للشبكات المحلية", thumbnail: "https://m.media-amazon.com/images/I/61N+pX+cKSL._AC_SL1000_.jpg" },
    { name: "كابل باور أصلي للابتوب", price: 600, category: "Accessories", subCategory: "Cables", brand: "Generic", description: "كابل باور لابتوب جودة أصلية", thumbnail: "https://m.media-amazon.com/images/I/71v1zV5Q8lL._AC_SL1500_.jpg" },
    { name: "اسبري اكاي تلميع بني", price: 150, category: "Accessories", subCategory: "Tools", brand: "Akai", description: "اسبري اكاي تلميع البني للأخشاب والجلود", thumbnail: "https://m.media-amazon.com/images/I/61u92NIdG5L._AC_SL1500_.jpg" },
    { name: "اسبري اكاي زيت ازرق", price: 60, category: "Accessories", subCategory: "Tools", brand: "Akai", description: "اسبري اكاي زيت ازرق لتشحيم الأجهزة", thumbnail: "https://m.media-amazon.com/images/I/61u92NIdG5L._AC_SL1500_.jpg" },
    { name: "اسبري اكاي فوم اخضر", price: 60, category: "Accessories", subCategory: "Tools", brand: "Akai", description: "اسبري اكاي فوم اخضر لتنظيف الأجهزة", thumbnail: "https://m.media-amazon.com/images/I/61u92NIdG5L._AC_SL1500_.jpg" },
    { name: "USB Hub 5 Ports", price: 60, category: "Accessories", subCategory: "Adapters", brand: "Generic", description: "موزع USB يحتوي على 5 منافذ", thumbnail: "https://m.media-amazon.com/images/I/71m4-P6I7DL._AC_SL1500_.jpg" },
    { name: "USB Hub 7 Ports", price: 120, category: "Accessories", subCategory: "Adapters", brand: "Generic", description: "موزع USB يحتوي على 7 منافذ", thumbnail: "https://m.media-amazon.com/images/I/71m4-P6I7DL._AC_SL1500_.jpg" },
    { name: "مروحة تبريد لابتوب 2000", price: 150, category: "Accessories", subCategory: "Cooling", brand: "Generic", description: "مروحة تبريد لابتوب عالية الكفاءة", thumbnail: "https://m.media-amazon.com/images/I/71uK-Vv5F+L._AC_SL1500_.jpg" },
    { name: "مروحة تبريد لابتوب 1000", price: 250, category: "Accessories", subCategory: "Cooling", brand: "Generic", description: "مروحة تبريد لابتوب بإضاءة", thumbnail: "https://m.media-amazon.com/images/I/71uK-Vv5F+L._AC_SL1500_.jpg" },
    { name: "أدابتور 12 فولت 2 أمبير", price: 70, category: "Accessories", subCategory: "Misc", brand: "Generic", description: "أدابتور كهرباء 12V 2A", thumbnail: "https://m.media-amazon.com/images/I/51v1zV5Q8lL._AC_SL1000_.jpg" },
    { name: "ريسفر Sniper ميني", price: 400, category: "Accessories", subCategory: "Misc", brand: "Sniper", description: "ريسفر Sniper ميني بجودة HD", thumbnail: "https://m.media-amazon.com/images/I/61N+pX+cKSL._AC_SL1000_.jpg" }
];

async function seedBatch2() {
    try {
        await connectDB();
        console.log('Connected to MongoDB');

        console.log(`Starting to add ${batch2.length} accessories (Batch 2)...`);

        let count = 0;
        for (const productData of batch2) {
            try {
                const product = new Product(productData);
                await product.save();
                count++;
                console.log(`[${count}/${batch2.length}] Added: ${productData.name}`);
            } catch (err) {
                console.error(`Failed to add ${productData.name}:`, err.message);
            }
        }

        console.log(`Successfully added ${count} accessories (Batch 2)!`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding Batch 2:', error);
        process.exit(1);
    }
}

seedBatch2();
