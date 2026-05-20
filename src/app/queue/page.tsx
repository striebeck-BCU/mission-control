"use client";

import { useState } from "react";

export default function QueuePage() {
  const [result, setResult] = useState<string>("");

  const trigger = async () => {
    setResult("Processing...");
    try {
      const res = await fetch("/api/process-queue");
      const data = await res.json();
      setResult(`✅ Sent ${data.processed} email(s) — ${data.message}`);
    } catch (err) {
      setResult(`❌ Error: ${err}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-2">BCU Email Queue</h1>
        <p className="text-slate-400 text-sm mb-6">
          Click to check the queue and send any due emails (3-day and 7-day nurture).
        </p>
        <button
          onClick={trigger}
          className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold transition-colors w-full"
        >
          Process Queue
        </button>
        {result && (
          <p className="mt-4 text-sm text-slate-300 font-mono">{result}</p>
        )}
      </div>
    </div>
  );
}