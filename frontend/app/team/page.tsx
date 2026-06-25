'use client';

import { ColumnDef } from "@tanstack/react-table";
import { DataTable, FilterConfig } from "../../components/table/DataTable";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_EMPLOYEES } from "../../graphql/queries/team";
import { CREATE_EMPLOYEE, UPDATE_EMPLOYEE, DELETE_EMPLOYEE } from "../../graphql/mutation/team";

type TeamMember = {
  id: string;
  employeeId: string;
  name: string;
  firstName: string;
  lastName: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  status: string;
  joinDate: string;
  role: string;
  country: string;
};

export default function TeamPage() {
  // Query
  const { data: queryData, loading, error, refetch } = useQuery(GET_ALL_EMPLOYEES, {
    variables: {
      request: {
        pageCriteria: { enablePage: true, pageSize: 100, skip: 0 }
      }
    }
  });

  // Mutations
  const [createEmployee] = useMutation(CREATE_EMPLOYEE);
  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE);
  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE);

  // Modals & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    designation: "",
    department: "Engineering",
    dateOfJoining: new Date().toISOString().split("T")[0],
    role: "Employee",
    status: "Active",
    country: "US"
  });

  // Map backend query data to TeamMember structure
  const data = useMemo(() => {
    if (!queryData?.getAllEmployees?.data?.employees) return [];
    return queryData.getAllEmployees.data.employees.map((emp: any) => ({
      id: emp.id,
      employeeId: emp.employeeId || "",
      name: `${emp.firstName} ${emp.lastName}`,
      firstName: emp.firstName || "",
      lastName: emp.lastName || "",
      designation: emp.designation || "Employee",
      department: emp.department || "General",
      email: emp.email || "",
      phone: emp.phone || "",
      status: emp.status || "Active",
      joinDate: emp.dateOfJoining ? emp.dateOfJoining.split("T")[0] : "",
      role: emp.role || "Employee",
      country: emp.country || "US"
    }));
  }, [queryData]);

  // Open modal for add
  const handleAddClick = () => {
    setEditingMember(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      designation: "",
      department: "Engineering",
      dateOfJoining: new Date().toISOString().split("T")[0],
      role: "Employee",
      status: "Active",
      country: "US"
    });
    setErrorMessage("");
    setSuccessMessage("");
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleEditClick = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone,
      designation: member.designation,
      department: member.department,
      dateOfJoining: member.joinDate,
      role: member.role,
      status: member.status,
      country: member.country
    });
    setErrorMessage("");
    setSuccessMessage("");
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDeleteClick = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      const res = await deleteEmployee({
        variables: {
          request: {
            requestParam: {
              employeeId: id
            }
          }
        }
      });
      if (res.data?.deleteEmployee?.success) {
        refetch();
        alert(`${name} was deleted successfully.`);
      } else {
        alert(res.data?.deleteEmployee?.message || "Failed to delete employee");
      }
    } catch (err: any) {
      alert(`Error deleting employee: ${err.message}`);
    }
  };

  // Form Submit (Add/Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.firstName || !formData.lastName || !formData.email) {
      setErrorMessage("First Name, Last Name and Email are required fields.");
      return;
    }

    const isoDateOfJoining = formData.dateOfJoining
      ? new Date(formData.dateOfJoining).toISOString()
      : null;

    try {
      if (editingMember) {
        // Edit Mode
        const res = await updateEmployee({
          variables: {
            request: {
              requestParam: {
                employeeId: editingMember.id,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                designation: formData.designation,
                department: formData.department,
                dateOfJoining: isoDateOfJoining,
                role: formData.role,
                status: formData.status,
                country: formData.country
              }
            }
          }
        });
        if (res.data?.updateEmployee?.success) {
          setSuccessMessage("Employee updated successfully!");
          refetch();
          setTimeout(() => setIsModalOpen(false), 800);
        } else {
          setErrorMessage(res.data?.updateEmployee?.message || "Failed to update employee");
        }
      } else {
        // Add Mode
        const res = await createEmployee({
          variables: {
            request: {
              requestParam: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                designation: formData.designation,
                department: formData.department,
                dateOfJoining: isoDateOfJoining,
                role: formData.role,
                status: formData.status,
                country: formData.country
              }
            }
          }
        });
        if (res.data?.createEmployee?.success) {
          setSuccessMessage("Employee created successfully!");
          refetch();
          setTimeout(() => setIsModalOpen(false), 800);
        } else {
          setErrorMessage(res.data?.createEmployee?.message || "Failed to create employee");
        }
      }
    } catch (err: any) {
      setErrorMessage(`Network or GraphQL Error: ${err.message}`);
    }
  };

  // Define Columns for the Data Table
  const columns = useMemo<ColumnDef<TeamMember>[]>(() => [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const name = row.original.name;
        return (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
              <span className="text-xs font-bold text-teal-700">
                {name.split(" ").map((n) => n[0]).join("")}
              </span>
            </div>
            <span className="font-medium">{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "designation",
      header: "Designation",
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ getValue }) => {
        const dept = getValue<string>();
        return (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium dark:bg-slate-700">
            {dept}
          </span>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ getValue }) => {
        const email = getValue<string>();
        return <span className="text-sm text-slate-600 dark:text-slate-400">{email}</span>;
      },
    },
    {
      accessorKey: "joinDate",
      header: "Join Date",
      cell: ({ getValue }) => {
        const dateStr = getValue<string>();
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return <span className="tabular-nums">{date.toLocaleDateString()}</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue<string>().toLowerCase();
        const colors: Record<string, string> = {
          active: "bg-green-100 text-green-800",
          inactive: "bg-gray-100 text-gray-800",
          onboarding: "bg-blue-100 text-blue-800",
          exit: "bg-red-100 text-red-800"
        };
        const colorClass = colors[status] || "bg-yellow-100 text-yellow-800";
        return (
          <span className={`rounded px-2 py-0.5 text-xs font-medium ${colorClass}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const member = row.original;
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleEditClick(member)}
              className="text-sm font-semibold text-teal-600 hover:text-teal-900 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteClick(member.id, member.name)}
              className="text-sm font-semibold text-red-600 hover:text-red-900 transition-colors"
            >
              Delete
            </button>
          </div>
        );
      }
    }
  ], []);

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const total = data.length;
    const active = data.filter((e) => e.status.toLowerCase() === "active").length;
    const onboarding = data.filter((e) => e.status.toLowerCase() === "onboarding").length;
    const inactive = data.filter((e) => e.status.toLowerCase() === "inactive").length;
    return { total, active, onboarding, inactive };
  }, [data]);

  const filters: FilterConfig = [
    { type: "search", placeholder: "Search team members..." },
    {
      type: "checkboxGroup",
      columnId: "department",
      label: "Department",
      options: [
        { label: "Engineering", value: "Engineering" },
        { label: "Product", value: "Product" },
        { label: "Design", value: "Design" },
        { label: "Analytics", value: "Analytics" },
        { label: "HR", value: "HR" },
      ],
    },
    {
      type: "checkboxGroup",
      columnId: "status",
      label: "Status",
      options: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
        { label: "Onboarding", value: "Onboarding" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 text-slate-800 dark:text-slate-100">
      {/* Header */}
      <header className="border-b border-teal-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/dashboard" className="text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400">
                ← Back to Dashboard
              </Link>
              <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                Team Management
              </h1>
            </div>
            <button
              onClick={handleAddClick}
              className="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 font-semibold shadow-md transition-all"
            >
              Add Team Member
            </button>
          </div>
        </div>
      </header>

      {/* Team Summary */}
      <div className="border-b border-teal-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            Team Overview
          </h2>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: "Total Members", count: summaryMetrics.total, color: "bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-100 dark:border-blue-900" },
              { label: "Active", count: summaryMetrics.active, color: "bg-green-50 text-green-800 dark:bg-green-950/40 dark:text-green-300 border border-green-100 dark:border-green-900" },
              { label: "Onboarding", count: summaryMetrics.onboarding, color: "bg-yellow-50 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300 border border-yellow-100 dark:border-yellow-900" },
              { label: "Inactive", count: summaryMetrics.inactive, color: "bg-gray-50 text-gray-800 dark:bg-gray-950/40 dark:text-gray-300 border border-gray-100 dark:border-gray-900" },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-xl p-4 shadow-sm ${item.color}`}
              >
                <p className="text-sm font-medium">{item.label}</p>
                <p className="mt-2 text-2xl font-bold">{item.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 p-4 text-red-800 dark:text-red-300">
            Error loading team: {error.message}
          </div>
        ) : (
          <DataTable<TeamMember>
            data={data}
            columns={columns}
            pageSizeOptions={[10, 20, 50]}
            initialPageSize={10}
            filters={filters}
            className="rounded-xl bg-white dark:bg-slate-800 p-6 shadow-md border border-slate-100 dark:border-slate-700"
          />
        )}
      </main>

      {/* Add / Edit Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-teal-100 dark:border-slate-700 transition-all max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingMember ? `Edit: ${editingMember.name}` : "Add New Team Member"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3 text-sm text-red-800 dark:text-red-300">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 p-3 text-sm text-green-800 dark:text-green-300">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                    <option value="Analytics">Analytics</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Date of Joining
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfJoining}
                    onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Employee">Employee</option>
                    <option value="Manager">Manager</option>
                    <option value="HR">HR</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Exit">Exit</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-55 dark:hover:bg-slate-700 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-semibold"
                >
                  {editingMember ? "Save Changes" : "Create Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
