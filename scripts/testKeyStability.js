require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testStability() {
    const providedKey = "AIzaSyCUXNeYyP3pOq2w6bFJebYbzcDxrPht1QM";
    const genAI = new GoogleGenerativeAI(providedKey);

    console.log('🚀 Testing gemini-1.5-flash with Provided Key...');
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hi");
        console.log('✅ 1.5 Flash Success!');
    } catch (e) {
        console.log('❌ 1.5 Flash Failed:', e.message);
    }

    console.log('\n🚀 Testing gemini-2.0-flash with Provided Key...');
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent("Hi");
        console.log('✅ 2.0 Flash Success!');
    } catch (e) {
        console.log('❌ 2.0 Flash Failed:', e.message);
    }
}

testStability();
