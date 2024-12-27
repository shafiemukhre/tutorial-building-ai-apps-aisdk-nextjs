import "dotenv/config";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import supportRequests from "./support_requests_multilanguage.json"; 
import { z } from "zod";
 
async function main() {
  const result = await generateObject({
    model: openai("gpt-4o-mini"),
    prompt:
      "Classify the following support requests.\n\n" +
      JSON.stringify(supportRequests),
    schema: z.object({
      request: z.string(),
      category: z.enum([
        "billing",
        "product_issues",
        "enterprise_sales",
        "account_issues",
        "product_feedback",
      ]),
      urgency: z.enum(["low", "medium", "high"]), // simply add another key to update the schema, and llm will infer it directly
      // when you are designing your schema, be careful with the model that you
      //  you are using. if you have a big schema, use bigger model, experiment.
      // smaller model will struggle to generate correct schema

      // llm is great at following example, here is an example of few-shot prompting
      language: z.string().describe("The language the support request is in. eg. English, Spanish etc."), 
    }),
    output: "array", // without this, the model will only output a single object, with this, it will array of object
  });
  console.log(result.object);
}
 
main().catch(console.error);