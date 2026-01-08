require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testWithHistory() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    console.log('Sending first message...');
    try {
        const chat = model.startChat({
            history: [],
        });
        const result = await chat.sendMessage("Hi");
        console.log('first message success');

        console.log('Sending second message...');
        const result2 = await chat.sendMessage("How are you?");
        console.log('second message success');
    } catch (e) {
        console.error('Failed:', e.message);
    }
}

testWithHistory();
