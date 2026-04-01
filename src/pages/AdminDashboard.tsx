import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminGuard from "@/components/AdminGuard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  scheduled: "bg-green-100 text-green-800",
  completed: "bg-muted text-muted-foreground",
  archived: "bg-muted text-muted-foreground",
};

const AdminDashboard = () => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [intakes, setIntakes] = useState<IntakeSubmission[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [selectedIntake, setSelectedIntake] = useState<IntakeSubmission | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    const [contactRes, intakeRes] = await Promise.all([
      supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("intake_submissions").select("*").order("created_at", { ascending: false }),
    ]);
    if (contactRes.data) setContacts(contactRes.data);
    if (intakeRes.data) setIntakes(intakeRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateContactStatus = async (id: string, status: string) => {
    await supabase.from("contact_submissions").update({ status }).eq("id", id);
    fetchData();
    if (selectedContact?.id === id) setSelectedContact({ ...selectedContact, status });
  };

  const updateIntakeStatus = async (id: string, status: string) => {
    await supabase.from("intake_submissions").update({ status }).eq("id", id);
    fetchData();
    if (selectedIntake?.id === id) setSelectedIntake({ ...selectedIntake, status });
  };

  const saveContactNotes = async (id: string) => {
    await supabase.from("contact_submissions").update({ notes: editNotes }).eq("id", id);
    fetchData();
  };

  const saveIntakeNotes = async (id: string) => {
    await supabase.from("intake_submissions").update({ notes: editNotes }).eq("id", id);
    fetchData();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const newContactCount = contacts.filter((c) => c.status === "new").length;
  const newIntakeCount = intakes.filter((i) => i.status === "new").length;

  return (
    <AdminGuard>
      <Helmet>
        <title>Admin Dashboard | Adept Healing</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-sage-light">
        {/* Header */}
        <header className="bg-background border-b border-border px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-semibold text-foreground">
                Adept Healing Admin
              </h1>
              <p className="text-sm text-muted-foreground">Manage inquiries and patient intake forms</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Dashboard */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-background rounded-xl p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">Contact Inquiries</p>
              <p className="text-3xl font-display font-semibold text-foreground">{contacts.length}</p>
            </div>
            <div className="bg-background rounded-xl p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">New Inquiries</p>
              <p className="text-3xl font-display font-semibold text-primary">{newContactCount}</p>
            </div>
            <div className="bg-background rounded-xl p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">Intake Forms</p>
              <p className="text-3xl font-display font-semibold text-foreground">{intakes.length}</p>
            </div>
            <div className="bg-background rounded-xl p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">New Intakes</p>
              <p className="text-3xl font-display font-semibold text-primary">{newIntakeCount}</p>
            </div>
          </div>

          <Tabs defaultValue="contacts" className="space-y-6">
            <TabsList className="bg-background">
              <TabsTrigger value="contacts" className="gap-2">
                Contact Inquiries
                {newContactCount > 0 && (
                  <Badge variant="destructive" className="text-xs px-1.5 py-0">{newContactCount}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="intakes" className="gap-2">
                Patient Intakes
                {newIntakeCount > 0 && (
                  <Badge variant="destructive" className="text-xs px-1.5 py-0">{newIntakeCount}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Contacts Tab */}
            <TabsContent value="contacts">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* List */}
                <div className="lg:col-span-2 space-y-3">
                  {contacts.length === 0 ? (
                    <div className="bg-background rounded-xl p-8 text-center text-muted-foreground">
                      No contact inquiries yet.
                    </div>
                  ) : (
                    contacts.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => { setSelectedContact(c); setSelectedIntake(null); setEditNotes(c.notes || ""); }}
                        className={`bg-background rounded-xl p-4 shadow-sm cursor-pointer transition-all hover:shadow-md ${
                          selectedContact?.id === c.id ? "ring-2 ring-primary" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-display font-medium text-foreground">{c.name}</p>
                            <p className="text-sm text-muted-foreground">{c.email}</p>
                          </div>
                          <Badge className={statusColors[c.status] || ""}>{c.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{c.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {format(new Date(c.created_at), "MMM d, yyyy h:mm a")}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Detail Panel */}
                <div>
                  {selectedContact ? (
                    <div className="bg-background rounded-xl p-6 shadow-sm sticky top-4 space-y-4">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {selectedContact.name}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Email:</span> {selectedContact.email}</p>
                        {selectedContact.phone && <p><span className="text-muted-foreground">Phone:</span> {selectedContact.phone}</p>}
                        <p><span className="text-muted-foreground">Interest:</span> {selectedContact.interest}</p>
                        <p><span className="text-muted-foreground">Date:</span> {format(new Date(selectedContact.created_at), "MMM d, yyyy h:mm a")}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Message</p>
                        <p className="text-sm text-muted-foreground bg-sage-light rounded-lg p-3">{selectedContact.message}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Status</p>
                        <div className="flex flex-wrap gap-2">
                          {["new", "contacted", "scheduled", "completed", "archived"].map((s) => (
                            <button
                              key={s}
                              onClick={() => updateContactStatus(selectedContact.id, s)}
                              className={`text-xs px-3 py-1 rounded-full capitalize transition-colors ${
                                selectedContact.status === s
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Notes</p>
                        <textarea
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          className="w-full h-24 text-sm border border-input rounded-lg p-2 bg-background"
                          placeholder="Add internal notes..."
                        />
                        <button
                          onClick={() => saveContactNotes(selectedContact.id)}
                          className="mt-2 text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-full hover:opacity-90"
                        >
                          Save Notes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-background rounded-xl p-6 text-center text-muted-foreground text-sm">
                      Select an inquiry to view details
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Intakes Tab */}
            <TabsContent value="intakes">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* List */}
                <div className="lg:col-span-2 space-y-3">
                  {intakes.length === 0 ? (
                    <div className="bg-background rounded-xl p-8 text-center text-muted-foreground">
                      No intake forms submitted yet.
                    </div>
                  ) : (
                    intakes.map((i) => (
                      <div
                        key={i.id}
                        onClick={() => { setSelectedIntake(i); setSelectedContact(null); setEditNotes(i.notes || ""); }}
                        className={`bg-background rounded-xl p-4 shadow-sm cursor-pointer transition-all hover:shadow-md ${
                          selectedIntake?.id === i.id ? "ring-2 ring-primary" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-display font-medium text-foreground">
                              {i.first_name} {i.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">{i.email}</p>
                          </div>
                          <Badge className={statusColors[i.status] || ""}>{i.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{i.primary_concern}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {format(new Date(i.created_at), "MMM d, yyyy h:mm a")}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Detail Panel */}
                <div>
                  {selectedIntake ? (
                    <div className="bg-background rounded-xl p-6 shadow-sm sticky top-4 space-y-4 max-h-[80vh] overflow-y-auto">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {selectedIntake.first_name} {selectedIntake.last_name}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Email:</span> {selectedIntake.email}</p>
                        <p><span className="text-muted-foreground">Phone:</span> {selectedIntake.phone}</p>
                        <p><span className="text-muted-foreground">DOB:</span> {selectedIntake.date_of_birth}</p>
                        <p><span className="text-muted-foreground">Gender:</span> {selectedIntake.gender}</p>
                        <p><span className="text-muted-foreground">Address:</span> {selectedIntake.address}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Emergency Contact</p>
                        <p className="text-sm text-muted-foreground">{selectedIntake.emergency_contact} — {selectedIntake.emergency_phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Primary Concern</p>
                        <p className="text-sm text-muted-foreground bg-sage-light rounded-lg p-3">{selectedIntake.primary_concern}</p>
                      </div>
                      {selectedIntake.conditions && selectedIntake.conditions.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-foreground mb-2">Conditions</p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedIntake.conditions.map((c) => (
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
                      <p className="text-sm"><span className="text-muted-foreground">Previous Acupuncture:</span> {selectedIntake.previous_acupuncture}</p>
                      {selectedIntake.referral_source && (
                        <p className="text-sm"><span className="text-muted-foreground">Referral:</span> {selectedIntake.referral_source}</p>
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Status</p>
                        <div className="flex flex-wrap gap-2">
                          {["new", "contacted", "scheduled", "completed", "archived"].map((s) => (
                            <button
                              key={s}
                              onClick={() => updateIntakeStatus(selectedIntake.id, s)}
                              className={`text-xs px-3 py-1 rounded-full capitalize transition-colors ${
                                selectedIntake.status === s
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Notes</p>
                        <textarea
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          className="w-full h-24 text-sm border border-input rounded-lg p-2 bg-background"
                          placeholder="Add internal notes..."
                        />
                        <button
                          onClick={() => saveIntakeNotes(selectedIntake.id)}
                          className="mt-2 text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-full hover:opacity-90"
                        >
                          Save Notes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-background rounded-xl p-6 text-center text-muted-foreground text-sm">
                      Select an intake form to view details
                    </div>
                  )}
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
