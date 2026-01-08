require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function checkProduct() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const product = await Product.findOne({ name: /7530/i });
        if (product) {
            console.log('Product Found:', product.name);
            console.log('Category:', product.category);
            console.log('Specifications:', JSON.stringify(product.specifications, null, 2));
            console.log('Description:', product.description);
            console.log('Has Embedding:', !!product.embedding_vector);
        } else {
            console.log('Product 7530 not found in database.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkProduct();
