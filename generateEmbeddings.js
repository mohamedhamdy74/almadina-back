const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

async function generateEmbeddings() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const products = await Product.find({});
        console.log(`📦 Found ${products.length} products`);

        if (products.length === 0) {
            console.log('⚠️  No products found in database');
            process.exit(0);
        }

        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            console.log(`\n[${i + 1}/${products.length}] Processing: ${product.name}`);

            // Trigger the pre-save hook by modifying and saving
            product.markModified('name');
            await product.save();
        }

        console.log('\n✅ All embeddings generated successfully!');
        console.log('🎉 You can now use the AI recommendation system');

    } catch (error) {
        console.error('❌ Error generating embeddings:', error);
        console.error('Full error:', error.stack);
    } finally {
        await mongoose.connection.close();
        console.log('\n👋 Database connection closed');
        process.exit(0);
    }
}

generateEmbeddings();
