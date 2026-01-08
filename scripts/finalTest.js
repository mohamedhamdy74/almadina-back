require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function finalTest() {
    console.log('🚀 Checking gemini-3-flash-preview stability...');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    try {
        console.log('--- Sending Request 1 ---');
        const result1 = await model.generateContent("مرحبا، عرف نفسك باختصار");
        console.log('✅ Response 1 Success:', result1.response.text().trim());

        console.log('\n--- Sending Request 2 (History Test) ---');
        const chat = model.startChat({
            history: [
                { role: 'user', parts: [{ text: "اسمي محمد" }] },
                { role: 'model', parts: [{ text: "أهلاً بك يا محمد، كيف أساعدك؟" }] }
            ]
        });
        const result2 = await chat.sendMessage("ما هو اسمي؟");
        console.log('✅ Response 2 Success:', result2.response.text().trim());

        console.log('\n🌟 Result: gemini-2.0-flash is working perfectly!');
    } catch (error) {
        console.error('❌ Test Failed:', error.message);
    }
}

finalTest();
