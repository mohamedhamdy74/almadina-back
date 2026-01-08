require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testProjectSDK() {
    const providedKey = "AIzaSyCUXNeYyP3pOq2w6bFJebYbzcDxrPht1QM";
    console.log('🚀 Testing Provided API Key with Project SDK (@google/generative-ai)...');

    const genAI = new GoogleGenerativeAI(providedKey);

    // 1. Test Embedding
    console.log('\n--- Test 1: Embedding (text-embedding-004) ---');
    try {
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const result = await model.embedContent("تجربة");
        console.log('✅ Embedding Success! Dimensions:', result.embedding.values.length);
    } catch (error) {
        console.error('❌ Embedding Failed:', error.message);
    }

    // 2. Test Chat
    console.log('\n--- Test 2: Chat (gemini-2.5-flash) ---');
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent("Hi, say hello in Arabic");
        console.log('✅ Chat Success! Response:', result.response.text().trim());
    } catch (error) {
        console.error('❌ Chat Failed:', error.message);
    }

    console.log('\n🏁 Test Finished.');
}

testProjectSDK();
