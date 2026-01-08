require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function refreshEmbeddings() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const products = await Product.find({});
        console.log(`Refreshing embeddings for ${products.length} products...`);

        for (const product of products) {
            // Force modification flag for specifications to trigger pre-save hook
            product.markModified('specifications');
            // Also mark description as modified just in case
            product.markModified('description');

            await product.save();
            console.log(`✅ Refreshed: ${product.name}`);
        }

        console.log('All embeddings refreshed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

refreshEmbeddings();
