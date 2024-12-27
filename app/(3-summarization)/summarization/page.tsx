"use client";

import { MessageList } from "./message-list";
import { Button } from "@/components/ui/button";
import messages from "./messages.json";
import { generateSummary } from "./actions";
import { useState } from "react";
import { SummaryCard } from "./summary-card";

export default function Home() {
  // <Awaited<ReturnType<typeof generateSummary>> | null> is a nice typescript
  //    trick to get whatever the returned type from that object.
  // this is very helpful because now we don't have to update the type of
  //    summary each time we changed the schema of generateSummary
  const [summary, setSummary] = useState<Awaited<
    ReturnType<typeof generateSummary>
  > | null>(null); 
  const [loading, setLoading] = useState(false);
  return (
    <main className="mx-auto max-w-2xl pt-8">
      <div className="flex space-x-4 items-center mb-2">
        <h3 className="font-bold">Comments</h3>
        <Button
          variant={"secondary"}
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            // generate summary
            setSummary(await generateSummary(messages)); 
            setLoading(false);
          }}
        >
          Summary
        </Button>
      </div>
      {summary && <SummaryCard {...summary} />}
      <MessageList messages={messages} />
    </main>
  );
}
