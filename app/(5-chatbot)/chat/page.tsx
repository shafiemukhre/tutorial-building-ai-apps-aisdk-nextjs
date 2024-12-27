'use client';
 
import { useChat } from 'ai/react';
import Weather from './weather';
 
export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    //  to make the generated UI a responsive component that user can interact
    //    with, add an id.
    id: "weather",
    //  default maxSteps is 1. So when you ask the weather, it will give you
    //    only the json object response from the tool. we don't want that
    //  to solve this, increase the maxSteps. So when you ask the weather,
    //    it will invoke the tool, get output from the tool and return it back
    //    to the llm model. Now the model have data on the weather and can
    //    answer your question correctly. maxSteps is the amount of times
    //    llm will execute the steps before returning the final result to you.
    //  now you can hide the json output from the tool, and just response
    //    with the final message.
    maxSteps: 5,
  }); 
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {/* if tool has been invoked, return output from tool, else normal response */}
          {m.toolInvocations ? ( 
            m.toolInvocations.map((t) =>
              t.toolName === "getWeather" && t.state === "result" ? ( 
                <Weather key={t.toolCallId} weatherData={t.result} />
              ) : null, 
            ) 
          ) : ( 
            <p>{m.content}</p>
          )}
        </div>
      ))}
 
      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input} 
          placeholder="Say something..."
          onChange={handleInputChange} 
        />
      </form>
    </div>
  );
}