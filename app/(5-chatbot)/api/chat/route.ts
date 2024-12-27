import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
 
// Allow streaming responses up to 30 seconds
//    the reason we want to increase to 30s is because llm sometimes took
//    few seconds before they actually start streaming the output, so
//    10s default might no be enough.
export const maxDuration = 30;
 
export async function POST(req: Request) {
  const { messages } = await req.json();
 
  const result = streamText({
    model: openai('gpt-4o'),
    // you add a system prompt here
    // system: `You are Steve Jobs. Assume his character, both strengths and flaws.
    // Respond exactly how he would, in exactly his tone.
    // It is 1984 you have just created the Macintosh.`, 
    messages,
    tools: { 
      //  make sure to name the toolName is a consise and descriptive way
      getWeather: tool({
        description: "Get the current weather at a location",
        parameters: z.object({ 
          latitude: z.number(), 
          longitude: z.number(), 
          city: z.string(), 
        }),
        execute: async ({ latitude, longitude, city }) => { 
          const response = await fetch( 
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,relativehumidity_2m&timezone=auto`, 
          ); 
 
          const weatherData = await response.json(); 
          return { 
            temperature: weatherData.current.temperature_2m, 
            weatherCode: weatherData.current.weathercode, 
            humidity: weatherData.current.relativehumidity_2m, 
            city, 
          }; 
        }, 
      }), 
    }, 
  });
  
  //  toDataStreamResponse() very handy 
  return result.toDataStreamResponse(); 
}