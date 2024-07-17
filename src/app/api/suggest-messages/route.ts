import { openai } from "@ai-sdk/openai";
import { StreamingTextResponse, streamText } from "ai";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // const { messages } = await req.json();
console.log(process.env.OPENAI_API_KEY)
    const prompt = "Create a list of three open-ended and engaging question formatted as a single string. Each question should be seperated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for diverse audience. Avoid personal of sensitive topics, focusing instead on universal themes that encourages friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with historical figure, who would it be?||What's a simple thing that makes you happy?'.Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment";
    
    const result = await streamText({
      model: openai("gpt-3.5-turbo"),
      prompt,
      headers:{
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    return result.toAIStreamResponse();
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message, type } = error;
      return NextResponse.json({ message, headers, name, type }, { status });
    } else {
      console.error("An unexpected error occurred", error);
      throw error;
    }
  }
}
