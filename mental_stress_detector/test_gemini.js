require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testAI() {
    const key = process.env.GEMINI_API_KEY;
    
    if (!key || key === 'your_gemini_api_key_here') {
        console.log("❌ ERROR: No API Key found in .env file.");
        return;
    }

    console.log("Testing with Key: " + key.substring(0, 10) + "...");
    
    // Initialize with the stable 'v1' API version if possible, or try different model names
    const genAI = new GoogleGenerativeAI(key);

    const modelsToTry = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro"];
    
    for (let modelName of modelsToTry) {
        console.log(`\n--- Trying Model: ${modelName} ---`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Say 'Hello! Your Gemini API is working perfectly.'");
            const response = await result.response;
            console.log("✅ SUCCESS!");
            console.log("AI Response: " + response.text());
            console.log("Use this model name in your server.js: " + modelName);
            return; // Exit if successful
        } catch (err) {
            console.log(`❌ FAILED for ${modelName}: ` + err.message);
        }
    }

    console.log("\n❌ ALL MODELS FAILED. Possible reasons:");
    console.log("1. Your API key might be restricted to a specific region.");
    console.log("2. The API key might not be active yet (it can take 5-10 mins).");
    console.log("3. You might be using a 'Service Account' key instead of an 'API Key'.");
}

testAI();
