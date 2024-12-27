"use server";
 
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
 
export const extractAppointment = async (input: string) => {
  const result = await generateObject({
    model: openai("gpt-4o-mini"),
    prompt: "Extract appointment info for the following input: " + input,
    schema: z.object({ 
      //  tips: use .nullable() instead of optional. 
      //    if you use optional, the model sometimes skips it even though the
      //    info is there. by using nullable(), the model has to make 
      //    definite decision whether the property should be null or null.
      //    therefore it will always generate the value if the value exist
      //    else, set the value to null.
      //  this will lead to better schema generated.
      title: z.string().describe("The title of the event. This should be the main purpose of the event. No need to mention names. Clean up formatting (capitalise)."), 
      startTime: z.string().nullable().describe("format HH:MM"), 
      endTime: z.string().nullable().describe("format HH:MM - note: default meeting duration is 1 hour"), 
      attendees: z.array(z.string()).nullable().describe("comma separated list of attendees"), 
      location: z.string().nullable(),
      //  llm has no context on what is today's date, this is how to solve the 
      //    date issue.
      date: z.string().describe("Today's date is: " + new Date().toISOString().split("T")[0]), 
      // tips: spending some time on the describe() function is so so beneficial
    }), 
  });
  return result.object;
};