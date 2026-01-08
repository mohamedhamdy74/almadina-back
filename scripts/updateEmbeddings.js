require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const Product = require('../models/Product');

async function updateAllEmbeddings() {
    try {
        // 1. Connect to Database
        await connectDB();
        console.log('🚀 Starting to update product embeddings...');

        // 2. Fetch all products
        const products = await Product.find({});
        console.log(`📦 Found ${products.length} products to process.`);

        let count = 0;
        for (const product of products) {
            count++;
            console.log(`[${count}/${products.length}] 🔄 Updating embedding for: ${product.name}`);

            // We explicitly set embedding_vector to null to force the pre-save hook to run
            // since the logic in pre('save') checks for !this.embedding_vector
            product.embedding_vector = undefined;

            await product.save();

            // Small delay to avoid hitting Gemini API rate limits too fast (optional but safer)
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log('✅ All product embeddings have been updated successfully!');
    } catch (error) {
        console.error('❌ Error during update:', error);
    } finally {
        // 3. Close connection
        await mongoose.connection.close();
        process.exit(0);
    }
}

updateAllEmbeddings();
