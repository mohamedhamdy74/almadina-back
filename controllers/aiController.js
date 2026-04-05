const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/Product');

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// AI-based Product Recommendation (RAG)
const getRecommendation = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'الرجاء إدخال رسالة' });
        }

        // Step 1: Generate embedding
        console.log('🤖 Starting Embedding step...');
        const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
        const embeddingResult = await embeddingModel.embedContent(message);
        const queryEmbedding = embeddingResult.embedding.values;

        // Step 2: Vector Search
        let categoryFilter = 'Laptops'; 
        const lowerMessage = message.toLowerCase();
        if (/اكسسوار|شنطة|ماوس|كيبورد|سماعة|شاحن|وصلة/i.test(lowerMessage)) {
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

        // Step 3: Formatting
        const productsContext = similarProducts.map((p, i) => `Product ${i+1}: ID: ${p._id}, Name: ${p.name}, Price: ${p.price}`).join('\n');

        const systemPrompt = `أنت خبير مبيعات في متجر المدينة للإلكترونيات بالعامية المصرية. استخدم هذه البيانات فقط:\n${productsContext}\n\nاختر أفضل منتجين واكتب رداً للعميل. في النهاية اكتب الـ IDs بهذا التنسيق: [IDs: id1, id2]`;

        // Step 4: Chat Generation
        const chatModel = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash-lite', 
            systemInstruction: systemPrompt
        });

        const chatResult = await chatModel.generateContent(message);
        let aiResponse = chatResult.response.text();

        // Step 5: Extract IDs and Get Full Product Objects
        const idMatch = aiResponse.match(/\[IDs:\s*([^\]]+)\]/);
        let recommendedProducts = [];
        if (idMatch) {
            const recommendedIds = idMatch[1].split(',').map(id => id.trim());
            // Fetch full products from DB for the Frontend
            recommendedProducts = await Product.find({ _id: { $in: recommendedIds } });
            aiResponse = aiResponse.replace(/\[IDs:\s*[^\]]+\]/, '').trim();
        }

        res.json({
            reply: aiResponse,
            recommendedProducts: recommendedProducts // مهم جداً للـ Frontend
        });

    } catch (error) {
        console.error('❌ AI Error:', error);
        res.status(500).json({ message: 'فشل مساعد الـ AI في الرد، يرجى المحاولة لاحقاً', error: error.message });
    }
};

const getTroubleshooting = async (req, res) => {
    try {
        const { message } = req.body;
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash-lite",
            systemInstruction: "أنت خبير صيانة لابتوبات بالعامية المصرية."
        });
        const result = await model.generateContent(message);
        res.json({ reply: result.response.text() });
    } catch (err) {
        res.status(500).json({ message: 'Error' });
    }
};

module.exports = { getRecommendation, getTroubleshooting };
