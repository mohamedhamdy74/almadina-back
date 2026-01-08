import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
// Note: The new SDK expects GEMINI_API_KEY in env, but let's be explicit if needed.
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function main() {
    console.log('🚀 Testing with the NEW SDK (@google/genai)...');
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Explain how AI works in a few words",
        });
        console.log('✅ Success! Response:', response.text);
    } catch (error) {
        console.error('❌ Failed:', error.message);
        if (error.status) console.log('Status:', error.status);
    }
}

main();
