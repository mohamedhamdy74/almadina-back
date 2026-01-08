require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    console.log('🚀 Starting Gemini API Test...');
    console.log('🔑 API Key (first 5 chars):', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 5) + '...' : 'MISSING');

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // 1. Test Embedding
    console.log('\n--- Test 1: Embedding (text-embedding-004) ---');
    try {
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const result = await model.embedContent("مرحبا، أريد تجربة التشفير");
        console.log('✅ Embedding Success! Dimensions:', result.embedding.values.length);
    } catch (error) {
        console.error('❌ Embedding Failed:', error.message);
        if (error.status) console.log('Status code:', error.status);
    }

    // 2. Test 1.5 Flash
    console.log('\n--- Test 2: Chat (gemini-1.5-flash) ---');
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Say hello in Arabic");
        console.log('✅ 1.5 Flash Success! Response:', result.response.text().trim());
    } catch (error) {
        console.error('❌ 1.5 Flash Failed:', error.message);
        if (error.status) console.log('Status code:', error.status);
    }

    // 3. Test 1.5 Flash 8b
    console.log('\n--- Test 3: Chat (gemini-1.5-flash-8b) ---');
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
        const result = await model.generateContent("Say hello in Arabic");
        console.log('✅ 1.5 Flash 8b Success! Response:', result.response.text().trim());
    } catch (error) {
        console.error('❌ 1.5 Flash 8b Failed:', error.message);
        if (error.status) console.log('Status code:', error.status);
    }

    // 4. Test 2.0 Flash Exp
    console.log('\n--- Test 4: Chat (gemini-2.0-flash-exp) ---');
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        const result = await model.generateContent("Say hello in Arabic");
        console.log('✅ 2.0 Flash Exp Success! Response:', result.response.text().trim());
    } catch (error) {
        console.error('❌ 2.0 Flash Exp Failed:', error.message);
        if (error.status) console.log('Status code:', error.status);
    }

    console.log('\n🏁 Test Finished.');
}

testGemini();
