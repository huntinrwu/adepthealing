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
  name: string;
  email: string;
  phone: string | null;
  interest: string;
  message: string;
  status: string;
  notes: string | null;
  created_at: string;
};

type IntakeSubmission = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  address: string;
  emergency_contact: string;
  emergency_phone: string;
  primary_concern: string;
  conditions: string[] | null;
  medical_history: string | null;
  current_medications: string | null;
  allergies: string | null;
  previous_acupuncture: string;
  referral_source: string | null;
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

const STATUSES = ["new", "pending", "in_review", "contacted", "in_progress", "scheduled", "completed", "archived"] as const;

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  new: { label: "New", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300", dot: "bg-blue-500" },
  pending: { label: "Pending", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300", dot: "bg-amber-500" },
  in_review: { label: "In Review", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300", dot: "bg-purple-500" },
  contacted: { label: "Contacted", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300", dot: "bg-yellow-500" },
  in_progress: { label: "In Progress", color: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300", dot: "bg-sky-500" },
  scheduled: { label: "Scheduled", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300", dot: "bg-green-500" },
  completed: { label: "Completed", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300", dot: "bg-emerald-500" },
  archived: { label: "Archived", color: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
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

const AdminDashboard = () => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [intakes, setIntakes] = useState<IntakeSubmission[]>([]);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [selectedIntake, setSelectedIntake] = useState<IntakeSubmission | null>(null);
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
    const [contactRes, intakeRes, auditRes] = await Promise.all([
      supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("intake_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("audit_log").select("*").order("created_at", { ascending: false }).limit(200),
    ]);
    if (contactRes.data) setContacts(contactRes.data);
    if (intakeRes.data) setIntakes(intakeRes.data);
    if (auditRes.data) setAuditLog(auditRes.data as AuditEntry[]);
  };

  useEffect(() => { fetchData(); }, []);

  const logAction = async (action: string, targetTable: string, targetId: string, details: Record<string, unknown> = {}) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("audit_log").insert({
      user_id: user.id,
      action,
      target_table: targetTable,
      target_id: targetId,
      details: details as Record<string, unknown>,
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
        (c.phone && c.phone.includes(q))
      );
    }
    return list;
  }, [contacts, statusFilter, search]);

  const filteredIntakes = useMemo(() => {
    let list = intakes;
    if (statusFilter !== "all") list = list.filter(i => i.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(i =>
        `${i.first_name} ${i.last_name}`.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.primary_concern.toLowerCase().includes(q) ||
        i.phone.includes(q)
      );
    }
    return list;
  }, [intakes, statusFilter, search]);

  const updateContactStatus = async (id: string, status: string) => {
    const prev = contacts.find(c => c.id === id)?.status;
    await supabase.from("contact_submissions").update({ status }).eq("id", id);
    await logAction("status_change", "contact_submissions", id, { from: prev, to: status });
    fetchData();
    if (selectedContact?.id === id) setSelectedContact({ ...selectedContact, status });
  };

  const updateIntakeStatus = async (id: string, status: string) => {
    const prev = intakes.find(i => i.id === id)?.status;
    await supabase.from("intake_submissions").update({ status }).eq("id", id);
    await logAction("status_change", "intake_submissions", id, { from: prev, to: status });
    fetchData();
    if (selectedIntake?.id === id) setSelectedIntake({ ...selectedIntake, status });
  };

  const saveNotes = async (type: "contact" | "intake", id: string) => {
    setSaving(true);
    const table = type === "contact" ? "contact_submissions" : "intake_submissions";
    await supabase.from(table).update({ notes: editNotes }).eq("id", id);
    await logAction("notes_updated", table, id, { notes_preview: editNotes.slice(0, 100) });
    await fetchData();
    setSaving(false);
  };

  const deleteRecord = async (type: "contact" | "intake", id: string) => {
    setDeleting(true);
    const table = type === "contact" ? "contact_submissions" : "intake_submissions";
    const record = type === "contact"
      ? contacts.find(c => c.id === id)
      : intakes.find(i => i.id === id);

    const summary = type === "contact"
      ? { name: (record as ContactSubmission)?.name, email: (record as ContactSubmission)?.email }
      : { name: `${(record as IntakeSubmission)?.first_name} ${(record as IntakeSubmission)?.last_name}`, email: (record as IntakeSubmission)?.email };

    await logAction("deleted", table, id, summary);
    await supabase.from(table).delete().eq("id", id);

    if (type === "contact") setSelectedContact(null);
    else setSelectedIntake(null);

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
      // Verify current password by re-signing in
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
    STATUSES.forEach(s => counts[s] = 0);
    items.forEach(i => { counts[i.status] = (counts[i.status] || 0) + 1; });
    return counts;
  };

  const contactCounts = countByStatus(contacts);
  const intakeCounts = countByStatus(intakes);
  const actionNeeded = contactCounts.new + contactCounts.pending + intakeCounts.new + intakeCounts.pending;
  const inProgress = contactCounts.in_review + contactCounts.contacted + contactCounts.in_progress +
                     intakeCounts.in_review + intakeCounts.contacted + intakeCounts.in_progress;

  const actionLabels: Record<string, string> = {
    status_change: "Status Changed",
    notes_updated: "Notes Updated",
    deleted: "Record Deleted",
    password_changed: "Password Changed",
  };

  const tableLabels: Record<string, string> = {
    contact_submissions: "Inquiry",
    intake_submissions: "Patient",
  };

  const DeleteButton = ({ type, id, label }: { type: "contact" | "intake"; id: string; label: string }) => (
    confirmDelete === id ? (
      <div className="flex items-center gap-2 mt-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
        <p className="text-xs text-destructive flex-1">Permanently delete <strong>{label}</strong>? This cannot be undone.</p>
        <button
          onClick={() => deleteRecord(type, id)}
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
        onClick={() => setConfirmDelete(id)}
        className="mt-3 text-xs text-destructive hover:text-destructive/80 transition-colors"
      >
        🗑 Delete Record
      </button>
    )
  );

  return (
    <AdminGuard>
      <Helmet>
        <title>Admin Dashboard | Adept Healing</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <header className="bg-background border-b border-border px-4 sm:px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold text-base">A</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Practice Manager</h1>
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
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {[
              { label: "Total", value: contacts.length + intakes.length, accent: false },
              { label: "Action Needed", value: actionNeeded, accent: actionNeeded > 0 },
              { label: "In Progress", value: inProgress, accent: false },
              { label: "Scheduled", value: contactCounts.scheduled + intakeCounts.scheduled, accent: false },
              { label: "Completed", value: contactCounts.completed + intakeCounts.completed, accent: false },
            ].map((stat) => (
              <div key={stat.label} className="bg-background rounded-lg p-4 shadow-sm">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-semibold ${stat.accent ? "text-primary" : "text-foreground"}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <Input
              placeholder="Search by name, email, phone..."
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
              {STATUSES.map(s => (
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

          <Tabs defaultValue="contacts" className="space-y-4">
            <TabsList className="bg-background">
              <TabsTrigger value="contacts" className="gap-2">
                Inquiries
                {contactCounts.new > 0 && <Badge variant="destructive" className="text-xs px-1.5 py-0">{contactCounts.new}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="intakes" className="gap-2">
                Patients
                {intakeCounts.new > 0 && <Badge variant="destructive" className="text-xs px-1.5 py-0">{intakeCounts.new}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="audit" className="gap-2">
                Audit Log
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                Settings
              </TabsTrigger>
            </TabsList>

            {/* CONTACTS TAB */}
            <TabsContent value="contacts">
              <div className="space-y-2">
                {filteredContacts.length === 0 ? (
                  <div className="bg-background rounded-lg p-8 text-center text-muted-foreground text-sm">
                    {search || statusFilter !== "all" ? "No results match your filters." : "No contact inquiries yet."}
                  </div>
                ) : (
                  filteredContacts.map(c => (
                    <div
                      key={c.id}
                      onClick={() => { setSelectedContact(c); setSelectedIntake(null); setEditNotes(c.notes || ""); setConfirmDelete(null); }}
                      className="bg-background rounded-lg p-4 shadow-sm cursor-pointer transition-all hover:shadow-md border-l-4 border-l-transparent hover:border-l-primary"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{c.name}</p>
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

              {/* Contact Detail Dialog */}
              <Dialog open={!!selectedContact} onOpenChange={(open) => { if (!open) setSelectedContact(null); }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  {selectedContact && (
                    <>
                      <DialogHeader>
                        <DialogTitle className="text-xl">{selectedContact.name}</DialogTitle>
                      </DialogHeader>

                      <div className="space-y-5 mt-2">
                        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                          <p><span className="text-muted-foreground">Email:</span> <a href={`mailto:${selectedContact.email}`} className="text-primary hover:underline">{selectedContact.email}</a></p>
                          {selectedContact.phone && <p><span className="text-muted-foreground">Phone:</span> <a href={`tel:${selectedContact.phone}`} className="text-primary hover:underline">{selectedContact.phone}</a></p>}
                          <p><span className="text-muted-foreground">Interest:</span> {selectedContact.interest}</p>
                          <p><span className="text-muted-foreground">Submitted:</span> {format(new Date(selectedContact.created_at), "MMM d, yyyy h:mm a")}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-foreground mb-1">Message</p>
                          <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">{selectedContact.message}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-foreground mb-2">Status Pipeline</p>
                          <div className="flex flex-wrap gap-1.5">
                            {STATUSES.map(s => (
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
                            onClick={() => saveNotes("contact", selectedContact.id)}
                            disabled={saving}
                            className="mt-2 text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-full hover:opacity-90 disabled:opacity-50"
                          >
                            {saving ? "Saving..." : "Save Notes"}
                          </button>
                        </div>

                        <div className="border-t border-border pt-3">
                          <DeleteButton type="contact" id={selectedContact.id} label={selectedContact.name} />
                        </div>
                      </div>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* INTAKES TAB */}
            <TabsContent value="intakes">
              <div className="space-y-2">
                {filteredIntakes.length === 0 ? (
                  <div className="bg-background rounded-lg p-8 text-center text-muted-foreground text-sm">
                    {search || statusFilter !== "all" ? "No results match your filters." : "No intake forms yet."}
                  </div>
                ) : (
                  filteredIntakes.map(i => (
                    <div
                      key={i.id}
                      onClick={() => { setSelectedIntake(i); setSelectedContact(null); setEditNotes(i.notes || ""); setConfirmDelete(null); }}
                      className="bg-background rounded-lg p-4 shadow-sm cursor-pointer transition-all hover:shadow-md border-l-4 border-l-transparent hover:border-l-primary"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{i.first_name} {i.last_name}</p>
                          <p className="text-xs text-muted-foreground">{i.email} · {i.phone}</p>
                        </div>
                        <StatusBadge status={i.status} />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{i.primary_concern}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-muted-foreground">{format(new Date(i.created_at), "MMM d, yyyy h:mm a")}</p>
                        {i.notes && <span className="text-xs text-muted-foreground">📝 Has notes</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Intake Detail Dialog */}
              <Dialog open={!!selectedIntake} onOpenChange={(open) => { if (!open) setSelectedIntake(null); }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  {selectedIntake && (
                    <>
                      <DialogHeader>
                        <DialogTitle className="text-xl">{selectedIntake.first_name} {selectedIntake.last_name}</DialogTitle>
                      </DialogHeader>

                      <div className="space-y-5 mt-2">
                        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                          <p><span className="text-muted-foreground">Email:</span> <a href={`mailto:${selectedIntake.email}`} className="text-primary hover:underline">{selectedIntake.email}</a></p>
                          <p><span className="text-muted-foreground">Phone:</span> <a href={`tel:${selectedIntake.phone}`} className="text-primary hover:underline">{selectedIntake.phone}</a></p>
                          <p><span className="text-muted-foreground">DOB:</span> {selectedIntake.date_of_birth}</p>
                          <p><span className="text-muted-foreground">Gender:</span> <span className="capitalize">{selectedIntake.gender}</span></p>
                          <p className="sm:col-span-2"><span className="text-muted-foreground">Address:</span> {selectedIntake.address}</p>
                        </div>

                        <div className="border-t border-border pt-3">
                          <p className="text-sm font-medium text-foreground mb-1">Emergency Contact</p>
                          <p className="text-sm text-muted-foreground">{selectedIntake.emergency_contact} — <a href={`tel:${selectedIntake.emergency_phone}`} className="text-primary hover:underline">{selectedIntake.emergency_phone}</a></p>
                        </div>

                        <div className="border-t border-border pt-3">
                          <p className="text-sm font-medium text-foreground mb-1">Primary Concern</p>
                          <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">{selectedIntake.primary_concern}</p>
                        </div>

                        {selectedIntake.conditions && selectedIntake.conditions.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-foreground mb-1.5">Conditions</p>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedIntake.conditions.map(c => (
                                <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedIntake.medical_history && (
                          <div>
                            <p className="text-sm font-medium text-foreground mb-1">Medical History</p>
                            <p className="text-sm text-muted-foreground">{selectedIntake.medical_history}</p>
                          </div>
                        )}

                        {selectedIntake.current_medications && (
                          <div>
                            <p className="text-sm font-medium text-foreground mb-1">Medications</p>
                            <p className="text-sm text-muted-foreground">{selectedIntake.current_medications}</p>
                          </div>
                        )}

                        {selectedIntake.allergies && (
                          <div>
                            <p className="text-sm font-medium text-foreground mb-1">Allergies</p>
                            <p className="text-sm text-muted-foreground">{selectedIntake.allergies}</p>
                          </div>
                        )}

                        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                          <p><span className="text-muted-foreground">Previous Acupuncture:</span> {selectedIntake.previous_acupuncture}</p>
                          {selectedIntake.referral_source && (
                            <p><span className="text-muted-foreground">Referral:</span> {selectedIntake.referral_source}</p>
                          )}
                        </div>

                        <div className="border-t border-border pt-3">
                          <p className="text-sm font-medium text-foreground mb-2">Status Pipeline</p>
                          <div className="flex flex-wrap gap-1.5">
                            {STATUSES.map(s => (
                              <button
                                key={s}
                                onClick={() => updateIntakeStatus(selectedIntake.id, s)}
                                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                                  selectedIntake.status === s
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                              >
                                {statusConfig[s]?.label || s}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-border pt-3">
                          <p className="text-sm font-medium text-foreground mb-1">Internal Notes</p>
                          <textarea
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            className="w-full h-28 text-sm border border-input rounded-lg p-2.5 bg-background resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            placeholder="Add notes about this patient..."
                          />
                          <button
                            onClick={() => saveNotes("intake", selectedIntake.id)}
                            disabled={saving}
                            className="mt-2 text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-full hover:opacity-90 disabled:opacity-50"
                          >
                            {saving ? "Saving..." : "Save Notes"}
                          </button>
                        </div>

                        <div className="border-t border-border pt-3">
                          <DeleteButton type="intake" id={selectedIntake.id} label={`${selectedIntake.first_name} ${selectedIntake.last_name}`} />
                        </div>
                      </div>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* AUDIT LOG TAB */}
            <TabsContent value="audit">
              <div className="space-y-2">
                {auditLog.length === 0 ? (
                  <div className="bg-background rounded-lg p-8 text-center text-muted-foreground text-sm">
                    No activity logged yet. Actions will appear here as you manage records.
                  </div>
                ) : (
                  auditLog.map(entry => {
                    const details = entry.details || {};
                    return (
                      <div key={entry.id} className="bg-background rounded-lg p-4 shadow-sm flex items-start gap-4">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          entry.action === "deleted" ? "bg-destructive" :
                          entry.action === "status_change" ? "bg-primary" : "bg-amber-500"
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-foreground">{actionLabels[entry.action] || entry.action}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{tableLabels[entry.target_table] || entry.target_table}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {entry.action === "status_change" && (
                              <span>
                                {statusConfig[(details as Record<string, string>).from]?.label || (details as Record<string, string>).from} → {statusConfig[(details as Record<string, string>).to]?.label || (details as Record<string, string>).to}
                              </span>
                            )}
                            {entry.action === "deleted" && (
                              <span>{(details as Record<string, string>).name} ({(details as Record<string, string>).email})</span>
                            )}
                            {entry.action === "notes_updated" && (
                              <span className="line-clamp-1">{(details as Record<string, string>).notes_preview}</span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground flex-shrink-0">
                          {format(new Date(entry.created_at), "MMM d, yyyy h:mm a")}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </TabsContent>

            {/* SETTINGS TAB */}
            <TabsContent value="settings">
              <div className="max-w-md">
                <div className="bg-background rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-1">Change Password</h2>
                  <p className="text-sm text-muted-foreground mb-5">Update your admin account password.</p>
                  {passwordMsg && (
                    <div className={`text-sm p-3 rounded-lg mb-4 ${passwordMsg.type === "success" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-destructive/10 text-destructive"}`}>
                      {passwordMsg.text}
                    </div>
                  )}
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1">Current Password</label>
                      <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1">New Password</label>
                      <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={12} />
                      <p className="text-xs text-muted-foreground mt-1">Min 12 chars · uppercase · lowercase · number · symbol</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1">Confirm New Password</label>
                      <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="w-full bg-primary text-primary-foreground py-3 rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {changingPassword ? "Updating..." : "Update Password"}
                    </button>
                  </form>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AdminGuard>
  );
};

export default AdminDashboard;
