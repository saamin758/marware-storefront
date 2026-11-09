"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getStaffUsers,
  createStaffUser,
  updateStaffUser,
  deleteStaffUser,
} from "@/services/api/admin";
import { formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
  Users,
  ShieldCheck,
  Crown,
  Shield,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  UserCheck,
  X,
  KeyRound,
  Sparkles,
} from "lucide-react";

export default function AdminStaffPage() {
  const { user: currentUser, isSuperAdmin, login } = useAuth();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Form state for creating new staff
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "admin",
    permissions: ["manage_catalog", "manage_orders", "view_reports"],
  });

  const availablePermissions = [
    { id: "manage_catalog", label: "Catalog & Products (Create, Edit, Inventory)" },
    { id: "manage_orders", label: "Order Fulfillment (Process Status, Packing)" },
    { id: "view_reports", label: "Sales & Performance Reports" },
    { id: "manage_staff", label: "Staff & User Governance (Super Admin Feature)" },
    { id: "manage_settings", label: "Store Configuration & Logistics (Super Admin Feature)" },
  ];

  const loadStaff = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const data = await getStaffUsers();
      setStaffList(data);
    } catch (err) {
      setErrorMsg(err.message || "Failed to load staff list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleRoleChange = (selectedRole) => {
    let perms = [];
    if (selectedRole === "super_admin") {
      perms = [
        "all",
        "manage_staff",
        "manage_catalog",
        "manage_orders",
        "manage_settings",
        "view_reports",
      ];
    } else {
      perms = ["manage_catalog", "manage_orders", "view_reports"];
    }
    setFormData({
      ...formData,
      role: selectedRole,
      permissions: perms,
    });
  };

  const handlePermissionToggle = (permId) => {
    const exists = formData.permissions.includes(permId);
    let updated;
    if (exists) {
      updated = formData.permissions.filter((p) => p !== permId && p !== "all");
    } else {
      updated = [...formData.permissions, permId];
    }
    setFormData({ ...formData, permissions: updated });
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      setErrorMsg("Please provide both name and email.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);
      await createStaffUser(formData);
      setSuccessMsg(`Account for ${formData.fullName} created as ${formData.role === "super_admin" ? "Super Admin" : "Admin"}!`);
      setModalOpen(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        role: "admin",
        permissions: ["manage_catalog", "manage_orders", "view_reports"],
      });
      await loadStaff();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setErrorMsg(err.message || "Failed to create administrator account.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (staffMember) => {
    if (!isSuperAdmin) {
      setErrorMsg("Action Denied: Only Super Administrators can alter staff account status.");
      setTimeout(() => setErrorMsg(null), 3500);
      return;
    }
    try {
      setErrorMsg(null);
      await updateStaffUser(staffMember.id, {
        isActive: !staffMember.isActive,
      });
      setSuccessMsg(`Status for ${staffMember.fullName} updated to ${!staffMember.isActive ? "Active" : "Suspended"}.`);
      await loadStaff();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      setErrorMsg(err.message || "Unable to update status.");
      setTimeout(() => setErrorMsg(null), 3500);
    }
  };

  const handleDeleteStaff = async (staffMember) => {
    if (!isSuperAdmin) {
      setErrorMsg("Action Denied: Only Super Administrators can delete staff accounts.");
      setTimeout(() => setErrorMsg(null), 3500);
      return;
    }
    if (staffMember.id === currentUser?.id) {
      setErrorMsg("Security Violation: You cannot delete your own logged-in account.");
      setTimeout(() => setErrorMsg(null), 3500);
      return;
    }

    const confirmMsg = `Are you sure you want to delete ${staffMember.fullName} (${staffMember.role})? This action cannot be undone.`;
    if (!confirm(confirmMsg)) return;

    try {
      setErrorMsg(null);
      await deleteStaffUser(staffMember.id);
      setSuccessMsg(`Account ${staffMember.fullName} has been removed.`);
      await loadStaff();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      setErrorMsg(err.message || "Could not delete account.");
      setTimeout(() => setErrorMsg(null), 3500);
    }
  };

  const switchToSuperAdmin = async () => {
    try {
      setLoading(true);
      await login("superadmin@ecstasy.local", "superadmin123");
      setSuccessMsg("Logged in as Sultan Mahmud (Super Admin). Full permissions activated!");
      await loadStaff();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const totalSuperAdmins = staffList.filter((s) => s.role === "super_admin").length;
  const totalAdmins = staffList.filter((s) => s.role === "admin").length;
  const activeStaff = staffList.filter((s) => s.isActive).length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-hairline gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-micro font-bold text-sale">
              Role-Based Access Control (RBAC)
            </span>
            <span className="text-muted text-xs">•</span>
            <span className="text-[10px] uppercase tracking-micro text-muted">
              Team Governance
            </span>
          </div>
          <h1 className="font-editorial text-3xl font-bold text-ink">
            Staff & Administrators
          </h1>
          <p className="text-muted text-xs uppercase tracking-micro mt-1">
            Manage administrative hierarchy, role assignments & system permissions
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isSuperAdmin ? (
            <Button
              size="sm"
              onClick={() => {
                setErrorMsg(null);
                setModalOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus size={14} /> Add Administrator
            </Button>
          ) : (
            <button
              onClick={switchToSuperAdmin}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber text-surface text-xs uppercase tracking-micro font-medium hover:bg-amber-700 transition-colors"
            >
              <Crown size={14} /> Switch to Super Admin
            </button>
          )}
        </div>
      </div>

      {/* Role Alert / Notice if not Super Admin */}
      {!isSuperAdmin && (
        <div className="mb-8 p-4 bg-amber-light/60 border border-amber/30 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck size={20} className="text-amber flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-micro text-ink">
                Viewing as Store Administrator (Operations)
              </p>
              <p className="text-xs text-muted mt-0.5">
                You have permission to view team members and catalog/orders. Adding new Admins, promoting to Super Admin, or removing staff accounts requires <strong>Super Administrator</strong> authority.
              </p>
            </div>
          </div>
          <button
            onClick={switchToSuperAdmin}
            className="self-start sm:self-center px-3 py-1.5 bg-ink text-surface text-[11px] uppercase tracking-micro font-medium hover:bg-neutral-800 transition-colors whitespace-nowrap"
          >
            Switch to Super Admin
          </button>
        </div>
      )}

      {/* Notifications */}
      {successMsg && (
        <div className="mb-6 p-4 bg-forest-light border border-forest/30 text-forest text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="mb-6 p-4 bg-destructive-light border border-destructive/30 text-destructive text-xs flex items-center gap-2 font-medium">
          <AlertTriangle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface border border-hairline p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-micro text-muted font-semibold">
              Total Staff
            </span>
            <Users size={18} className="text-ink" />
          </div>
          <p className="font-editorial text-3xl font-bold text-ink tabular-nums">
            {staffList.length}
          </p>
          <span className="text-[10px] text-muted tracking-micro uppercase block mt-1">
            Registered team members
          </span>
        </div>

        <div className="bg-surface border border-hairline p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-micro text-amber font-semibold">
              Super Admins
            </span>
            <Crown size={18} className="text-amber" />
          </div>
          <p className="font-editorial text-3xl font-bold text-ink tabular-nums">
            {totalSuperAdmins}
          </p>
          <span className="text-[10px] text-muted tracking-micro uppercase block mt-1">
            Full root & governance rights
          </span>
        </div>

        <div className="bg-surface border border-hairline p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-micro text-muted font-semibold">
              Operations Admins
            </span>
            <Shield size={18} className="text-ink" />
          </div>
          <p className="font-editorial text-3xl font-bold text-ink tabular-nums">
            {totalAdmins}
          </p>
          <span className="text-[10px] text-muted tracking-micro uppercase block mt-1">
            Catalog & order processing
          </span>
        </div>

        <div className="bg-surface border border-hairline p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-micro text-forest font-semibold">
              Active Accounts
            </span>
            <UserCheck size={18} className="text-forest" />
          </div>
          <p className="font-editorial text-3xl font-bold text-ink tabular-nums">
            {activeStaff}
          </p>
          <span className="text-[10px] text-muted tracking-micro uppercase block mt-1">
            Authorized to sign in
          </span>
        </div>
      </div>

      {/* Staff Directory Table */}
      <div className="bg-surface border border-hairline">
        <div className="p-6 border-b border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xs uppercase tracking-micro font-bold text-ink">
              Staff Directory & Permissions
            </h2>
            <p className="text-[11px] text-muted mt-0.5">
              Authorized users with dashboard access and operational capabilities
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-micro text-muted">
            <span>Filter:</span>
            <span className="font-bold text-ink">All Administrative Roles</span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-muted">
            Loading team roster...
          </div>
        ) : staffList.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted">
            No administrative staff found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-hairline bg-stone/40 text-[10px] uppercase tracking-micro text-muted font-semibold">
                  <th className="py-3 px-6">Member & ID</th>
                  <th className="py-3 px-6">Role Level</th>
                  <th className="py-3 px-6">Assigned Permissions</th>
                  <th className="py-3 px-6">Account Status</th>
                  <th className="py-3 px-6">Joined Date</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline text-xs">
                {staffList.map((member) => {
                  const isSelf = member.id === currentUser?.id;
                  const isMemberSuperAdmin = member.role === "super_admin";

                  return (
                    <tr
                      key={member.id}
                      className={`hover:bg-stone/20 transition-colors ${
                        !member.isActive ? "opacity-60 bg-stone/10" : ""
                      }`}
                    >
                      {/* Name & Contact */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-ink">
                            {member.fullName}
                          </span>
                          {isSelf && (
                            <span className="text-[9px] uppercase tracking-micro bg-ink text-surface px-1.5 py-0.2">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-muted mt-0.5 flex items-center gap-2">
                          <span>{member.email}</span>
                          <span>•</span>
                          <span>{member.phone || "No phone"}</span>
                        </div>
                        <span className="text-[9px] text-muted-light font-mono block mt-0.5">
                          {member.id}
                        </span>
                      </td>

                      {/* Role Level */}
                      <td className="py-4 px-6">
                        {isMemberSuperAdmin ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-micro font-bold bg-amber-light text-amber border border-amber/30">
                            <Crown size={12} /> Super Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-micro font-medium bg-stone text-ink border border-hairline">
                            <Shield size={12} /> Admin
                          </span>
                        )}
                      </td>

                      {/* Permissions Tags */}
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {isMemberSuperAdmin ? (
                            <span className="text-[9px] uppercase tracking-micro px-1.5 py-0.5 bg-ink text-surface font-semibold">
                              Master / All Permissions
                            </span>
                          ) : member.permissions && member.permissions.length > 0 ? (
                            member.permissions.map((p) => (
                              <span
                                key={p}
                                className="text-[9px] uppercase tracking-micro px-1.5 py-0.5 bg-stone border border-hairline text-ink"
                              >
                                {p.replace("manage_", "").replace("_", " ")}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-muted italic">
                              Default Operations
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Account Status */}
                      <td className="py-4 px-6">
                        {member.isActive ? (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-micro text-forest font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-forest"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-micro text-destructive font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>
                            Suspended
                          </span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-6 text-muted text-[11px]">
                        {member.createdAt ? formatDate(member.createdAt) : "Jan 2026"}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        {isSuperAdmin ? (
                          <div className="inline-flex items-center gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(member)}
                              disabled={isSelf}
                              className={`text-[10px] uppercase tracking-micro px-2 py-1 border transition-colors ${
                                isSelf
                                  ? "border-hairline text-muted cursor-not-allowed opacity-40"
                                  : member.isActive
                                  ? "border-amber/40 text-amber hover:bg-amber-light"
                                  : "border-forest/40 text-forest hover:bg-forest-light"
                              }`}
                            >
                              {member.isActive ? "Suspend" : "Activate"}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteStaff(member)}
                              disabled={isSelf}
                              title={isSelf ? "Cannot delete own account" : "Remove account"}
                              className={`p-1.5 transition-colors ${
                                isSelf
                                  ? "text-muted-light cursor-not-allowed opacity-40"
                                  : "text-muted hover:text-destructive"
                              }`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] uppercase tracking-micro text-muted-light italic">
                            Super Admin Only
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Creation Modal for Super Admin */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-hairline w-full max-w-lg p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 text-muted hover:text-ink transition-colors"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <span className="text-[10px] uppercase tracking-micro font-bold text-sale block mb-1">
                Executive Staff Provisioning
              </span>
              <h2 className="font-editorial text-2xl font-bold text-ink">
                Add New Administrator
              </h2>
              <p className="text-muted text-xs uppercase tracking-micro mt-1">
                Assign role privileges and operational capabilities
              </p>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-[10px] uppercase tracking-micro font-semibold text-ink mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahfuzur Rahman"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full h-11 px-3 text-xs border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-micro font-semibold text-ink mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="staff@ecstasy.local"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full h-11 px-3 text-xs border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-micro font-semibold text-ink mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+8801700000000"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full h-11 px-3 text-xs border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink"
                  />
                </div>
              </div>

              {/* Initial Password */}
              <div>
                <label className="block text-[10px] uppercase tracking-micro font-semibold text-ink mb-1">
                  Temporary Password
                </label>
                <input
                  type="text"
                  placeholder="e.g. Admin1234! (or defaults to 'password')"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full h-11 px-3 text-xs border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink"
                />
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-[10px] uppercase tracking-micro font-semibold text-ink mb-2">
                  Select Administrative Role *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => handleRoleChange("admin")}
                    className={`p-3 border cursor-pointer transition-all ${
                      formData.role === "admin"
                        ? "border-ink bg-stone/50 ring-1 ring-ink"
                        : "border-hairline bg-surface hover:border-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Shield size={14} className="text-ink" />
                      <span className="text-xs font-bold uppercase tracking-micro text-ink">
                        Store Admin
                      </span>
                    </div>
                    <p className="text-[10px] text-muted leading-relaxed">
                      Operations level: Catalog products, stock adjustments, and order processing.
                    </p>
                  </div>

                  <div
                    onClick={() => handleRoleChange("super_admin")}
                    className={`p-3 border cursor-pointer transition-all ${
                      formData.role === "super_admin"
                        ? "border-amber bg-amber-light/40 ring-1 ring-amber"
                        : "border-hairline bg-surface hover:border-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Crown size={14} className="text-amber" />
                      <span className="text-xs font-bold uppercase tracking-micro text-ink">
                        Super Admin
                      </span>
                    </div>
                    <p className="text-[10px] text-muted leading-relaxed">
                      Executive level: Master control, manage other admins, change store settings & security.
                    </p>
                  </div>
                </div>
              </div>

              {/* Granular Permissions Checklist */}
              <div>
                <label className="block text-[10px] uppercase tracking-micro font-semibold text-ink mb-1.5">
                  Permissions Checklist
                </label>
                <div className="border border-hairline p-3 bg-stone/20 space-y-2 max-h-40 overflow-y-auto">
                  {availablePermissions.map((perm) => {
                    const checked =
                      formData.role === "super_admin" ||
                      formData.permissions.includes(perm.id);
                    const disabled = formData.role === "super_admin";

                    return (
                      <label
                        key={perm.id}
                        className={`flex items-start gap-2 text-xs select-none ${
                          disabled ? "opacity-75 cursor-default" : "cursor-pointer"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={disabled}
                          onChange={() => handlePermissionToggle(perm.id)}
                          className="mt-0.5 accent-ink"
                        />
                        <span className="text-[11px] text-ink">{perm.label}</span>
                      </label>
                    );
                  })}
                </div>
                {formData.role === "super_admin" && (
                  <p className="text-[10px] text-amber mt-1 flex items-center gap-1 font-medium">
                    <Sparkles size={11} /> Super Administrators automatically inherit all platform permissions.
                  </p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-hairline mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  loading={submitting}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 size={14} /> Create Staff Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

