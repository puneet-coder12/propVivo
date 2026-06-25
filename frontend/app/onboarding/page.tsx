"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ONBOARDING_TASKS } from "../../graphql/queries/onboarding";
import { CREATE_ONBOARDING_TASK } from "../../graphql/mutation/onboarding";

export default function OnboardingPage() {
  const { data, loading, error, refetch } = useQuery(GET_ONBOARDING_TASKS, {
    variables: {
      request: {
        pageCriteria: { enablePage: true, pageSize: 100, skip: 0 }
      }
    }
  });

  const [createOnboardingTask] = useMutation(CREATE_ONBOARDING_TASK);

  // Form State
  const [title, setTitle] = useState("");
  const [phase, setPhase] = useState("Pre-joining");
  const [statusMsg, setStatusMsg] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const tasks = data?.onboardingTasks?.items || [];

  // Group tasks by phase
  const groupedTasks: Record<string, any[]> = {
    "Pre-joining": [],
    "Day 1": [],
    "Week 1": [],
    "Month 1": []
  };

  tasks.forEach((t: any) => {
    const phaseKey = t.phase || "Pre-joining";
    if (!groupedTasks[phaseKey]) {
      groupedTasks[phaseKey] = [];
    }
    groupedTasks[phaseKey].push(t);
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setStatusMsg("Please specify a task title.");
      return;
    }
    try {
      const res = await createOnboardingTask({
        variables: {
          request: {
            title,
            phase,
            userId: "EMP-001" // Default or logged in user context
          }
        }
      });
      if (res.data?.createOnboardingTask) {
        setStatusMsg("Onboarding task logged successfully!");
        setTitle("");
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-4">Onboarding Journey</h1>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-semibold text-sm"
        >
          {isFormOpen ? "Close Form" : "Create Task"}
        </button>
      </header>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Form */}
        {isFormOpen && (
          <form onSubmit={handleCreate} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-teal-100 dark:border-slate-700 space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Create Onboarding Task</h3>
            {statusMsg && (
              <p className={`text-sm ${statusMsg.includes("Error") || statusMsg.includes("Please") ? "text-red-500" : "text-green-500"}`}>{statusMsg}</p>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Task Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sign IT Policy form"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 text-sm bg-transparent text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Onboarding Phase</label>
                <select
                  value={phase}
                  onChange={(e) => setPhase(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 text-sm bg-transparent text-slate-900 dark:text-white"
                >
                  <option value="Pre-joining">Pre-joining</option>
                  <option value="Day 1">Day 1</option>
                  <option value="Week 1">Week 1</option>
                  <option value="Month 1">Month 1</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-bold text-sm"
            >
              Add Onboarding Task
            </button>
          </form>
        )}

        {/* Progress List */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md border border-teal-100 dark:border-slate-700">
          <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Your Progress</h2>
          
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"></div>
            </div>
          ) : error ? (
            <p className="text-red-500 text-sm">Error: {error.message}</p>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedTasks).map(([phaseName, phaseTasks]) => (
                <div key={phaseName} className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-700 pb-2">{phaseName}</h3>
                  {phaseTasks.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No tasks in this phase.</p>
                  ) : (
                    <div className="space-y-3">
                      {phaseTasks.map((t: any) => (
                        <div key={t.id} className="flex gap-4 items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs border ${t.isCompleted ? "bg-teal-600 text-white border-teal-600" : "bg-teal-50 text-teal-600 border-teal-200 dark:bg-slate-700 dark:border-slate-600"}`}>
                            {t.isCompleted ? "✓" : "○"}
                          </div>
                          <div>
                            <h4 className={`text-sm font-bold text-slate-900 dark:text-white ${t.isCompleted ? "line-through text-slate-400 dark:text-slate-500" : ""}`}>{t.title}</h4>
                            <p className="text-xs text-slate-500">{t.isCompleted ? "Completed" : "In Progress"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
