require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // There is no direct listModels in the SDK for web/node usually, 
    // it's usually done via the management API or we just try the correct strings.
    // The correct strings are usually 'gemini-1.5-flash' etc.
    // Let's try some variations in a test script.
}

async function testVariations() {
    console.log('Testing model variations...');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const variations = [
        'gemini-1.5-flash-latest',
        'gemini-1.5-flash',
        'gemini-1.5-flash-001',
        'gemini-1.5-flash-002',
        'gemini-1.5-pro'
    ];

    for (const v of variations) {
        try {
            const model = genAI.getGenerativeModel({ model: v });
            const result = await model.generateContent("Hi");
            console.log(`✅ ${v} Success!`);
        } catch (e) {
            console.log(`❌ ${v} Failed: ${e.message}`);
        }
    }
}

testVariations();
