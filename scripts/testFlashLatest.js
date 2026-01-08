require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testFlashLatest() {
    console.log('🚀 Checking gemini-flash-latest compatibility...');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Note: 'gemini-flash-latest' usually points to stable 1.5-flash
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    try {
        console.log('--- Sending Request 1 ---');
        const result1 = await model.generateContent("مرحبا، عرف نفسك باختصار بالعامية المصرية");
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

        console.log('\n🌟 Result: gemini-flash-latest is working successfully!');
    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        if (error.status) console.log('Status code:', error.status);
    }
}

testFlashLatest();
