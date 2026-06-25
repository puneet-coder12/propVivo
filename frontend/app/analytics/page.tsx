"use client";
import React from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_ANALYTICS_REPORTS } from "../../graphql/queries/analytics";

export default function AnalyticsPage() {
  const { data, loading, error } = useQuery(GET_ANALYTICS_REPORTS, {
    variables: {
      request: {
        pageCriteria: { enablePage: true, pageSize: 20, skip: 0 }
      }
    }
  });

  const reports = data?.analyticsReports?.items || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 p-8">
      <header className="mb-8">
        <Link href="/dashboard" className="text-teal-600 hover:text-teal-700 dark:text-teal-400">← Back to Dashboard</Link>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-4">HR Analytics</h1>
      </header>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg">
          Error: {error.message}
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center p-12 bg-white dark:bg-slate-800 rounded-xl border border-teal-100 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400">No generated reports available.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report: any) => {
            let parsedData: any = null;
            try {
              if (report.dataJson) {
                parsedData = JSON.parse(report.dataJson);
              }
            } catch (e) {
              parsedData = { raw: report.dataJson };
            }

            return (
              <div key={report.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-teal-100 dark:border-slate-700 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300">
                        {report.category || "General"}
                      </span>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white mt-2">{report.title}</h3>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700 mb-4 max-h-40 overflow-y-auto">
                    {parsedData ? (
                      <div className="space-y-2 text-xs font-mono text-slate-700 dark:text-slate-300">
                        {Object.entries(parsedData).map(([key, val]: [string, any]) => (
                          <div key={key} className="flex justify-between">
                            <span className="font-medium text-slate-500">{key}:</span>
                            <span className="font-semibold">{typeof val === 'object' ? JSON.stringify(val) : String(val)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">No structured data found.</p>
                    )}
                  </div>
                </div>
                
                <p className="text-xs text-slate-400 mt-2">
                  Generated: {new Date(report.generatedDate).toLocaleDateString()}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
