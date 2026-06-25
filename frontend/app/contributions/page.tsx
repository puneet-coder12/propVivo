"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CONTRIBUTIONS } from "../../graphql/queries/contributions";
import { CREATE_CONTRIBUTION } from "../../graphql/mutation/contributions";

export default function ContributionsPage() {
  const { data, loading, error, refetch } = useQuery(GET_CONTRIBUTIONS, {
    variables: {
      request: {
        pageCriteria: { enablePage: true, pageSize: 20, skip: 0 }
      }
    }
  });

  const [createContribution] = useMutation(CREATE_CONTRIBUTION);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Innovation");
  const [statusMsg, setStatusMsg] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const contributions = data?.contributions?.items || [];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      setStatusMsg("Please fill out all fields.");
      return;
    }
    try {
      const res = await createContribution({
        variables: {
          request: {
            title,
            description,
            category
          }
        }
      });
      if (res.data?.createContribution) {
        setStatusMsg("Contribution logged successfully! Point calculation is pending review.");
        setTitle("");
        setDescription("");
        refetch();
        setTimeout(() => {
          setStatusMsg("");
          setIsFormOpen(false);
        }, 2000);
      }
    } catch (err: any) {
      setStatusMsg(`Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <Link href="/dashboard" className="text-teal-600 hover:text-teal-700 dark:text-teal-400">← Back to Dashboard</Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-4">Value Contributions</h1>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-semibold text-sm"
        >
          {isFormOpen ? "Close Form" : "Log Contribution"}
        </button>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* Create Form */}
          {isFormOpen && (
            <form onSubmit={handleSend} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-teal-100 dark:border-slate-700 space-y-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Log a New Value Contribution</h3>
              {statusMsg && (
                <p className={`text-sm ${statusMsg.includes("Error") || statusMsg.includes("Please") ? "text-red-500" : "text-green-500"}`}>{statusMsg}</p>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Refactored Login module"
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
                    <option value="Innovation">Innovation</option>
                    <option value="Mentorship">Mentorship</option>
                    <option value="Process Optimization">Process Optimization</option>
                    <option value="Quality Assurance">Quality Assurance</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what you did and the impact it had..."
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 text-sm bg-transparent text-slate-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-bold text-sm"
              >
                Submit Contribution
              </button>
            </form>
          )}

          {/* List */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-teal-100 dark:border-slate-700">
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Recent Contributions</h2>
            
            {loading ? (
              <div className="flex justify-center p-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"></div>
              </div>
            ) : error ? (
              <p className="text-red-500 text-sm">Error: {error.message}</p>
            ) : contributions.length === 0 ? (
              <p className="text-slate-500 text-sm dark:text-slate-400">No contributions found.</p>
            ) : (
              <div className="space-y-4">
                {contributions.map((c: any) => (
                  <div key={c.id} className="p-4 border border-slate-100 dark:border-slate-700 rounded-lg flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{c.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{c.description}</p>
                      <p className="text-xs text-slate-400 mt-1">Category: {c.category} • Status: <span className="font-semibold text-teal-600">{c.status}</span></p>
                    </div>
                    <span className="text-xl font-bold text-teal-600">+{c.points} pts</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-teal-100 dark:border-slate-700 h-fit">
          <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Leaderboard</h2>
          <div className="space-y-3">
             {[
               { name: "Alice Smith", points: 1400 },
               { name: "Bob Johnson", points: 1200 },
               { name: "Carol Davis", points: 900 }
             ].map((usr, i) => (
               <div key={i} className="flex justify-between items-center text-sm">
                 <span className="text-slate-700 dark:text-slate-300">{i + 1}. {usr.name}</span>
                 <span className="font-bold text-orange-600">{usr.points} pts</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
