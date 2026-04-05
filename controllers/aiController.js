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

        // Step 1: Generate embedding for user query
        console.log('🤖 Generating embedding using gemini-embedding-001...');
        const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
        const embeddingResult = await embeddingModel.embedContent(message);
        const queryEmbedding = embeddingResult.embedding.values;
        console.log('✅ Embedding generated successfully');

        // Determine category based on keywords
        let categoryFilter = 'Laptops'; 
        const lowerMessage = message.toLowerCase();
        if (/اكسسوار|شنطة|ماوس|كيبورد|سماعة|شاحن|وصلة|accessory|mouse|keyboard|headset|charger/i.test(lowerMessage)) {
            categoryFilter = 'Accessories';
        }

        // Step 2: Vector Search in MongoDB
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
        console.log(`✅ Vector search found ${similarProducts.length} products`);

        // Step 3: Prompt Formatting
        const productsContext = similarProducts.map((product, index) => {
            const specs = product.specifications || {};
            return `المنتج ${index + 1}:
[الرقم التعريفي]: ${product._id}
[الاسم]: ${product.name}
[الماركة]: ${product.brand}
[السعر]: ${product.price} LE
[المواصفات التقنية]:
- المعالج: ${specs.cpu || specs.cpuModel || 'N/A'}
- الرامات: ${specs.ramMemory || 'N/A'}
- الهارد: ${specs.hardDiskSize || 'N/A'}
- كارت الشاشة: ${specs.graphicsDescription || 'N/A'}
- الشاشة: ${specs.screenSize || 'N/A'}
[الوصف]: ${product.description}`.trim();
        }).join('\n\n---\n\n');

        const systemPrompt = `أنت خبير مبيعات في متجر المدينة للإلكترونيات. ساعد العميل بالعامية المصرية في اختيار المنتجات المناسبة من القائمة التالية فقط:\n${productsContext}\n\nقواعد:\n1. اختر أفضل منتجين فقط يناسبان طلب العميل.\n2. إذا لم تجد منتجات تناسب طلب العميل تماماً، وضح ذلك واقترح أقرب البدائل من القائمة.\n3. لا تذكر [الرقم التعريفي] نهائياً في كلامك مع العميل.\n4. في نهاية الرد تماماً، استخرج [الرقم التعريفي] للمنتجات التي اخترتها واكتبها بهذا التنسيق: [IDs: id1, id2]`;

        // Step 4: Chat Generation
        console.log('💬 Invoking gemini-2.5-flash-lite...');
        const chatModel = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash-lite', 
            systemInstruction: systemPrompt
        });

        const chatResult = await chatModel.generateContent(message);
        console.log('✅ Chat response received');
        let aiResponse = chatResult.response.text();

        // Step 5: Extract Recommended IDs
        const idMatch = aiResponse.match(/\[IDs:\s*([^\]]+)\]/);
        let recommendedIds = [];
        if (idMatch) {
            recommendedIds = idMatch[1].split(',').map(id => id.trim());
            aiResponse = aiResponse.replace(/\[IDs:\s*[^\]]+\]/, '').trim();
        }

        res.json({
            reply: aiResponse,
            recommendedIds: recommendedIds
        });

    } catch (error) {
        console.error('❌ AI Assistant Error:', error);
        res.status(500).json({ message: 'فشل مساعد الـ AI في الرد، يرجى المحاولة لاحقاً' });
    }
};

// Technical Support / Troubleshooting (Stateless)
const getTroubleshooting = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'الرجاء وصف المشكلة التقنية' });
        }

        console.log('🔧 Invoking Support AI (gemini-2.5-flash-lite)...');
        const systemInstruction = "أنت خبير دعم فني متخصص في الإلكترونيات واللابتوبات. حلل مشكلة العميل بالعامية المصرية وقدم خطوات عملية ومرتبة لإصلاحها. إذا كانت المشكلة تتطلب فني متخصص، انصح العميل بزيارة متجر المدينة للإلكترونيات.";

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash-lite",
            systemInstruction: systemInstruction
        });

        const result = await model.generateContent(message);
        const advice = result.response.text();

        res.json({ reply: advice });

    } catch (error) {
        console.error('❌ AI Support Error:', error);
        res.status(500).json({ message: 'فشل مساعد الدعم الفني في الرد، يرجى المحاولة لاحقاً' });
    }
};

module.exports = {
    getRecommendation,
    getTroubleshooting
};
