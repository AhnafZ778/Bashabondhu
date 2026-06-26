"use client";

import React, { useState } from "react";
import { useSearch } from "@/context/SearchContext";
import { 
  PhoneCall, Calendar, AlertTriangle, FileText, CheckCircle2, 
  UserCheck, ShieldAlert, Building2, TrendingUp, Compass, Flame, Info,
  Bold, Italic, Underline, RotateCcw, Edit3, Check
} from "lucide-react";

export default function VisitPlanner() {
  const { profile, scoredListings } = useSearch();
  const [activeTab, setActiveTab] = useState<"scripts" | "physical" | "calling" | "listing">("scripts");
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  
  // Script rich-text editing states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedScripts, setEditedScripts] = useState<Record<string, string>>({});
  const [resetKeys, setResetKeys] = useState<Record<string, number>>({});

  if (!profile) return null;

  // Filter listings that are suitable to visit (verdict is "visit" or "maybe")
  const visitListings = scoredListings
    .filter((l) => l.verdict === "visit" || l.verdict === "maybe")
    .slice(0, 3);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Helper to compile the default script content
  const getDefaultScript = (l: any) => {
    const chargeText = l.serviceChargeKnown && l.serviceCharge 
      ? `৳<b>${l.serviceCharge.toLocaleString()}</b>` 
      : "koto fixed";
    return `&ldquo;Assalamu Alaikum. Ami flat er post ti dekhe call korlam. Shifting plan korchi family/bachelor shathe. Flat a ki Govt gas connection ache naki cylinder? R service charge ${chargeText}? Amra flat ti visit korte chaile kobe shubidha hobe?&rdquo;`;
  };

  // Get current script content (edited or default)
  const getScriptContent = (listingId: string, defaultText: string) => {
    return editedScripts[listingId] !== undefined ? editedScripts[listingId] : defaultText;
  };

  // Format using standard browser contentEditable command execution
  const handleFormat = (command: string) => {
    document.execCommand(command, false);
  };

  // Reset script to original generated template
  const handleReset = (id: string, defaultVal: string) => {
    if (confirm("Reset this script to the default template?")) {
      setEditedScripts((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      // Increment the reset key to force a React component re-mount for contentEditable
      setResetKeys((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
      setEditingId(null);
    }
  };

  return (
    <div className="w-full space-y-6 transition-colors duration-300">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-border-light mb-6">
        <button
          onClick={() => setActiveTab("scripts")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer ${
            activeTab === "scripts"
              ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
              : "bg-card border border-border-light text-text-muted hover:text-text-main"
          }`}
        >
          <PhoneCall className="w-3.5 h-3.5" /> Call Scripts ({visitListings.length})
        </button>

        <button
          onClick={() => setActiveTab("physical")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer ${
            activeTab === "physical"
              ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
              : "bg-card border border-border-light text-text-muted hover:text-text-main"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" /> Physical Visit Blueprint
        </button>

        <button
          onClick={() => setActiveTab("calling")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer ${
            activeTab === "calling"
              ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
              : "bg-card border border-border-light text-text-muted hover:text-text-main"
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" /> Landlord Negotiation Playbook
        </button>

        <button
          onClick={() => setActiveTab("listing")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer ${
            activeTab === "listing"
              ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
              : "bg-card border border-border-light text-text-muted hover:text-text-main"
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> Listing Creation Factors
        </button>
      </div>

      {/* Tab content area */}
      <div className="animate-fade-in">
        {/* TAB 1: CALL SCRIPTS */}
        {activeTab === "scripts" && (
          <div className="space-y-6">
            <div className="max-w-2xl text-left mb-4">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-1">Generated Call Playbook</h3>
              <p className="text-xs text-text-muted">
                Pre-loaded Banglish negotiation scripts custom-generated based on your match comparison database. Click &ldquo;Edit&rdquo; to customize, bold, italicize, or format your dialogue before making the call.
              </p>
            </div>

            {visitListings.length === 0 ? (
              <div className="bg-card border border-border-light rounded-3xl p-8 text-center shadow-xs transition-colors duration-300">
                <Calendar className="w-10 h-10 text-primary/20 mx-auto mb-3" />
                <h3 className="font-sans uppercase tracking-wider text-xs font-bold text-text-main">No Shortlisted Homes</h3>
                <p className="text-[11px] text-text-muted mt-1 max-w-xs mx-auto">
                  Compare listings and select your preferred match items to automatically compile tailored phone scripts.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {visitListings.map((l, idx) => {
                  const defaultText = getDefaultScript(l);
                  return (
                    <div
                      key={l.id}
                      className="bg-card border border-border-light rounded-3xl p-5 shadow-xs space-y-4 flex flex-col justify-between transition-colors duration-300"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] uppercase font-extrabold bg-primary/10 text-primary px-2.5 py-1 rounded-md border border-primary/20">
                              Script #{idx + 1}
                            </span>
                            <h3 className="font-bold text-text-main text-sm mt-2 leading-tight">{l.title}</h3>
                            <p className="text-[11px] text-text-muted mt-0.5">{l.area} • ৳{l.rent.toLocaleString()}/mo</p>
                          </div>
                          <span className="text-[10px] font-extrabold text-[#C9952B] bg-[#C9952B]/5 border border-[#C9952B]/20 px-2 py-0.5 rounded-md">
                            {l.scores.total}% Fit
                          </span>
                        </div>

                        {/* Script Container */}
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-[11px] leading-relaxed text-text-main">
                          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200/50">
                            <div className="flex items-center gap-1.5">
                              <PhoneCall className="w-3.5 h-3.5 text-[#C9952B]" />
                              <span className="font-black text-[#C9952B] uppercase tracking-wider text-[10px]">Calling Script</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {/* Rich Formatting Toolbar (shown when editing) */}
                              {editingId === l.id && (
                                <div className="flex items-center gap-0.5 bg-slate-200/70 p-0.5 rounded-lg border border-slate-300/30 mr-1.5">
                                  <button
                                    title="Bold"
                                    onClick={() => handleFormat("bold")}
                                    className="p-1 hover:bg-slate-300 rounded text-slate-700 hover:text-slate-900 cursor-pointer"
                                  >
                                    <Bold className="w-2.5 h-2.5" />
                                  </button>
                                  <button
                                    title="Italic"
                                    onClick={() => handleFormat("italic")}
                                    className="p-1 hover:bg-slate-300 rounded text-slate-700 hover:text-slate-900 cursor-pointer"
                                  >
                                    <Italic className="w-2.5 h-2.5" />
                                  </button>
                                  <button
                                    title="Underline"
                                    onClick={() => handleFormat("underline")}
                                    className="p-1 hover:bg-slate-300 rounded text-slate-700 hover:text-slate-900 cursor-pointer"
                                  >
                                    <Underline className="w-2.5 h-2.5" />
                                  </button>
                                  <button
                                    title="Reset Template"
                                    onClick={() => handleReset(l.id, defaultText)}
                                    className="p-1 hover:bg-slate-300 rounded text-slate-500 hover:text-rose-600 cursor-pointer ml-0.5 border-l border-slate-300"
                                  >
                                    <RotateCcw className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              )}

                              {/* Save/Edit Switcher */}
                              <button
                                onClick={() => setEditingId(editingId === l.id ? null : l.id)}
                                className="flex items-center gap-1 px-2 py-0.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-[10px] font-bold text-slate-600 cursor-pointer transition-all"
                              >
                                {editingId === l.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" /> Save
                                  </>
                                ) : (
                                  <>
                                    <Edit3 className="w-3 h-3 text-primary" /> Edit
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Editable Text Area */}
                          <div 
                            key={`${l.id}-${resetKeys[l.id] || 0}`}
                            contentEditable={editingId === l.id}
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const html = e.currentTarget.innerHTML;
                              setEditedScripts((prev) => ({ ...prev, [l.id]: html }));
                            }}
                            dangerouslySetInnerHTML={{ __html: getScriptContent(l.id, defaultText) }}
                            className={`focus:outline-none min-h-[60px] p-2 rounded-xl transition-all duration-200 font-mono text-[11px] leading-relaxed ${
                              editingId === l.id 
                                ? "bg-white border border-primary/20 ring-2 ring-primary/5 text-slate-800" 
                                : "bg-transparent text-slate-700 italic cursor-text"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Specific warning checklist */}
                      <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3.5 text-xs text-amber-800 space-y-1 mt-2">
                        <div className="flex items-center gap-1.5 font-bold mb-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span className="text-[11px] font-black uppercase tracking-wider">Verify before signing:</span>
                        </div>
                        <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                          <li>Refundability of the {l.advanceMonths}-month advance (৳{(l.rent * l.advanceMonths).toLocaleString()}).</li>
                          {l.gasType === "cylinder" && <li>Who pays for the cylinder refills.</li>}
                          {l.waterloggingRisk === "high" && <li>Waterlogging level in the alley during heavy rains.</li>}
                          {!l.generator && <li>IPS backup capacity for fan & light.</li>}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PHYSICAL VISIT BLUEPRINT */}
        {activeTab === "physical" && (
          <div className="space-y-6">
            <div className="max-w-2xl text-left">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-1">Physical House Inspection Guide</h3>
              <p className="text-xs text-text-muted">
                Do not rent blindly. Take this checklist with you to verify physical parameters when visiting the building in person. Click items to check them off as you inspect.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category 1 */}
              <div className="bg-card border border-border-light rounded-3xl p-5 shadow-xs space-y-4">
                <h4 className="text-xs font-black uppercase text-primary tracking-wider flex items-center gap-1.5 pb-2 border-b border-border-light">
                  <Flame className="w-3.5 h-3.5" /> Utilities & Hardware
                </h4>
                
                <div className="space-y-3">
                  {[
                    {
                      id: "u_water",
                      title: "Water Quality & Flow",
                      desc: "Turn on kitchen/bath taps. Check iron content, color, and pressure. Ask how often the building water tanks are cleaned."
                    },
                    {
                      id: "u_meter",
                      title: "Electricity Meter Verification",
                      desc: "Locate the prepaid meter. Check for outstanding debts or tariffs, and check the load limits of the line."
                    },
                    {
                      id: "u_damp",
                      title: "Dampness & Wall Seepage",
                      desc: "Check structural corners, ceiling boundaries, and closets for mold, damp spots, or recent paint cover-ups."
                    },
                    {
                      id: "u_gas",
                      title: "Gas Pressure & Load",
                      desc: "Test the stove during cooking peak hours (8 AM - 10 AM, 1 PM - 3 PM) to verify pressure levels."
                    }
                  ].map((item) => {
                    const isChecked = checkedItems.includes(item.id);
                    return (
                      <div 
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className={`flex items-start gap-3 p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                          isChecked 
                            ? "bg-primary/5 border-primary/20" 
                            : "bg-slate-50/50 hover:bg-slate-50 border-border-light"
                        }`}
                      >
                        <div className="mt-0.5">
                          <CheckCircle2 className={`w-4 h-4 transition-colors ${isChecked ? "text-primary fill-primary/10" : "text-slate-300"}`} />
                        </div>
                        <div>
                          <span className={`text-[11px] font-bold block ${isChecked ? "text-primary line-through" : "text-text-main"}`}>
                            {item.title}
                          </span>
                          <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category 2 */}
              <div className="bg-card border border-border-light rounded-3xl p-5 shadow-xs space-y-4">
                <h4 className="text-xs font-black uppercase text-[#C9952B] tracking-wider flex items-center gap-1.5 pb-2 border-b border-border-light">
                  <Compass className="w-3.5 h-3.5" /> Neighborhood & Building Environment
                </h4>

                <div className="space-y-3">
                  {[
                    {
                      id: "n_waterlog",
                      title: "Waterlogging Potential",
                      desc: "Inspect the road right outside. Ask nearby grocery shopkeepers if the road sinks during heavy monsoons."
                    },
                    {
                      id: "n_ventilation",
                      title: "Natural Light & Orientation",
                      desc: "Verify south-facing corridors and window placements. Ensure the apartment is not blocked by adjacent high-rises."
                    },
                    {
                      id: "n_safety",
                      title: "Building Security & Fire Escapes",
                      desc: "Check if the staircase is wide enough for emergencies. Inquire about security guards' night rotation shifts."
                    },
                    {
                      id: "n_noise",
                      title: "Ambient Noise Evaluation",
                      desc: "Observe proximity to main roads, mosques (loudspeakers), school gates, or local commercial workshops."
                    }
                  ].map((item) => {
                    const isChecked = checkedItems.includes(item.id);
                    return (
                      <div 
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className={`flex items-start gap-3 p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                          isChecked 
                            ? "bg-[#C9952B]/5 border-[#C9952B]/20" 
                            : "bg-slate-50/50 hover:bg-slate-50 border-border-light"
                        }`}
                      >
                        <div className="mt-0.5">
                          <CheckCircle2 className={`w-4 h-4 transition-colors ${isChecked ? "text-[#C9952B] fill-[#C9952B]/10" : "text-slate-300"}`} />
                        </div>
                        <div>
                          <span className={`text-[11px] font-bold block ${isChecked ? "text-[#C9952B] line-through" : "text-text-main"}`}>
                            {item.title}
                          </span>
                          <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LANDLORD NEGOTIATIONS PLAYBOOK */}
        {activeTab === "calling" && (
          <div className="space-y-6">
            <div className="max-w-2xl text-left">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-1">Landlord Communication Playbook</h3>
              <p className="text-xs text-text-muted">
                Negotiating with Dhaka landlords requires understanding specific terms. Before committing, call the landlord to clarify these clauses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Concept 1 */}
              <div className="bg-card border border-border-light rounded-3xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <h4 className="font-bold text-text-main text-xs uppercase tracking-wider">Security Deposit & Advance</h4>
                  <p className="text-[11px] text-text-muted mt-1.5 leading-relaxed">
                    Landlords in Dhaka request 2 to 3 months of basic rent in advance. Confirm the conditions of return before transferring money.
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-100/80 rounded-2xl p-3.5 mt-4">
                  <span className="text-[10px] font-black uppercase text-primary block mb-1">Essential Inquiry:</span>
                  <p className="text-[10px] italic text-slate-600">
                    &ldquo;Advance er taka ki shesh dui mashing rent a adjust hobe naki contract sheshe check dewa hobe?&rdquo;
                  </p>
                </div>
              </div>

              {/* Concept 2 */}
              <div className="bg-card border border-border-light rounded-3xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
                    <Info className="w-4 h-4 text-amber-600" />
                  </div>
                  <h4 className="font-bold text-text-main text-xs uppercase tracking-wider">Service Charge Breakdown</h4>
                  <p className="text-[11px] text-text-muted mt-1.5 leading-relaxed">
                    A flat rent price might look low until service charge is added. It must cover elevator, security guards, generator maintenance, and water pump electricity.
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-100/80 rounded-2xl p-3.5 mt-4">
                  <span className="text-[10px] font-black uppercase text-amber-700 block mb-1">Essential Inquiry:</span>
                  <p className="text-[10px] italic text-slate-600">
                    &ldquo;Service charge a ki generator fuel bill r lift cleaning bill added ache? Naki separate utilities calculation hobe?&rdquo;
                  </p>
                </div>
              </div>

              {/* Concept 3 */}
              <div className="bg-card border border-border-light rounded-3xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-teal-500/10 flex items-center justify-center mb-3">
                    <ShieldAlert className="w-4 h-4 text-teal-600" />
                  </div>
                  <h4 className="font-bold text-text-main text-xs uppercase tracking-wider">Curfews & Tenant Regulations</h4>
                  <p className="text-[11px] text-text-muted mt-1.5 leading-relaxed">
                    Gate closing times differ across Dhaka. Many buildings lock gates at 11 PM. Bachelor units face extra restrictions regarding visitors and family.
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-100/80 rounded-2xl p-3.5 mt-4">
                  <span className="text-[10px] font-black uppercase text-teal-700 block mb-1">Essential Inquiry:</span>
                  <p className="text-[10px] italic text-slate-600">
                    &ldquo;Gate er key ki tenant pabe? Naki fixed time er por gate lock hoye jay? Relative ra ashle thakte parbe ki?&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Negotiation Checklist */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-4">
              <h4 className="text-xs font-black uppercase text-text-main tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#C9952B]" /> Core Terms to Agree Upon
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] text-text-main">
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                  <p><strong className="font-bold">Rent Hikes:</strong> Agree on the rent growth cap (standard is 5-10% every 2 years). Do not accept arbitrary annual jumps.</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                  <p><strong className="font-bold">Maintenance Clauses:</strong> Major repairs (internal water pipelines, wiring) are structural and must be paid by the landlord, not the tenant.</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                  <p><strong className="font-bold">Official Receipts:</strong> Demand monthly physical rent receipts containing the landlord's signature. Crucial for official records and verification.</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                  <p><strong className="font-bold">DMP Form Processing:</strong> Tenant verification form is legally mandatory in Dhaka. Landlord must submit the signed copy to the local police station.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LISTING CREATION FACTORS */}
        {activeTab === "listing" && (
          <div className="space-y-6">
            <div className="max-w-2xl text-left">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-1">Listing Creation & Verification Guide</h3>
              <p className="text-xs text-text-muted">
                Are you looking to post a sub-let, transfer a lease, or evaluate listed items? These core factors determine the transparency and speed of property leasing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Factor Left */}
              <div className="bg-card border border-border-light rounded-3xl p-5 shadow-xs space-y-4">
                <h4 className="text-xs font-black uppercase text-primary tracking-wider flex items-center gap-1.5 pb-2 border-b border-border-light">
                  <FileText className="w-3.5 h-3.5" /> Key Information to Present
                </h4>

                <div className="space-y-3.5 text-[11px] text-text-main">
                  <div className="space-y-1">
                    <strong className="font-bold block text-text-main">Rent and Fixed Utilities Structure</strong>
                    <p className="text-text-muted leading-relaxed">
                      Always separate the basic monthly rent from the service charge. Clearly specify who bears the cost of water, trash disposal, gas, and electricity prepaid meter top-ups.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <strong className="font-bold block text-text-main">Accurate Flat Orientation & Floor Level</strong>
                    <p className="text-text-muted leading-relaxed">
                      Flats facing South or East are highly valued in Dhaka for monsoon wind flow and light. Mention the floor level (e.g. 4th floor) and whether a functional elevator exists.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <strong className="font-bold block text-text-main">Gas Connection Verification</strong>
                    <p className="text-text-muted leading-relaxed">
                      Pipeline gas (Titas Gas) is much cheaper (around ৳1,080/mo fixed) than LPG cylinders. State this connection type explicitly as it is a major decision factor for cooking expenses.
                    </p>
                  </div>
                </div>
              </div>

              {/* Factor Right */}
              <div className="bg-card border border-border-light rounded-3xl p-5 shadow-xs space-y-4">
                <h4 className="text-xs font-black uppercase text-[#C9952B] tracking-wider flex items-center gap-1.5 pb-2 border-b border-border-light">
                  <Info className="w-3.5 h-3.5" /> Legal & Procedural Terms
                </h4>

                <div className="space-y-3.5 text-[11px] text-text-main">
                  <div className="space-y-1">
                    <strong className="font-bold block text-text-main">Notice Period Regulations</strong>
                    <p className="text-text-muted leading-relaxed">
                      The standard notice period in Dhaka is 2 months. Clearly document whether the tenant needs to notify by the 1st of the month and if the security deposit is used as rent for those months.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <strong className="font-bold block text-text-main">Security Deposit Return Timeline</strong>
                    <p className="text-text-muted leading-relaxed">
                      State precisely when the security deposit will be refunded (e.g. within 15 days of key handover) and whether deductions will be made for paint or cleaning.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <strong className="font-bold block text-text-main">Tenant Category Matching</strong>
                    <p className="text-text-muted leading-relaxed">
                      Avoid listing mismatch: explicitly state the preferred tenant profile (bachelor allowed vs family only, corporate job holders, maximum occupancy limits).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick summary check */}
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-5 text-emerald-900 space-y-3">
              <h4 className="text-xs font-black uppercase text-emerald-800 tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Listing Success Formula
              </h4>
              <p className="text-[11px] text-emerald-800/80 leading-relaxed">
                By presenting complete upfront costs, listing details clearly, confirming orientation, and clarifying the notice rules, you reduce the average tenant-searching cycle in Dhaka by 65%.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
