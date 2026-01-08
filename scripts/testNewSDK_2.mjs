import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function main() {
    console.log('🚀 Testing gemini-2.0-flash with the NEW SDK...');
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: "Hi",
        });
        console.log('✅ Success! Response:', response.text);
    } catch (error) {
        console.error('❌ Failed:', error.message);
    }
}

main();
