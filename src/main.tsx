import React from 'react'
import { createRoot } from 'react-dom/client'
import { Bell, CalendarDays, CheckCircle2, ChevronRight, Clock3, FileText, Inbox, LayoutDashboard, Mail, Settings2, Users, Workflow } from 'lucide-react'
import './styles.css'

const nav = [
  ['Overview', LayoutDashboard],
  ['Correspondence', Mail],
  ['Schedule', CalendarDays],
  ['Contacts', Users],
  ['Templates', FileText],
  ['Automation', Workflow],
  ['Proof Archive', Inbox],
] as const

const scheduled = [
  { title: 'Payment reminder · Acme Supply', meta: 'Standard Mail · 1 page · Aug 18 at 9:00 AM', status: 'Scheduled' },
  { title: 'Contract renewal · North Coast HVAC', meta: 'Certified Mail · 3 pages · Aug 21 at 9:00 AM', status: 'Approval required' },
  { title: 'Past-due notice · Redwood Office', meta: 'Standard Mail · 2 pages · Aug 22 at 9:00 AM', status: 'Scheduled' },
]

const events = [
  ['Aug 14 · 10:42 AM', 'Payment demand mailed', 'Acme Supply · Certified Mail · Tracking added'],
  ['Aug 14 · 9:18 AM', 'Renewal sequence created', 'North Coast HVAC · 3-step sequence'],
  ['Aug 13 · 4:05 PM', 'Proof generated', 'Redwood Office · Delivery confirmed'],
]

function App() {
  const [active, setActive] = React.useState('Overview')
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">M</div>
          <div><div className="brand-name">MailMyPDF</div><span className="brand-sub">Business</span></div>
        </div>
        <div className="nav-label">Workspace</div>
        <nav className="nav">
          {nav.map(([label, Icon]) => <button key={label} className={active === label ? 'active' : ''} onClick={() => setActive(label)}><Icon size={16} strokeWidth={1.7}/>{label}</button>)}
        </nav>
        <div className="sidebar-bottom"><div className="business">North Coast Services</div><div className="business-meta">Business plan · 3 team members</div></div>
      </aside>
      <main className="main">
        <header className="topbar"><div className="topbar-title">Business correspondence / {active}</div><div className="top-actions"><button className="icon-btn"><Bell size={16}/></button><button className="icon-btn"><Settings2 size={16}/></button><div className="avatar">NC</div></div></header>
        <section className="content">
          <div className="header-row">
            <div><div className="eyebrow">Business correspondence OS</div><h1 className="serif">Everything important,<br/>sent on time.</h1><div className="subtitle">Create, schedule, track, and permanently prove the documents your business sends. MailMyPDF handles the physical mailing so your team can focus on the work.</div></div>
            <button className="primary">Create mailing <ChevronRight size={15} style={{verticalAlign:'-3px',marginLeft:5}}/></button>
          </div>

          <div className="deadline"><div><div className="label">Next scheduled mailing</div><strong>Payment reminder · Acme Supply</strong></div><div className="deadline-right"><div className="label">August 18 · 9:00 AM</div><strong>4 days</strong></div></div>

          <div className="stat-grid">
            <div className="stat"><div className="stat-value">23</div><div className="stat-label">Scheduled mailings</div></div>
            <div className="stat"><div className="stat-value">8</div><div className="stat-label">Awaiting approval</div></div>
            <div className="stat"><div className="stat-value">37</div><div className="stat-label">In transit</div></div>
            <div className="stat"><div className="stat-value">214</div><div className="stat-label">Delivered</div></div>
          </div>

          <div className="grid">
            <div className="card"><div className="card-head"><div><div className="card-kicker">Queue</div><div className="card-title">Upcoming correspondence</div></div><button className="secondary">View schedule</button></div><div className="card-body queue">{scheduled.map((item) => <div className="queue-item" key={item.title}><div><div className="item-title">{item.title}</div><div className="item-meta">{item.meta}</div></div><span className={`badge ${item.status === 'Approval required' ? 'red' : ''}`}>{item.status}</span></div>)}</div></div>
            <div className="card"><div className="card-head"><div><div className="card-kicker">This month</div><div className="card-title">Mail calendar</div></div><CalendarDays size={16}/></div><div className="card-body"><div className="calendar">{['M','T','W','T','F','S','S'].map((d,i)=><div className="day-name" key={i}>{d}</div>)}{Array.from({length:35},(_,i)=>{const n=i-3; return <div className={`day ${n<1?'muted':''}`} key={i}><div className="day-num">{n>0?n:''}</div>{[5,8,14,18,21,22,26].includes(n)&&<><div className="dot"/><div className="day-count">{n===18?'4':'1'} mail</div></>}</div>})}</div></div></div>
          </div>

          <div style={{height:18}}/>
          <div className="grid">
            <div className="card next"><div className="card-head"><div><div className="card-kicker">Next best action</div><div className="card-title">8 mailings need approval</div></div><Clock3 size={16}/></div><div className="card-body"><div className="item-title">Contract renewal · North Coast HVAC</div><div className="item-meta">Certified Mail · 3 pages · scheduled Aug 21</div><div style={{marginTop:16}}><button className="primary">Review approvals</button></div></div></div>
            <div className="card"><div className="card-head"><div><div className="card-kicker">Activity</div><div className="card-title">Recent events</div></div><CheckCircle2 size={16}/></div><div className="card-body timeline">{events.map(([date,title,meta])=><div className="event" key={title}><div className="event-date">{date}</div><div className="event-title">{title}</div><div className="event-meta">{meta}</div></div>)}</div></div>
          </div>
        </section>
      </main>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)
