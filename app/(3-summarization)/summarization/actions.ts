"use server";
 
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
 
export const generateSummary = async (comments: any[]) => {
  const result = await generateObject({
    model: openai("gpt-4o"),
    prompt: `Please summarise the following comments.
    ---
    Comments:
    ${JSON.stringify(comments)}
`,
    schema: z.object({
      headline: z
        .string()
        // .max(5) // alternatively you can force it to have certain length
        //    but add it to .describe if you want to be more like a guideline
        .describe("The headline of the summary. Max 5 words."),
      context: z
        .string()
        .describe(
          "What is the relevant context that prompted discussion. Max 2 sentences.",
        ),
      discussionPoints: z
        .string()
        .describe("What are the key discussion points? Max 2 sentences."),
      takeaways: z
        .string()
        // llm can infer the PIC when we add "include names" in the prompt.
        // the point here is that to play around with the prompts.
        .describe(
          "What are the key takeaways / next steps? Include names. Max 2 sentences.",
        ),
    }),
  });
  return result.object;
};