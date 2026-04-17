import { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminGuard from "@/components/AdminGuard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";

type ContactSubmission = {
  id: string;
  display_id: number;
  name: string;
  email: string;
  phone: string | null;
  interest: string;
  message: string;
  status: string;
  notes: string | null;
  created_at: string;
};

type AuditEntry = {
  id: string;
  created_at: string;
  action: string;
  target_table: string;
  target_id: string | null;
  details: Record<string, unknown> | null;
};

const INQUIRY_STATUSES = ["new", "pending", "contacted", "scheduled"] as const;

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  new: { label: "New", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300", dot: "bg-blue-500" },
  pending: { label: "Pending", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300", dot: "bg-amber-500" },
  contacted: { label: "Contacted", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300", dot: "bg-yellow-500" },
  scheduled: { label: "Scheduled", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300", dot: "bg-green-500" },
};

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = statusConfig[status] || statusConfig.new;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

const buildGoogleCalendarUrl = (name: string, email: string, phone: string | null, message: string) => {
  const title = encodeURIComponent(`Adept Healing — ${name}`);
  const details = encodeURIComponent(`Inquirer: ${name}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ""}\nReason: ${message}`);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;
};

const AdminDashboard = () => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [editContact, setEditContact] = useState<Partial<ContactSubmission>>({});
  const [savingFields, setSavingFields] = useState(false);
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    const [contactRes, auditRes] = await Promise.all([
      supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("audit_log").select("*").order("created_at", { ascending: false }).limit(200),
    ]);
    if (contactRes.data) setContacts(contactRes.data as unknown as ContactSubmission[]);
    if (auditRes.data) setAuditLog(auditRes.data as AuditEntry[]);
  };

  useEffect(() => { fetchData(); }, []);

  const logAction = async (action: string, targetTable: string, targetId: string, details: Record<string, unknown> = {}) => {
    await supabase.rpc("create_audit_entry", {
      _action: action,
      _target_table: targetTable,
      _target_id: targetId,
      _details: details,
    } as never);
  };

  const filteredContacts = useMemo(() => {
    let list = contacts;
    if (statusFilter !== "all") list = list.filter(c => c.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.message.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q)) ||
        String(c.display_id).includes(q)
      );
    }
    return list;
  }, [contacts, statusFilter, search]);

  const updateContactStatus = async (id: string, status: string) => {
    const prev = contacts.find(c => c.id === id)?.status;
    await supabase.from("contact_submissions").update({ status }).eq("id", id);
    await logAction("status_change", "contact_submissions", id, { from: prev, to: status });
    fetchData();
    if (selectedContact?.id === id) setSelectedContact({ ...selectedContact, status });
  };

  const openContact = async (c: ContactSubmission) => {
    setSelectedContact(c);
    setEditContact({ ...c });
    setEditNotes(c.notes || "");
    setConfirmDelete(null);
    if (c.status === "new") {
      await updateContactStatus(c.id, "pending");
    }
  };

  const saveContactFields = async () => {
    if (!selectedContact) return;
    setSavingFields(true);
    const updates: Record<string, unknown> = {};
    const fields: (keyof ContactSubmission)[] = ["name", "email", "phone", "message"];
    fields.forEach(f => {
      if (editContact[f] !== undefined && editContact[f] !== selectedContact[f]) {
        updates[f] = editContact[f] || null;
      }
    });
    if (Object.keys(updates).length > 0) {
      await supabase.from("contact_submissions").update(updates).eq("id", selectedContact.id);
      await logAction("inquiry_updated", "contact_submissions", selectedContact.id, { fields: Object.keys(updates) });
      await fetchData();
      setSelectedContact({ ...selectedContact, ...updates } as ContactSubmission);
    }
    setSavingFields(false);
  };

  const saveNotes = async (id: string) => {
    setSaving(true);
    await supabase.from("contact_submissions").update({ notes: editNotes }).eq("id", id);
    await logAction("notes_updated", "contact_submissions", id, { notes_preview: editNotes.slice(0, 100) });
    await fetchData();
    setSaving(false);
  };

  const deleteRecord = async (id: string) => {
    setDeleting(true);
    const record = contacts.find(c => c.id === id);
    await logAction("deleted", "contact_submissions", id, { name: record?.name, email: record?.email });
    await supabase.from("contact_submissions").delete().eq("id", id);
    setSelectedContact(null);
    setConfirmDelete(null);
    setDeleting(false);
    fetchData();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (newPassword.length < 12) { setPasswordMsg({ type: "error", text: "Password must be at least 12 characters." }); return; }
    if (!/[A-Z]/.test(newPassword)) { setPasswordMsg({ type: "error", text: "Password must include an uppercase letter." }); return; }
    if (!/[a-z]/.test(newPassword)) { setPasswordMsg({ type: "error", text: "Password must include a lowercase letter." }); return; }
    if (!/[0-9]/.test(newPassword)) { setPasswordMsg({ type: "error", text: "Password must include a number." }); return; }
    if (!/[^A-Za-z0-9]/.test(newPassword)) { setPasswordMsg({ type: "error", text: "Password must include a symbol (e.g. !@#$%)." }); return; }
    if (newPassword !== confirmPassword) { setPasswordMsg({ type: "error", text: "Passwords do not match." }); return; }
    setChangingPassword(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) { setPasswordMsg({ type: "error", text: "Unable to verify identity." }); return; }
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: user.email, password: currentPassword });
      if (signInError) { setPasswordMsg({ type: "error", text: "Current password is incorrect." }); setChangingPassword(false); return; }
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) { setPasswordMsg({ type: "error", text: error.message }); } else {
        setPasswordMsg({ type: "success", text: "Password updated successfully." });
        await logAction("password_changed", "auth", user.id, {});
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      }
    } catch { setPasswordMsg({ type: "error", text: "An unexpected error occurred." }); }
    finally { setChangingPassword(false); }
  };

  const countByStatus = (items: { status: string }[]) => {
    const counts: Record<string, number> = {};
    INQUIRY_STATUSES.forEach(s => counts[s] = 0);
    items.forEach(i => { counts[i.status] = (counts[i.status] || 0) + 1; });
    return counts;
  };

  const counts = countByStatus(contacts);
  const actionNeeded = counts.new;

  const actionLabels: Record<string, string> = {
    status_change: "Status Changed",
    notes_updated: "Notes Updated",
    deleted: "Inquiry Deleted",
    password_changed: "Password Changed",
    inquiry_updated: "Inquiry Updated",
  };

  return (
    <AdminGuard>
      <Helmet>
        <title>Admin Dashboard | Adept Healing</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-muted/30">
        <header className="bg-background border-b border-border px-4 sm:px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold text-base">A</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Inquiry Manager</h1>
                <p className="text-xs text-muted-foreground">Adept Healing Admin</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <a href="/" className="text-primary hover:text-primary/80 transition-colors">← Site</a>
              <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors">
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total", value: contacts.length, accent: false },
              { label: "New", value: actionNeeded, accent: actionNeeded > 0 },
              { label: "Pending", value: counts.pending, accent: false },
              { label: "Scheduled", value: counts.scheduled, accent: false },
            ].map((stat) => (
              <div key={stat.label} className="bg-background rounded-lg p-4 shadow-sm">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-semibold ${stat.accent ? "text-primary" : "text-foreground"}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <Input
              placeholder="Search by name, email, phone, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sm:max-w-xs"
            />
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setStatusFilter("all")}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                  statusFilter === "all" ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                All
              </button>
              {INQUIRY_STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                    statusFilter === s ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {statusConfig[s].label}
                </button>
              ))}
            </div>
          </div>

          <Tabs defaultValue="inquiries" className="space-y-4">
            <TabsList className="bg-background">
              <TabsTrigger value="inquiries" className="gap-2">
                Inquiries
                {counts.new > 0 && <Badge variant="destructive" className="text-xs px-1.5 py-0">{counts.new}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="audit">Audit Log</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="inquiries">
              <div className="space-y-2">
                {filteredContacts.length === 0 ? (
                  <div className="bg-background rounded-lg p-8 text-center text-muted-foreground text-sm">
                    {search || statusFilter !== "all" ? "No results match your filters." : "No inquiries yet."}
                  </div>
                ) : (
                  filteredContacts.map(c => (
                    <div
                      key={c.id}
                      onClick={() => openContact(c)}
                      className="bg-background rounded-lg p-4 shadow-sm cursor-pointer transition-all hover:shadow-md border-l-4 border-l-transparent hover:border-l-primary"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground">INQ-{c.display_id}</span>
                            <p className="font-medium text-foreground truncate">{c.name}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{c.email}{c.phone ? ` · ${c.phone}` : ""}</p>
                        </div>
                        <StatusBadge status={c.status} />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{c.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-muted-foreground">{format(new Date(c.created_at), "MMM d, yyyy h:mm a")}</p>
                        {c.notes && <span className="text-xs text-muted-foreground">📝 Has notes</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <Dialog open={!!selectedContact} onOpenChange={(open) => { if (!open) setSelectedContact(null); }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  {selectedContact && (
                    <>
                      <DialogHeader>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">INQ-{selectedContact.display_id}</span>
                          <DialogTitle className="text-xl">{selectedContact.name}</DialogTitle>
                        </div>
                      </DialogHeader>

                      <div className="space-y-5 mt-2">
                        <div className="grid sm:grid-cols-2 gap-x-4 gap-y-3">
                          <div>
                            <label className="text-xs font-medium text-muted-foreground block mb-1">Name</label>
                            <Input value={editContact.name || ""} onChange={e => setEditContact({ ...editContact, name: e.target.value })} />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground block mb-1">Email</label>
                            <Input type="email" value={editContact.email || ""} onChange={e => setEditContact({ ...editContact, email: e.target.value })} />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground block mb-1">Phone</label>
                            <Input value={editContact.phone || ""} onChange={e => setEditContact({ ...editContact, phone: e.target.value })} />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground block mb-1">Submitted</label>
                            <p className="text-sm text-foreground py-2">{format(new Date(selectedContact.created_at), "MMM d, yyyy h:mm a")}</p>
                          </div>
                          <div className="sm:col-span-2">
                            <label className="text-xs font-medium text-muted-foreground block mb-1">Reason for Visit</label>
                            <textarea
                              value={editContact.message || ""}
                              onChange={e => setEditContact({ ...editContact, message: e.target.value })}
                              className="w-full min-h-[100px] text-sm border border-input rounded-lg p-2.5 bg-background resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={saveContactFields}
                            disabled={savingFields}
                            className="text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-full hover:opacity-90 disabled:opacity-50"
                          >
                            {savingFields ? "Saving..." : "Save Changes"}
                          </button>
                          <a href={`mailto:${selectedContact.email}`} className="text-sm bg-muted text-foreground px-4 py-1.5 rounded-full hover:bg-muted/80">📧 Email</a>
                          {selectedContact.phone && (
                            <a href={`tel:${selectedContact.phone}`} className="text-sm bg-muted text-foreground px-4 py-1.5 rounded-full hover:bg-muted/80">📞 Call</a>
                          )}
                          <a
                            href={buildGoogleCalendarUrl(selectedContact.name, selectedContact.email, selectedContact.phone, selectedContact.message)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm bg-muted text-foreground px-4 py-1.5 rounded-full hover:bg-muted/80"
                          >
                            📅 Schedule
                          </a>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-foreground mb-2">Status</p>
                          <div className="flex flex-wrap gap-1.5">
                            {INQUIRY_STATUSES.map(s => (
                              <button
                                key={s}
                                onClick={() => updateContactStatus(selectedContact.id, s)}
                                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                                  selectedContact.status === s
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                              >
                                {statusConfig[s]?.label || s}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-foreground mb-1">Internal Notes</p>
                          <textarea
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            className="w-full h-28 text-sm border border-input rounded-lg p-2.5 bg-background resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            placeholder="Add notes about this inquiry..."
                          />
                          <button
                            onClick={() => saveNotes(selectedContact.id)}
                            disabled={saving}
                            className="mt-2 text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-full hover:opacity-90 disabled:opacity-50"
                          >
                            {saving ? "Saving..." : "Save Notes"}
                          </button>
                        </div>

                        <div className="border-t border-border pt-3">
                          {confirmDelete === selectedContact.id ? (
                            <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                              <p className="text-xs text-destructive flex-1">Permanently delete <strong>{selectedContact.name}</strong>? This cannot be undone.</p>
                              <button
                                onClick={() => deleteRecord(selectedContact.id)}
                                disabled={deleting}
                                className="text-xs bg-destructive text-destructive-foreground px-3 py-1.5 rounded-full hover:opacity-90 disabled:opacity-50"
                              >
                                {deleting ? "Deleting..." : "Delete"}
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="text-xs text-muted-foreground hover:text-foreground px-2 py-1.5"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(selectedContact.id)}
                              className="text-xs text-destructive hover:text-destructive/80 transition-colors"
                            >
                              🗑 Delete Inquiry
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="audit">
              <div className="bg-background rounded-lg shadow-sm divide-y divide-border">
                {auditLog.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">No activity yet.</div>
                ) : (
                  auditLog.map(entry => (
                    <div key={entry.id} className="p-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {actionLabels[entry.action] || entry.action}
                        </p>
                        {entry.details && Object.keys(entry.details).length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {JSON.stringify(entry.details)}
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(entry.created_at), "MMM d, h:mm a")}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="bg-background rounded-lg shadow-sm p-6 max-w-md">
                <h3 className="text-base font-semibold text-foreground mb-4">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Current Password</label>
                    <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">New Password</label>
                    <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                    <p className="text-xs text-muted-foreground mt-1">12+ chars, with uppercase, lowercase, number, symbol.</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Confirm New Password</label>
                    <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                  </div>
                  {passwordMsg && (
                    <p className={`text-xs ${passwordMsg.type === "error" ? "text-destructive" : "text-green-600"}`}>
                      {passwordMsg.text}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-full hover:opacity-90 disabled:opacity-50"
                  >
                    {changingPassword ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AdminGuard>
  );
};

export default AdminDashboard;
