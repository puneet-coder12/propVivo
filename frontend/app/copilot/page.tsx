"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useMutation } from "@apollo/client";
import { SEND_COPILOT_MESSAGE } from "../../graphql/mutation/copilot";

interface Message {
  role: string;
  content: string;
}

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your HR Copilot. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [conversationId] = useState(() => `conv_${Date.now()}`);

  const [sendMessage, { loading }] = useMutation(SEND_COPILOT_MESSAGE);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");

    try {
      const res = await sendMessage({
        variables: {
          request: {
            conversationId,
            message: userMsg
          }
        }
      });
      if (res.data?.chat) {
        const reply = res.data.chat;
        setMessages(prev => [...prev, { role: reply.role, content: reply.content }]);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { role: "assistant", content: `Error: ${err.message}` }]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 p-8 flex flex-col">
      <header className="mb-8">
        <Link href="/dashboard" className="text-teal-600 hover:text-teal-700 dark:text-teal-400">← Back to Dashboard</Link>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-4">HR Copilot</h1>
      </header>
      <div className="flex-1 max-w-4xl mx-auto w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg flex flex-col overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-4 rounded-lg ${msg.role === "user" ? "bg-teal-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white"}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-50 dark:bg-slate-900/30 text-slate-400 px-4 py-2 rounded-lg text-xs italic">
                Copilot is thinking...
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex gap-4">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
            placeholder="Ask me anything about HR..."
            className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white disabled:opacity-50"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
