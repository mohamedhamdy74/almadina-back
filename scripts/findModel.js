require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function checkModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const models = [
        'gemini-pro',
        'gemini-1.5-flash',
        'gemini-1.5-flash-8b',
        'gemini-2.0-flash-exp'
    ];

    for (const m of models) {
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("Hello");
            console.log(`✅ ${m} is working!`);
            return; // Stop at first working model
        } catch (e) {
            console.log(`❌ ${m} failed: ${e.message} (Status: ${e.status})`);
        }
    }
}

checkModels();
