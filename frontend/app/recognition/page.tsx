"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client";
import { GET_RECOGNITIONS } from "../../graphql/queries/recognition";
import { CREATE_RECOGNITION } from "../../graphql/mutation/recognition";

export default function RecognitionPage() {
  const { data, loading, error, refetch } = useQuery(GET_RECOGNITIONS, {
    variables: {
      request: {
        pageCriteria: { enablePage: true, pageSize: 20, skip: 0 }
      }
    }
  });

  const [createRecognition] = useMutation(CREATE_RECOGNITION);

  // Form State
  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("Collaboration");
  const [statusMsg, setStatusMsg] = useState("");

  const recognitions = data?.recognitions?.items || [];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiverId || !message) {
      setStatusMsg("Please fill out all fields.");
      return;
    }
    try {
      const res = await createRecognition({
        variables: {
          request: {
            receiverId,
            message,
            category
          }
        }
      });
      if (res.data?.createRecognition) {
        setStatusMsg("Recognition sent successfully!");
        setReceiverId("");
        setMessage("");
        refetch();
        setTimeout(() => setStatusMsg(""), 3000);
      }
    } catch (err: any) {
      setStatusMsg(`Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 p-8">
      <header className="mb-8">
        <Link href="/dashboard" className="text-teal-600 hover:text-teal-700 dark:text-teal-400">← Back to Dashboard</Link>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-4">Recognition & Appreciation</h1>
      </header>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Send Recognition Form */}
        <form onSubmit={handleSend} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-orange-100 dark:border-slate-700 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Send Recognition</h2>
          {statusMsg && (
            <p className={`text-sm ${statusMsg.includes("Error") || statusMsg.includes("Please") ? "text-red-500" : "text-green-500"}`}>{statusMsg}</p>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">To (Receiver Employee ID/Email)</label>
              <input
                type="text"
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
                placeholder="e.g. EMP-002"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 text-sm bg-transparent text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 text-sm bg-transparent text-slate-900 dark:text-white"
              >
                <option value="Collaboration">Collaboration</option>
                <option value="Innovation">Innovation</option>
                <option value="Leadership">Leadership</option>
                <option value="Customer Focus">Customer Focus</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Message</label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What did they do that was awesome?"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 text-sm bg-transparent text-slate-900 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2.5 rounded-lg hover:bg-orange-700 transition-colors font-bold text-sm"
          >
            Recognize Peer
          </button>
        </form>

        {/* Recognition Feed */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Wall of Fame</h2>
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
            </div>
          ) : error ? (
            <p className="text-red-500 text-sm">Error: {error.message}</p>
          ) : recognitions.length === 0 ? (
            <p className="text-slate-500 text-sm dark:text-slate-400 text-center py-6">No recognition posts yet. Be the first to appreciate someone!</p>
          ) : (
            recognitions.map((r: any) => {
              const initials = (r.receiverId || "E").slice(0, 2).toUpperCase();
              return (
                <div key={r.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border-l-4 border-orange-500">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-slate-700 rounded-full flex items-center justify-center font-bold text-orange-600 dark:text-orange-400">
                      {initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {r.giverId || "Someone"} recognized {r.receiverId}
                      </h4>
                      <p className="text-xs text-slate-500">{new Date(r.createdOn).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex mb-2">
                    <span className="px-2 py-0.5 rounded text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 font-medium">
                      {r.category}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 italic">"{r.message}"</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
