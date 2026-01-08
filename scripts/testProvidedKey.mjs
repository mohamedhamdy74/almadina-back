import { GoogleGenAI } from "@google/genai";

async function testKey() {
    const providedKey = "AIzaSyCUXNeYyP3pOq2w6bFJebYbzcDxrPht1QM";
    console.log('🚀 Testing Provided API Key (Fixed Embedding Test)...');

    const ai = new GoogleGenAI({
        apiKey: providedKey
    });

    try {
        console.log('--- Test 1: Chat (gemini-2.5-flash) ---');
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Hi, say something very short in Arabic",
        });
        console.log('✅ Chat Success! Response:', response.text);

        console.log('\n--- Test 2: Embedding (text-embedding-004) ---');
        // Using the simplified content structure
        const embedResult = await ai.models.embedContent({
            model: "text-embedding-004",
            content: { parts: [{ text: "تجربة" }] },
        });
        console.log('✅ Embedding Success! Dimensions:', embedResult.embedding.values.length);

    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        if (error.status) console.log('Status code:', error.status);
        console.log('Error details:', JSON.stringify(error));
    }
}

testKey();
