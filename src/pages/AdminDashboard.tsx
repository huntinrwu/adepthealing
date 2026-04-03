import { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminGuard from "@/components/AdminGuard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, isToday } from "date-fns";

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

type IntakeSubmission = {
  id: string;
  display_id: number;
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
  linked_inquiry_id: string | null;
};

type PatientVisit = {
  id: string;
  patient_id: string;
  visit_date: string;
  visit_status: string;
  chief_complaint: string | null;
  treatment_notes: string | null;
  follow_up_notes: string | null;
  symptoms: string | null;
  prescriptions: string | null;
  results: string | null;
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
const PATIENT_STATUSES = ["new", "pending", "contacted", "scheduled"] as const;

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

const buildGoogleCalendarUrl = (name: string, email: string, phone: string | null, concern: string) => {
  const title = encodeURIComponent(`Adept Healing — ${name}`);
  const details = encodeURIComponent(`Patient: ${name}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ""}\nConcern: ${concern}`);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;
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
  const [patientVisits, setPatientVisits] = useState<PatientVisit[]>([]);
  const [selectedVisit, setSelectedVisit] = useState<PatientVisit | null>(null);
  const [showAddVisit, setShowAddVisit] = useState(false);
  const [visitForm, setVisitForm] = useState({ visit_date: new Date().toISOString().split("T")[0], visit_status: "completed", chief_complaint: "", treatment_notes: "", follow_up_notes: "", symptoms: "", prescriptions: "", results: "" });
  const [savingVisit, setSavingVisit] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const [allVisits, setAllVisits] = useState<(PatientVisit & { patient_name?: string })[]>([]);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [calendarSelectedDay, setCalendarSelectedDay] = useState<Date | null>(null);
  const navigate = useNavigate();

  const fetchAllVisits = async () => {
    const { data: visits } = await supabase
      .from("patient_visits")
      .select("*")
      .order("visit_date", { ascending: false });
    return (visits as unknown as PatientVisit[]) || [];
  };

  const fetchData = async () => {
    const [contactRes, intakeRes, auditRes, visits] = await Promise.all([
      supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("intake_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("audit_log").select("*").order("created_at", { ascending: false }).limit(200),
      fetchAllVisits(),
    ]);
    if (contactRes.data) setContacts(contactRes.data as unknown as ContactSubmission[]);
    if (intakeRes.data) {
      const intakeData = intakeRes.data as unknown as IntakeSubmission[];
      setIntakes(intakeData);
      // Enrich visits with patient names
      const enriched = visits.map(v => {
        const patient = intakeData.find(p => p.id === v.patient_id);
        return { ...v, patient_name: patient ? `${patient.first_name} ${patient.last_name}` : "Unknown" };
      });
      setAllVisits(enriched);
    }
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

  const filteredIntakes = useMemo(() => {
    let list = intakes;
    if (statusFilter !== "all") list = list.filter(i => i.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(i =>
        `${i.first_name} ${i.last_name}`.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.primary_concern.toLowerCase().includes(q) ||
        i.phone.includes(q) ||
        String(i.display_id).includes(q)
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

  // Auto-mark as "pending" when a "new" record is opened
  const openContact = async (c: ContactSubmission) => {
    setSelectedContact(c);
    setSelectedIntake(null);
    setEditNotes(c.notes || "");
    setConfirmDelete(null);
    if (c.status === "new") {
      await updateContactStatus(c.id, "pending");
    }
  };

  const fetchVisits = async (patientId: string) => {
    const { data } = await supabase
      .from("patient_visits")
      .select("*")
      .eq("patient_id", patientId)
      .order("visit_date", { ascending: false });
    setPatientVisits((data as unknown as PatientVisit[]) || []);
  };

  const openIntake = async (i: IntakeSubmission) => {
    setSelectedIntake(i);
    setSelectedContact(null);
    setEditNotes(i.notes || "");
    setConfirmDelete(null);
    setSelectedVisit(null);
    setShowAddVisit(false);
    fetchVisits(i.id);
    if (i.status === "new") {
      await updateIntakeStatus(i.id, "pending");
    }
  };

  const addVisit = async (patientId: string) => {
    setSavingVisit(true);
    await supabase.from("patient_visits").insert({
      patient_id: patientId,
      visit_date: visitForm.visit_date,
      visit_status: visitForm.visit_status,
      chief_complaint: visitForm.chief_complaint || null,
      treatment_notes: visitForm.treatment_notes || null,
      follow_up_notes: visitForm.follow_up_notes || null,
      symptoms: visitForm.symptoms || null,
      prescriptions: visitForm.prescriptions || null,
      results: visitForm.results || null,
    } as never);
    await logAction("visit_added", "patient_visits", patientId, { visit_date: visitForm.visit_date, visit_status: visitForm.visit_status });
    setVisitForm({ visit_date: new Date().toISOString().split("T")[0], visit_status: "completed", chief_complaint: "", treatment_notes: "", follow_up_notes: "", symptoms: "", prescriptions: "", results: "" });
    setShowAddVisit(false);
    setSavingVisit(false);
    fetchVisits(patientId);
  };

  const deleteVisit = async (visitId: string, patientId: string) => {
    await supabase.from("patient_visits").delete().eq("id", visitId);
    await logAction("visit_deleted", "patient_visits", patientId, { visit_id: visitId });
    setSelectedVisit(null);
    fetchVisits(patientId);
  };

  const linkInquiryToPatient = async (intakeId: string, inquiryId: string | null) => {
    await supabase.from("intake_submissions").update({ linked_inquiry_id: inquiryId } as never).eq("id", intakeId);
    await logAction("linked_inquiry", "intake_submissions", intakeId, { linked_inquiry_id: inquiryId });
    fetchData();
    if (selectedIntake?.id === intakeId) {
      setSelectedIntake({ ...selectedIntake, linked_inquiry_id: inquiryId });
    }
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

  const contactCounts = countByStatus(contacts);
  const intakeCounts = countByStatus(intakes);
  const actionNeeded = contactCounts.new + intakeCounts.new;
  const pending = contactCounts.pending + intakeCounts.pending;

  const actionLabels: Record<string, string> = {
    status_change: "Status Changed",
    notes_updated: "Notes Updated",
    deleted: "Record Deleted",
    password_changed: "Password Changed",
    linked_inquiry: "Inquiry Linked",
    visit_added: "Visit Added",
    visit_deleted: "Visit Deleted",
  };

  const tableLabels: Record<string, string> = {
    contact_submissions: "Inquiry",
    intake_submissions: "Patient",
  };

  const getLinkedInquiry = (inquiryId: string | null) => {
    if (!inquiryId) return null;
    return contacts.find(c => c.id === inquiryId) || null;
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total", value: contacts.length + intakes.length, accent: false },
              { label: "New", value: actionNeeded, accent: actionNeeded > 0 },
              { label: "Pending", value: pending, accent: false },
              { label: "Scheduled", value: contactCounts.scheduled + intakeCounts.scheduled, accent: false },
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
              <TabsTrigger value="lookup" className="gap-2">
                🔍 Lookup
              </TabsTrigger>
              <TabsTrigger value="calendar" className="gap-2">
                📅 Calendar
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

              {/* Contact Detail Dialog */}
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

                        {/* Google Calendar */}
                        <div>
                          <a
                            href={buildGoogleCalendarUrl(selectedContact.name, selectedContact.email, selectedContact.phone, selectedContact.interest)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm bg-primary text-primary-foreground px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
                          >
                            📅 Schedule in Google Calendar
                          </a>
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
                      onClick={() => openIntake(i)}
                      className="bg-background rounded-lg p-4 shadow-sm cursor-pointer transition-all hover:shadow-md border-l-4 border-l-transparent hover:border-l-primary"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground">PAT-{i.display_id}</span>
                            <p className="font-medium text-foreground truncate">{i.first_name} {i.last_name}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{i.email} · {i.phone}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {i.linked_inquiry_id && (
                            <span className="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                              🔗 INQ-{contacts.find(c => c.id === i.linked_inquiry_id)?.display_id || "?"}
                            </span>
                          )}
                        </div>
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
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">PAT-{selectedIntake.display_id}</span>
                          <DialogTitle className="text-xl">{selectedIntake.first_name} {selectedIntake.last_name}</DialogTitle>
                        </div>
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

                        {/* Link Inquiry */}
                        <div className="border-t border-border pt-3">
                          <p className="text-sm font-medium text-foreground mb-2">Link to Inquiry</p>
                          {selectedIntake.linked_inquiry_id && getLinkedInquiry(selectedIntake.linked_inquiry_id) ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-primary font-mono">INQ-{getLinkedInquiry(selectedIntake.linked_inquiry_id)!.display_id}</span>
                              <span className="text-sm text-muted-foreground">— {getLinkedInquiry(selectedIntake.linked_inquiry_id)!.name}</span>
                              <button
                                onClick={() => linkInquiryToPatient(selectedIntake.id, null)}
                                className="text-xs text-destructive hover:text-destructive/80 ml-2"
                              >
                                Unlink
                              </button>
                            </div>
                          ) : (
                            <Select onValueChange={(val) => linkInquiryToPatient(selectedIntake.id, val)}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select an inquiry to link..." />
                              </SelectTrigger>
                              <SelectContent>
                                {contacts.map(c => (
                                  <SelectItem key={c.id} value={c.id}>
                                    INQ-{c.display_id} — {c.name} ({c.email})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>


                        {/* Google Calendar */}
                        <div>
                          <a
                            href={buildGoogleCalendarUrl(
                              `${selectedIntake.first_name} ${selectedIntake.last_name}`,
                              selectedIntake.email,
                              selectedIntake.phone,
                              selectedIntake.primary_concern
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm bg-primary text-primary-foreground px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
                          >
                            📅 Schedule in Google Calendar
                          </a>
                        </div>

                        {/* Visit History */}
                        <div className="border-t border-border pt-3">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium text-foreground">Visit History ({patientVisits.length})</p>
                            <button
                              onClick={() => { setShowAddVisit(!showAddVisit); setSelectedVisit(null); }}
                              className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity"
                            >
                              {showAddVisit ? "Cancel" : "+ Add Visit"}
                            </button>
                          </div>

                          {showAddVisit && (
                            <div className="bg-muted/50 rounded-lg p-4 mb-3 space-y-3">
                              <div className="grid sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-xs font-medium text-foreground block mb-1">Visit Date</label>
                                  <Input type="date" value={visitForm.visit_date} onChange={e => setVisitForm({ ...visitForm, visit_date: e.target.value })} />
                                </div>
                                <div>
                                  <label className="text-xs font-medium text-foreground block mb-1">Status</label>
                                  <div className="flex gap-1.5">
                                    {[
                                      { value: "completed", label: "✅ Completed", activeClass: "bg-green-600 text-white" },
                                      { value: "no-show", label: "❌ No-Show", activeClass: "bg-red-600 text-white" },
                                      { value: "cancelled", label: "🚫 Cancelled", activeClass: "bg-amber-600 text-white" },
                                    ].map(s => (
                                      <button
                                        key={s.value}
                                        type="button"
                                        onClick={() => setVisitForm({ ...visitForm, visit_status: s.value })}
                                        className={`text-xs px-2.5 py-1.5 rounded-full border transition-all ${visitForm.visit_status === s.value ? s.activeClass + " border-transparent" : "border-input bg-background text-muted-foreground hover:bg-muted"}`}
                                      >
                                        {s.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {visitForm.visit_status === "completed" && (
                                <>
                                  <div>
                                    <label className="text-xs font-medium text-foreground block mb-1">Chief Complaint</label>
                                    <textarea value={visitForm.chief_complaint} onChange={e => setVisitForm({ ...visitForm, chief_complaint: e.target.value })} className="w-full h-16 text-sm border border-input rounded-lg p-2 bg-background resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="What brought the patient in today..." />
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium text-foreground block mb-1">Symptoms Treated</label>
                                    <textarea value={visitForm.symptoms} onChange={e => setVisitForm({ ...visitForm, symptoms: e.target.value })} className="w-full h-16 text-sm border border-input rounded-lg p-2 bg-background resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="e.g. lower back pain, insomnia, anxiety..." />
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium text-foreground block mb-1">Treatment Notes</label>
                                    <textarea value={visitForm.treatment_notes} onChange={e => setVisitForm({ ...visitForm, treatment_notes: e.target.value })} className="w-full h-20 text-sm border border-input rounded-lg p-2 bg-background resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Points used, techniques, observations..." />
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium text-foreground block mb-1">Prescriptions / Herbs</label>
                                    <textarea value={visitForm.prescriptions} onChange={e => setVisitForm({ ...visitForm, prescriptions: e.target.value })} className="w-full h-16 text-sm border border-input rounded-lg p-2 bg-background resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Herbal formulas, supplements, lifestyle recommendations..." />
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium text-foreground block mb-1">Results / Response</label>
                                    <textarea value={visitForm.results} onChange={e => setVisitForm({ ...visitForm, results: e.target.value })} className="w-full h-16 text-sm border border-input rounded-lg p-2 bg-background resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Patient response to treatment, improvements noted..." />
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium text-foreground block mb-1">Follow-up Notes</label>
                                    <textarea value={visitForm.follow_up_notes} onChange={e => setVisitForm({ ...visitForm, follow_up_notes: e.target.value })} className="w-full h-16 text-sm border border-input rounded-lg p-2 bg-background resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Recommendations, next visit plan..." />
                                  </div>
                                </>
                              )}

                              {visitForm.visit_status !== "completed" && (
                                <div>
                                  <label className="text-xs font-medium text-foreground block mb-1">Notes (optional)</label>
                                  <textarea value={visitForm.follow_up_notes} onChange={e => setVisitForm({ ...visitForm, follow_up_notes: e.target.value })} className="w-full h-16 text-sm border border-input rounded-lg p-2 bg-background resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Any notes about this no-show or cancellation..." />
                                </div>
                              )}

                              <button onClick={() => addVisit(selectedIntake.id)} disabled={savingVisit} className="text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-full hover:opacity-90 disabled:opacity-50">
                                {savingVisit ? "Saving..." : "Save Visit"}
                              </button>
                            </div>
                          )}

                          {selectedVisit ? (
                            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-foreground">{format(new Date(selectedVisit.visit_date + "T00:00:00"), "MMMM d, yyyy")}</p>
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                    selectedVisit.visit_status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                                    selectedVisit.visit_status === "no-show" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                                    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                  }`}>
                                    {selectedVisit.visit_status === "completed" ? "✅ Completed" : selectedVisit.visit_status === "no-show" ? "❌ No-Show" : "🚫 Cancelled"}
                                  </span>
                                </div>
                                <button onClick={() => setSelectedVisit(null)} className="text-xs text-muted-foreground hover:text-foreground">← Back</button>
                              </div>
                              {selectedVisit.chief_complaint && (
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-0.5">Chief Complaint</p>
                                  <p className="text-sm text-foreground">{selectedVisit.chief_complaint}</p>
                                </div>
                              )}
                              {selectedVisit.symptoms && (
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-0.5">Symptoms Treated</p>
                                  <p className="text-sm text-foreground">{selectedVisit.symptoms}</p>
                                </div>
                              )}
                              {selectedVisit.treatment_notes && (
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-0.5">Treatment Notes</p>
                                  <p className="text-sm text-foreground whitespace-pre-wrap">{selectedVisit.treatment_notes}</p>
                                </div>
                              )}
                              {selectedVisit.prescriptions && (
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-0.5">Prescriptions / Herbs</p>
                                  <p className="text-sm text-foreground whitespace-pre-wrap">{selectedVisit.prescriptions}</p>
                                </div>
                              )}
                              {selectedVisit.results && (
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-0.5">Results / Response</p>
                                  <p className="text-sm text-foreground whitespace-pre-wrap">{selectedVisit.results}</p>
                                </div>
                              )}
                              {selectedVisit.follow_up_notes && (
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-0.5">Follow-up</p>
                                  <p className="text-sm text-foreground">{selectedVisit.follow_up_notes}</p>
                                </div>
                              )}
                              <button onClick={() => deleteVisit(selectedVisit.id, selectedIntake.id)} className="text-xs text-destructive hover:text-destructive/80">🗑 Delete Visit</button>
                            </div>
                          ) : (
                            patientVisits.length === 0 ? (
                              <p className="text-sm text-muted-foreground">No visits recorded yet.</p>
                            ) : (
                              <div className="space-y-1.5">
                                {patientVisits.map(v => (
                                  <div
                                    key={v.id}
                                    onClick={() => { setSelectedVisit(v); setShowAddVisit(false); }}
                                    className="flex items-center justify-between bg-background rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors border border-border"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className={`w-2 h-2 rounded-full shrink-0 ${
                                        v.visit_status === "completed" ? "bg-green-500" :
                                        v.visit_status === "no-show" ? "bg-red-500" : "bg-amber-500"
                                      }`} />
                                      <div>
                                        <p className="text-sm font-medium text-foreground">{format(new Date(v.visit_date + "T00:00:00"), "MMM d, yyyy")}</p>
                                        {v.chief_complaint && <p className="text-xs text-muted-foreground line-clamp-1">{v.chief_complaint}</p>}
                                      </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground">→</span>
                                  </div>
                                ))}
                              </div>
                            )
                          )}
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

            {/* LOOKUP TAB */}
            <TabsContent value="lookup">
              {(() => {
                const [lookupQuery, setLookupQuery] = [search, setSearch];
                const q = lookupQuery.trim().toLowerCase();

                const matchedContacts = q ? contacts.filter(c =>
                  c.name.toLowerCase().includes(q) ||
                  c.email.toLowerCase().includes(q) ||
                  (c.phone && c.phone.includes(q)) ||
                  `inq-${c.display_id}`.includes(q) ||
                  String(c.display_id) === q
                ) : [];

                const matchedIntakes = q ? intakes.filter(i =>
                  `${i.first_name} ${i.last_name}`.toLowerCase().includes(q) ||
                  i.email.toLowerCase().includes(q) ||
                  i.phone.includes(q) ||
                  `pat-${i.display_id}`.includes(q) ||
                  String(i.display_id) === q
                ) : [];

                const totalResults = matchedContacts.length + matchedIntakes.length;

                return (
                  <div className="space-y-4">
                    <div className="bg-background rounded-lg shadow-sm p-6">
                      <h2 className="text-lg font-semibold text-foreground mb-1">Customer Lookup</h2>
                      <p className="text-sm text-muted-foreground mb-4">Search by INQ-ID, PAT-ID, name, phone, or email.</p>
                      <Input
                        placeholder="e.g. INQ-5, PAT-12, John, 703-555-1234, john@email.com"
                        value={lookupQuery}
                        onChange={(e) => setLookupQuery(e.target.value)}
                        className="text-base"
                        autoFocus
                      />
                      {q && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {totalResults} result{totalResults !== 1 ? "s" : ""} found
                        </p>
                      )}
                    </div>

                    {q && matchedContacts.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2 px-1">Inquiries ({matchedContacts.length})</h3>
                        <div className="space-y-2">
                          {matchedContacts.map(c => (
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
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {q && matchedIntakes.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2 px-1">Patients ({matchedIntakes.length})</h3>
                        <div className="space-y-2">
                          {matchedIntakes.map(i => (
                            <div
                              key={i.id}
                              onClick={() => openIntake(i)}
                              className="bg-background rounded-lg p-4 shadow-sm cursor-pointer transition-all hover:shadow-md border-l-4 border-l-transparent hover:border-l-primary"
                            >
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono text-muted-foreground">PAT-{i.display_id}</span>
                                    <p className="font-medium text-foreground truncate">{i.first_name} {i.last_name}</p>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{i.email} · {i.phone}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {i.linked_inquiry_id && (
                                    <span className="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                      🔗 INQ-{contacts.find(c => c.id === i.linked_inquiry_id)?.display_id || "?"}
                                    </span>
                                  )}
                                  <StatusBadge status={i.status} />
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{i.primary_concern}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {q && totalResults === 0 && (
                      <div className="bg-background rounded-lg p-8 text-center text-muted-foreground text-sm">
                        No inquiries or patients match "<strong>{q}</strong>".
                      </div>
                    )}

                    {!q && (
                      <div className="bg-background rounded-lg p-8 text-center text-muted-foreground text-sm">
                        Start typing to search across all inquiries and patients.
                      </div>
                    )}
                  </div>
                );
              })()}
            </TabsContent>

            {/* CALENDAR TAB */}
            <TabsContent value="calendar">
              <div className="bg-background rounded-lg shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))}
                    className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full hover:bg-muted transition-colors"
                  >
                    ← Prev
                  </button>
                  <h2 className="text-lg font-semibold text-foreground">
                    {format(calendarMonth, "MMMM yyyy")}
                  </h2>
                  <button
                    onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}
                    className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full hover:bg-muted transition-colors"
                  >
                    Next →
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 text-center text-xs font-medium text-muted-foreground mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                    <div key={d} className="py-2">{d}</div>
                  ))}
                </div>

                {/* Calendar grid */}
                {(() => {
                  const monthStart = startOfMonth(calendarMonth);
                  const monthEnd = endOfMonth(calendarMonth);
                  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
                  const startPad = getDay(monthStart);

                  return (
                    <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
                      {/* Padding for days before month starts */}
                      {Array.from({ length: startPad }).map((_, i) => (
                        <div key={`pad-${i}`} className="bg-muted/30 min-h-[80px] sm:min-h-[100px]" />
                      ))}
                      {days.map(day => {
                        const dateStr = format(day, "yyyy-MM-dd");
                        const dayVisits = allVisits.filter(v => v.visit_date === dateStr);
                        const isSelected = calendarSelectedDay && isSameDay(day, calendarSelectedDay);

                        return (
                          <div
                            key={dateStr}
                            onClick={() => setCalendarSelectedDay(isSelected ? null : day)}
                            className={`bg-background min-h-[80px] sm:min-h-[100px] p-1.5 cursor-pointer transition-colors hover:bg-muted/50 ${
                              isSelected ? "ring-2 ring-primary ring-inset" : ""
                            }`}
                          >
                            <span className={`text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${
                              isToday(day) ? "bg-primary text-primary-foreground" : "text-foreground"
                            }`}>
                              {format(day, "d")}
                            </span>
                            {dayVisits.length > 0 && (
                              <div className="mt-1 space-y-0.5">
                                {dayVisits.slice(0, 3).map(v => (
                                  <div key={v.id} className="text-[10px] leading-tight bg-primary/10 text-primary rounded px-1 py-0.5 truncate">
                                    {v.patient_name}
                                  </div>
                                ))}
                                {dayVisits.length > 3 && (
                                  <div className="text-[10px] text-muted-foreground">+{dayVisits.length - 3} more</div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* Selected day detail */}
                {calendarSelectedDay && (() => {
                  const dateStr = format(calendarSelectedDay, "yyyy-MM-dd");
                  const dayVisits = allVisits.filter(v => v.visit_date === dateStr);
                  return (
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-foreground mb-3">
                        {format(calendarSelectedDay, "EEEE, MMMM d, yyyy")} — {dayVisits.length} visit{dayVisits.length !== 1 ? "s" : ""}
                      </h3>
                      {dayVisits.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No visits scheduled for this day.</p>
                      ) : (
                        <div className="space-y-2">
                          {dayVisits.map(v => {
                            const patient = intakes.find(p => p.id === v.patient_id);
                            return (
                              <div
                                key={v.id}
                                className="bg-muted/50 rounded-lg p-4 border border-border cursor-pointer hover:bg-muted transition-colors"
                                onClick={() => patient && openIntake(patient)}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    {patient && <span className="text-xs font-mono text-muted-foreground">PAT-{patient.display_id}</span>}
                                    <p className="text-sm font-medium text-foreground">{v.patient_name}</p>
                                  </div>
                                  <span className="text-xs text-primary">View patient →</span>
                                </div>
                                {v.chief_complaint && <p className="text-xs text-muted-foreground line-clamp-1">{v.chief_complaint}</p>}
                                {v.treatment_notes && <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">Treatment: {v.treatment_notes}</p>}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
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
