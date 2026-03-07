require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) { console.log("No API Key found."); return; }

    console.log("Checking API Key: " + key.substring(0, 10) + "...");
    
    try {
        // Try to fetch the list of models directly via fetch to bypass SDK defaults
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        if (data.error) {
            console.log("❌ API ERROR: " + data.error.message);
            console.log("Status: " + data.error.status);
            return;
        }

        console.log("✅ API Key is valid! Available models:");
        data.models.forEach(m => {
            console.log(`- ${m.name.replace('models/', '')} (Supports: ${m.supportedGenerationMethods.join(', ')})`);
        });

    } catch (err) {
        console.log("❌ Connection Error: " + err.message);
    }
}

listModels();
