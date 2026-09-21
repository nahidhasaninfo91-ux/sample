import React, { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, ListChecks, CheckSquare, Plus, Search, Filter,
  Eye, Trash2, ChevronDown, ChevronRight, Menu, X, LogOut,
  Clock, AlertTriangle, TrendingUp, Calendar, User, Building2, Tag, Save, RefreshCw
} from "lucide-react";

const TEAL = "#6e5f05";
const TEAL_DARK = "#20887c";

const USERS = [
  { id: "u1", name: "Md. Nahid Hasan", code: "000004", role: "Admin", team: "Content & Media" },
  { id: "u2", name: "A", code: "000003", role: "Member", team: "Content & Media" },
  { id: "u3", name: "B", code: "000005", role: "Member", team: "Content & Media" },
];

const TEAMS = ["Content & Media", "Sales", "Operations"];
const PRIORITIES = ["Low", "Medium", "High"];
const STATUSES = ["Pending", "In Progress", "Submitted For Review", "Revision Requested", "Completed", "Cancelled"];
const TASK_TYPES = ["Content Writing", "Static Design", "Long Video", "TikTok Post", "YouTube Post", "Daily Task Plan", "Ad Campaign Setup", "Facebook & Instagram Post"];
const LEAD_SOURCES = ["Facebook", "Website", "Referral", "WhatsApp", "Walk-in"];
const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Converted", "Lost"];

const todayStr = () => new Date().toISOString().slice(0, 10);

