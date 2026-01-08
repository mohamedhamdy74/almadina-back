const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/Product');

// Initialize Google AI with API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Device Recommendation Endpoint (RAG-based)
 * Uses vector search to find similar products and generates recommendations
 */
exports.getRecommendation = async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        // Step 1: Generate embedding for user query
        console.log('🤖 Starting Embedding step for message:', message);
        const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const embeddingResult = await embeddingModel.embedContent(message);
        const queryEmbedding = embeddingResult.embedding.values;
        console.log('✅ Embedding generated successfully');

        // Determine category based on keywords
        let categoryFilter = 'Laptops'; // Default
        const lowerMessage = message.toLowerCase();
        if (/اكسسوار|شنطة|ماوس|كيبورد|سماعة|شاحن|وصلة|accessory|mouse|keyboard|headset|charger/i.test(lowerMessage)) {
            categoryFilter = 'Accessories';
        }

        const similarProducts = await Product.aggregate([
            {
                $vectorSearch: {
                    index: 'vector_index',
                    path: 'embedding_vector',
                    queryVector: queryEmbedding,
                    numCandidates: 100,
                    limit: 15, // Increased limit for better selection
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

        const systemPrompt = `أنت خبير مبيعات في متجر المدينة للإلكترونيات. ساعد العميل بالعامية المصرية في اختيار المنتجات المناسبة من القائمة التالية فقط:\n${productsContext}\n\nقواعد:\n1. اختر أفضل منتجين فقط يناسبان طلب العميل.\n2. إذا لم تجد منتجات تناسب طلب العميل تماماً، وضح ذلك واقترح أقرب البدائل من القائمة.\n3. لا تذكر المعرف (ID) في الشرح.\n4. في نهاية الرد تماماً، اكتب المعرفات بهذا التنسيق: [IDs: id1, id2]`;

        // Step 4: Chat Generation (No History to save quota/avoid errors)
        console.log('💬 Starting Gemini Chat generation (gemini-2.5-flash) - History Disabled...');
        const chatModel = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: systemPrompt // Newer SDKs support this directly
        });

        // Use generateContent instead of startChat for a stateless response
        const chatResult = await chatModel.generateContent(message);
        console.log('✅ Chat response received from Gemini');
        let aiResponse = chatResult.response.text();

        // Extract selected IDs and clean the response
        let recommendedProducts = [];
        const idMatch = aiResponse.match(/\[IDs:\s*([^\]]+)\]/);

        if (idMatch) {
            const selectedIds = idMatch[1].split(',').map(id => id.trim());
            recommendedProducts = similarProducts.filter(p => selectedIds.includes(p._id.toString()));
            aiResponse = aiResponse.replace(/\[IDs:\s*[^\]]+\]/, '').trim();
        } else {
            recommendedProducts = similarProducts.slice(0, 2);
        }

        res.json({
            message: aiResponse,
            retrievedProducts: recommendedProducts.map(p => ({
                _id: p._id,
                name: p.name,
                price: p.price,
                thumbnail: p.thumbnail,
                category: p.category,
                description: p.description,
                brand: p.brand,
                score: p.score,
            })),
        });

    } catch (error) {
        console.error('❌ Error in getRecommendation:', error);

        // Handle Gemini Overload/Quota specifically
        if (error.message.includes('503') || error.message.includes('overloaded')) {
            return res.status(200).json({
                message: "بعتذر منك، السيرفر عليه ضغط حالياً. ممكن تجرب كمان دقيقة؟",
                retrievedProducts: []
            });
        }

        res.status(500).json({
            message: 'حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.',
            error: error.message
        });
    }
};

/**
 * Troubleshooting Endpoint
 * Provides technical support for laptop issues
 */
exports.getTroubleshooting = async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        const systemPrompt = `أنت مهندس دعم فني متخصص في تشخيص وإصلاح أعطال الحواسيب المحمولة.

مهمتك:
1. طرح أسئلة تشخيصية متسلسلة لتحديد المشكلة بدقة
2. تقديم حلول عملية خطوة بخطوة
3. شرح الحلول بطريقة واضحة وسهلة الفهم
4. البدء بالحلول البسيطة قبل المعقدة
5. تحذير المستخدم إذا كان الحل يتطلب خبرة فنية متقدمة

كن محترفاً، صبوراً، ومفيداً في جميع ردودك.`;

        const chatModel = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: systemPrompt
        });

        const result = await chatModel.generateContent(message);
        const aiResponse = result.response.text();

        res.json({
            message: aiResponse,
        });

    } catch (error) {
        console.error('❌ Error in getTroubleshooting:', error);
        res.status(500).json({
            message: 'حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.',
            error: error.message
        });
    }
};
