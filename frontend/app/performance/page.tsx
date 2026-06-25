"use client";
import React from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_GOALS } from "../../graphql/queries/performance";

export default function PerformancePage() {
  const { data, loading, error } = useQuery(GET_GOALS, {
    variables: {
      request: {
        pageCriteria: { enablePage: true, pageSize: 20, skip: 0 }
      }
    }
  });

  const goals = data?.goals?.items || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 p-8">
      <header className="mb-8">
        <Link href="/dashboard" className="text-teal-600 hover:text-teal-700 dark:text-teal-400">← Back to Dashboard</Link>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-4">Performance & Goals</h1>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-teal-100 dark:border-slate-700">
          <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Active Goals</h2>
          
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"></div>
            </div>
          ) : error ? (
            <p className="text-red-500 text-sm">Error: {error.message}</p>
          ) : goals.length === 0 ? (
            <p className="text-slate-500 text-sm dark:text-slate-400">No active goals found.</p>
          ) : (
            <div className="space-y-4">
              {goals.map((goal: any) => {
                const progress = goal.targetValue
                  ? Math.round((goal.currentValue / goal.targetValue) * 100)
                  : 0;
                return (
                  <div key={goal.id} className="p-4 bg-teal-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-slate-900 dark:text-white">{goal.title}</span>
                      <span className="text-sm text-teal-600 dark:text-teal-400">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-2">
                      <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>Category: {goal.category}</span>
                      <span>Weight: {goal.weight}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-orange-100 dark:border-slate-700">
          <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Performance Reviews</h2>
          <p className="text-slate-600 dark:text-slate-400">Next review scheduled for Q3 2026.</p>
        </div>
      </div>
    </div>
  );
}
