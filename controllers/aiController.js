const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/Product');
const mongoose = require('mongoose');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getRecommendation = async (req, res) => {
    try {
        console.log('🤖 AI Request received:', req.body.message);
        
        // 1. Simple Keyword Search (Fallback for 500 safety)
        const products = await Product.find({ category: 'Laptops' }).limit(10).select('name price description _id');
        const context = products.map(p => `ID: ${p._id}, Name: ${p.name}, Price: ${p.price}`).join('\n');

        // 2. Chat with Gemini 1.5 Flash
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `أنت خبير مبيعات في متجر المدينة بالعامية المصرية. ساعد العميل: "${req.body.message}" بناءً على هذه البيانات فقط:\n${context}\n\nفي النهاية اكتب الـ IDs كالتالي: [IDs: id1, id2]`;

        const result = await model.generateContent(prompt);
        let aiResponse = result.response.text();

        // 3. Extract and Search IDs
        let recommendedProducts = [];
        const idMatch = aiResponse.match(/\[IDs:\s*([^\]]+)\]/);
        
        if (idMatch) {
            const rawIds = idMatch[1].split(',').map(id => id.trim().substring(0, 24));
            const validIds = rawIds.filter(id => mongoose.Types.ObjectId.isValid(id));
            if (validIds.length > 0) {
                recommendedProducts = await Product.find({ _id: { $in: validIds } });
            }
            aiResponse = aiResponse.replace(/\[IDs:\s*[^\]]+\]/, '').trim();
        }

        res.json({ reply: aiResponse, recommendedProducts });

    } catch (error) {
        console.error('❌ FATAL AI ERROR:', error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
};

const getTroubleshooting = async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(req.body.message);
        res.json({ reply: result.response.text() });
    } catch (e) {
        res.status(500).json({ message: 'Error' });
    }
};

module.exports = { getRecommendation, getTroubleshooting };
