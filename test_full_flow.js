require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mongoose = require('mongoose');
const Product = require('./models/Product');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testFullFlow() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const message = "مواصفات dell 7530 ايه؟ وبالاخص كارت الشاشة";
        console.log('Query:', message);

        // Embedding
        const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const embeddingResult = await embeddingModel.embedContent(message);
        const queryEmbedding = embeddingResult.embedding.values;

        // Search
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

        console.log(`Found ${similarProducts.length} products.`);

        // Context
        const productsContext = similarProducts.map((product, index) => {
            const specs = product.specifications || {};
            return `المنتج ${index + 1}:
الاسم: ${product.name}
الماركة: ${product.brand}
السعر: ${product.price} LE
المواصفات:
- المعالج: ${specs.cpu || specs.cpuModel || 'N/A'}
- الرامات: ${specs.ramMemory || 'N/A'}
- الهارد: ${specs.hardDiskSize || 'N/A'}
- كارت الشاشة: ${specs.graphicsDescription || 'N/A'}
- الشاشة: ${specs.screenSize || 'N/A'}
الوصف: ${product.description}`.trim();
        }).join('\n\n---\n\n');

        const systemPrompt = `أنت خبير مبيعات في متجر المدينة للإلكترونيات. ساعد العميل بالعامية المصرية في اختيار المنتجات المناسبة من القائمة التالية فقط:\n${productsContext}\n\nقواعد:\n1. اختر أفضل منتجين فقط يناسبان طلب العميل.\n2. إذا لم تجد منتجات تناسب طلب العميل تماماً، وضح ذلك واقترح أقرب البدائل من القائمة.\n3. لا تذكر المعرف (ID) في الشرح.\n4. في نهاية الرد تماماً، اكتب المعرفات بهذا التنسيق: [IDs: id1, id2]`;

        console.log('System Prompt Length:', systemPrompt.length);

        // Chat - Try both gemini-2.0-flash and fallback
        let chatModel;
        try {
            chatModel = genAI.getGenerativeModel({
                model: 'gemini-1.5-flash',
                systemInstruction: systemPrompt
            });
            const chatResult = await chatModel.generateContent(message);
            console.log('AI Response:\n', chatResult.response.text());
        } catch (e) {
            console.error('Gemini Error:', e.message);
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

testFullFlow();
