const { GoogleGenAI } = require('@google/genai');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// New SDK initialization
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getRecommendation = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ reply: 'الرجاء إدخال رسالة' });

        console.log('🤖 AI Request:', message);

        // Step 1: Get products from DB
        const allProducts = await Product.find().limit(20)
            .select('name brand price category specifications thumbnail description _id');
        
        if (!allProducts.length) {
            return res.json({ reply: 'مفيش منتجات متاحة حالياً.', recommendedProducts: [] });
        }

        const context = allProducts.map((p, i) => {
            const s = p.specifications || {};
            return `${i+1}. [${p._id}] ${p.name} - ${p.price} جنيه (${s.cpu || ''}, ${s.ramMemory || ''}, ${s.hardDiskSize || ''})`;
        }).join('\n');

        // Step 2: Generate with new SDK
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: `أنت خبير مبيعات لابتوبات في متجر المدينة. العميل بيقول: "${message}"

المنتجات المتاحة:
${context}

رد بالعامية المصرية واختار أفضل 2 منتج. في آخر ردك اكتب: [IDs: id1, id2]`,
        });

        let aiResponse = response.text;
        console.log('✅ AI responded');

        // Step 3: Extract IDs safely
        let recommendedProducts = [];
        const idMatch = aiResponse.match(/\[IDs:\s*([^\]]+)\]/);
        
        if (idMatch) {
            const rawIds = idMatch[1].split(',').map(id => id.trim());
            const validIds = rawIds.filter(id => mongoose.Types.ObjectId.isValid(id));
            
            if (validIds.length > 0) {
                try {
                    recommendedProducts = await Product.find({ _id: { $in: validIds } });
                } catch (e) {
                    console.error('DB lookup error:', e.message);
                }
            }
            aiResponse = aiResponse.replace(/\[IDs:\s*[^\]]+\]/, '').trim();
        }

        return res.json({ reply: aiResponse, recommendedProducts });

    } catch (error) {
        console.error('❌ AI ERROR:', error.message || error);
        return res.status(500).json({ reply: 'حصل مشكلة في الذكاء الاصطناعي، جرب تاني.', error: error.message });
    }
};

const getTroubleshooting = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ reply: 'الرجاء وصف المشكلة' });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: `أنت خبير صيانة لابتوبات. حل المشكلة دي بالعامية المصرية: ${message}`,
        });

        return res.json({ reply: response.text });
    } catch (error) {
        console.error('❌ Support ERROR:', error.message || error);
        return res.status(500).json({ reply: 'حصل مشكلة، جرب تاني.' });
    }
};

module.exports = { getRecommendation, getTroubleshooting };
