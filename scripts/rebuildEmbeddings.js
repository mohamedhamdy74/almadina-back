require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/database');

async function rebuildEmbeddings() {
    try {
        console.log('🚀 Starting embedding rebuild process...');

        // Connect to MongoDB
        await connectDB();
        console.log('✅ Connected to MongoDB');

        // Fetch all products
        const products = await Product.find({});
        console.log(`📦 Found ${products.length} products to process`);

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            try {
                console.log(`[${i + 1}/${products.length}] Processing: ${product.name}...`);

                // Force regeneration by clearing the existing vector
                // This triggers the (!this.embedding_vector) condition in the pre-save hook
                product.embedding_vector = undefined;
                await product.save();

                successCount++;
                console.log(`   ✅ Success`);
            } catch (error) {
                failCount++;
                console.error(`   ❌ Failed: ${product.name}`, error.message);
            }
        }

        console.log('\n--- Process Completed ---');
        console.log(`✅ Successfully updated: ${successCount}`);
        console.log(`❌ Failed: ${failCount}`);

        process.exit(0);
    } catch (error) {
        console.error('💥 Critical Error:', error);
        process.exit(1);
    }
}

rebuildEmbeddings();
