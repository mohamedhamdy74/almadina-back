require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testSearchBySimpleQuery() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const message = "Nvidia 6G";
        const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const embeddingResult = await embeddingModel.embedContent(message);
        const queryEmbedding = embeddingResult.embedding.values;

        const similarProducts = await Product.aggregate([
            {
                $vectorSearch: {
                    index: 'vector_index',
                    path: 'embedding_vector',
                    queryVector: queryEmbedding,
                    numCandidates: 100,
                    limit: 10,
                    filter: { category: 'Laptops' }
                },
            },
            {
                $project: {
                    name: 1, specifications: 1,
                    score: { $meta: 'vectorSearchScore' },
                },
            },
        ]);

        console.log(`Results for query: "${message}"`);
        similarProducts.forEach((p, i) => {
            console.log(`${i + 1}. ${p.name} - GPU: ${p.specifications.graphicsDescription} (Score: ${p.score})`);
        });

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

testSearchBySimpleQuery();
