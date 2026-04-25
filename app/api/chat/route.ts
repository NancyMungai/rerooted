import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  const { ingredients, mode } = await req.json();

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  let prompt = "";

  if (mode === "fridge") {
    prompt = `You are ReRooted, a sustainability-focused cooking assistant. 
    The user has these ingredients: ${ingredients}
    
    Identify which ingredients are likely expiring soon based on typical shelf life.
    Return ONLY a JSON object in this exact format, no markdown, no explanation:
    {
      "expiring": ["ingredient1", "ingredient2"],
      "recipes": [
        {
          "name": "Recipe Name",
          "time": "20 min",
          "tags": ["vegetarian"],
          "usesCount": 4,
          "totalIngredients": 5,
          "wasteSaved": "340g",
          "co2Saved": "0.8kg",
          "steps": ["Step 1 instruction", "Step 2 instruction", "Step 3 instruction", "Step 4 instruction"],
          "missing": ["pasta"]
        }
      ]
    }
    Return 3 recipes, prioritising ones that use expiring ingredients first.`;
  }

  if (mode === "shopping") {
    prompt = `You are ReRooted, a sustainability-focused cooking assistant.
    The user wants to cook: ${ingredients}
    
    Generate a minimal shopping list — only what they truly need, nothing extra.
    Return ONLY a JSON object in this exact format, no markdown, no explanation:
    {
      "items": ["item 1 · quantity", "item 2 · quantity", "item 3 · quantity"],
      "wasteSaved": "1.2kg",
      "tip": "A short sustainability tip about buying only what you need"
    }`;
  }

  if (mode === "tired") {
    prompt = `You are ReRooted, a sustainability assistant. The user was going to cook: ${ingredients}. Suggest they support a local independent restaurant tonight instead. Make up a warm, realistic local restaurant name (not a chain), a short distance, and a sustainability reason specific to eating local. Return ONLY JSON:
{
  "restaurant": "a cozy local restaurant name",
  "distance": "walking distance like 0.8km",
  "match": "what kind of food they serve that matches",
  "sustainability": "a specific reason why eating local tonight is the sustainable choice - mention reduced food miles, supporting local economy, less packaging",
  "boltFood": true
}`;
  }

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(clean);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to parse response", raw: text });
  }
}