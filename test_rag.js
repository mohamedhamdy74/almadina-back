require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testRecommendation() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const message = "dell 7530";

        // Step 1: Generate embedding
        const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const embeddingResult = await embeddingModel.embedContent(message);
        const queryEmbedding = embeddingResult.embedding.values;

        // Step 2: Vector Search
        const similarProducts = await Product.aggregate([
            {
                $vectorSearch: {
                    index: 'vector_index',
                    path: 'embedding_vector',
                    queryVector: queryEmbedding,
                    numCandidates: 100,
                    limit: 5,
                    filter: { category: 'Laptops' }
                },
            },
            {
                $project: {
                    name: 1, brand: 1, description: 1, price: 1,
                    category: 1, specifications: 1,
                    score: { $meta: 'vectorSearchScore' },
                },
            },
        ]);

        console.log(`Found ${similarProducts.length} similar products.`);

        similarProducts.forEach((product, index) => {
            const specs = product.specifications || {};
            console.log(`--- Product ${index + 1} ---`);
            console.log(`Name: ${product.name}`);
            console.log(`GPU: ${specs.graphicsDescription}`);
            console.log(`Score: ${product.score}`);

            const context = `
الاسم: ${product.name}
المواصفات:
- كارت الشاشة: ${specs.graphicsDescription || 'N/A'}
`.trim();
            console.log(`Context sent to Gemini:\n${context}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testRecommendation();
