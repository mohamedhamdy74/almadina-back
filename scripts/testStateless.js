require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testStateless() {
    const providedKey = "AIzaSyCUXNeYyP3pOq2w6bFJebYbzcDxrPht1QM";
    console.log('🚀 Testing Stateless Gemini (No History) with gemini-2.5-flash...');

    const genAI = new GoogleGenerativeAI(providedKey);
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: "أنت خبير مبيعات في متجر المدينة. رد باختصار جداً بالعامية المصرية."
    });

    try {
        console.log('--- Sending Request (Stateless) ---');
        // Direct generateContent (no startChat)
        const result = await model.generateContent("أنا محتاج لابتوب للدراسة");
        console.log('✅ Success! Response:', result.response.text().trim());

        console.log('\n🌟 Result: Stateless request is working perfectly!');
    } catch (error) {
        console.error('❌ Test Failed:', error.message);
    }
}

testStateless();
