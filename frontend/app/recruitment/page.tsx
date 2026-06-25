"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client";
import { GET_JOB_POSTINGS } from "../../graphql/queries/recruitment";
import { CREATE_JOB_POSTING } from "../../graphql/mutation/recruitment";

export default function RecruitmentPage() {
  const { data, loading, error, refetch } = useQuery(GET_JOB_POSTINGS, {
    variables: {
      request: {
        pageCriteria: { enablePage: true, pageSize: 20, skip: 0 }
      }
    }
  });

  const [createJobPosting] = useMutation(CREATE_JOB_POSTING);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [location, setLocation] = useState("Remote");
  const [statusMsg, setStatusMsg] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const jobPostings = data?.jobPostings?.items || [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !location) {
      setStatusMsg("Please fill out all fields.");
      return;
    }
    try {
      const res = await createJobPosting({
        variables: {
          request: {
            title,
            description,
            department,
            location
          }
        }
      });
      if (res.data?.createJobPosting) {
        setStatusMsg("Job posting created successfully!");
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-4">Recruitment Workspace</h1>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-semibold text-sm"
        >
          {isFormOpen ? "Close Form" : "Create Job Posting"}
        </button>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          {/* Form */}
          {isFormOpen && (
            <form onSubmit={handleCreate} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-teal-100 dark:border-slate-700 space-y-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Create New Job Posting</h3>
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
                    placeholder="e.g. Senior frontend Engineer"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 text-sm bg-transparent text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 text-sm bg-transparent text-slate-900 dark:text-white"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Remote, San Francisco"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 text-sm bg-transparent text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Job roles and responsibilities..."
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 text-sm bg-transparent text-slate-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-bold text-sm"
              >
                Publish Job Posting
              </button>
            </form>
          )}

          {/* List */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-teal-100 dark:border-slate-700">
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Open Job Postings</h2>
            
            {loading ? (
              <div className="flex justify-center p-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"></div>
              </div>
            ) : error ? (
              <p className="text-red-500 text-sm">Error: {error.message}</p>
            ) : jobPostings.length === 0 ? (
              <p className="text-slate-500 text-sm dark:text-slate-400">No open jobs found.</p>
            ) : (
              <div className="space-y-4">
                {jobPostings.map((j: any) => (
                  <div key={j.id} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{j.title}</h4>
                        <p className="text-sm text-slate-500">{j.department} • {j.location}</p>
                        <p className="text-xs text-slate-400 mt-2">{j.description}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${j.status === "Active" ? "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300" : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300"}`}>
                        {j.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-teal-100 dark:border-slate-700 h-fit">
          <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Candidate Pipeline</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">Manage your hiring workflow here.</p>
          <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-100 dark:border-orange-900/30">
            <span className="text-sm font-semibold text-orange-800 dark:text-orange-300">Pending Review</span>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Hiring managers can access applications directly from candidate tracking system integrations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
