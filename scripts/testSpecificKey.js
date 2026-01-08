const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testSpecificKey() {
    const providedKey = "AIzaSyCUXNeYyP3pOq2w6bFJebYbzcDxrPht1QM";
    console.log('🚀 Testing SPECIFIC API Key with gemini-2.5-flash...');

    const genAI = new GoogleGenerativeAI(providedKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    try {
        console.log('--- Sending Request 1 ---');
        const result1 = await model.generateContent("مرحبا، رد باختصار جداً");
        console.log('✅ Response 1 Success:', result1.response.text().trim());

        console.log('\n--- Sending Request 2 (History Test) ---');
        const chat = model.startChat({
            history: [
                { role: 'user', parts: [{ text: "اسمي أحمد" }] },
                { role: 'model', parts: [{ text: "أهلاً بك يا أحمد" }] }
            ]
        });
        const result2 = await chat.sendMessage("من أنا؟");
        console.log('✅ Response 2 Success:', result2.response.text().trim());

        console.log('\n🌟 Result: This key is working with gemini-2.5-flash!');
    } catch (error) {
        console.error('❌ Test Failed:', error.message);
    }
}

testSpecificKey();
