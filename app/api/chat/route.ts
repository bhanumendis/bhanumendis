import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are an assistant on bhanumendis.com. Answer questions about Bhanu Mendis briefly.

Bhanu Mendis — Sri Lankan leader, audio engineer, public speaker, educator. Colombo, Sri Lanka.
Senior Head Prefect Lyceum International School 2023-2025. Directed Elysium '25 for 26,000 people. Maathra 14 at BMICH, 750+ performers.
Founder Swara Concert (700+ performers) and Padura Concert. Educator at The Science Brainery.
Sangeetha Visharadha First Division. Cambridge O/Levels A* Sinhala, A Physics, A Maths, A Biology.
Awards: All-Island Dancing Champion 2018,2019,2023. All-Island Music Champion 2019,2023,2024. Malaysian World Choral Competition 1st. Chess National Champion 2016.
Contact: bhanumendis@gmail.com | +94 77 712 4152 | linkedin.com/in/bhanumendis | @bhanu_mendis
Tuition: forms.gle/N52vwAytUsJCt2df6
Keep answers under 3 sentences. Be professional and warm.`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const chat = model.startChat({
      history: history || [],
      generationConfig: { maxOutputTokens: 400, temperature: 0.6 },
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();

    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error("Gemini error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}