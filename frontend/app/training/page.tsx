"use client";
import React from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_TRAINING_MODULES } from "../../graphql/queries/training";

export default function TrainingPage() {
  const { data, loading, error } = useQuery(GET_TRAINING_MODULES, {
    variables: {
      request: {
        pageCriteria: { enablePage: true, pageSize: 50, skip: 0 }
      }
    }
  });

  const modules = data?.trainingModules?.items || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 p-8">
      <header className="mb-8">
        <Link href="/dashboard" className="text-teal-600 hover:text-teal-700 dark:text-teal-400">← Back to Dashboard</Link>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-4">Training & Learning</h1>
      </header>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg">
          Error: {error.message}
        </div>
      ) : modules.length === 0 ? (
        <div className="text-center p-12 bg-white dark:bg-slate-800 rounded-xl border border-teal-100 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400">No training modules available.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {modules.map((m: any) => (
            <div key={m.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-teal-100 dark:border-slate-700 flex flex-col justify-between">
              <div>
                <div className="h-32 bg-gradient-to-br from-teal-100 to-orange-100 dark:from-slate-700 dark:to-slate-600 rounded-lg mb-4 flex flex-col items-center justify-center p-4 text-center">
                  <span className="text-teal-800 dark:text-teal-300 font-bold text-lg">{m.category || "General"}</span>
                  {m.isMandatory && (
                    <span className="mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                      Mandatory
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{m.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{m.description}</p>
              </div>
              <a 
                href={m.contentUrl || "#"} 
                target="_blank" 
                rel="noreferrer"
                className="w-full text-center bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors block text-sm font-semibold"
              >
                Start Learning
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
