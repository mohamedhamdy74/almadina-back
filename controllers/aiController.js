const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getRecommendation = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ message: 'الرجاء إدخال رسالة' });

        // Step 1: Embedding
        const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
        const embeddingResult = await embeddingModel.embedContent(message);
        const queryEmbedding = embeddingResult.embedding.values;

        // Step 2: Vector Search
        let categoryFilter = 'Laptops'; 
        if (/اكسسوار|شنطة|ماوس|كيبورد|سماعة|شاحن|وصلة/i.test(message)) {
            categoryFilter = 'Accessories';
        }

        const similarProducts = await Product.aggregate([
            {
                $vectorSearch: {
                    index: 'vector_index',
                    path: 'embedding_vector',
                    queryVector: queryEmbedding,
                    numCandidates: 100,
                    limit: 15,
                    filter: { category: categoryFilter }
                },
            },
            { $limit: 15 },
            {
                $project: {
                    name: 1, brand: 1, description: 1, price: 1,
                    category: 1, specifications: 1, thumbnail: 1,
                    score: { $meta: 'vectorSearchScore' },
                },
            },
        ]);

        const productsContext = similarProducts.map((p, i) => `Product ${i+1}: ID: ${p._id}, Name: ${p.name}, Price: ${p.price}`).join('\n');

        // Step 3: Latest AI Integration (Gemini 1.5 Flash Stable)
        const chatModel = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash-latest', 
            systemInstruction: `أنت خبير مبيعات لابتوبات. استخدم هذه البيانات:\n${productsContext}\n\nاختر أفضل منتجين واكتب الـ IDs في النهاية كـ: [IDs: id1, id2]`
        });

        const chatResult = await chatModel.generateContent(message);
        let aiResponse = chatResult.response.text();

        // Step 4: Robust ID Extraction
        const idMatch = aiResponse.match(/\[IDs:\s*([^\]]+)\]/);
        let recommendedProducts = [];
        
        if (idMatch) {
            const rawIds = idMatch[1].split(',').map(id => id.trim());
            // Only use valid MongoDB IDs to prevent BSONError
            const validIds = rawIds.filter(id => mongoose.Types.ObjectId.isValid(id));
            
            if (validIds.length > 0) {
                recommendedProducts = await Product.find({ _id: { $in: validIds } });
            }
            aiResponse = aiResponse.replace(/\[IDs:\s*[^\]]+\]/, '').trim();
        }

        res.json({ reply: aiResponse, recommendedProducts });

    } catch (error) {
        console.error('❌ AI ERROR:', error.message);
        res.status(500).json({ message: 'فشل مساعد الـ AI في الرد، يرجى المحاولة لاحقاً', error: error.message });
    }
};

const getTroubleshooting = async (req, res) => {
    try {
        const { message } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result = await model.generateContent(message);
        res.json({ reply: result.response.text() });
    } catch (e) {
        res.status(500).json({ message: 'Error' });
    }
};

module.exports = { getRecommendation, getTroubleshooting };