function fmtDate(d) {
  if (!d) return "-";
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function seedTasks() {
  const base = todayStr();
  return [
    { id: "t1", title: "Group Create & Cover Design", team: "Content & Media", type: "Static Design", priority: "Medium", due: base, status: "Pending", assignee: "u1" },
    { id: "t2", title: "Hiring Post: Video Editor & Cinematographer — Part 1", team: "Content & Media", type: "Content Writing", priority: "Medium", due: base, status: "Pending", assignee: "u1" },
    { id: "t3", title: "অফিসের পাশে চায়ের দোকান", team: "Content & Media", type: "Long Video", priority: "Medium", due: base, status: "In Progress", assignee: "u1" },
    { id: "t4", title: "Series Name: Better Sleep Blueprint Episode", team: "Content & Media", type: "Long Video", priority: "Medium", due: base, status: "In Progress", assignee: "u1" },
    { id: "t5", title: "Tiktok", team: "Content & Media", type: "TikTok Post", priority: "Medium", due: "2026-06-20", status: "Completed", assignee: "u1" },
    { id: "t6", title: "Youtube and Tiktok Post", team: "Content & Media", type: "YouTube Post", priority: "Medium", due: "2026-06-20", status: "Completed", assignee: "u1" },
    { id: "t7", title: "Shoot: Content 7", team: "Content & Media", type: "Long Video", priority: "Medium", due: "2026-07-22", status: "Pending", assignee: "u2" },
    { id: "t8", title: "Editing: Content 7", team: "Content & Media", type: "Long Video", priority: "Medium", due: "2026-07-25", status: "Pending", assignee: "u2" },
    { id: "t9", title: "Facebook Ad Setup - Jaggery Powder", team: "Sales", type: "Ad Campaign Setup", priority: "High", due: base, status: "Pending", assignee: "u3" },
  ];
}

function seedLeads() {
  return [
    { id: "l1", name: "Farhana Islam", phone: "01711-000111", source: "Facebook", status: "New", assignedTo: "u3", note: "Interested in 1kg jaggery powder" },
    { id: "l2", name: "Kamal Hossain", phone: "01822-000222", source: "Website", status: "Contacted", assignedTo: "u3", note: "Asked about bulk pricing" },
    { id: "l3", name: "Rima Sultana", phone: "01933-000333", source: "WhatsApp", status: "Qualified", assignedTo: "u3", note: "Ready to order, confirming address" },
    { id: "l4", name: "Jahid Hasan", phone: "01644-000444", source: "Referral", status: "Converted", assignedTo: "u3", note: "Repeat customer" },
  ];
}

async function loadState() {
  try {
    const t = await window.storage?.get("pp-tasks");
    const l = await window.storage?.get("pp-leads");
    return {
      tasks: t ? JSON.parse(t.value) : seedTasks(),
      leads: l ? JSON.parse(l.value) : seedLeads(),
    };
  } catch {
    return { tasks: seedTasks(), leads: seedLeads() };
  }
}
async function saveTasks(tasks) {
  try { await window.storage?.set("pp-tasks", JSON.stringify(tasks)); } catch {}
}
async function saveLeads(leads) {
  try { await window.storage?.set("pp-leads", JSON.stringify(leads)); } catch {}
}

function userName(id) { return USERS.find(u => u.id === id)?.name || "Unassigned"; }

const statusColor = {
  "Pending": "bg-amber-50 text-amber-700 border-amber-200",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
  "Submitted For Review": "bg-purple-50 text-purple-700 border-purple-200",
  "Revision Requested": "bg-rose-50 text-rose-700 border-rose-200",
  "Completed": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Cancelled": "bg-gray-100 text-gray-500 border-gray-200",
};
const priorityColor = {
  "Low": "bg-gray-100 text-gray-600",
  "Medium": "bg-orange-50 text-orange-700",
  "High": "bg-red-50 text-red-700",
};
const leadStatusColor = {
  "New": "bg-sky-50 text-sky-700 border-sky-200",
  "Contacted": "bg-amber-50 text-amber-700 border-amber-200",
  "Qualified": "bg-purple-50 text-purple-700 border-purple-200",
  "Converted": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Lost": "bg-gray-100 text-gray-500 border-gray-200",
};

function StatCard({ icon: Icon, label, value, sub, tone = "slate" }) {
  const tones = {
    slate: "text-slate-600 bg-slate-100",
    amber: "text-amber-600 bg-amber-100",
    teal: "text-teal-700 bg-teal-100",
    rose: "text-rose-600 bg-rose-100",
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex-1 min-w-[150px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-500">{label}</span>
        <span className={`p-1.5 rounded-lg ${tones[tone]}`}><Icon size={16} /></span>
      </div>
      <div className="text-2xl font-semibold text-slate-800">{value}</div>
      {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
    </div>
  );
}

function Select({ value, onChange, options, placeholder, className = "" }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 ${className}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className={`w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 ${props.className || ""}`}
    />
  );
}

function StatusPill({ status }) {
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border ${statusColor[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {status}
    </span>
  );
}

function LoginPage({ onLogin }) {
  const [userId, setUserId] = useState(USERS[0].id);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!password) { setError("পাসওয়ার্ড দিন (ডেমো: যেকোনো কিছু লিখুন)"); return; }
    onLogin(userId);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-slate-50 p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg mb-3" style={{ background: TEAL }}>P&amp;P</div>
          <h1 className="text-xl font-semibold text-slate-800">Nahid &amp; Hasan CRM</h1>
          <p className="text-sm text-slate-400 mt-1">Task &amp; CRM Dashboard</p>
        </div>
        <form onSubmit={submit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">User</label>
            <select
              value={userId}
              onChange={e => setUserId(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
            >
              {USERS.map(u => <option key={u.id} value={u.id}>{u.name} — {u.role}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Password</label>
            <Input type="password" placeholder="••••••••" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} />
          </div>
          {error && <p className="text-xs text-rose-500">{error}</p>}
          <button type="submit" className="w-full text-white text-sm font-medium py-2.5 rounded-lg transition" style={{ background: TEAL }}>
            Log In
          </button>
          <p className="text-[11px] text-center text-slate-400">এটি একটি প্রোটোটাইপ — যেকোনো পাসওয়ার্ড দিয়ে লগইন করুন</p>
        </form>
      </div>
    </div>
  );
}

function NavGroup({ label, icon: Icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-1">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-3 py-2 text-[13px] font-medium text-slate-500 hover:text-slate-700">
        <span className="flex items-center gap-2"><Icon size={15} />{label}</span>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {open && <div className="ml-4 border-l border-slate-100 pl-3 space-y-0.5">{children}</div>}
    </div>
  );
}

function NavItem({ label, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[13px] flex items-center justify-between transition ${
        active ? "bg-teal-50 text-teal-700 font-medium" : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      <span>{label}</span>
      {badge != null && <span className="text-[10px] bg-slate-100 text-slate-500 rounded-full px-1.5">{badge}</span>}
    </button>
  );
}

function Sidebar({ page, setPage, open, setOpen, counts }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="flex items-center gap-2 px-4 h-14 border-b border-slate-200 shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs" style={{ background: TEAL }}>P&amp;P</div>
          <span className="font-semibold text-slate-800 text-sm">Pusti &amp; Pure</span>
          <button className="ml-auto md:hidden text-slate-400" onClick={() => setOpen(false)}><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto py-3 px-2">
          <div className="text-[11px] font-semibold text-slate-400 px-3 mb-1 mt-1">HOME</div>
          <NavGroup label="Dashboard" icon={LayoutDashboard} defaultOpen>
            <NavItem label="Overview" active={page === "overview"} onClick={() => setPage("overview")} />
            <NavItem label="Lead Overview" active={page === "leadOverview"} onClick={() => setPage("leadOverview")} />
            <NavItem label="Team Task Overview" active={page === "teamOverview"} onClick={() => setPage("teamOverview")} />
          </NavGroup>

          <div className="text-[11px] font-semibold text-slate-400 px-3 mb-1 mt-4">LEAD MANAGEMENT</div>
          <NavGroup label="Leads" icon={Users} defaultOpen>
            <NavItem label="All Leads" active={page === "leads"} onClick={() => setPage("leads")} badge={counts.leads} />
          </NavGroup>

          <div className="text-[11px] font-semibold text-slate-400 px-3 mb-1 mt-4">TASK MANAGEMENT</div>
          <NavItem label="My Tasks" active={page === "myTasks"} onClick={() => setPage("myTasks")} />
          <div className="h-1" />
          <NavGroup label="Tasks" icon={ListChecks} defaultOpen>
            <NavItem label="All Tasks" active={page === "allTasks"} onClick={() => setPage("allTasks")} badge={counts.tasks} />
            <NavItem label="Create Task" active={page === "createTask"} onClick={() => setPage("createTask")} />
          </NavGroup>
        </div>
      </aside>
    </>
  );
}

function Topbar({ user, onMenu, onLogout }) {
  const [menu, setMenu] = useState(false);
  return (
    <div className="h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-3 sticky top-0 z-20">
      <button className="md:hidden text-slate-500" onClick={onMenu}><Menu size={20} /></button>
      <div className="flex-1" />
      <div className="relative">
        <button onClick={() => setMenu(!menu)} className="flex items-center gap-2 text-sm text-slate-700">
          <span className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-semibold">
            {user.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
          </span>
          <span className="hidden sm:inline">{user.name}</span>
          <ChevronDown size={14} />
        </button>
        {menu && (
          <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 text-sm">
            <div className="px-3 py-2 text-xs text-slate-400 border-b border-slate-100">{user.role} · {user.team}</div>
            <button onClick={onLogout} className="w-full text-left px-3 py-2 flex items-center gap-2 text-rose-600 hover:bg-rose-50">
              <LogOut size={14} /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function TaskModal({ task, onClose }) {
  if (!task) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-semibold text-slate-800 text-base pr-4">{task.title}</h3>
          <button onClick={onClose} className="text-slate-400"><X size={18} /></button>
        </div>
        <div className="space-y-3 text-sm">
          <Row icon={Building2} label="Team" value={task.team} />
          <Row icon={Tag} label="Type" value={task.type} />
          <Row icon={User} label="Assignee" value={userName(task.assignee)} />
          <Row icon={Calendar} label="Due" value={fmtDate(task.due)} />
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColor[task.priority]}`}>{task.priority} priority</span>
            <StatusPill status={task.status} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 text-slate-600">
      <Icon size={14} className="text-slate-400" />
      <span className="text-slate-400 w-16 shrink-0">{label}</span>
      <span className="text-slate-700 font-medium">{value}</span>
    </div>
  );
}

function PageHeader({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center"><Icon size={18} /></div>
        <div>
          <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

function Overview({ tasks, leads, setPage }) {
  const openTasks = tasks.filter(t => t.status !== "Completed" && t.status !== "Cancelled").length;
  const completed = tasks.filter(t => t.status === "Completed").length;
  const overdue = tasks.filter(t => t.due < todayStr() && t.status !== "Completed" && t.status !== "Cancelled").length;
  return (
    <div>
      <PageHeader icon={LayoutDashboard} title="Overview" subtitle="Business Snapshot Across Leads And Tasks" />
      <div className="flex flex-wrap gap-3 mb-6">
        <StatCard icon={ListChecks} label="Open Tasks" value={openTasks} tone="teal" />
        <StatCard icon={TrendingUp} label="Completed Tasks" value={completed} tone="slate" />
        <StatCard icon={AlertTriangle} label="Overdue Tasks" value={overdue} tone="rose" />
        <StatCard icon={Users} label="Total Leads" value={leads.length} tone="amber" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Recent Tasks</h3>
          <div className="space-y-2">
            {tasks.slice(0, 5).map(t => (
              <div key={t.id} className="flex items-center justify-between text-sm py-1.5 border-b border-slate-50 last:border-0">
                <span className="text-slate-600 truncate pr-2">{t.title}</span>
                <StatusPill status={t.status} />
              </div>
            ))}
          </div>
          <button onClick={() => setPage("allTasks")} className="text-xs text-teal-700 font-medium mt-3">View all tasks →</button>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Recent Leads</h3>
          <div className="space-y-2">
            {leads.slice(0, 5).map(l => (
              <div key={l.id} className="flex items-center justify-between text-sm py-1.5 border-b border-slate-50 last:border-0">
                <span className="text-slate-600">{l.name}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full border ${leadStatusColor[l.status]}`}>{l.status}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setPage("leads")} className="text-xs text-teal-700 font-medium mt-3">View all leads →</button>
        </div>
      </div>
    </div>
  );
}

function LeadOverview({ leads }) {
  const bySource = LEAD_SOURCES.map(s => ({ s, n: leads.filter(l => l.source === s).length })).filter(x => x.n);
  const converted = leads.filter(l => l.status === "Converted").length;
  return (
    <div>
      <PageHeader icon={TrendingUp} title="Lead Overview" subtitle="Lead Funnel And Source Performance" />
      <div className="flex flex-wrap gap-3 mb-6">
        <StatCard icon={Users} label="Total Leads" value={leads.length} tone="teal" />
        <StatCard icon={TrendingUp} label="Converted" value={converted} sub={leads.length ? `${Math.round(converted / leads.length * 100)}% conversion` : ""} tone="slate" />
        <StatCard icon={Clock} label="New" value={leads.filter(l => l.status === "New").length} tone="amber" />
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Leads by Source</h3>
        <div className="space-y-2">
          {bySource.map(({ s, n }) => (
            <div key={s} className="flex items-center gap-3">
              <span className="text-xs text-slate-500 w-20 shrink-0">{s}</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(n / leads.length) * 100}%`, background: TEAL }} />
              </div>
              <span className="text-xs text-slate-500 w-6 text-right">{n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TeamTaskOverview({ tasks }) {
  const [from, setFrom] = useState(todayStr());
  const [to, setTo] = useState(todayStr());
  const inRange = tasks.filter(t => t.due >= from && t.due <= to);
  const pending = inRange.filter(t => t.status === "Pending" || t.status === "In Progress");
  const completed = inRange.filter(t => t.status === "Completed");
  const overdue = tasks.filter(t => t.due < todayStr() && t.status !== "Completed" && t.status !== "Cancelled");

  return (
    <div>
      <PageHeader icon={TrendingUp} title="Team Task Overview" subtitle="Task Progress For Your Team Members" />
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">From Date</label>
          <Input type="date" value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">To Date</label>
          <Input type="date" value={to} onChange={e => setTo(e.target.value)} />
        </div>
        <button onClick={() => { setFrom(todayStr()); setTo(todayStr()); }} className="text-sm px-3 py-2 border border-slate-200 rounded-lg text-slate-600 flex items-center gap-1"><RefreshCw size={13} />Today</button>
      </div>
      <div className="flex flex-wrap gap-3 mb-5">
        <StatCard icon={ListChecks} label="Tasks in Range" value={inRange.length} tone="teal" />
        <StatCard icon={Clock} label="Pending / Active" value={pending.length} tone="amber" />
        <StatCard icon={TrendingUp} label="Completed" value={completed.length} sub={inRange.length ? `${Math.round(completed.length / inRange.length * 100)}% completion` : ""} tone="slate" />
        <StatCard icon={AlertTriangle} label="Overdue" value={overdue.length} tone="rose" />
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-1">Pending Tasks</h3>
        <p className="text-xs text-slate-400 mb-3">Open tasks due in range, or overdue</p>
        <div className="space-y-3">
          {[...pending, ...overdue.filter(t => !pending.includes(t))].map(t => (
            <div key={t.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-50 last:border-0 pb-3 last:pb-0">
              <div>
                <div className="text-sm font-medium text-slate-700">{t.title}</div>
                <div className="text-xs text-slate-400">{t.team} · {t.type}</div>
              </div>
              <div className="text-xs text-slate-500 text-right">
                <div>{userName(t.assignee)}</div>
                <div>Due {fmtDate(t.due)}</div>
              </div>
            </div>
          ))}
          {pending.length === 0 && overdue.length === 0 && <p className="text-sm text-slate-400">No pending tasks 🎉</p>}
        </div>
      </div>
    </div>
  );
}

function Leads({ leads, setLeads }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", source: LEAD_SOURCES[0], status: "New", assignedTo: USERS[0].id, note: "" });

  const filtered = leads.filter(l =>
    (!statusFilter || l.status === statusFilter) &&
    (l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search))
  );

  const addLead = () => {
    if (!form.name || !form.phone) return;
    const updated = [{ id: "l" + Date.now(), ...form }, ...leads];
    setLeads(updated); saveLeads(updated);
    setForm({ name: "", phone: "", source: LEAD_SOURCES[0], status: "New", assignedTo: USERS[0].id, note: "" });
    setShowForm(false);
  };
  const updateStatus = (id, status) => {
    const updated = leads.map(l => l.id === id ? { ...l, status } : l);
    setLeads(updated); saveLeads(updated);
  };
  const removeLead = (id) => {
    const updated = leads.filter(l => l.id !== id);
    setLeads(updated); saveLeads(updated);
  };

  return (
    <div>
      <PageHeader icon={Users} title="Leads" subtitle="Track And Convert Incoming Customer Leads"
        action={<button onClick={() => setShowForm(!showForm)} className="text-sm text-white px-3 py-2 rounded-lg flex items-center gap-1.5" style={{ background: TEAL }}><Plus size={15} />Add Lead</button>} />

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 grid sm:grid-cols-2 gap-3">
          <Input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <Select value={form.source} onChange={v => setForm({ ...form, source: v })} options={LEAD_SOURCES} />
          <select value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
            {USERS.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          <Input placeholder="Note" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} className="sm:col-span-2" />
          <button onClick={addLead} className="sm:col-span-2 text-sm text-white py-2 rounded-lg flex items-center justify-center gap-1.5" style={{ background: TEAL }}><Save size={14} />Save Lead</button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-[180px] relative">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or phone..." className="w-full border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {LEAD_STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        {filtered.map(l => (
          <div key={l.id} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-medium text-slate-800 text-sm">{l.name}</div>
              <div className="text-xs text-slate-400">{l.phone} · {l.source} · {userName(l.assignedTo)}</div>
              {l.note && <div className="text-xs text-slate-400 mt-0.5">{l.note}</div>}
            </div>
            <div className="flex items-center gap-2">
              <select value={l.status} onChange={e => updateStatus(l.id, e.target.value)} className={`text-xs border rounded-full px-2 py-1 ${leadStatusColor[l.status]}`}>
                {LEAD_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
              <button onClick={() => removeLead(l.id)} className="text-slate-300 hover:text-rose-500"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-slate-400 text-center py-8">কোনো লিড পাওয়া যায়নি</p>}
      </div>
    </div>
  );
}

function TaskRow({ t, onView, onStatus, onDelete }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center gap-4">
      <div className="min-w-[200px] flex-1">
        <div className="font-medium text-slate-800 text-sm">{t.title}</div>
        <div className="text-xs text-slate-400 mt-0.5">Team: {t.team} · Assignee: {userName(t.assignee)}</div>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColor[t.priority]}`}>{t.priority}</span>
      <div className="text-xs text-slate-500 w-32">Due: {fmtDate(t.due)}</div>
      <select value={t.status} onChange={e => onStatus(t.id, e.target.value)} className={`text-xs border rounded-lg px-2 py-1.5 ${statusColor[t.status]}`}>
        {STATUSES.map(s => <option key={s}>{s}</option>)}
      </select>
      <div className="flex items-center gap-2 ml-auto">
        <button onClick={() => onView(t)} className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:text-teal-700"><Eye size={14} /></button>
        <button onClick={() => onDelete(t.id)} className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:text-rose-500"><Trash2 size={14} /></button>
      </div>
    </div>
  );
}

function AllTasks({ tasks, setTasks }) {
  const [view, setView] = useState("Active");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [team, setTeam] = useState("");
  const [search, setSearch] = useState("");
  const [modalTask, setModalTask] = useState(null);

  const filtered = tasks.filter(t => {
    if (view === "Active" && (t.status === "Completed" || t.status === "Cancelled")) return false;
    if (status && t.status !== status) return false;
    if (priority && t.priority !== priority) return false;
    if (team && t.team !== team) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !userName(t.assignee).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const updateStatus = (id, s) => {
    const updated = tasks.map(t => t.id === id ? { ...t, status: s } : t);
    setTasks(updated); saveTasks(updated);
  };
  const remove = (id) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated); saveTasks(updated);
  };

  return (
    <div>
      <PageHeader icon={ListChecks} title="Tasks" subtitle="Track Work Across Teams, Priorities, And Deadlines" />
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3"><Filter size={14} />Filters</div>
        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-3">
          <select value={view} onChange={e => setView(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
            <option>Active</option><option>All</option>
          </select>
          <select value={status} onChange={e => setStatus(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
            <option value="">Status</option>{STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={priority} onChange={e => setPriority(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
            <option value="">Priority</option>{PRIORITIES.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={team} onChange={e => setTeam(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
            <option value="">Team</option>{TEAMS.map(s => <option key={s}>{s}</option>)}
          </select>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Title, assignee..." className="w-full border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-sm" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {filtered.map(t => <TaskRow key={t.id} t={t} onView={setModalTask} onStatus={updateStatus} onDelete={remove} />)}
        {filtered.length === 0 && <p className="text-sm text-slate-400 text-center py-8">কোনো টাস্ক পাওয়া যায়নি</p>}
      </div>
      <TaskModal task={modalTask} onClose={() => setModalTask(null)} />
    </div>
  );
}

function MyTasks({ tasks, setTasks, currentUser }) {
  const mine = tasks.filter(t => t.assignee === currentUser.id);
  const openTasks = mine.filter(t => t.status !== "Completed" && t.status !== "Cancelled").length;
  const pending = mine.filter(t => t.status === "Pending").length;
  const dueToday = mine.filter(t => t.due === todayStr()).length;
  const overdue = mine.filter(t => t.due < todayStr() && t.status !== "Completed" && t.status !== "Cancelled").length;
  const [modalTask, setModalTask] = useState(null);

  const updateStatus = (id, s) => {
    const updated = tasks.map(t => t.id === id ? { ...t, status: s } : t);
    setTasks(updated); saveTasks(updated);
  };
  const remove = (id) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated); saveTasks(updated);
  };

  return (
    <div>
      <PageHeader icon={CheckSquare} title="My Tasks" subtitle="Tasks Assigned To You — Update Status When Needed" />
      <div className="flex flex-wrap gap-3 mb-5">
        <StatCard icon={ListChecks} label="Open Tasks" value={openTasks} tone="teal" />
        <StatCard icon={Clock} label="Pending" value={pending} tone="amber" />
        <StatCard icon={Calendar} label="Due Today" value={dueToday} tone="slate" />
        <StatCard icon={AlertTriangle} label="Overdue" value={overdue} tone="rose" />
      </div>
      <div className="space-y-2">
        {mine.map(t => <TaskRow key={t.id} t={t} onView={setModalTask} onStatus={updateStatus} onDelete={remove} />)}
        {mine.length === 0 && <p className="text-sm text-slate-400 text-center py-8">আপনার কোনো টাস্ক নেই</p>}
      </div>
      <TaskModal task={modalTask} onClose={() => setModalTask(null)} />
    </div>
  );
}

function CreateTask({ tasks, setTasks, setPage }) {
  const [form, setForm] = useState({
    title: "", team: TEAMS[0], type: TASK_TYPES[0], priority: "Medium",
    due: todayStr(), assignee: USERS[0].id, status: "Pending",
  });
  const [saved, setSaved] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!form.title) return;
    const updated = [{ id: "t" + Date.now(), ...form }, ...tasks];
    setTasks(updated); saveTasks(updated);
    setSaved(true);
    setTimeout(() => { setSaved(false); setPage("allTasks"); }, 700);
  };

  return (
    <div className="max-w-xl">
      <PageHeader icon={Plus} title="Create Task" subtitle="Add A New Task And Assign It To Your Team" />
      <form onSubmit={submit} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">Title</label>
          <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Design product label" required />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Team</label>
            <Select value={form.team} onChange={v => setForm({ ...form, team: v })} options={TEAMS} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Type</label>
            <Select value={form.type} onChange={v => setForm({ ...form, type: v })} options={TASK_TYPES} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Priority</label>
            <Select value={form.priority} onChange={v => setForm({ ...form, priority: v })} options={PRIORITIES} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Due Date</label>
            <Input type="date" value={form.due} onChange={e => setForm({ ...form, due: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-slate-500 mb-1 block">Assignee</label>
            <select value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm">
              {USERS.map(u => <option key={u.id} value={u.id}>{u.name} — {u.team}</option>)}
            </select>
          </div>
        </div>
        <button type="submit" className="w-full text-white text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2" style={{ background: saved ? "#16a34a" : TEAL }}>
          <Save size={15} />{saved ? "Task Created ✓" : "Create Task"}
        </button>
      </form>
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [currentUser, setCurrentUser] = useState(USERS[0]);
  const [page, setPage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadState().then(({ tasks, leads }) => { setTasks(tasks); setLeads(leads); setLoading(false); });
  }, []);

  const handleLogin = (userId) => {
    setCurrentUser(USERS.find(u => u.id === userId));
    setAuthed(true);
  };

  if (!authed) return <LoginPage onLogin={handleLogin} />;
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">লোড হচ্ছে...</div>;
  }

  const counts = {
    tasks: tasks.filter(t => t.status !== "Completed" && t.status !== "Cancelled").length,
    leads: leads.length,
  };

  const pages = {
    overview: <Overview tasks={tasks} leads={leads} setPage={setPage} />,
    leadOverview: <LeadOverview leads={leads} />,
    teamOverview: <TeamTaskOverview tasks={tasks} />,
    leads: <Leads leads={leads} setLeads={setLeads} />,
    myTasks: <MyTasks tasks={tasks} setTasks={setTasks} currentUser={currentUser} />,
    allTasks: <AllTasks tasks={tasks} setTasks={setTasks} />,
    createTask: <CreateTask tasks={tasks} setTasks={setTasks} setPage={setPage} />,
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800" style={{ fontFamily: "system-ui, sans-serif" }}>
      <Sidebar page={page} setPage={(p) => { setPage(p); setSidebarOpen(false); }} open={sidebarOpen} setOpen={setSidebarOpen} counts={counts} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar user={currentUser} onMenu={() => setSidebarOpen(true)} onLogout={() => setAuthed(false)} />
        <main className="p-4 md:p-6 flex-1">{pages[page]}</main>
      </div>
    </div>
  );
}
