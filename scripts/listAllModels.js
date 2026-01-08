require('dotenv').config();
const axios = require('axios');

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await axios.get(url);
        console.log('Available models:');
        response.data.models.forEach(m => {
            console.log(`- ${m.name} (${m.supportedGenerationMethods})`);
        });
    } catch (e) {
        console.error('Failed to list models:', e.message);
    }
}

listModels();
