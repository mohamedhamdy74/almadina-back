const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/Product');

// Initialize Google AI with API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize local embedding pipeline
let embedder = null;

async function getEmbedder() {
    if (!embedder) {
        const { pipeline } = await import('@xenova/transformers');
        embedder = await pipeline('feature-extraction', 'Xenova/multilingual-e5-small');
    }
    return embedder;
}

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

        // Step 1: Generate embedding for user query using local model
        const model = await getEmbedder();
        const output = await model(message, { pooling: 'mean', normalize: true });
        const queryEmbedding = Array.from(output.data);

        // Step 2: Perform vector search in MongoDB Atlas
        // Note: This requires a vector search index on the 'embedding_vector' field
        const similarProducts = await Product.aggregate([
            {
                $vectorSearch: {
                    index: 'vector_index', // Name of your vector search index in Atlas
                    path: 'embedding_vector',
                    queryVector: queryEmbedding,
                    numCandidates: 100,
                    limit: 10, // Increase limit to allow filtering
                    filter: { category: 'Laptops' } // Filter for Laptops only
                },
            },
            { $limit: 10 }, // Increase limit to give AI more options for specific filters (like HDD size)
            {
                $project: {
                    name: 1,
                    brand: 1,
                    description: 1,
                    price: 1,
                    category: 1,
                    specifications: 1,
                    thumbnail: 1,
                    score: { $meta: 'vectorSearchScore' },
                },
            },
        ]);

        // Step 3: Format retrieved products as context
        const productsContext = similarProducts.map((product, index) => {
            const specs = product.specifications || {};
            return `
المنتج ${index + 1}:
- المعرف (ID): ${product._id}
- الاسم: ${product.name}
- العلامة التجارية: ${product.brand}
- الوصف: ${product.description}
- السعر: ${product.price} جنيه مصري
- المعالج: ${specs.cpu || specs.cpuModel || 'غير محدد'}
- الذاكرة العشوائية: ${specs.ramMemory || 'غير محدد'}
- التخزين: ${specs.hardDiskSize || 'غير محدد'}
- حجم الشاشة: ${specs.screenSize || 'غير محدد'}
- كرت الشاشة: ${specs.graphicsDescription || 'غير محدد'}
- نظام التشغيل: ${specs.operatingSystem || 'غير محدد'}
- المميزات الخاصة: ${specs.specialFeatures?.join(', ') || 'غير محدد'}
      `.trim();
        }).join('\n\n---\n\n');

        // Step 4: Generate AI response using retrieved context
        const chatModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const systemPrompt = `أنت خبير مبيعات محترف وودود في "متجر المدينة للإلكترونيات". مهمتك هي مساعدة العملاء في اختيار أفضل جهاز لابتوب يناسب احتياجاتهم.
العملاء غالباً ما يتحدثون بالعامية المصرية، لذا كن مرناً في فهمهم ورد عليهم بنفس الأسلوب الودود ولكن باحترافية.

 قواعد مهمة:
1. استخدم فقط المنتجات المسترجعة من قاعدة البيانات المذكورة أدناه.
2. من الـ 10 أجهزة المتاحة، اختر أفضل "جهازين" فقط يناسبان طلب العميل وركز عليهما في ردك.
3. اشرح "لماذا" كل جهاز مناسب له بشكل مقنع، ولكن **لا تذكر المعرف (ID) نهائياً في كلامك مع العميل**.
4. في نهاية ردك تماماً، يجب أن تكتب معرفات (IDs) الجهازين اللذين اخترتهما بهذا التنسيق حصراً: [IDs: id1, id2] ليتمكن النظام من عرض الكروت.

المنتجات المتاحة حالياً في المعرض:
${productsContext}`;

        // Build conversation history for context
        const chatHistory = conversationHistory.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));

        const chat = chatModel.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: 'model',
                    parts: [{ text: 'فهمت. سأساعدك في اختيار أفضل جهاز لابتوب من المنتجات المتاحة بناءً على احتياجاتك.' }],
                },
                ...chatHistory,
            ],
        });

        const result = await chat.sendMessage(message);
        let aiResponse = result.response.text();

        // Extract selected IDs and clean the response
        let recommendedProducts = [];
        const idMatch = aiResponse.match(/\[IDs:\s*([^\]]+)\]/);

        if (idMatch) {
            const selectedIds = idMatch[1].split(',').map(id => id.trim());
            recommendedProducts = similarProducts.filter(p => selectedIds.includes(p._id.toString()));
            // Remove the IDs tag from the visible response
            aiResponse = aiResponse.replace(/\[IDs:\s*[^\]]+\]/, '').trim();
        } else {
            // Fallback: if AI forgets to include IDs, show top 2
            recommendedProducts = similarProducts.slice(0, 2);
        }

        res.json({
            message: aiResponse,
            retrievedProducts: recommendedProducts.map(p => ({
                id: p._id,
                name: p.name,
                price: p.price,
                thumbnail: p.thumbnail,
                score: p.score,
            })),
        });

    } catch (error) {
        console.error('❌ Error in getRecommendation:', error);
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

        const chatModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const systemPrompt = `أنت مهندس دعم فني متخصص في تشخيص وإصلاح أعطال الحواسيب المحمولة.

مهمتك:
1. طرح أسئلة تشخيصية متسلسلة لتحديد المشكلة بدقة
2. تقديم حلول عملية خطوة بخطوة
3. شرح الحلول بطريقة واضحة وسهلة الفهم
4. البدء بالحلول البسيطة قبل المعقدة
5. تحذير المستخدم إذا كان الحل يتطلب خبرة فنية متقدمة

كن محترفاً، صبوراً، ومفيداً في جميع ردودك.`;

        // Build conversation history
        const chatHistory = conversationHistory.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));

        const chat = chatModel.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: 'model',
                    parts: [{ text: 'مرحباً! أنا هنا لمساعدتك في حل مشاكل جهازك. من فضلك، صف لي المشكلة التي تواجهها.' }],
                },
                ...chatHistory,
            ],
        });

        const result = await chat.sendMessage(message);
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
