import { useState, useMemo } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

/* ─────────────────────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────────────────────── */
const T = {
  // Core palette — clean blue & white
  bg:        "#f0f4ff",
  surface:   "#ffffff",
  card:      "#ffffff",
  cardHover: "#f0f4ff",
  border:    "#d1ddf7",
  border2:   "#b8cdf5",

  // Accent — professional blue
  primary:   "#1a4fd6",
  primaryDim:"#1440b8",
  cyan:      "#0ea5e9",
  emerald:   "#059669",
  amber:     "#d97706",
  rose:      "#dc2626",
  purple:    "#7c3aed",

  // Text
  txt1: "#0f172a",
  txt2: "#334155",
  txt3: "#64748b",
  txt4: "#94a3b8",

  // Status
  ok:   "#059669",
  warn: "#d97706",
  err:  "#dc2626",
  info: "#0ea5e9",
};

/* ─────────────────────────────────────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────────────────────────────────────── */
// Styles loaded from index.css

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */
const COMPLIANCE_STANDARDS = {
  RoHS:{full:"Restriction of Hazardous Substances",region:"EU / Global",icon:"🇪🇺",color:T.emerald},
  REACH:{full:"Registration, Evaluation, Authorisation of Chemicals",region:"EU",icon:"⚗️",color:T.purple},
  UL:{full:"Underwriters Laboratories",region:"USA / Global",icon:"🔵",color:T.primary},
  CE:{full:"Conformité Européenne",region:"EU",icon:"🏷️",color:T.amber},
  CSA:{full:"Canadian Standards Association",region:"Canada",icon:"🍁",color:T.rose},
  "UL94 V-0":{full:"Flammability Rating Vertical V-0",region:"USA / Global",icon:"🔥",color:T.rose},
  "ASTM D4956":{full:"Standard for Retroreflective Sheeting",region:"USA",icon:"🔆",color:T.cyan},
  "DIN VDE 0472":{full:"Halogen-Free Standard",region:"Germany / EU",icon:"🇩🇪",color:T.emerald},
  FDA:{full:"Food & Drug Administration",region:"USA",icon:"🍽️",color:T.cyan},
};

const MATERIALS = [
  {id:1,code:"B-595",name:"Brady B-595 Vinyl Film",supplier:"Brady Worldwide",supplierId:"S1",type:"Vinyl",substrate:"Vinyl Film",thickness:0.10,adhesion:1100,tempMin:-40,tempMax:82,environment:"Both",ink:"Thermal Transfer",uvResistant:true,chemResistant:true,cost:4.20,stock:2400,usage:320,shelfLife:"1 year",finish:"High Gloss",appCategory:"Outdoor Labels — UV Resistant",applications:"Pipemarkers, Warehouse Marking, Safety Signs, Arc Flash",notes:"Not for bare concrete. RoHS. 8–10yr outdoor durability.",compliance:["RoHS","CE"],complianceNotes:"RoHS 2002/95/EC. CE marked.",tdsFile:"b-595.pdf",status:"active",duplicateRisk:false},
  {id:2,code:"B-423",name:"BradyBondz B-423 Polyester",supplier:"Brady Worldwide",supplierId:"S1",type:"PET (Polyester)",substrate:"White Polyester",thickness:0.076,adhesion:800,tempMin:-70,tempMax:110,environment:"Both",ink:"Thermal Transfer",uvResistant:true,chemResistant:true,cost:6.80,stock:1800,usage:210,shelfLife:"2 years",finish:"Glossy White",appCategory:"Electronics — Nameplate / Insulation",applications:"PCB/Component ID, Barcode Labels, Rating Plates, Solar Panel ID",notes:"UL Recognized outdoor. Halogen-free. UL969, CSA.",compliance:["RoHS","REACH","UL","CSA","DIN VDE 0472"],complianceNotes:"UL969 Recognized MH17154. CSA C22.2 No.0.1595.",tdsFile:"b-423.pdf",status:"active",duplicateRisk:false},
  {id:3,code:"3M-7847",name:"3M Scotchcal 7847 Reflective",supplier:"3M Industrial",supplierId:"S2",type:"Reflective Film",substrate:"Micro-prism Reflective",thickness:0.18,adhesion:750,tempMin:-40,tempMax:70,environment:"Outdoor",ink:"Solvent Inkjet",uvResistant:true,chemResistant:false,cost:18.50,stock:420,usage:85,shelfLife:"3 years",finish:"Reflective",appCategory:"Outdoor Labels — UV Resistant",applications:"Safety Signs, Vehicle Markings, Traffic, Hi-Vis Labels",notes:"7-year outdoor reflectivity warranty. ASTM D4956.",compliance:["RoHS","ASTM D4956"],complianceNotes:"Meets ASTM D4956 Type IX.",tdsFile:null,status:"active",duplicateRisk:false},
  {id:4,code:"FL-HT600",name:"FLEXcon HT600 High Temp Polyimide",supplier:"FLEXcon",supplierId:"S3",type:"High-Temperature Resistant",substrate:"Polyimide (Kapton)",thickness:0.065,adhesion:600,tempMin:-65,tempMax:260,environment:"Both",ink:"Thermal Transfer",uvResistant:true,chemResistant:true,cost:24.00,stock:380,usage:62,shelfLife:"5 years",finish:"Matte",appCategory:"Automotive — Engine Bay / Warning",applications:"PCB Labels, Engine Bay, Aerospace, Reflow Soldering",notes:"Withstands reflow 260°C. UL94 V-0. Silicone adhesive.",compliance:["RoHS","REACH","UL","UL94 V-0","CE"],complianceNotes:"UL94 V-0 flame rating. RoHS & REACH compliant.",tdsFile:null,status:"active",duplicateRisk:false},
  {id:5,code:"AD-7100",name:"Avery Dennison 7100 Clear BOPP",supplier:"Avery Dennison",supplierId:"S4",type:"Outdoor-Durable",substrate:"Clear BOPP",thickness:0.063,adhesion:950,tempMin:-30,tempMax:90,environment:"Outdoor",ink:"UV Inkjet",uvResistant:true,chemResistant:false,cost:3.50,stock:5200,usage:480,shelfLife:"18 months",finish:"Gloss",appCategory:"Outdoor Labels — Weatherproof",applications:"Product Labels, Retail, Barcode, Food & Beverage",notes:"High clarity no-label look. Suitable for curved surfaces.",compliance:["RoHS","REACH","FDA"],complianceNotes:"FDA-compliant face stock for indirect food contact.",tdsFile:null,status:"active",duplicateRisk:false},
  {id:6,code:"3M-471",name:"3M 471 Vinyl Floor Tape",supplier:"3M Industrial",supplierId:"S2",type:"Adhesive Tape",substrate:"Vinyl",thickness:0.14,adhesion:2200,tempMin:-10,tempMax:60,environment:"Indoor",ink:"None",uvResistant:false,chemResistant:true,cost:22.00,stock:890,usage:120,shelfLife:"2 years",finish:"Matte",appCategory:"Safety — Lockout / Tagout",applications:"5S Floor Marking, Aisle Marking, Warehouse Safety Zones",notes:"Chamfered edges reduce trip hazard. Abrasion resistant.",compliance:["RoHS","REACH","CE"],complianceNotes:"RoHS & REACH compliant. CE marked.",tdsFile:null,status:"active",duplicateRisk:false},
  {id:7,code:"LT-3050",name:"Lintec 3050 Direct Thermal Paper",supplier:"Lintec Corp.",supplierId:"S5",type:"Thermal Transfer",substrate:"Thermal Coated Paper",thickness:0.095,adhesion:680,tempMin:0,tempMax:60,environment:"Indoor",ink:"Direct Thermal",uvResistant:false,chemResistant:false,cost:1.80,stock:12400,usage:1850,shelfLife:"1 year",finish:"Matte",appCategory:"Indoor Labels — Barcode & Product",applications:"Shipping Labels, Retail Price Tags, GHS Labels, Food Labels",notes:"Not for long-term outdoor use. Heat/light sensitive.",compliance:["RoHS","CE"],complianceNotes:"RoHS compliant. CE marked.",tdsFile:null,status:"active",duplicateRisk:false},
  {id:8,code:"PC-250",name:"Makrolon PC-250 Polycarbonate",supplier:"Bayer Materials",supplierId:"S6",type:"Polycarbonate",substrate:"Clear Polycarbonate",thickness:0.175,adhesion:900,tempMin:-40,tempMax:130,environment:"Both",ink:"UV Inkjet",uvResistant:true,chemResistant:true,cost:14.50,stock:620,usage:78,shelfLife:"5 years",finish:"Gloss/Matte",appCategory:"Electronics — Nameplate / Insulation",applications:"Nameplates, Control Panels, Instrumentation, Dials, Overlays",notes:"Excellent impact resistance. UL recognized.",compliance:["RoHS","UL","CE"],complianceNotes:"UL recognized component. RoHS compliant.",tdsFile:null,status:"active",duplicateRisk:false},
  {id:9,code:"FM-3000",name:"3M VHB Foam Tape 3000 Series",supplier:"3M Industrial",supplierId:"S2",type:"Foam",substrate:"Acrylic Foam",thickness:0.80,adhesion:3200,tempMin:-40,tempMax:93,environment:"Both",ink:"None",uvResistant:true,chemResistant:true,cost:32.00,stock:720,usage:98,shelfLife:"2 years",finish:"Foam",appCategory:"Automotive — Engine Bay / Warning",applications:"Panel Bonding, Trim Attachment, Gasket Mounting, Vehicle Assembly",notes:"High bond to metals and plastics. Gap-filling VHB technology.",compliance:["RoHS","REACH","CE"],complianceNotes:"RoHS & REACH compliant. CE marked.",tdsFile:null,status:"active",duplicateRisk:false},
  {id:10,code:"CB-450",name:"Brady CLHT-35 Cable Marker",supplier:"Brady Worldwide",supplierId:"S1",type:"Vinyl",substrate:"Vinyl Film",thickness:0.085,adhesion:720,tempMin:-40,tempMax:90,environment:"Both",ink:"Thermal Transfer",uvResistant:true,chemResistant:true,cost:8.40,stock:3100,usage:420,shelfLife:"2 years",finish:"Matte White",appCategory:"Telecom / Electrical — Cable & Wire ID",applications:"Cable Markers, Wire ID, Panel Wiring, Network Cabling",notes:"Wraps around cables. Halogen-free. Solvent resistant.",compliance:["RoHS","REACH","DIN VDE 0472","CE"],complianceNotes:"Halogen-free per DIN VDE 0472. RoHS & REACH compliant.",tdsFile:null,status:"active",duplicateRisk:false},
  {id:11,code:"LOT-200",name:"Panduit LOTO Lockout Label",supplier:"Panduit",supplierId:"S7",type:"Vinyl",substrate:"Vinyl Film",thickness:0.12,adhesion:1400,tempMin:-30,tempMax:80,environment:"Both",ink:"Thermal Transfer",uvResistant:true,chemResistant:true,cost:11.20,stock:980,usage:145,shelfLife:"3 years",finish:"Gloss",appCategory:"Safety — Lockout / Tagout",applications:"Lockout/Tagout, Arc Flash, Danger Labels, Equipment ID",notes:"OSHA compliant. Aggressive adhesive for rough surfaces.",compliance:["RoHS","CE"],complianceNotes:"CE marked. Meets OSHA 29 CFR 1910.147.",tdsFile:null,status:"active",duplicateRisk:false},
  {id:12,code:"PET-TT120",name:"Avery Dennison 9080 Matte Polyester",supplier:"Avery Dennison",supplierId:"S4",type:"PET (Polyester)",substrate:"White Matte Polyester",thickness:0.085,adhesion:1050,tempMin:-40,tempMax:100,environment:"Both",ink:"Thermal Transfer",uvResistant:true,chemResistant:true,cost:5.90,stock:3100,usage:290,shelfLife:"2 years",finish:"Matte",appCategory:"Indoor Labels — Barcode & Product",applications:"Asset Tags, Cable Marking, Industrial Labels, Inventory Control",notes:"Excellent dimensional stability. Good for laser printing.",compliance:["RoHS","REACH","CE"],complianceNotes:"RoHS & REACH compliant. CE marked.",tdsFile:null,status:"slow",duplicateRisk:true},
];

const SUPPLIERS = [
  {id:"S1",name:"Brady Worldwide",contact:"sales@brady.com",rating:4.8,leadTime:"2–3 wks",country:"USA",materials:["B-595","B-423","CB-450"]},
  {id:"S2",name:"3M Industrial",contact:"industrial@3m.com",rating:4.9,leadTime:"3–4 wks",country:"USA",materials:["3M-7847","3M-471","FM-3000"]},
  {id:"S3",name:"FLEXcon",contact:"info@flexcon.com",rating:4.5,leadTime:"2–3 wks",country:"USA",materials:["FL-HT600"]},
  {id:"S4",name:"Avery Dennison",contact:"sales@averydennison.com",rating:4.6,leadTime:"1–2 wks",country:"USA",materials:["AD-7100","PET-TT120"]},
  {id:"S5",name:"Lintec Corp.",contact:"info@lintec.com",rating:4.3,leadTime:"4–6 wks",country:"Japan",materials:["LT-3050"]},
  {id:"S6",name:"Bayer Materials",contact:"materials@bayer.com",rating:4.2,leadTime:"5–6 wks",country:"Germany",materials:["PC-250"]},
  {id:"S7",name:"Panduit",contact:"info@panduit.com",rating:4.4,leadTime:"2–3 wks",country:"USA",materials:["LOT-200"]},
];

/* ─────────────────────────────────────────────────────────────────────────────
   PRIMITIVE COMPONENTS
───────────────────────────────────────────────────────────────────────────── */

// Status / type badge
const StatusTag = ({label, color=T.primary}) => (
  <span className="tag" style={{background:color + "18",color,border:"1px solid " + color + "28"}}>{label}</span>
);

// Compliance pill
const CompTag = ({std}) => {
  const s = COMPLIANCE_STANDARDS[std];
  const c = s?.color || T.txt3;
  return <span className="tag" style={{background:c + "15",color:c,border:"1px solid " + c + "25"}}>{s?.icon} {std}</span>;
};

// KPI card
const KPICard = ({label,value,sub,color=T.primary,icon}) => (
  <div className="card fade-up" style={{padding:"20px 22px",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,right:0,width:80,height:80,background:"radial-gradient(circle at 80% 20%," + color + "12,transparent 70%)"}}/>
    <div style={{fontSize:22,marginBottom:4}}>{icon}</div>
    <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:26,fontWeight:600,color,lineHeight:1,letterSpacing:-1}}>{value}</div>
    <div style={{fontSize:13,color:T.txt2,marginTop:4}}>{label}</div>
    {sub && <div style={{fontSize:11,color:T.txt4,marginTop:3}}>{sub}</div>}
  </div>
);

// Section header
const SectionHead = ({title,sub,action}) => (
  <div className="section-header">
    <div>
      <h2 style={{fontSize:19,fontWeight:700,color:T.txt1,letterSpacing:-.3}}>{title}</h2>
      {sub && <p style={{fontSize:13,color:T.txt3,marginTop:3}}>{sub}</p>}
    </div>
    {action}
  </div>
);

// Table header cell
const TH = ({children,w}) => (
  <th style={{padding:"9px 14px",textAlign:"left",fontSize:11,fontWeight:600,color:T.txt4,textTransform:"uppercase",letterSpacing:.5,borderBottom:"1px solid " + T.border,width:w,whiteSpace:"nowrap"}}>{children}</th>
);

// Table data cell
const TD = ({children,mono}) => (
  <td style={{padding:"10px 14px",fontSize:13,color:mono?T.cyan:T.txt2,fontFamily:mono?"'IBM Plex Mono',monospace":"inherit",whiteSpace:"nowrap"}}>{children}</td>
);

// Match score bar
const MatchBar = ({pct}) => {
  const c = pct>=80?T.emerald:pct>=50?T.amber:T.rose;
  return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div className="progress" style={{flex:1}}>
        <div className="progress-fill" style={{width:pct + "%",background:c}}/>
      </div>
      <span className="mono" style={{fontSize:11,color:c,minWidth:32}}>{pct}%</span>
    </div>
  );
};

// Input wrapper
const Field = ({label,children,full}) => (
  <div style={{gridColumn:full?"span 2":"span 1"}}>
    <label style={{fontSize:11,fontWeight:600,color:T.txt3,textTransform:"uppercase",letterSpacing:.5,display:"block",marginBottom:5}}>{label}</label>
    {children}
  </div>
);

// Tooltip renderer for recharts
const ChartTip = ({active,payload,label}) => {
  if(!active||!payload?.length) return null;
  return (
    <div style={{background:T.card,border:"1px solid " + T.border,borderRadius:8,padding:"10px 14px",fontSize:12}}>
      {label && <div style={{color:T.txt3,marginBottom:6}}>{label}</div>}
      {payload.map((p,i)=>(
        <div key={i} style={{color:p.color,display:"flex",gap:10,justifyContent:"space-between"}}>
          <span>{p.name}</span><strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   RECOMMENDATION ENGINE
───────────────────────────────────────────────────────────────────────────── */
function runRecommendation(db, req) {
  const results = db.map(m => {
    let pts = 0, max = 0, reasons = [], flags = [];

    // Material type — 25pts
    if (req.type && req.type !== "Any") {
      max += 25;
      if (m.type === req.type) { pts += 25; reasons.push("Material type matches"); }
    }
    // App category — 25pts
    if (req.appCategory && req.appCategory !== "Any") {
      max += 25;
      if (m.appCategory === req.appCategory) { pts += 25; reasons.push("Application category matches"); }
    }
    // Thickness — 15pts (within ±20%)
    if (req.thickness) {
      max += 15; const d = parseFloat(req.thickness);
      const diff = m.thickness - d;
      if (Math.abs(diff) <= d*0.05) { pts += 15; reasons.push("Thickness exact match"); }
      else if (diff >= 0 && diff <= d*0.3) { pts += 10; reasons.push("Thickness within tolerance (+over-spec)"); flags.push("Over-Spec"); }
      else if (Math.abs(diff) <= d*0.2) { pts += 6; }
    }
    // Adhesion — 15pts
    if (req.adhesion) {
      max += 15; const d = parseFloat(req.adhesion);
      if (m.adhesion >= d) { pts += 15; reasons.push(`Adhesion meets requirement (${m.adhesion}gf ≥ ${d}gf)`); }
      else if (m.adhesion >= d * 0.85) { pts += 8; flags.push("Slightly Under-Spec"); }
    }
    // Temperature — 10pts
    if (req.tempMax) {
      max += 10; const d = parseFloat(req.tempMax);
      if (m.tempMax >= d) { pts += 10; reasons.push("Max temp sufficient (" + m.tempMax + "°C)"); }
    }
    // Environment — 10pts
    if (req.environment && req.environment !== "Any") {
      max += 10;
      if (m.environment === "Both" || m.environment === req.environment) { pts += 10; reasons.push("Environment compatible"); }
    }
    // Ink — 10pts
    if (req.ink && req.ink !== "Any") {
      max += 10;
      if (m.ink.toLowerCase().includes(req.ink.toLowerCase())) { pts += 10; reasons.push("Ink/print technology matches"); }
    }
    // UV — 5pts
    if (req.uvResistant) { max += 5; if (m.uvResistant) { pts += 5; reasons.push("UV resistant"); } }
    // Chem — 5pts
    if (req.chemResistant) { max += 5; if (m.chemResistant) { pts += 5; reasons.push("Chemical resistant"); } }

    const pct = max > 0 ? Math.round((pts/max)*100) : (req.keyword ? 0 : 50);

    // Keyword boost
    if (req.keyword) {
      const kw = req.keyword.toLowerCase();
      if (m.name.toLowerCase().includes(kw)||m.code.toLowerCase().includes(kw)||m.applications.toLowerCase().includes(kw)||m.substrate.toLowerCase().includes(kw)) {
        flags.push("Keyword match");
      }
    }

    // Match category label
    let matchLabel = pct>=90?"Exact Match":pct>=70?"Close Match":pct>=45?"Over-Spec Alternative":"Possible Match";

    return { ...m, matchPct: pct, reasons, flags, matchLabel };
  }).filter(m => m.matchPct > 0).sort((a,b)=>b.matchPct-a.matchPct);

  return results;
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGES
───────────────────────────────────────────────────────────────────────────── */

/* ── DASHBOARD ── */
function Dashboard({db,suppliers}) {
  const active = db.filter(m=>m.status==="active").length;
  const dups = db.filter(m=>m.duplicateRisk).length;
  const slow = db.filter(m=>m.status==="slow").length;
  const totalStockVal = db.reduce((a,m)=>a+m.stock*m.cost,0);

  const topUsed = [...db].sort((a,b)=>b.usage-a.usage).slice(0,6);
  const categoryDist = Object.entries(
    db.reduce((acc,m)=>{acc[m.type]=(acc[m.type]||0)+1;return acc;},{}))
    .sort((a,b)=>b[1]-a[1]).slice(0,6)
    .map(([name,value])=>({name,value}));

  const supplierDist = suppliers.map(s=>({
    name:s.name.split(" ")[0],
    materials:db.filter(m=>m.supplierId===s.id).length,
    value:db.filter(m=>m.supplierId===s.id).reduce((a,m)=>a+m.stock*m.cost,0),
  })).filter(s=>s.materials>0).slice(0,5);

  const stockTrend = [
    {month:"Jan",active:4200,slow:800},{month:"Feb",active:4600,slow:750},
    {month:"Mar",active:5100,slow:700},{month:"Apr",active:4900,slow:1200},
    {month:"May",active:5400,slow:900},{month:"Jun",active:5800,slow:600},
  ];

  const PIE_COLORS = [T.primary,T.cyan,T.emerald,T.amber,T.purple,T.rose];

  return (
    <div className="fade-up" style={{padding:"28px 32px",maxWidth:1300}}>
      <SectionHead
        title="Operational Dashboard"
        sub="Real-time inventory health · material intelligence · compliance overview"
      />

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:14,marginBottom:28}}>
        <KPICard label="Total Materials" value={db.length} sub={suppliers.length + " suppliers"} color={T.primary} icon="◈"/>
        <KPICard label="Active" value={active} sub={Math.round(active/db.length*100) + "% of total"} color={T.emerald} icon="◉"/>
        <KPICard label="Duplicate Risk" value={dups} sub="Require review" color={T.amber} icon="⚠"/>
        <KPICard label="Slow Moving" value={slow} sub="Below threshold" color={T.rose} icon="◎"/>
        <KPICard label="Stock Value" value={"$" + Math.round(totalStockVal/1000) + "k"} sub="Total inventory" color={T.cyan} icon="$"/>
      </div>

      {/* Charts row */}
      <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:18,marginBottom:18}}>
        {/* Stock trend */}
        <div className="card" style={{padding:"20px 22px"}}>
          <div style={{fontSize:13,fontWeight:600,color:T.txt1,marginBottom:16}}>Stock Movement — Active vs Slow</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stockTrend} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false}/>
              <XAxis dataKey="month" tick={{fill:T.txt4,fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:T.txt4,fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip content={<ChartTip/>}/>
              <Bar dataKey="active" name="Active Stock" fill={T.primary} radius={[3,3,0,0]}/>
              <Bar dataKey="slow" name="Slow Moving" fill={T.amber} radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category pie */}
        <div className="card" style={{padding:"20px 22px"}}>
          <div style={{fontSize:13,fontWeight:600,color:T.txt1,marginBottom:16}}>Material Type Distribution</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryDist} cx="40%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {categoryDist.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
              </Pie>
              <Tooltip content={<ChartTip/>}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>
            {categoryDist.map((c,i)=>(
              <span key={c.name} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:T.txt3}}>
                <span style={{width:8,height:8,borderRadius:"50%",background:PIE_COLORS[i%PIE_COLORS.length],display:"inline-block"}}/>
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        {/* Top materials */}
        <div className="card" style={{padding:"20px 22px"}}>
          <div style={{fontSize:13,fontWeight:600,color:T.txt1,marginBottom:16}}>Top Materials by Monthly Usage</div>
          {topUsed.map((m,i)=>(
            <div key={m.id} style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
              <span className="mono" style={{color:T.txt4,fontSize:12,minWidth:18}}>{i+1}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:12,color:T.txt1,fontWeight:500,marginBottom:4}}>{m.name}</div>
                <MatchBar pct={Math.round(m.usage/topUsed[0].usage*100)}/>
              </div>
              <span className="mono" style={{color:T.cyan,fontSize:12,minWidth:40,textAlign:"right"}}>{m.usage}</span>
            </div>
          ))}
        </div>

        {/* Supplier chart */}
        <div className="card" style={{padding:"20px 22px"}}>
          <div style={{fontSize:13,fontWeight:600,color:T.txt1,marginBottom:16}}>Supplier Performance</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={supplierDist} layout="vertical" barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} horizontal={false}/>
              <XAxis type="number" tick={{fill:T.txt4,fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis dataKey="name" type="category" tick={{fill:T.txt2,fontSize:12}} axisLine={false} tickLine={false} width={60}/>
              <Tooltip content={<ChartTip/>}/>
              <Bar dataKey="materials" name="Materials" fill={T.primary} radius={[0,3,3,0]}/>
            </BarChart>
          </ResponsiveContainer>
          <div style={{marginTop:14,display:"flex",flexDirection:"column",gap:6}}>
            {suppliers.filter(s=>db.some(m=>m.supplierId===s.id)).slice(0,4).map(s=>(
              <div key={s.id} style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
                <span style={{color:T.txt2}}>{s.name}</span>
                <span className="mono" style={{color:T.txt4}}>{s.leadTime} · ⭐{s.rating}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Duplicate alerts */}
      {db.filter(m=>m.duplicateRisk).length > 0 && (
        <div className="card" style={{padding:"18px 22px",marginTop:18,border:"1px solid " + T.amber + "33"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <span style={{fontSize:16}}>⚠</span>
            <span style={{fontSize:13,fontWeight:600,color:T.amber}}>Duplicate Risk — Consolidation Opportunity</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {db.filter(m=>m.duplicateRisk).map(m=>(
              <div key={m.id} style={{background:T.surface,borderRadius:8,padding:"10px 14px",border:"1px solid " + T.border}}>
                <div style={{fontSize:13,fontWeight:600,color:T.txt1,marginBottom:4}}>{m.name}</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <span className="mono" style={{fontSize:11,color:T.txt4}}>{m.code}</span>
                  <span className="mono" style={{fontSize:11,color:T.cyan}}>{m.thickness}mm</span>
                  <StatusTag label="Review" color={T.amber}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── MATERIALS TABLE ── */
function MaterialsPage({db,setDb,onSelect}) {
  const [search,setSearch]=useState("");
  const [filters,setFilters]=useState({type:"All",env:"All",supplier:"All",status:"All"});
  const [sort,setSort]=useState({key:"name",dir:1});

  const types=["All",...new Set(db.map(m=>m.type))];
  const envs=["All","Indoor","Outdoor","Both"];
  const supplierNames=["All",...new Set(db.map(m=>m.supplier))];
  const statuses=["All","active","slow"];

  const filtered = useMemo(()=>{
    return db.filter(m=>{
      if(filters.type!=="All"&&m.type!==filters.type) return false;
      if(filters.env!=="All"&&m.environment!==filters.env&&m.environment!=="Both") return false;
      if(filters.supplier!=="All"&&m.supplier!==filters.supplier) return false;
      if(filters.status!=="All"&&m.status!==filters.status) return false;
      if(search){
        const q=search.toLowerCase();
        return m.name.toLowerCase().includes(q)||m.code.toLowerCase().includes(q)||m.supplier.toLowerCase().includes(q)||m.applications.toLowerCase().includes(q);
      }
      return true;
    }).sort((a,b)=>{
      const va=a[sort.key], vb=b[sort.key];
      return typeof va==="string"?va.localeCompare(vb)*sort.dir:(va-vb)*sort.dir;
    });
  },[db,filters,sort,search]);

  const setFilter=k=>v=>setFilters(f=>({...f,[k]:v}));
  const toggleSort=k=>setSort(s=>s.key===k?{key:k,dir:-s.dir}:{key:k,dir:1});
  const SortIcon=({k})=><span style={{color:sort.key===k?T.primary:T.txt4,fontSize:10,marginLeft:3}}>{sort.key===k?(sort.dir===1?"▲":"▼"):"⇅"}</span>;

  return (
    <div className="fade-up" style={{padding:"28px 32px",maxWidth:1300}}>
      <SectionHead
        title="Material Database"
        sub={db.length + " materials · " + new Set(db.map(m=>m.supplier)).size + " suppliers"}
      />

      {/* Filters bar */}
      <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{position:"relative",flex:"0 0 260px"}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:T.txt4,fontSize:14}}>⌕</span>
          <input className="input" placeholder="Search materials, codes, applications…" value={search} onChange={e=>setSearch(e.target.value)} style={{paddingLeft:30}}/>
        </div>
        {[["type",types],["env",envs],["supplier",supplierNames],["status",statuses]].map(([k,opts])=>(
          <select key={k} className="select" style={{width:"auto",flex:"0 0 auto"}} value={filters[k]} onChange={e=>setFilter(k)(e.target.value)}>
            {opts.map(o=><option key={o} style={{background:T.card}}>{o}</option>)}
          </select>
        ))}
        <span style={{marginLeft:"auto",fontSize:12,color:T.txt4}}>{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="card" style={{overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead style={{background:T.surface}}>
            <tr>
              <TH>Material</TH>
              <TH>Type</TH>
              <TH><span onClick={()=>toggleSort("thickness")} style={{cursor:"pointer"}}>Thickness<SortIcon k="thickness"/></span></TH>
              <TH><span onClick={()=>toggleSort("adhesion")} style={{cursor:"pointer"}}>Adhesion<SortIcon k="adhesion"/></span></TH>
              <TH>Temp Range</TH>
              <TH>Environment</TH>
              <TH>Compliance</TH>
              <TH>Status</TH>
              <TH>TDS</TH>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m,i)=>(
              <tr key={m.id} className="tr-row" onClick={()=>onSelect(m)} style={{background:i%2===0?T.card:"transparent",borderBottom:"1px solid " + T.border}}>
                <td style={{padding:"10px 14px"}}>
                  <div style={{fontWeight:600,color:T.txt1,fontSize:13}}>{m.name}</div>
                  <div style={{display:"flex",gap:6,marginTop:3,flexWrap:"wrap"}}>
                    <span className="mono" style={{fontSize:11,color:T.txt4}}>{m.code}</span>
                    {m.duplicateRisk&&<StatusTag label="Dup Risk" color={T.amber}/>}
                  </div>
                </td>
                <TD><StatusTag label={m.type} color={T.primary}/></TD>
                <TD mono>{m.thickness}mm</TD>
                <TD mono>{m.adhesion}gf</TD>
                <td style={{padding:"10px 14px"}}><span className="mono" style={{fontSize:12,color:T.txt3}}>{m.tempMin}° / {m.tempMax}°C</span></td>
                <TD><StatusTag label={m.environment} color={m.environment==="Outdoor"?T.amber:m.environment==="Both"?T.emerald:T.primary}/></TD>
                <td style={{padding:"10px 14px"}}>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                    {(m.compliance||[]).slice(0,2).map(c=><CompTag key={c} std={c}/>)}
                    {(m.compliance||[]).length>2&&<span className="tag" style={{background:T.border,color:T.txt3}}>+{m.compliance.length-2}</span>}
                  </div>
                </td>
                <TD><StatusTag label={m.status} color={m.status==="active"?T.emerald:T.amber}/></TD>
                <td style={{padding:"10px 14px"}}>{m.tdsFile?<StatusTag label="📄 TDS" color={T.cyan}/>:<span style={{color:T.txt4,fontSize:12}}>—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── MATERIAL DETAIL ── */
function MaterialDetail({material,db,onBack}) {
  const [tab,setTab]=useState("specs");
  if(!material) return null;
  const m=material;
  const similar=db.filter(x=>x.id!==m.id&&Math.abs(x.thickness-m.thickness)<=0.025&&x.environment===m.environment).slice(0,4);

  const specRows=[
    ["Material Type",m.type],["Substrate",m.substrate],["Thickness",m.thickness + "mm"],
    ["Adhesion Force",m.adhesion + "gf"],["Min Temperature",m.tempMin + "°C"],["Max Temperature",m.tempMax + "°C"],
    ["Environment",m.environment],["Ink Compatibility",m.ink],["UV Resistant",m.uvResistant?"Yes":"No"],
    ["Chem Resistant",m.chemResistant?"Yes":"No"],["Finish",m.finish],["Shelf Life",m.shelfLife],
    ["Cost ($/m²)","$" + m.cost],["Stock",m.stock+" units"],["Monthly Usage",m.usage+" units"],
  ];

  return (
    <div className="fade-up" style={{padding:"28px 32px",maxWidth:1100}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20}}>
        <button className="btn-secondary" onClick={onBack} style={{padding:"6px 12px",fontSize:12}}>← Back</button>
        <span style={{color:T.txt4,fontSize:12}}>Materials /</span>
        <span style={{color:T.txt2,fontSize:12}}>{m.name}</span>
      </div>

      {/* Header */}
      <div className="card" style={{padding:"22px 26px",marginBottom:18}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <span className="mono" style={{background:T.surface,border:"1px solid " + T.border,borderRadius:6,padding:"4px 10px",fontSize:13,color:T.primary,fontWeight:600}}>{m.code}</span>
              <StatusTag label={m.status} color={m.status==="active"?T.emerald:T.amber}/>
              {m.duplicateRisk&&<StatusTag label="Duplicate Risk" color={T.amber}/>}
              {m.tdsFile&&<StatusTag label="📄 TDS Available" color={T.cyan}/>}
            </div>
            <h1 style={{fontSize:21,fontWeight:700,color:T.txt1,letterSpacing:-.3}}>{m.name}</h1>
            <div style={{fontSize:13,color:T.txt3,marginTop:4}}>{m.supplier} · {m.substrate}</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="btn-secondary">Export PDF</button>
            <button className="btn-primary">Add to Compare</button>
          </div>
        </div>
        <div style={{display:"flex",gap:6,marginTop:14,flexWrap:"wrap"}}>
          {(m.compliance||[]).map(c=><CompTag key={c} std={c}/>)}
        </div>
      </div>

      {/* Tabs */}
      <div style={{borderBottom:"1px solid " + T.border,marginBottom:18,display:"flex",gap:0}}>
        {["specs","compliance","similar","usage"].map(t=>(
          <button key={t} className={"tab-btn " + (tab===t?"active":"")} onClick={()=>setTab(t)}>
            {t==="specs"?"Technical Specs":t==="compliance"?"Compliance":t==="similar"?"Similar Materials":"Usage & Stock"}
          </button>
        ))}
      </div>

      {tab==="specs" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div className="card" style={{padding:22}}>
            <div style={{fontSize:12,fontWeight:700,color:T.txt4,textTransform:"uppercase",letterSpacing:.5,marginBottom:14}}>Physical Properties</div>
            {specRows.slice(0,8).map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid " + T.border}}>
                <span style={{fontSize:13,color:T.txt3}}>{k}</span>
                <span className="mono" style={{fontSize:13,color:T.txt1,fontWeight:500}}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div className="card" style={{padding:22}}>
              <div style={{fontSize:12,fontWeight:700,color:T.txt4,textTransform:"uppercase",letterSpacing:.5,marginBottom:14}}>Commercial Details</div>
              {specRows.slice(8).map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid " + T.border}}>
                  <span style={{fontSize:13,color:T.txt3}}>{k}</span>
                  <span className="mono" style={{fontSize:13,color:T.txt1,fontWeight:500}}>{v}</span>
                </div>
              ))}
            </div>
            {m.notes&&(
              <div className="card" style={{padding:18,border:"1px solid " + T.amber + "33"}}>
                <div style={{fontSize:12,fontWeight:700,color:T.amber,marginBottom:6}}>⚠ Engineering Notes</div>
                <div style={{fontSize:13,color:T.txt2,lineHeight:1.6}}>{m.notes}</div>
              </div>
            )}
            <div className="card" style={{padding:18}}>
              <div style={{fontSize:12,fontWeight:700,color:T.txt4,textTransform:"uppercase",letterSpacing:.5,marginBottom:10}}>Applications</div>
              <div style={{fontSize:13,color:T.txt2,lineHeight:1.6}}>{m.applications}</div>
            </div>
          </div>
        </div>
      )}

      {tab==="compliance" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {(m.compliance||[]).map(std=>{
            const s=COMPLIANCE_STANDARDS[std];
            const c=s?.color||T.txt3;
            return(
              <div key={std} className="card" style={{padding:20,border:"1px solid " + c + "33"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <span style={{fontSize:24}}>{s?.icon}</span>
                  <div>
                    <div style={{fontWeight:700,color:T.txt1,fontSize:14}}>{std}</div>
                    <div style={{fontSize:11,color:T.txt4}}>{s?.full}</div>
                  </div>
                  <span className="tag" style={{marginLeft:"auto",background:c + "18",color:c,border:"1px solid " + c + "28"}}>Certified</span>
                </div>
                <div style={{fontSize:12,color:T.txt3,marginBottom:8}}>📍 Region: <strong style={{color:T.txt2}}>{s?.region}</strong></div>
                <div style={{fontSize:12,color:T.txt2,lineHeight:1.5}}>{s?.description}</div>
                {m.complianceNotes&&<div style={{marginTop:10,fontSize:12,color:c,background:c + "0d",borderRadius:6,padding:"6px 10px"}}>{m.complianceNotes}</div>}
              </div>
            );
          })}
        </div>
      )}

      {tab==="similar" && (
        <div>
          {similar.length===0?<div style={{color:T.txt3,fontSize:14,textAlign:"center",padding:"40px 0"}}>No similar materials found in the database.</div>:
          similar.map(s=>(
            <div key={s.id} className="card" style={{padding:"16px 20px",marginBottom:12,border:"1px solid " + T.amber + "33"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:T.txt1,marginBottom:4}}>{s.name}</div>
                  <div style={{display:"flex",gap:8}}>
                    <span className="mono" style={{fontSize:12,color:T.txt4}}>{s.code}</span>
                    <span className="mono" style={{fontSize:12,color:T.cyan}}>{s.thickness}mm</span>
                    <span className="mono" style={{fontSize:12,color:T.primary}}>{s.adhesion}gf</span>
                  </div>
                </div>
                <StatusTag label="Review for Consolidation" color={T.amber}/>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="usage" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
          {[["Current Stock",m.stock+" units",T.primary],["Monthly Usage",m.usage+" units",T.cyan],["Months of Cover",m.usage>0?Math.round(m.stock/m.usage)+"mo":"∞",m.usage>0&&m.stock/m.usage<3?T.emerald:m.usage>0&&m.stock/m.usage>8?T.rose:T.amber]].map(([l,v,c])=>(
            <div key={l} className="card" style={{padding:"18px 20px",textAlign:"center"}}>
              <div style={{fontSize:28,fontWeight:700,color:c,fontFamily:"'IBM Plex Mono',monospace",marginBottom:4}}>{v}</div>
              <div style={{fontSize:13,color:T.txt3}}>{l}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── RECOMMENDATION ENGINE ── */
function RecommendPage({db}) {
  const TYPES=["Any","Vinyl","PET (Polyester)","Polycarbonate","Foam","Reflective Film","Adhesive Tape","Thermal Transfer","Outdoor-Durable","High-Temperature Resistant"];
  const APP_CATS=["Any","Indoor Labels — General / Stickers","Indoor Labels — Barcode & Product","Outdoor Labels — UV Resistant","Outdoor Labels — Weatherproof","Outdoor Labels — Chemical Resistant","Automotive — Engine Bay / Warning","Electronics — Nameplate / Insulation","Safety — Lockout / Tagout","Telecom / Electrical — Cable & Wire ID"];
  const INK_TYPES=["Any","Thermal Transfer","Direct Thermal","UV Inkjet","Solvent Inkjet","None"];

  const [req,setReq]=useState({type:"Any",appCategory:"Any",thickness:"",adhesion:"",tempMax:"",environment:"Any",ink:"Any",uvResistant:false,chemResistant:false,keyword:""});
  const [results,setResults]=useState(null);
  const set=k=>v=>setReq(r=>({...r,[k]:v}));

  function run(){setResults(runRecommendation(db,req));}

  const matchColor={
    "Exact Match":T.emerald,"Close Match":T.primary,
    "Over-Spec Alternative":T.cyan,"Possible Match":T.amber
  };

  const hasReq=Object.entries(req).some(([k,v])=>k!=="keyword"&&v&&v!=="Any"&&v!==false&&v!=="");

  return(
    <div className="fade-up" style={{padding:"28px 32px",maxWidth:1200}}>
      <SectionHead title="Smart Recommendation Engine" sub="Describe your application requirements — the engine finds the best in-stock match with intelligent scoring"/>

      <div style={{display:"grid",gridTemplateColumns:"340px 1fr",gap:24,alignItems:"start"}}>
        {/* Input panel */}
        <div>
          <div className="card" style={{padding:22}}>
            <div style={{fontSize:12,fontWeight:700,color:T.primary,textTransform:"uppercase",letterSpacing:.5,marginBottom:16}}>▸ Application Requirements</div>

            <div style={{display:"grid",gap:12}}>
              <div>
                <label style={{fontSize:11,fontWeight:600,color:T.txt4,textTransform:"uppercase",letterSpacing:.5,display:"block",marginBottom:5}}>Material Type</label>
                <select className="select" value={req.type} onChange={e=>set("type")(e.target.value)}>
                  {TYPES.map(t=><option key={t} style={{background:T.card}}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:11,fontWeight:600,color:T.txt4,textTransform:"uppercase",letterSpacing:.5,display:"block",marginBottom:5}}>Application Category</label>
                <select className="select" value={req.appCategory} onChange={e=>set("appCategory")(e.target.value)}>
                  {APP_CATS.map(a=><option key={a} style={{background:T.card}}>{a}</option>)}
                </select>
              </div>
              {[["Thickness (mm)","thickness","0.10"],["Min Adhesion (gf)","adhesion","900"],["Max Temp (°C)","tempMax","100"]].map(([l,k,p])=>(
                <div key={k}>
                  <label style={{fontSize:11,fontWeight:600,color:T.txt4,textTransform:"uppercase",letterSpacing:.5,display:"block",marginBottom:5}}>{l}</label>
                  <input className="input" type="number" placeholder={p} value={req[k]} onChange={e=>set(k)(e.target.value)}/>
                </div>
              ))}
              <div>
                <label style={{fontSize:11,fontWeight:600,color:T.txt4,textTransform:"uppercase",letterSpacing:.5,display:"block",marginBottom:5}}>Environment</label>
                <select className="select" value={req.environment} onChange={e=>set("environment")(e.target.value)}>
                  {["Any","Indoor","Outdoor","Both"].map(v=><option key={v} style={{background:T.card}}>{v}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:11,fontWeight:600,color:T.txt4,textTransform:"uppercase",letterSpacing:.5,display:"block",marginBottom:5}}>Ink / Print Type</label>
                <select className="select" value={req.ink} onChange={e=>set("ink")(e.target.value)}>
                  {INK_TYPES.map(v=><option key={v} style={{background:T.card}}>{v}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:11,fontWeight:600,color:T.txt4,textTransform:"uppercase",letterSpacing:.5,display:"block",marginBottom:5}}>Keyword Search</label>
                <input className="input" placeholder="e.g. cable, PCB, engine…" value={req.keyword} onChange={e=>set("keyword")(e.target.value)}/>
              </div>
              <div style={{display:"flex",gap:16,paddingTop:4}}>
                {[["uvResistant","UV Resistant"],["chemResistant","Chemical Resistant"]].map(([k,l])=>(
                  <label key={k} style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",fontSize:12,color:T.txt2}}>
                    <div onClick={()=>set(k)(!req[k])} style={{width:36,height:20,borderRadius:10,background:req[k]?T.primary:T.border2,position:"relative",cursor:"pointer",transition:"background .2s",flexShrink:0}}>
                      <div style={{position:"absolute",top:2,left:req[k]?17:2,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"left .2s"}}/>
                    </div>{l}
                  </label>
                ))}
              </div>
            </div>

            <button className="btn-primary" onClick={run} style={{width:"100%",marginTop:18,justifyContent:"center"}}>
              Run Recommendation →
            </button>
            {hasReq&&<button className="btn-secondary" onClick={()=>{setReq({type:"Any",appCategory:"Any",thickness:"",adhesion:"",tempMax:"",environment:"Any",ink:"Any",uvResistant:false,chemResistant:false,keyword:""});setResults(null);}} style={{width:"100%",marginTop:8,justifyContent:"center"}}>Clear</button>}
          </div>
        </div>

        {/* Results */}
        <div>
          {!results&&(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:300,color:T.txt4,gap:12}}>
              <div style={{fontSize:48}}>◉</div>
              <div style={{fontSize:14}}>Set your requirements and click Run Recommendation</div>
            </div>
          )}
          {results&&results.length===0&&(
            <div className="card" style={{padding:40,textAlign:"center",color:T.txt3}}>
              <div style={{fontSize:32,marginBottom:12}}>◎</div>
              <div>No materials match your hard filters. Try relaxing UV/Chem/Temp requirements.</div>
            </div>
          )}
          {results&&results.length>0&&(
            <div>
              <div style={{fontSize:13,color:T.txt3,marginBottom:14}}>
                <strong style={{color:T.txt1}}>{results.length}</strong> materials ranked by suitability
              </div>
              {results.map((m,i)=>(
                <div key={m.id} className="card" style={{padding:"18px 20px",marginBottom:12,border:i===0?"1px solid " + T.emerald + "44":"1px solid " + T.border}}>
                  {i===0&&<div style={{fontSize:10,fontWeight:700,color:T.emerald,marginBottom:8,letterSpacing:.5,textTransform:"uppercase"}}>★ Best Match</div>}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                        <span style={{fontWeight:700,color:T.txt1,fontSize:14}}>{m.name}</span>
                        <StatusTag label={m.matchLabel} color={matchColor[m.matchLabel]||T.primary}/>
                        {m.flags.map(f=><StatusTag key={f} label={f} color={T.cyan}/>)}
                      </div>
                      <div style={{fontSize:12,color:T.txt4,marginBottom:10}}>{m.supplier} · {m.type} · {m.appCategory}</div>
                      {/* Why recommended */}
                      {m.reasons.length>0&&(
                        <div style={{background:T.surface,borderRadius:7,padding:"10px 12px",border:"1px solid " + T.border}}>
                          <div style={{fontSize:11,fontWeight:700,color:T.txt4,marginBottom:6,textTransform:"uppercase",letterSpacing:.4}}>Why recommended</div>
                          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                            {m.reasons.map(r=>(
                              <span key={r} style={{fontSize:11,color:T.emerald,background:T.emerald + "10",border:"1px solid " + T.emerald + "22",borderRadius:4,padding:"2px 7px"}}>✓ {r}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div style={{minWidth:160,flexShrink:0}}>
                      <div style={{fontSize:10,color:T.txt4,marginBottom:6,textTransform:"uppercase",letterSpacing:.4}}>Match Score</div>
                      <MatchBar pct={m.matchPct}/>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:12}}>
                        {[["Thickness",m.thickness + "mm",T.cyan],["Adhesion",m.adhesion + "gf",T.primary],["Max Temp",m.tempMax + "°C",T.amber],["Stock",m.stock,T.emerald]].map(([l,v,c])=>(
                          <div key={l} style={{background:T.surface,borderRadius:6,padding:"6px 8px",textAlign:"center"}}>
                            <div className="mono" style={{fontSize:12,color:c,fontWeight:600}}>{v}</div>
                            <div style={{fontSize:10,color:'rgba(255,255,255,0.6)'}}>{l}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── COMPLIANCE PAGE ── */
function CompliancePage({db}) {
  const [subTab,setSubTab]=useState("overview");
  const [filterStd,setFilterStd]=useState("All");
  const [checkReq,setCheckReq]=useState([]);
  const [checkResults,setCheckResults]=useState(null);

  const stdSummary=Object.keys(COMPLIANCE_STANDARDS).map(std=>({
    std,count:db.filter(m=>(m.compliance||[]).includes(std)).length,...COMPLIANCE_STANDARDS[std]
  }));

  const filteredMats=filterStd==="All"?db:db.filter(m=>(m.compliance||[]).includes(filterStd));

  function toggleReq(std){setCheckReq(r=>r.includes(std)?r.filter(s=>s!==std):[...r,std]);setCheckResults(null);}
  function runCheck(){
    if(!checkReq.length)return;
    const matched=db.filter(m=>checkReq.every(s=>(m.compliance||[]).includes(s)));
    const partial=db.filter(m=>!checkReq.every(s=>(m.compliance||[]).includes(s))&&checkReq.some(s=>(m.compliance||[]).includes(s)));
    setCheckResults({matched,partial});
  }

  return(
    <div className="fade-up" style={{padding:"28px 32px",maxWidth:1200}}>
      <SectionHead title="Compliance Centre" sub="Regulatory standards across all materials — RoHS, REACH, UL, CE, CSA, FDA and more"/>

      {/* Summary cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
        {stdSummary.map(s=>(
          <div key={s.std} className={"card card-interactive"} onClick={()=>setFilterStd(filterStd===s.std?"All":s.std)}
            style={{padding:"14px 16px",border:filterStd===s.std?"1px solid " + s.color + "55":"1px solid " + T.border,background:filterStd===s.std?s.color + "0c":T.card}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                <span style={{fontSize:18}}>{s.icon}</span>
                <span style={{fontWeight:700,color:filterStd===s.std?s.color:T.txt1,fontSize:13}}>{s.std}</span>
              </div>
              <span className="mono" style={{fontSize:16,fontWeight:600,color:s.color}}>{s.count}</span>
            </div>
            <div style={{fontSize:11,color:T.txt4}}>{s.region}</div>
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div style={{borderBottom:"1px solid " + T.border,marginBottom:20,display:"flex"}}>
        {[["overview","Materials Overview"],["reference","Standards Reference"],["checker","Compliance Checker"]].map(([id,label])=>(
          <button key={id} className={"tab-btn " + (subTab===id?"active":"")} onClick={()=>setSubTab(id)}>{label}</button>
        ))}
      </div>

      {/* OVERVIEW */}
      {subTab==="overview"&&(
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,flexWrap:"wrap"}}>
            <span style={{fontSize:12,color:T.txt4}}>Filter:</span>
            {["All",...Object.keys(COMPLIANCE_STANDARDS)].map(s=>{
              const info=COMPLIANCE_STANDARDS[s];
              return(
                <span key={s} onClick={()=>setFilterStd(s)}
                  style={{cursor:"pointer",padding:"4px 10px",borderRadius:20,fontSize:11,fontWeight:600,border:"1px solid " + filterStd===s?(info?.color||T.primary):T.border,background:filterStd===s?(info?.color||T.primary)+"18":"transparent",color:filterStd===s?(info?.color||T.primary):T.txt3,transition:"all .15s"}}>
                  {s==="All"?"All":s}
                </span>
              );
            })}
          </div>
          <div className="card" style={{overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead style={{background:T.surface}}>
                <tr><TH>Material</TH><TH>Type</TH><TH>Compliance Standards</TH><TH>Notes</TH></tr>
              </thead>
              <tbody>
                {filteredMats.map((m,i)=>(
                  <tr key={m.id} className="tr-row" style={{background:i%2===0?T.card:"transparent",borderBottom:"1px solid " + T.border}}>
                    <td style={{padding:"11px 14px"}}>
                      <div style={{fontWeight:600,color:T.txt1,fontSize:13}}>{m.name}</div>
                      <span className="mono" style={{fontSize:11,color:T.txt4}}>{m.code} · {m.supplier}</span>
                    </td>
                    <TD><StatusTag label={m.type} color={T.primary}/></TD>
                    <td style={{padding:"11px 14px"}}>
                      <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                        {(m.compliance||[]).length===0?<span style={{color:T.txt4,fontSize:12}}>Not specified</span>:(m.compliance||[]).map(c=><CompTag key={c} std={c}/>)}
                      </div>
                    </td>
                    <td style={{padding:"11px 14px",fontSize:12,color:T.txt3,maxWidth:280}}>{m.complianceNotes||"—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REFERENCE */}
      {subTab==="reference"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {Object.entries(COMPLIANCE_STANDARDS).map(([std,s])=>{
            const mats=db.filter(m=>(m.compliance||[]).includes(std));
            return(
              <div key={std} className="card" style={{padding:"18px 20px",border:"1px solid " + s.color + "22"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <span style={{fontSize:22}}>{s.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,color:T.txt1,fontSize:14}}>{std}</div>
                    <div style={{fontSize:11,color:T.txt4}}>{s.full}</div>
                  </div>
                  <span className="mono" style={{fontSize:14,fontWeight:600,color:s.color}}>{mats.length}</span>
                </div>
                <div style={{background:T.surface,borderRadius:7,padding:"9px 11px",fontSize:12,color:T.txt3,lineHeight:1.55,marginBottom:10}}>{s.description}</div>
                <div style={{fontSize:11,color:T.txt4,marginBottom:8}}>📍 Region: <strong style={{color:T.txt2}}>{s.region}</strong></div>
                {mats.length>0&&(
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {mats.map(m=>(
                      <span key={m.id} style={{background:s.color + "15",color:s.color,border:"1px solid " + s.color + "25",borderRadius:4,padding:"2px 7px",fontSize:11,fontWeight:600}}>{m.code}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* CHECKER */}
      {subTab==="checker"&&(
        <div>
          <div style={{background:T.primary + "0c",border:"1px solid " + T.primary + "33",borderRadius:10,padding:"12px 16px",marginBottom:20,fontSize:13,color:T.primary}}>
            ✅ Select the standards your customer or project requires — SOLUTION will show which materials already qualify.
          </div>
          <div className="card" style={{padding:22,marginBottom:20}}>
            <div style={{fontSize:12,fontWeight:700,color:T.txt4,textTransform:"uppercase",letterSpacing:.5,marginBottom:14}}>Required standards</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18}}>
              {Object.entries(COMPLIANCE_STANDARDS).map(([std,s])=>(
                <label key={std} onClick={()=>toggleReq(std)}
                  style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",border:"1px solid " + checkReq.includes(std)?s.color:T.border,borderRadius:9,background:checkReq.includes(std)?s.color + "0e":T.surface,cursor:"pointer",transition:"all .15s"}}>
                  <div style={{width:17,height:17,borderRadius:4,border:"2px solid " + checkReq.includes(std)?s.color:T.border2,background:checkReq.includes(std)?s.color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .15s"}}>
                    {checkReq.includes(std)&&<span style={{color:"#000",fontSize:10,fontWeight:800}}>✓</span>}
                  </div>
                  <div>
                    <div style={{fontWeight:600,fontSize:12,color:checkReq.includes(std)?s.color:T.txt2}}>{s.icon} {std}</div>
                    <div style={{fontSize:10,color:'rgba(255,255,255,0.6)'}}>{s.region}</div>
                  </div>
                </label>
              ))}
            </div>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <button className="btn-primary" onClick={runCheck} style={{opacity:checkReq.length===0?.5:1}}>Check Materials →</button>
              {checkReq.length>0&&<button className="btn-secondary" onClick={()=>{setCheckReq([]);setCheckResults(null);}}>Clear</button>}
            </div>
          </div>

          {checkResults&&(
            <div>
              {/* Fully compliant */}
              <div style={{marginBottom:20}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                  <span style={{fontSize:16}}>✅</span>
                  <span style={{fontWeight:700,color:T.emerald,fontSize:14}}>Fully Compliant — {checkResults.matched.length} material{checkResults.matched.length!==1?"s":""}</span>
                </div>
                {checkResults.matched.length===0?(
                  <div className="card" style={{padding:20,color:T.txt3,textAlign:"center",border:"1px solid " + T.rose + "33"}}>No materials currently hold all selected standards.</div>
                ):checkResults.matched.map((m,i)=>(
                  <div key={m.id} className="card" style={{padding:"14px 18px",marginBottom:10,border:i===0?"1px solid " + T.emerald + "44":"1px solid " + T.border}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        {i===0&&<div style={{fontSize:10,fontWeight:700,color:T.emerald,marginBottom:4,letterSpacing:.4,textTransform:"uppercase"}}>★ Best Match</div>}
                        <div style={{fontWeight:700,color:T.txt1,fontSize:14,marginBottom:4}}>{m.name}</div>
                        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{(m.compliance||[]).map(c=><CompTag key={c} std={c}/>)}</div>
                      </div>
                      <StatusTag label="✓ Compliant" color={T.emerald}/>
                    </div>
                    {m.complianceNotes&&<div style={{marginTop:10,fontSize:12,color:T.emerald,background:T.emerald + "0c",borderRadius:6,padding:"6px 10px"}}>{m.complianceNotes}</div>}
                  </div>
                ))}
              </div>

              {/* Partial */}
              {checkResults.partial.length>0&&(
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                    <span>⚠️</span>
                    <span style={{fontWeight:700,color:T.amber,fontSize:14}}>Partial — {checkResults.partial.length} material{checkResults.partial.length!==1?"s":""} (missing some standards)</span>
                  </div>
                  {checkResults.partial.map(m=>{
                    const missing=checkReq.filter(s=>!(m.compliance||[]).includes(s));
                    const has=checkReq.filter(s=>(m.compliance||[]).includes(s));
                    return(
                      <div key={m.id} className="card" style={{padding:"14px 18px",marginBottom:10,border:"1px solid " + T.amber + "33"}}>
                        <div style={{fontWeight:600,color:T.txt1,fontSize:13,marginBottom:8}}>{m.name} <span className="mono" style={{fontSize:11,color:T.txt4}}>{m.code}</span></div>
                        <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                          <div>
                            <div style={{fontSize:11,color:T.emerald,fontWeight:600,marginBottom:4}}>Has:</div>
                            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{has.map(s=><CompTag key={s} std={s}/>)}</div>
                          </div>
                          <div>
                            <div style={{fontSize:11,color:T.rose,fontWeight:600,marginBottom:4}}>Missing:</div>
                            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{missing.map(s=><span key={s} className="tag" style={{background:T.rose + "15",color:T.rose,border:"1px solid " + T.rose + "28"}}>✗ {s}</span>)}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}




/* ── ADD MATERIAL + STOCK + PRICING + COMPRESSION COMPARISON ── */
/* ── ADD MATERIAL — TDS READER (PDF + Image + Text) ── */
function UploadTDSPage({onAdd, db}) {
  const [mode, setMode]       = useState("choose");  // choose | pdf | image | paste | loading | review | done
  const [log, setLog]         = useState([]);
  const [form, setForm]       = useState(null);
  const [fileName, setFileName] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [error, setError]     = useState("");
  const [tried, setTried]     = useState(false);

  // Stock & Pricing state
  const [stock, setStock]           = useState("");
  const [cost, setCost]             = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [moq, setMoq]               = useState("");
  const [leadTime, setLeadTime]     = useState("");
  const [currency, setCurrency]     = useState("USD");
  const [warehouse, setWarehouse]   = useState("");
  const [supplierPartNo, setSupplierPartNo] = useState("");

  const TYPES = ["Vinyl","PET (Polyester)","Polycarbonate","Foam","Reflective Film","Adhesive Tape","Thermal Transfer","Outdoor-Durable","High-Temperature Resistant"];
  const APP_CATS = ["Indoor Labels - General / Stickers","Indoor Labels - Barcode & Product","Outdoor Labels - UV Resistant","Outdoor Labels - Weatherproof","Outdoor Labels - Chemical Resistant","Automotive - Engine Bay / Warning","Electronics - Nameplate / Insulation","Safety - Lockout / Tagout","Telecom / Electrical - Cable & Wire ID"];

  const EXTRACT_PROMPT = "You are an expert TDS extraction AI. Extract ALL technical data. Return ONLY valid JSON, no markdown: {\"code\":\"\",\"name\":\"\",\"supplier\":\"\",\"substrate\":\"\",\"adhesiveType\":\"\",\"liner\":\"\",\"type\":\"Vinyl\",\"thickness_total_mm\":0,\"thickness_substrate_mm\":0,\"thickness_adhesive_mm\":0,\"adhesion_tack_gf\":0,\"adhesion_steel_15min_ozin\":0,\"adhesion_steel_24hr_ozin\":0,\"adhesion_steel_N100mm\":0,\"adhesion_powdercoat_ozin\":0,\"adhesion_pp_ozin\":0,\"adhesion_abs_ozin\":0,\"adhesion_glass_ozin\":0,\"dielectric_volts\":0,\"tempMin_C\":0,\"tempMax_C\":0,\"tempMax_shortterm_C\":0,\"minApplicationTemp_C\":0,\"environment\":\"Both\",\"uvResistant\":false,\"chemResistant\":false,\"halogenFree\":false,\"ink\":\"Thermal Transfer\",\"recommendedRibbons\":\"\",\"finish\":\"\",\"color\":\"\",\"shelfLife\":\"\",\"outdoorDurability\":\"\",\"abrasionResistance\":\"\",\"appCategory\":\"Indoor Labels - Barcode & Product\",\"applications\":\"\",\"compliance\":[],\"complianceNotes\":\"\",\"ulFileNumber\":\"\",\"csaFileNumber\":\"\",\"rohsDirective\":\"\",\"notes\":\"\",\"chemicalResistanceNotes\":\"\",\"effectiveDate\":\"\"}";

  function resetAll() {
    setMode("choose"); setLog([]); setForm(null); setFileName(""); setPasteText(""); setError(""); setTried(false);
    setStock(""); setCost(""); setSellingPrice(""); setMoq(""); setLeadTime("");
    setCurrency("USD"); setWarehouse(""); setSupplierPartNo("");
  }

  const set = k => v => setForm(f => ({...f, [k]: v}));
  const f = form || {};

  // ── Shared log runner ──
  async function runExtraction(apiBody) {
    setTried(true); setMode("loading"); setLog([]);
    const steps = [
      "Reading document...",
      "Extracting text layers...",
      "Parsing thickness and adhesion values...",
      "Reading temperature range...",
      "Detecting compliance standards (RoHS, UL, REACH)...",
      "Extracting applications and ribbons...",
      "Building material record...",
    ];
    let i = 0;
    const iv = setInterval(() => {
      if (i < steps.length) setLog(l => [...l, steps[i++]]);
      else clearInterval(iv);
    }, 600);

    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 2000, messages: [{ role: "user", content: apiBody }] })
      });
      clearInterval(iv); setLog(steps);
      const data = await resp.json();
      const raw = data.content.map(c => c.text || "").join("").replace(/```json|```/g, "").trim();
      const obj = JSON.parse(raw);
      const count = Object.values(obj).filter(v => v && v !== 0 && v !== "").length;
      setLog(l => [...l, "Done - " + count + " fields extracted"]);
      setForm({
        code: obj.code || "", name: obj.name || "", supplier: obj.supplier || "",
        substrate: obj.substrate || "", adhesiveType: obj.adhesiveType || "Permanent Acrylic",
        liner: obj.liner || "", type: obj.type || "Vinyl",
        thickness: obj.thickness_total_mm || "",
        thickness_sub: obj.thickness_substrate_mm || "",
        thickness_adh: obj.thickness_adhesive_mm || "",
        adhesion: obj.adhesion_tack_gf || "",
        adhesion_steel_15: obj.adhesion_steel_15min_ozin || "",
        adhesion_steel_24: obj.adhesion_steel_24hr_ozin || "",
        adhesion_steel_N: obj.adhesion_steel_N100mm || "",
        adhesion_pc: obj.adhesion_powdercoat_ozin || "",
        adhesion_pp: obj.adhesion_pp_ozin || "",
        adhesion_abs: obj.adhesion_abs_ozin || "",
        adhesion_glass: obj.adhesion_glass_ozin || "",
        dielectric: obj.dielectric_volts || "",
        tempMin: obj.tempMin_C || "", tempMax: obj.tempMax_C || "",
        tempMaxShort: obj.tempMax_shortterm_C || "",
        minAppTemp: obj.minApplicationTemp_C || "",
        environment: obj.environment || "Both",
        uvResistant: !!obj.uvResistant, chemResistant: !!obj.chemResistant,
        halogenFree: !!obj.halogenFree,
        ink: obj.ink || "Thermal Transfer",
        ribbons: obj.recommendedRibbons || "",
        finish: obj.finish || "", color: obj.color || "",
        shelfLife: obj.shelfLife || "",
        outdoorDurability: obj.outdoorDurability || "",
        abrasionResistance: obj.abrasionResistance || "",
        appCategory: obj.appCategory || "Indoor Labels - Barcode & Product",
        applications: obj.applications || "",
        compliance: Array.isArray(obj.compliance) ? obj.compliance : [],
        complianceNotes: obj.complianceNotes || "",
        ulFileNumber: obj.ulFileNumber || "",
        csaFileNumber: obj.csaFileNumber || "",
        rohsDirective: obj.rohsDirective || "",
        notes: obj.notes || "",
        chemResistanceNotes: obj.chemicalResistanceNotes || "",
        effectiveDate: obj.effectiveDate || "",
      });
      setMode("review");
    } catch (e) {
      clearInterval(iv);
      setError("Could not extract data. Try again or use Paste Text method.");
      setMode("choose");
    }
  }

  // ── PDF handler ──
  async function handlePDF(file) {
    if (!file) return;
    setFileName(file.name);
    const b64 = await new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result.split(",")[1]);
      r.onerror = rej;
      r.readAsDataURL(file);
    });
    runExtraction([
      { type: "document", source: { type: "base64", media_type: "application/pdf", data: b64 } },
      { type: "text", text: EXTRACT_PROMPT }
    ]);
  }

  // ── Image handler (photo of TDS) ──
  async function handleImage(file) {
    if (!file) return;
    setFileName(file.name);
    const b64 = await new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result.split(",")[1]);
      r.onerror = rej;
      r.readAsDataURL(file);
    });
    const mime = file.type || "image/jpeg";
    runExtraction([
      { type: "image", source: { type: "base64", media_type: mime, data: b64 } },
      { type: "text", text: EXTRACT_PROMPT }
    ]);
  }

  // ── Paste text handler ──
  function handlePaste() {
    setTried(true);
    if (!pasteText.trim()) { setError("Please paste some TDS text first."); return; }
    setError("");
    runExtraction(EXTRACT_PROMPT + "\n\nTDS TEXT:\n" + pasteText);
  }

  // ── Save to DB ──
  function save() {
    if (!form || !form.name) return;
    onAdd({
      id: Date.now(), code: f.code || f.name, name: f.name, supplier: f.supplier,
      supplierId: "S_NEW", type: f.type, substrate: f.substrate,
      adhesiveType: f.adhesiveType, liner: f.liner,
      thickness: parseFloat(f.thickness) || 0,
      adhesion: parseInt(f.adhesion) || 0,
      adhesion_steel_15: parseFloat(f.adhesion_steel_15) || 0,
      adhesion_steel_24: parseFloat(f.adhesion_steel_24) || 0,
      dielectric: parseFloat(f.dielectric) || 0,
      tempMin: parseInt(f.tempMin) || 0, tempMax: parseInt(f.tempMax) || 0,
      environment: f.environment, ink: f.ink,
      uvResistant: f.uvResistant, chemResistant: f.chemResistant, halogenFree: f.halogenFree,
      finish: f.finish, color: f.color, shelfLife: f.shelfLife,
      outdoorDurability: f.outdoorDurability, abrasionResistance: f.abrasionResistance,
      appCategory: f.appCategory, applications: f.applications,
      compliance: f.compliance, complianceNotes: f.complianceNotes,
      ulFileNumber: f.ulFileNumber, csaFileNumber: f.csaFileNumber,
      notes: f.notes, tdsFile: fileName,
      cost: parseFloat(cost) || 0, stock: parseInt(stock) || 0, usage: 0,
      sellingPrice: parseFloat(sellingPrice) || 0,
      moq: parseInt(moq) || 0, leadTime, currency, warehouse,
      supplierPartNo, status: "active", duplicateRisk: false,
    });
    setMode("done");
  }

  const cardStyle = { padding: 22, marginBottom: 14 };
  const IS = { width: "100%", background: T.surface, border: "1px solid " + T.border, borderRadius: 7, padding: "9px 12px", color: T.txt1, fontSize: 13, fontFamily: "inherit" };
  const LS = { fontSize: 10, fontWeight: 700, color: T.txt4, textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 5 };

  // ── DONE ──
  if (mode === "done") return (
    <div style={{ padding: "40px 32px", textAlign: "center", maxWidth: 440, margin: "0 auto" }}>
      <div style={{ width: 68, height: 68, background: T.emerald + "18", border: "2px solid " + T.emerald, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 30 }}>✓</div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: T.emerald, marginBottom: 8 }}>Material Added!</h2>
      <p style={{ color: T.txt3, fontSize: 14, marginBottom: 24 }}><strong style={{ color: T.txt1 }}>{f.name}</strong> saved to database.</p>
      <button className="btn-primary" onClick={resetAll}>Add Another TDS</button>
    </div>
  );

  // ── LOADING ──
  if (mode === "loading") return (
    <div style={{ padding: "28px 32px", maxWidth: 480 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: T.txt1, marginBottom: 20 }}>Reading TDS...</div>
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <div className="spin" style={{ width: 22, height: 22, border: "3px solid " + T.border, borderTopColor: T.primary, borderRadius: "50%", flexShrink: 0 }} />
          <span style={{ fontWeight: 600, color: T.primary, fontSize: 14 }}>Claude AI is reading your TDS document...</span>
        </div>
        {log.map((l, i) => (
          <div key={i} style={{ fontSize: 13, padding: "7px 10px", borderRadius: 6, marginBottom: 3, background: i === log.length - 1 ? T.primary + "12" : "transparent", color: i === log.length - 1 ? T.primary : T.txt3 }}>
            {i === log.length - 1 ? "→ " : "✓ "}{l}
          </div>
        ))}
      </div>
    </div>
  );

  // ── CHOOSE METHOD ──
  if (mode === "choose") return (
    <div style={{ padding: "28px 32px", maxWidth: 640 }}>
      <div style={{ fontSize: 19, fontWeight: 700, color: T.txt1, marginBottom: 4 }}>Add Material from TDS</div>
      <div style={{ fontSize: 13, color: T.txt3, marginBottom: 28 }}>Choose how to provide your Technical Data Sheet — Claude AI reads it and extracts all specs automatically</div>

      {error && tried && (
        <div style={{ background: T.rose + "12", border: "1px solid " + T.rose + "44", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: T.rose }}>{error}</div>
      )}

      {/* Method 1 — PDF Upload */}
      <div className="card" style={{ padding: 22, marginBottom: 12, borderLeft: "3px solid " + T.primary }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 36, height: 36, background: T.primary + "18", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>📄</div>
          <div>
            <div style={{ fontWeight: 700, color: T.txt1, fontSize: 14 }}>Upload PDF File</div>
            <div style={{ fontSize: 12, color: T.txt3 }}>Select TDS PDF from your device — works on desktop</div>
          </div>
        </div>
        <div>
          <input
            id="pdf-input"
            type="file"
            accept=".pdf,application/pdf"
            style={{ display: "none" }}
            onChange={e => { if (e.target.files && e.target.files[0]) { handlePDF(e.target.files[0]); e.target.value=""; } }}
          />
          <button className="btn-primary" style={{ marginBottom: 8 }} onClick={() => document.getElementById("pdf-input").click()}>
            Select PDF File
          </button>
        </div>
        <div style={{ fontSize: 11, color: T.txt4, marginTop: 6 }}>Brady B-595, B-423, 3M, Avery, FLEXcon PDFs all supported</div>
      </div>

      {/* Method 2 — Photo / Image */}
      <div className="card" style={{ padding: 22, marginBottom: 12, borderLeft: "3px solid " + T.cyan }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 36, height: 36, background: T.cyan + "18", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>📷</div>
          <div>
            <div style={{ fontWeight: 700, color: T.txt1, fontSize: 14 }}>Take Photo / Upload Image</div>
            <div style={{ fontSize: 12, color: T.txt3 }}>On mobile — take a photo of the TDS page. On desktop — upload a JPG/PNG scan</div>
          </div>
        </div>
        <div>
          <input
            id="img-input"
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: "none" }}
            onChange={e => { if (e.target.files && e.target.files[0]) { handleImage(e.target.files[0]); e.target.value=""; } }}
          />
          <button style={{ background: T.cyan, color: "#fff", border: "none", borderRadius: 7, padding: "10px 18px", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 8 }}
            onClick={() => document.getElementById("img-input").click()}>
            Open Camera / Select Image
          </button>
        </div>
        <div style={{ fontSize: 11, color: T.txt4, marginTop: 6 }}>Best for mobile — tap the button, your camera opens, photograph the TDS data table clearly</div>
      </div>

      {/* Method 3 — Paste Text */}
      <div className="card" style={{ padding: 22, marginBottom: 12, borderLeft: "3px solid " + T.emerald }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, background: T.emerald + "18", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>📋</div>
          <div>
            <div style={{ fontWeight: 700, color: T.txt1, fontSize: 14 }}>Paste TDS Text</div>
            <div style={{ fontSize: 12, color: T.txt3 }}>Open PDF, copy all text, paste here — works everywhere including mobile</div>
          </div>
        </div>
        <textarea
          style={{ ...IS, resize: "vertical", lineHeight: 1.6, fontSize: 12, marginBottom: 10, minHeight: 140 }}
          placeholder={"Paste the full text from your TDS document here...\n\nExample:\nBRADY B-423 THERMAL TRANSFER PRINTABLE GLOSSY WHITE POLYESTER\nThickness: 0.003 inch (0.0762mm)\nAdhesion to Stainless Steel: 51 oz/inch (56 N/100mm)\nService Temperature: -70 deg C to 110 deg C\nUL Recognized Component UL969, file MH17154\nCSA Accepted C22.2 No.0.1595, file 041833\n..."}
          value={pasteText}
          onChange={e => { setPasteText(e.target.value); setError(""); }}
        />
        <button className="btn-primary" onClick={handlePaste} style={{ padding: "10px 24px" }}>
          Extract with AI
        </button>
        <div style={{ fontSize: 11, color: T.txt4, marginTop: 8 }}>How to copy on mobile: open PDF app → long press text → Select All → Copy → come back here → paste</div>
      </div>

      {/* What gets extracted */}
      <div className="card" style={{ padding: "14px 18px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.txt4, textTransform: "uppercase", letterSpacing: .5, marginBottom: 10 }}>What Claude AI extracts from your TDS</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
          {["Material code & full name","Supplier / manufacturer","Substrate & adhesive type","Thickness (substrate + adhesive + total)","Adhesion: steel, PP, ABS, glass, powder coat","Adhesion tack (gf) & oz/in values","Temperature: min, max, short-term","Min application temperature","UV & chemical resistance","Dielectric strength (volts)","Recommended ribbons","Compliance: RoHS, UL file no., CSA, REACH, CE","Outdoor durability (years)","Shelf life & storage conditions","Applications & use cases","Notes & warnings"].map(t => (
            <div key={t} style={{ fontSize: 11, color: T.txt3, display: "flex", alignItems: "flex-start", gap: 5, lineHeight: 1.4 }}>
              <span style={{ color: T.emerald, fontSize: 9, marginTop: 3, flexShrink: 0 }}>◆</span>{t}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: T.txt4, borderTop: "1px solid " + T.border, paddingTop: 8 }}>
          Fill in manually after extraction: Cost · Stock · Selling Price · MOQ · Lead Time
        </div>
      </div>
    </div>
  );

  // ── REVIEW FORM ──
  if (mode === "review" && form) return (
    <div style={{ padding: "28px 32px", maxWidth: 820 }}>
      <div style={{ fontSize: 19, fontWeight: 700, color: T.txt1, marginBottom: 4 }}>Review Extracted Data</div>
      <div style={{ fontSize: 13, color: T.txt3, marginBottom: 16 }}>AI extracted these specs from your TDS — correct anything if needed, add stock details, then save.</div>

      <div style={{ background: T.primary + "0c", border: "1px solid " + T.primary + "33", borderRadius: 9, padding: "10px 16px", marginBottom: 20, fontSize: 13, color: T.primary }}>
        Extracted from: {fileName || "pasted text"} — {f.compliance && f.compliance.length > 0 ? f.compliance.length + " compliance standards found" : "verify compliance manually"}

      {/* ── STOCK & PRICING — TOP PRIORITY — FILL IN FIRST ── */}
      <div style={{ background: "linear-gradient(135deg,#1a4fd6,#1440b8)", borderRadius: 12, padding: "20px 22px", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 22 }}>📦</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Stock & Pricing Details</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Fill these in — not extracted from TDS</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 5 }}>Current Stock (units) *</label>
            <input type="number" placeholder="e.g. 1800" value={stock} onChange={e => setStock(e.target.value)}
              style={{ width: "100%", background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 7, padding: "9px 12px", color: "#fff", fontSize: 13, fontFamily: "inherit" }}/>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 5 }}>Purchase Cost (per unit) *</label>
            <input type="number" placeholder="e.g. 6.80" value={cost} onChange={e => setCost(e.target.value)}
              style={{ width: "100%", background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 7, padding: "9px 12px", color: "#fff", fontSize: 13, fontFamily: "inherit" }}/>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 5 }}>Selling Price</label>
            <input type="number" placeholder="e.g. 9.50" value={sellingPrice} onChange={e => setSellingPrice(e.target.value)}
              style={{ width: "100%", background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 7, padding: "9px 12px", color: "#fff", fontSize: 13, fontFamily: "inherit" }}/>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 5 }}>Currency</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)}
              style={{ width: "100%", background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 7, padding: "9px 12px", color: "#fff", fontSize: 13, fontFamily: "inherit", cursor: "pointer" }}>
              {["USD","EUR","GBP","INR","AED","SGD","JPY"].map(c => <option key={c} style={{ background: "#1a4fd6", color: "#fff" }}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 5 }}>MOQ</label>
            <input type="number" placeholder="e.g. 250" value={moq} onChange={e => setMoq(e.target.value)}
              style={{ width: "100%", background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 7, padding: "9px 12px", color: "#fff", fontSize: 13, fontFamily: "inherit" }}/>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 5 }}>Lead Time</label>
            <input type="text" placeholder="e.g. 2-3 weeks" value={leadTime} onChange={e => setLeadTime(e.target.value)}
              style={{ width: "100%", background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 7, padding: "9px 12px", color: "#fff", fontSize: 13, fontFamily: "inherit" }}/>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 5 }}>Warehouse / Location</label>
            <input type="text" placeholder="e.g. Rack A3" value={warehouse} onChange={e => setWarehouse(e.target.value)}
              style={{ width: "100%", background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 7, padding: "9px 12px", color: "#fff", fontSize: 13, fontFamily: "inherit" }}/>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 5 }}>Supplier Part No.</label>
            <input type="text" placeholder="e.g. B-423-WH" value={supplierPartNo} onChange={e => setSupplierPartNo(e.target.value)}
              style={{ width: "100%", background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 7, padding: "9px 12px", color: "#fff", fontSize: 13, fontFamily: "inherit" }}/>
          </div>
        </div>
        {/* Live margin calculator */}
        {cost && sellingPrice && parseFloat(cost) > 0 && parseFloat(sellingPrice) > 0 && (
          <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 9, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)", marginBottom: 10, textTransform: "uppercase", letterSpacing: .4 }}>Live Margin</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[
                ["Margin Amt", currency + " " + (parseFloat(sellingPrice) - parseFloat(cost)).toFixed(2)],
                ["Margin %", Math.round((1 - parseFloat(cost) / parseFloat(sellingPrice)) * 100) + "%"],
                ["Stock Value", currency + " " + (parseFloat(cost) * (parseFloat(stock) || 0)).toLocaleString()],
              ].map(([l, v]) => (
                <div key={l} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 7, padding: "8px 10px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 15, fontWeight: 700, color: "#fff" }}>{v}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      </div>

      {/* Section: Identity */}
      <div className="card" style={{ ...cardStyle, borderLeft: "3px solid " + T.primary }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.primary, textTransform: "uppercase", letterSpacing: .5, marginBottom: 14 }}>Material Identity</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[["Code","code","B-423"],["Name *","name","Brady B-423 Polyester"],["Supplier","supplier","Brady Worldwide"],["Substrate","substrate","White Polyester"],["Adhesive Type","adhesiveType","Permanent Acrylic"],["Liner","liner","Polyester"],["Color","color","White"],["Finish","finish","Glossy White"],["Effective Date","effectiveDate","10/05/2022"]].map(([l,k,p]) => (
            <div key={k}>
              <label style={LS}>{l}</label>
              <input style={IS} placeholder={p} value={f[k]||""} onChange={e=>set(k)(e.target.value)}/>
            </div>
          ))}
          <div>
            <label style={LS}>Material Type</label>
            <select style={IS} value={f.type||"Vinyl"} onChange={e=>set("type")(e.target.value)}>
              {TYPES.map(v=><option key={v} style={{background:T.card}}>{v}</option>)}
            </select>
          </div>
          <div>
            <label style={LS}>Application Category</label>
            <select style={IS} value={f.appCategory||""} onChange={e=>set("appCategory")(e.target.value)}>
              {APP_CATS.map(v=><option key={v} style={{background:T.card}}>{v}</option>)}
            </select>
          </div>
          <div>
            <label style={LS}>Environment</label>
            <select style={IS} value={f.environment||"Both"} onChange={e=>set("environment")(e.target.value)}>
              {["Indoor","Outdoor","Both"].map(v=><option key={v} style={{background:T.card}}>{v}</option>)}
            </select>
          </div>
          <div>
            <label style={LS}>Ink / Print Type</label>
            <select style={IS} value={f.ink||"Thermal Transfer"} onChange={e=>set("ink")(e.target.value)}>
              {["Thermal Transfer","Direct Thermal","UV Inkjet","Solvent Inkjet","None"].map(v=><option key={v} style={{background:T.card}}>{v}</option>)}
            </select>
          </div>
          <div style={{gridColumn:"span 2"}}>
            <label style={LS}>Recommended Ribbons</label>
            <input style={IS} placeholder="e.g. R6000 Halogen Free, R4400, R4900" value={f.ribbons||""} onChange={e=>set("ribbons")(e.target.value)}/>
          </div>
        </div>
      </div>

      {/* Section: Physical */}
      <div className="card" style={{ ...cardStyle, borderLeft: "3px solid " + T.cyan }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.cyan, textTransform: "uppercase", letterSpacing: .5, marginBottom: 14 }}>Physical Properties</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            ["Thickness - Substrate (mm)","thickness_sub","0.0508"],
            ["Thickness - Adhesive (mm)","thickness_adh","0.0254"],
            ["Thickness - Total (mm)","thickness","0.0762"],
            ["Adhesion Tack (gf)","adhesion","800"],
            ["Adhesion to Steel 15min (oz/in)","adhesion_steel_15","51"],
            ["Adhesion to Steel 24hr (oz/in)","adhesion_steel_24","57"],
            ["Adhesion to Steel (N/100mm)","adhesion_steel_N","56"],
            ["Adhesion to Powder Coat (oz/in)","adhesion_pc","51"],
            ["Adhesion to Polypropylene (oz/in)","adhesion_pp","36"],
            ["Adhesion to Textured ABS (oz/in)","adhesion_abs","10"],
            ["Adhesion to Glass (oz/in)","adhesion_glass",""],
            ["Dielectric Strength (volts)","dielectric","8400"],
          ].map(([l,k,p]) => (
            <div key={k}>
              <label style={LS}>{l}</label>
              <input type="number" style={IS} placeholder={p} value={f[k]||""} onChange={e=>set(k)(e.target.value)}/>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Temperature */}
      <div className="card" style={{ ...cardStyle, borderLeft: "3px solid " + T.amber }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.amber, textTransform: "uppercase", letterSpacing: .5, marginBottom: 14 }}>Temperature and Environment</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          {[["Min Service Temp (C)","tempMin","-70"],["Max Service Temp (C)","tempMax","110"],["Max Short-Term Temp (C)","tempMaxShort","180"],["Min Application Temp (C)","minAppTemp",""],["Outdoor Durability","outdoorDurability","e.g. 8-10 years"],["Abrasion Resistance","abrasionResistance","e.g. 100 cycles CS-10"],["Shelf Life","shelfLife","2 years"]].map(([l,k,p]) => (
            <div key={k}>
              <label style={LS}>{l}</label>
              <input style={IS} placeholder={p} value={f[k]||""} onChange={e=>set(k)(e.target.value)}/>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[["uvResistant","UV Resistant"],["chemResistant","Chemical Resistant"],["halogenFree","Halogen-Free"]].map(([k,l]) => (
            <label key={k} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12, color: T.txt2 }}>
              <div onClick={() => set(k)(!f[k])} style={{ width: 36, height: 20, borderRadius: 10, background: f[k] ? T.primary : T.border2, position: "relative", cursor: "pointer", transition: "background .2s", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: 2, left: f[k] ? 17 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left .2s" }} />
              </div>{l}
            </label>
          ))}
        </div>
      </div>

      {/* Section: Compliance */}
      <div className="card" style={{ ...cardStyle, borderLeft: "3px solid " + T.emerald }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.emerald, textTransform: "uppercase", letterSpacing: .5, marginBottom: 12 }}>Compliance & Regulatory</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          {Object.keys(COMPLIANCE_STANDARDS).map(std => {
            const s = COMPLIANCE_STANDARDS[std];
            const active = (f.compliance||[]).includes(std);
            return (
              <span key={std} onClick={() => set("compliance")(active ? (f.compliance||[]).filter(c=>c!==std) : [...(f.compliance||[]),std])}
                style={{ cursor: "pointer", padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: "1px solid " + (active?s.color:T.border), background: active?s.color+"18":"transparent", color: active?s.color:T.txt4, transition: "all .15s" }}>
                {s.icon} {std}
              </span>
            );
          })}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[["Compliance Notes","complianceNotes","UL969 MH17154, CSA C22.2"],["UL File No.","ulFileNumber","MH17154"],["CSA File No.","csaFileNumber","041833"],["RoHS Directive","rohsDirective","2002/95/EC"]].map(([l,k,p]) => (
            <div key={k}>
              <label style={LS}>{l}</label>
              <input style={IS} placeholder={p} value={f[k]||""} onChange={e=>set(k)(e.target.value)}/>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Applications */}
      <div className="card" style={{ ...cardStyle, borderLeft: "3px solid " + T.txt4 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.txt4, textTransform: "uppercase", letterSpacing: .5, marginBottom: 12 }}>Applications and Notes</div>
        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <label style={LS}>Applications / Use Cases</label>
            <textarea style={{ ...IS, resize: "vertical" }} rows={2} placeholder="PCB/Component ID, Barcode Labels, Rating Plates, Solar Panel ID" value={f.applications||""} onChange={e=>set("applications")(e.target.value)}/>
          </div>
          <div>
            <label style={LS}>Notes / Warnings</label>
            <textarea style={{ ...IS, resize: "vertical" }} rows={2} placeholder="UL Recognized outdoor on glass/polyester. Halogen-free." value={f.notes||""} onChange={e=>set("notes")(e.target.value)}/>
          </div>
          <div>
            <label style={LS}>Chemical Resistance Notes</label>
            <textarea style={{ ...IS, resize: "vertical" }} rows={2} placeholder="Resists IPA, mineral spirits. Fails on acetone, toluene." value={f.chemResistanceNotes||""} onChange={e=>set("chemResistanceNotes")(e.target.value)}/>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, paddingBottom: 32 }}>
        <button className="btn-primary" onClick={save} style={{ padding: "12px 32px", fontSize: 14 }}>Save to Database</button>
        <button className="btn-secondary" onClick={resetAll}>Start Over</button>
      </div>
    </div>
  );

  return null;
}

/* ── COST COMPARISON PAGE ── */
function ComparisonPage({db}) {
  const CURRENCIES = ["USD","EUR","GBP","INR","AED","SGD","JPY"];
  const PRICE_UNITS = ["per m2","per roll","per sheet","per unit","per kg","per liner metre"];

  const blank = () => ({
    name:"", supplier:"", type:"", thickness:"", adhesion:"",
    tempMax:"", environment:"Both", uvResistant:false, chemResistant:false,
    ink:"", stock:"", cost:"", sellingPrice:"", moq:"", leadTime:"",
    compliance:[], notes:"",
  });

  const [left, setLeft]   = useState(blank());
  const [right, setRight] = useState(blank());
  const [currency, setCurrency] = useState("USD");
  const [priceUnit, setPriceUnit] = useState("per m2");
  const [pickMode, setPickMode] = useState(null); // "left" | "right" | null
  const [compared, setCompared] = useState(false);

  const setL = k => v => setLeft(p  => ({...p, [k]: v}));
  const setR = k => v => setRight(p => ({...p, [k]: v}));

  function pickFromDB(mat, side) {
    const data = {
      name: mat.name, supplier: mat.supplier, type: mat.type,
      thickness: mat.thickness, adhesion: mat.adhesion,
      tempMax: mat.tempMax, environment: mat.environment,
      uvResistant: mat.uvResistant, chemResistant: mat.chemResistant,
      ink: mat.ink, stock: mat.stock, cost: mat.cost,
      sellingPrice: mat.sellingPrice || "",
      moq: mat.moq || "", leadTime: mat.leadTime || "",
      compliance: mat.compliance || [], notes: mat.notes || "",
    };
    if (side === "left")  setLeft(data);
    if (side === "right") setRight(data);
    setPickMode(null);
  }

  function resetAll() {
    setLeft(blank()); setRight(blank());
    setCompared(false); setPickMode(null);
  }

  // computed
  const lCost  = parseFloat(left.cost)  || 0;
  const rCost  = parseFloat(right.cost) || 0;
  const lSell  = parseFloat(left.sellingPrice)  || 0;
  const rSell  = parseFloat(right.sellingPrice) || 0;
  const lStock = parseInt(left.stock)   || 0;
  const rStock = parseInt(right.stock)  || 0;

  const lTotal   = lCost * lStock;
  const rTotal   = rCost * rStock;
  const lMarginP = lSell > 0 ? Math.round((1 - lCost/lSell)*100) : null;
  const rMarginP = rSell > 0 ? Math.round((1 - rCost/rSell)*100) : null;
  const lMarginA = lSell > 0 ? (lSell - lCost).toFixed(2) : null;
  const rMarginA = rSell > 0 ? (rSell - rCost).toFixed(2) : null;
  const saving   = rTotal - lTotal;

  const WIN  = T.emerald;
  const LOSE = T.rose;

  // who wins each spec
  function winner(lv, rv, mode) {
    const ln = parseFloat(lv), rn = parseFloat(rv);
    if (isNaN(ln)||isNaN(rn)||ln===rn) return "tie";
    if (mode==="lower") return ln < rn ? "L" : "R";
    return ln > rn ? "L" : "R";
  }

  const inputStyle = { width:"100%", background:T.surface, border:"1px solid "+T.border, borderRadius:7, padding:"8px 11px", color:T.txt1, fontSize:13, fontFamily:"inherit" };
  const labelStyle = { fontSize:10, fontWeight:700, color:T.txt4, textTransform:"uppercase", letterSpacing:.5, display:"block", marginBottom:5 };

  function ColInput({label, lkey, rkey, type="text", ph=""}) {
    return (
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12}}>
        <div>
          <label style={labelStyle}>{label}</label>
          <input type={type} style={inputStyle} placeholder={ph}
            value={left[lkey]||""} onChange={e=>setL(lkey)(e.target.value)}/>
        </div>
        <div>
          <label style={labelStyle}>{label}</label>
          <input type={type} style={inputStyle} placeholder={ph}
            value={right[rkey]||""} onChange={e=>setR(rkey)(e.target.value)}/>
        </div>
      </div>
    );
  }

  function ToggleRow({label, lkey, rkey}) {
    return (
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12}}>
        {[[left, lkey, setL],[right, rkey, setR]].map(([obj, key, setter], i) => (
          <label key={i} style={{display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:12, color:T.txt2}}>
            <div onClick={()=>setter(key)(!obj[key])}
              style={{width:34, height:18, borderRadius:9, background:obj[key]?T.primary:T.border2, position:"relative", cursor:"pointer", transition:"background .2s", flexShrink:0}}>
              <div style={{position:"absolute", top:2, left:obj[key]?17:2, width:14, height:14, borderRadius:"50%", background:"#fff", transition:"left .2s"}}/>
            </div>
            {label}
          </label>
        ))}
      </div>
    );
  }

  return (
    <div style={{padding:"28px 32px", maxWidth:1100}}>
      <div style={{display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24}}>
        <div>
          <div style={{fontSize:19, fontWeight:700, color:T.txt1, marginBottom:3}}>Cost Comparison</div>
          <div style={{fontSize:13, color:T.txt3}}>Compare two materials side by side — specs, pricing, margin and cost saving in one view</div>
        </div>
        <div style={{display:"flex", gap:10, alignItems:"center"}}>
          <div>
            <label style={{...labelStyle, marginBottom:4}}>Currency</label>
            <select style={{...inputStyle, width:"auto"}} value={currency} onChange={e=>setCurrency(e.target.value)}>
              {CURRENCIES.map(c=><option key={c} style={{background:T.card}}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{...labelStyle, marginBottom:4}}>Price Per</label>
            <select style={{...inputStyle, width:"auto"}} value={priceUnit} onChange={e=>setPriceUnit(e.target.value)}>
              {PRICE_UNITS.map(u=><option key={u} style={{background:T.card}}>{u}</option>)}
            </select>
          </div>
          <button className="btn-secondary" onClick={resetAll} style={{marginTop:18}}>Reset</button>
        </div>
      </div>

      {/* ── COLUMN HEADERS ── */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 40px 1fr", gap:0, marginBottom:16}}>
        {[["left","Material A — Existing / Reference"], ["right","Material B — New / Alternative"]].map(([side, title]) => (
          <div key={side} style={{background:side==="left"?T.primary+"18":T.cyan+"18", border:"1px solid "+(side==="left"?T.primary:T.cyan)+"44", borderRadius:10, padding:"14px 18px"}}>
            <div style={{fontWeight:700, color:side==="left"?T.primary:T.cyan, fontSize:14, marginBottom:8}}>{title}</div>
            <div style={{display:"flex", gap:8}}>
              <button className="btn-secondary" style={{fontSize:11, padding:"4px 12px"}}
                onClick={()=>setPickMode(pickMode===side?null:side)}>
                {pickMode===side ? "Cancel" : "Pick from Database"}
              </button>
              {(side==="left"?left:right).name && (
                <span style={{fontSize:12, color:T.txt3, alignSelf:"center"}}>
                  {(side==="left"?left:right).name}
                </span>
              )}
            </div>
            {/* DB picker dropdown */}
            {pickMode===side && (
              <div style={{marginTop:10, background:T.card, border:"1px solid "+T.border, borderRadius:8, overflow:"hidden", maxHeight:200, overflowY:"auto"}}>
                {db.map(m=>(
                  <div key={m.id} onClick={()=>pickFromDB(m,side)}
                    style={{padding:"9px 14px", cursor:"pointer", borderBottom:"1px solid "+T.border, fontSize:13, color:T.txt2, display:"flex", justifyContent:"space-between", alignItems:"center"}}
                    onMouseOver={e=>e.currentTarget.style.background=T.cardHover}
                    onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                    <span><strong style={{color:T.txt1}}>{m.code}</strong> — {m.name}</span>
                    <span className="mono" style={{fontSize:11, color:T.txt4}}>{m.thickness}mm · {m.adhesion}gf</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
          <div style={{fontSize:20, color:T.txt4}}>⇌</div>
        </div>
      </div>

      {/* ── INPUT SECTIONS ── */}
      {/* Material identity */}
      <div className="card" style={{padding:"18px 22px", marginBottom:12}}>
        <div style={{fontSize:11, fontWeight:700, color:T.primary, textTransform:"uppercase", letterSpacing:.5, marginBottom:14}}>Material Identity</div>
        <ColInput label="Material Name" lkey="name" rkey="name" ph="e.g. Brady B-595"/>
        <ColInput label="Supplier" lkey="supplier" rkey="supplier" ph="e.g. Brady Worldwide"/>
        <ColInput label="Material Type" lkey="type" rkey="type" ph="e.g. Vinyl Film"/>
        <ColInput label="Ink / Print Type" lkey="ink" rkey="ink" ph="e.g. Thermal Transfer"/>
      </div>

      {/* Technical specs */}
      <div className="card" style={{padding:"18px 22px", marginBottom:12}}>
        <div style={{fontSize:11, fontWeight:700, color:T.cyan, textTransform:"uppercase", letterSpacing:.5, marginBottom:14}}>Technical Specifications</div>
        <ColInput label="Thickness (mm)" lkey="thickness" rkey="thickness" type="number" ph="e.g. 0.10"/>
        <ColInput label="Adhesion (gf)" lkey="adhesion" rkey="adhesion" type="number" ph="e.g. 1100"/>
        <ColInput label="Max Temp (C)" lkey="tempMax" rkey="tempMax" type="number" ph="e.g. 82"/>
        <ColInput label="Environment" lkey="environment" rkey="environment" ph="Indoor / Outdoor / Both"/>
        <ToggleRow label="UV Resistant" lkey="uvResistant" rkey="uvResistant"/>
        <ToggleRow label="Chemical Resistant" lkey="chemResistant" rkey="chemResistant"/>
      </div>

      {/* Stock & Pricing */}
      <div className="card" style={{padding:"18px 22px", marginBottom:12}}>
        <div style={{fontSize:11, fontWeight:700, color:T.amber, textTransform:"uppercase", letterSpacing:.5, marginBottom:14}}>Stock and Pricing</div>
        <ColInput label={"Cost ("+currency+" "+priceUnit+")"} lkey="cost" rkey="cost" type="number" ph="e.g. 4.20"/>
        <ColInput label={"Selling Price ("+currency+")"} lkey="sellingPrice" rkey="sellingPrice" type="number" ph="e.g. 6.50"/>
        <ColInput label="Stock (units)" lkey="stock" rkey="stock" type="number" ph="e.g. 2400"/>
        <ColInput label="MOQ" lkey="moq" rkey="moq" type="number" ph="e.g. 500"/>
        <ColInput label="Lead Time" lkey="leadTime" rkey="leadTime" ph="e.g. 2-3 weeks"/>
      </div>

      {/* Compare button */}
      <button className="btn-primary" onClick={()=>setCompared(true)}
        style={{width:"100%", justifyContent:"center", padding:"13px", fontSize:15, marginBottom:24}}>
        Run Comparison
      </button>

      {/* ── COMPARISON RESULTS ── */}
      {compared && (
        <div>
          <div style={{fontSize:15, fontWeight:700, color:T.txt1, marginBottom:16}}>Comparison Results</div>

          {/* Side by side spec results */}
          <div style={{display:"grid", gridTemplateColumns:"1fr 200px 1fr", gap:0, marginBottom:16}}>

            {/* Left column */}
            <div className="card" style={{borderRadius:"10px 0 0 10px", border:"1px solid "+T.primary+"44", padding:"20px 22px"}}>
              <div style={{fontSize:13, fontWeight:700, color:T.primary, marginBottom:16}}>
                {left.name || "Material A"}
              </div>
              {[
                ["Cost", left.cost ? currency+" "+left.cost : "-", T.txt1],
                ["Selling Price", left.sellingPrice ? currency+" "+left.sellingPrice : "-", T.txt1],
                ["Margin %", lMarginP !== null ? lMarginP+"%" : "-", lMarginP > 0 ? T.emerald : T.rose],
                ["Margin Amt", lMarginA ? currency+" "+lMarginA : "-", lMarginA > 0 ? T.emerald : T.rose],
                ["Stock", left.stock ? left.stock+" units" : "-", T.txt1],
                ["Total Stock Value", lTotal > 0 ? currency+" "+lTotal.toLocaleString() : "-", T.cyan],
                ["Thickness", left.thickness ? left.thickness+"mm" : "-", T.txt1],
                ["Adhesion", left.adhesion ? left.adhesion+"gf" : "-", T.txt1],
                ["Max Temp", left.tempMax ? left.tempMax+"C" : "-", T.txt1],
                ["UV Resistant", left.uvResistant ? "Yes" : "No", left.uvResistant ? T.emerald : T.txt4],
                ["Chem Resistant", left.chemResistant ? "Yes" : "No", left.chemResistant ? T.emerald : T.txt4],
                ["Lead Time", left.leadTime || "-", T.txt1],
                ["MOQ", left.moq || "-", T.txt1],
              ].map(([label, val, color]) => (
                <div key={label} style={{display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid "+T.border}}>
                  <span style={{fontSize:12, color:T.txt3}}>{label}</span>
                  <span className="mono" style={{fontSize:12, color, fontWeight:600}}>{val}</span>
                </div>
              ))}
            </div>

            {/* Center verdict column */}
            <div style={{background:T.surface, border:"1px solid "+T.border, borderLeft:"none", borderRight:"none", padding:"20px 10px"}}>
              <div style={{fontSize:10, fontWeight:700, color:T.txt4, textTransform:"uppercase", letterSpacing:.5, textAlign:"center", marginBottom:16}}>Winner</div>
              {[
                {lv:left.cost, rv:right.cost, mode:"lower"},
                {lv:left.sellingPrice, rv:right.sellingPrice, mode:"higher"},
                {lv:lMarginP, rv:rMarginP, mode:"higher"},
                {lv:lMarginA, rv:rMarginA, mode:"higher"},
                {lv:left.stock, rv:right.stock, mode:"higher"},
                {lv:lTotal, rv:rTotal, mode:"lower"},
                {lv:left.thickness, rv:right.thickness, mode:"lower"},
                {lv:left.adhesion, rv:right.adhesion, mode:"higher"},
                {lv:left.tempMax, rv:right.tempMax, mode:"higher"},
                {lv:left.uvResistant?1:0, rv:right.uvResistant?1:0, mode:"higher"},
                {lv:left.chemResistant?1:0, rv:right.chemResistant?1:0, mode:"higher"},
                {lv:null, rv:null, mode:null},
                {lv:left.moq, rv:right.moq, mode:"lower"},
              ].map((row, i) => {
                const w = row.mode ? winner(row.lv, row.rv, row.mode) : "tie";
                return (
                  <div key={i} style={{height:37, display:"flex", alignItems:"center", justifyContent:"center", borderBottom:"1px solid "+T.border}}>
                    {w==="L" && <span style={{background:T.primary+"22", color:T.primary, borderRadius:4, padding:"2px 8px", fontSize:11, fontWeight:700}}>A</span>}
                    {w==="R" && <span style={{background:T.cyan+"22", color:T.cyan, borderRadius:4, padding:"2px 8px", fontSize:11, fontWeight:700}}>B</span>}
                    {w==="tie" && <span style={{color:T.txt4, fontSize:11}}>—</span>}
                  </div>
                );
              })}
            </div>

            {/* Right column */}
            <div className="card" style={{borderRadius:"0 10px 10px 0", border:"1px solid "+T.cyan+"44", borderLeft:"none", padding:"20px 22px"}}>
              <div style={{fontSize:13, fontWeight:700, color:T.cyan, marginBottom:16}}>
                {right.name || "Material B"}
              </div>
              {[
                ["Cost", right.cost ? currency+" "+right.cost : "-", T.txt1],
                ["Selling Price", right.sellingPrice ? currency+" "+right.sellingPrice : "-", T.txt1],
                ["Margin %", rMarginP !== null ? rMarginP+"%" : "-", rMarginP > 0 ? T.emerald : T.rose],
                ["Margin Amt", rMarginA ? currency+" "+rMarginA : "-", rMarginA > 0 ? T.emerald : T.rose],
                ["Stock", right.stock ? right.stock+" units" : "-", T.txt1],
                ["Total Stock Value", rTotal > 0 ? currency+" "+rTotal.toLocaleString() : "-", T.cyan],
                ["Thickness", right.thickness ? right.thickness+"mm" : "-", T.txt1],
                ["Adhesion", right.adhesion ? right.adhesion+"gf" : "-", T.txt1],
                ["Max Temp", right.tempMax ? right.tempMax+"C" : "-", T.txt1],
                ["UV Resistant", right.uvResistant ? "Yes" : "No", right.uvResistant ? T.emerald : T.txt4],
                ["Chem Resistant", right.chemResistant ? "Yes" : "No", right.chemResistant ? T.emerald : T.txt4],
                ["Lead Time", right.leadTime || "-", T.txt1],
                ["MOQ", right.moq || "-", T.txt1],
              ].map(([label, val, color]) => (
                <div key={label} style={{display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid "+T.border}}>
                  <span style={{fontSize:12, color:T.txt3}}>{label}</span>
                  <span className="mono" style={{fontSize:12, color, fontWeight:600}}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── COST SAVING SUMMARY ── */}
          {lTotal > 0 && rTotal > 0 && (
            <div className="card" style={{padding:"22px 26px", border:"1px solid "+(saving>0?T.emerald:T.rose)+"44", marginBottom:16}}>
              <div style={{fontSize:13, fontWeight:700, color:saving>0?T.emerald:T.rose, marginBottom:16}}>
                {saving>0 ? "Cost Saving — Material A is cheaper" : saving<0 ? "Cost Increase — Material B is cheaper" : "Equal Cost"}
              </div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:14}}>
                {[
                  ["Material A Total", currency+" "+lTotal.toLocaleString(), T.primary],
                  ["Material B Total", currency+" "+rTotal.toLocaleString(), T.cyan],
                  [saving>0?"You Save":"Extra Cost", currency+" "+Math.abs(saving).toLocaleString(), saving>0?T.emerald:T.rose],
                  ["Saving %", lTotal>0?Math.abs(Math.round((saving/Math.max(lTotal,rTotal))*100))+"%":"-", saving>0?T.emerald:T.rose],
                ].map(([label, val, color]) => (
                  <div key={label} style={{background:T.surface, borderRadius:9, padding:"14px 16px", textAlign:"center"}}>
                    <div className="mono" style={{fontSize:20, fontWeight:700, color, marginBottom:4}}>{val}</div>
                    <div style={{fontSize:11, color:T.txt4}}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:14, fontSize:13, color:T.txt2, lineHeight:1.6}}>
                {saving>0 && left.name && right.name &&
                  left.name+" (A) costs "+currency+" "+lTotal.toLocaleString()+" vs "+right.name+" (B) at "+currency+" "+rTotal.toLocaleString()+". Choosing Material A saves "+currency+" "+saving.toLocaleString()+"."}
                {saving<0 && left.name && right.name &&
                  right.name+" (B) costs "+currency+" "+rTotal.toLocaleString()+" vs "+left.name+" (A) at "+currency+" "+lTotal.toLocaleString()+". Choosing Material B saves "+currency+" "+Math.abs(saving).toLocaleString()+"."}
              </div>
            </div>
          )}

          {/* Margin comparison */}
          {(lMarginP !== null || rMarginP !== null) && (
            <div className="card" style={{padding:"18px 22px"}}>
              <div style={{fontSize:11, fontWeight:700, color:T.txt4, textTransform:"uppercase", letterSpacing:.5, marginBottom:14}}>Margin Comparison</div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:14}}>
                {[[left.name||"Material A", lMarginP, lMarginA, T.primary],[right.name||"Material B", rMarginP, rMarginA, T.cyan]].map(([name, mp, ma, color]) => (
                  <div key={name} style={{background:T.surface, borderRadius:9, padding:"16px 18px"}}>
                    <div style={{fontSize:12, fontWeight:700, color, marginBottom:12}}>{name}</div>
                    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
                      {[["Margin %", mp !== null ? mp+"%" : "-", mp>20?T.emerald:mp>10?T.amber:T.rose],
                        ["Margin Amt", ma ? currency+" "+ma : "-", ma>0?T.emerald:T.rose]].map(([l,v,c])=>(
                        <div key={l} style={{background:T.card, borderRadius:7, padding:"10px", textAlign:"center"}}>
                          <div className="mono" style={{fontSize:16, fontWeight:700, color:c}}>{v}</div>
                          <div style={{fontSize:10, color:T.txt4, marginTop:3}}>{l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── SUPPLIERS PAGE ── */
function SuppliersPage({suppliers,db}) {
  return(
    <div className="fade-up" style={{padding:"28px 32px",maxWidth:1200}}>
      <SectionHead title="Supplier Directory" sub="Performance overview, lead times and material mapping"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
        {suppliers.map(s=>{
          const mats=db.filter(m=>m.supplierId===s.id);
          const avgUsage=mats.length?Math.round(mats.reduce((a,m)=>a+m.usage,0)/mats.length):0;
          const totalVal=mats.reduce((a,m)=>a+m.stock*m.cost,0);
          return(
            <div key={s.id} className="card card-interactive" style={{padding:22}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div>
                  <div style={{fontWeight:700,color:T.txt1,fontSize:15}}>{s.name}</div>
                  <div style={{fontSize:12,color:T.txt4,marginTop:3}}>{s.contact}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div className="mono" style={{fontSize:22,fontWeight:600,color:T.amber}}>{s.rating}</div>
                  <div style={{fontSize:10,color:'rgba(255,255,255,0.6)'}}>Rating</div>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
                {[["Materials",mats.length,T.primary],["Avg Usage",avgUsage,T.cyan],["Stock Val","$"+Math.round(totalVal/1000)+"k",T.emerald]].map(([l,v,c])=>(
                  <div key={l} style={{background:T.surface,borderRadius:8,padding:"10px",textAlign:"center",border:"1px solid " + T.border}}>
                    <div className="mono" style={{fontSize:17,fontWeight:600,color:c}}>{v}</div>
                    <div style={{fontSize:10,color:T.txt4,marginTop:2}}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{borderTop:"1px solid " + T.border,paddingTop:12}}>
                <div style={{fontSize:11,color:T.txt4,marginBottom:6}}>Materials · {s.leadTime} · {s.country}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {mats.map(m=><span key={m.id} className="mono" style={{fontSize:10,background:T.surface,border:"1px solid " + T.border,borderRadius:4,padding:"2px 6px",color:T.txt3}}>{m.code}</span>)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── LOGIN SCREEN ── */
const USERS = [
  {email:"admin@brady.com",     password:"Brady@2024", name:"Admin User",    role:"Admin",       initials:"AU", dept:"Management"},
  {email:"engineering@brady.com",password:"Eng@2024",  name:"Alex Chen",     role:"Engineering", initials:"AC", dept:"Engineering"},
  {email:"quality@brady.com",   password:"Qual@2024",  name:"Priya Sharma",  role:"Quality",     initials:"PS", dept:"Quality"},
  {email:"purchase@brady.com",  password:"Purch@2024", name:"Sam Patel",     role:"Purchase",    initials:"SP", dept:"Purchasing"},
  {email:"viewer@brady.com",    password:"View@2024",  name:"Lee Wong",      role:"Viewer",      initials:"LW", dept:"Operations"},
];

function LoginPage({onLogin}) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  function handleLogin() {
    if (!email || !password) { setError("Please enter your office email and password."); return; }
    setLoading(true); setError("");
    setTimeout(() => {
      const user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        setError("Invalid email or password. Please use your official Brady office credentials.");
        setLoading(false);
      }
    }, 800);
  }

  const IS = { width:"100%", background:"#f8faff", border:"1.5px solid #d1ddf7", borderRadius:8, padding:"11px 14px", color:"#0f172a", fontSize:14, fontFamily:"inherit", outline:"none" };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#f0f4ff 0%,#e8eeff 50%,#dce8ff 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:20, position:"relative", overflow:"hidden" }}>
      {/* Background watermarks */}
      <div style={{position:"absolute",bottom:-20,right:-40,pointerEvents:"none",userSelect:"none",opacity:0.04}}>
        <div style={{fontSize:200,fontWeight:900,color:"#1a4fd6",fontFamily:"'IBM Plex Sans',sans-serif",letterSpacing:-8,lineHeight:1,transform:"rotate(-10deg)"}}>BRADY</div>
      </div>
      <div style={{position:"absolute",top:40,left:-30,pointerEvents:"none",userSelect:"none",opacity:0.03}}>
        <div style={{fontSize:120,fontWeight:900,color:"#1a4fd6",fontFamily:"'IBM Plex Sans',sans-serif",letterSpacing:-4,lineHeight:1,transform:"rotate(-10deg)"}}>SOLUTION</div>
      </div>

      <div style={{ width:"100%", maxWidth:420, position:"relative", zIndex:1 }}>
        {/* Logo card */}
        <div style={{ background:"linear-gradient(135deg,#1a4fd6,#1440b8)", borderRadius:"14px 14px 0 0", padding:"28px 32px", textAlign:"center" }}>
          <div style={{ width:56, height:56, background:"rgba(255,255,255,0.2)", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", border:"2px solid rgba(255,255,255,0.3)" }}>
            <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontWeight:700, fontSize:22, color:"#fff" }}>S</span>
          </div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontWeight:700, fontSize:18, color:"#fff", letterSpacing:2, marginBottom:4 }}>SOLUTION</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)", letterSpacing:1 }}>INVENTORY INTELLIGENCE PLATFORM</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", marginTop:6 }}>Brady Worldwide — Authorized Access Only</div>
        </div>

        {/* Form card */}
        <div style={{ background:"#fff", borderRadius:"0 0 14px 14px", padding:"32px", boxShadow:"0 20px 60px rgba(26,79,214,0.15)" }}>
          <div style={{ fontSize:16, fontWeight:700, color:"#0f172a", marginBottom:4 }}>Sign In</div>
          <div style={{ fontSize:13, color:"#64748b", marginBottom:24 }}>Use your official Brady office email and password</div>

          {error && (
            <div style={{ background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:13, color:"#dc2626" }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:.5, display:"block", marginBottom:6 }}>Office Email</label>
            <input
              style={IS}
              type="email"
              placeholder="yourname@brady.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
          </div>

          <div style={{ marginBottom:24 }}>
            <label style={{ fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:.5, display:"block", marginBottom:6 }}>Password</label>
            <div style={{ position:"relative" }}>
              <input
                style={IS}
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
              />
              <button onClick={() => setShowPass(!showPass)}
                style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:14, color:"#94a3b8", padding:0 }}>
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ width:"100%", background:loading?"#94a3b8":"#1a4fd6", color:"#fff", border:"none", borderRadius:8, padding:"13px", fontWeight:700, fontSize:15, cursor:loading?"not-allowed":"pointer", fontFamily:"inherit", boxShadow:loading?"none":"0 4px 14px rgba(26,79,214,0.35)", transition:"all .2s" }}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>

          <div style={{ marginTop:20, padding:"14px 16px", background:"#f0f4ff", borderRadius:8, border:"1px solid #d1ddf7" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#1a4fd6", marginBottom:8, textTransform:"uppercase", letterSpacing:.4 }}>Demo Credentials</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4 }}>
              {USERS.map(u => (
                <div key={u.email} onClick={() => { setEmail(u.email); setPassword(u.password); setError(""); }}
                  style={{ fontSize:11, color:"#334155", cursor:"pointer", padding:"4px 6px", borderRadius:4, background:"#fff", border:"1px solid #e2e8f0" }}>
                  <div style={{ fontWeight:600, color:"#1a4fd6" }}>{u.role}</div>
                  <div style={{ color:"#94a3b8", fontSize:10 }}>{u.email}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── STOCK & PRICING PAGE (separate) ── */
function StockPricingPage({db, setDb}) {
  const [selId, setSelId]           = useState(db[0]?.id || null);
  const [stock, setStock]           = useState("");
  const [cost, setCost]             = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [moq, setMoq]               = useState("");
  const [leadTime, setLeadTime]     = useState("");
  const [currency, setCurrency]     = useState("USD");
  const [reorderLevel, setReorderLevel] = useState("");
  const [warehouse, setWarehouse]   = useState("");
  const [supplierPartNo, setSupplierPartNo] = useState("");
  const [saved, setSaved]           = useState(false);
  const [search, setSearch]         = useState("");

  const filtered = db.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.code.toLowerCase().includes(search.toLowerCase()));
  const selected = db.find(m => m.id === selId);

  function loadMaterial(m) {
    setSelId(m.id);
    setStock(m.stock || "");
    setCost(m.cost || "");
    setSellingPrice(m.sellingPrice || "");
    setMoq(m.moq || "");
    setLeadTime(m.leadTime || "");
    setCurrency(m.currency || "USD");
    setReorderLevel(m.reorderLevel || "");
    setWarehouse(m.warehouse || "");
    setSupplierPartNo(m.supplierPartNo || "");
    setSaved(false);
  }

  function saveStock() {
    setDb(prev => prev.map(m => m.id === selId ? {
      ...m,
      stock: parseInt(stock) || m.stock,
      cost: parseFloat(cost) || m.cost,
      sellingPrice: parseFloat(sellingPrice) || 0,
      moq: parseInt(moq) || m.moq,
      leadTime: leadTime || m.leadTime,
      currency: currency,
      reorderLevel: parseInt(reorderLevel) || 0,
      warehouse: warehouse,
      supplierPartNo: supplierPartNo,
    } : m));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const marginAmt = cost && sellingPrice && parseFloat(cost) > 0 ? (parseFloat(sellingPrice) - parseFloat(cost)).toFixed(2) : null;
  const marginPct = cost && sellingPrice && parseFloat(sellingPrice) > 0 ? Math.round((1 - parseFloat(cost) / parseFloat(sellingPrice)) * 100) : null;
  const stockVal  = cost && stock ? (parseFloat(cost) * parseInt(stock)).toLocaleString() : null;

  const IS = { width:"100%", background:"#f8faff", border:"1.5px solid #d1ddf7", borderRadius:8, padding:"10px 13px", color:"#0f172a", fontSize:13, fontFamily:"inherit" };
  const LS = { fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:.5, display:"block", marginBottom:5 };

  return (
    <div style={{ padding:"28px 32px", maxWidth:1100 }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <div style={{ fontSize:19, fontWeight:700, color:T.txt1, marginBottom:3 }}>Stock & Pricing</div>
          <div style={{ fontSize:13, color:T.txt3 }}>Select a material and update its stock levels, cost and pricing details</div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:20 }}>
        {/* LEFT — material picker */}
        <div>
          <div className="card" style={{ padding:16 }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.txt4, textTransform:"uppercase", letterSpacing:.5, marginBottom:10 }}>Select Material</div>
            <input
              className="input"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ marginBottom:12, fontSize:12 }}
            />
            <div style={{ maxHeight:420, overflowY:"auto", display:"flex", flexDirection:"column", gap:6 }}>
              {filtered.map(m => (
                <div key={m.id} onClick={() => loadMaterial(m)}
                  style={{ padding:"10px 12px", borderRadius:8, cursor:"pointer", border:"1.5px solid " + (selId===m.id?"#1a4fd6":"#e2e8f0"), background:selId===m.id?"#dce8ff":"#fff", transition:"all .15s" }}>
                  <div style={{ fontSize:12, fontWeight:600, color:selId===m.id?"#1a4fd6":"#0f172a" }}>{m.name}</div>
                  <div style={{ display:"flex", gap:10, marginTop:3 }}>
                    <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:"#94a3b8" }}>{m.code}</span>
                    {m.stock > 0 && <span style={{ fontSize:10, color:"#059669" }}>{m.stock} units</span>}
                    {m.cost > 0 && <span style={{ fontSize:10, color:"#1a4fd6" }}>${m.cost}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — form */}
        <div>
          {!selected ? (
            <div className="card" style={{ padding:40, textAlign:"center", color:T.txt3 }}>
              <div style={{ fontSize:32, marginBottom:12 }}>📦</div>
              <div>Select a material from the left to update its stock and pricing</div>
            </div>
          ) : (
            <div>
              {/* Material header */}
              <div className="card" style={{ padding:"16px 20px", marginBottom:14, borderLeft:"3px solid #1a4fd6" }}>
                <div style={{ fontWeight:700, color:T.txt1, fontSize:15 }}>{selected.name}</div>
                <div style={{ fontSize:12, color:T.txt3, marginTop:3 }}>{selected.supplier} · {selected.code} · {selected.type}</div>
              </div>

              {/* Stock section */}
              <div className="card" style={{ padding:22, marginBottom:14 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                  <div style={{ width:30, height:30, background:"#dce8ff", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>📦</div>
                  <div style={{ fontSize:14, fontWeight:700, color:T.txt1 }}>Stock Levels</div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <div>
                    <label style={LS}>Current Stock (units)</label>
                    <input type="number" style={IS} placeholder="e.g. 1800" value={stock} onChange={e => setStock(e.target.value)}/>
                  </div>
                  <div>
                    <label style={LS}>Reorder Level (units)</label>
                    <input type="number" style={IS} placeholder="e.g. 500" value={reorderLevel} onChange={e => setReorderLevel(e.target.value)}/>
                  </div>
                  <div>
                    <label style={LS}>MOQ (Min Order Qty)</label>
                    <input type="number" style={IS} placeholder="e.g. 250" value={moq} onChange={e => setMoq(e.target.value)}/>
                  </div>
                  <div>
                    <label style={LS}>Lead Time</label>
                    <input type="text" style={IS} placeholder="e.g. 2-3 weeks" value={leadTime} onChange={e => setLeadTime(e.target.value)}/>
                  </div>
                  <div>
                    <label style={LS}>Warehouse / Location</label>
                    <input type="text" style={IS} placeholder="e.g. Rack A3, Shelf 2" value={warehouse} onChange={e => setWarehouse(e.target.value)}/>
                  </div>
                  <div>
                    <label style={LS}>Supplier Part Number</label>
                    <input type="text" style={IS} placeholder="e.g. B-423-WH" value={supplierPartNo} onChange={e => setSupplierPartNo(e.target.value)}/>
                  </div>
                </div>
              </div>

              {/* Pricing section */}
              <div className="card" style={{ padding:22, marginBottom:14 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                  <div style={{ width:30, height:30, background:"#fef3c7", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>💰</div>
                  <div style={{ fontSize:14, fontWeight:700, color:T.txt1 }}>Pricing</div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
                  <div>
                    <label style={LS}>Purchase / Unit Cost</label>
                    <input type="number" style={IS} placeholder="e.g. 6.80" value={cost} onChange={e => setCost(e.target.value)}/>
                  </div>
                  <div>
                    <label style={LS}>Selling Price</label>
                    <input type="number" style={IS} placeholder="e.g. 9.50" value={sellingPrice} onChange={e => setSellingPrice(e.target.value)}/>
                  </div>
                  <div>
                    <label style={LS}>Currency</label>
                    <select style={{...IS, cursor:"pointer"}} value={currency} onChange={e => setCurrency(e.target.value)}>
                      {["USD","EUR","GBP","INR","AED","SGD","JPY"].map(c => <option key={c} style={{background:"#fff"}}>{c}</option>)}
                    </select>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
                    <div style={{ fontSize:11, color:T.txt4, marginBottom:4 }}>Stock Value</div>
                    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:18, fontWeight:700, color:"#1a4fd6" }}>
                      {stockVal ? currency + " " + stockVal : "—"}
                    </div>
                  </div>
                </div>

                {/* Live margin */}
                {marginAmt && (
                  <div style={{ background:"linear-gradient(135deg,#1a4fd6,#1440b8)", borderRadius:10, padding:"16px 18px" }}>
                    <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.8)", marginBottom:12, textTransform:"uppercase", letterSpacing:.4 }}>Live Margin Calculation</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
                      {[
                        ["Margin Amount", currency + " " + marginAmt],
                        ["Margin %", marginPct + "%"],
                        ["Total Stock Value", stockVal ? currency + " " + stockVal : "—"],
                      ].map(([l, v]) => (
                        <div key={l} style={{ background:"rgba(255,255,255,0.15)", borderRadius:8, padding:"12px 10px", textAlign:"center" }}>
                          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:17, fontWeight:700, color:"#fff" }}>{v}</div>
                          <div style={{ fontSize:10, color:"rgba(255,255,255,0.65)", marginTop:3 }}>{l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Save button */}
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <button className="btn-primary" onClick={saveStock} style={{ padding:"12px 32px", fontSize:14 }}>
                  Save Stock & Pricing
                </button>
                {saved && (
                  <div style={{ background:"#f0fdf4", border:"1px solid #86efac", borderRadius:8, padding:"10px 16px", fontSize:13, color:"#059669", fontWeight:600 }}>
                    ✓ Saved successfully!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN APP — SIDEBAR LAYOUT
───────────────────────────────────────────────────────────────────────────── */
export default function App() {
  const [user, setUser]                     = useState(null);
  const [page, setPage]                     = useState("dashboard");
  const [db, setDb]                         = useState(MATERIALS);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [detailFrom, setDetailFrom]         = useState(null);

  // Show login if not authenticated
  if (!user) return (<><LoginPage onLogin={setUser}/></>);

  const nav=[
    {id:"dashboard", icon:"⬡", label:"Dashboard"},
    {id:"materials", icon:"⬢", label:"Materials"},
    {id:"recommend", icon:"◉", label:"Recommend"},
    {id:"compliance",icon:"✦", label:"Compliance"},
    {id:"stock",     icon:"📦", label:"Stock & Pricing"},
    {id:"upload",    icon:"↑",  label:"Add Material"},
    {id:"compare",   icon:"⇌", label:"Cost Comparison"},
    {id:"suppliers", icon:"◎", label:"Suppliers"},
  ];

  function openDetail(m,from){setSelectedMaterial(m);setDetailFrom(from||page);setPage("detail");}
  function closeDetail(){setPage(detailFrom||"materials");setSelectedMaterial(null);}

  return(
    <div style={{display:"flex",height:"100vh",background:"#f0f4ff",overflow:"hidden"}}>
      {/* ── SIDEBAR ── */}
      <div style={{width:215,background:"linear-gradient(180deg,#1a4fd6 0%,#1440b8 60%,#0f2d9e 100%)",display:"flex",flexDirection:"column",flexShrink:0,boxShadow:"4px 0 20px rgba(26,79,214,0.2)"}}>
        {/* Logo */}
        <div style={{padding:"20px 16px 16px",borderBottom:"1px solid rgba(255,255,255,0.15)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,background:"rgba(255,255,255,0.2)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:"2px solid rgba(255,255,255,0.3)"}}>
              <span style={{fontFamily:"'IBM Plex Mono',monospace",fontWeight:700,fontSize:14,color:"#fff",letterSpacing:-1}}>S</span>
            </div>
            <div>
              <div style={{fontFamily:"'IBM Plex Mono',monospace",fontWeight:700,fontSize:13,color:"#fff",letterSpacing:1}}>SOLUTION</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.55)",letterSpacing:.8,textTransform:"uppercase"}}>Inventory Intelligence</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{flex:1,padding:"10px 0",overflowY:"auto"}}>
          {nav.map(item=>(
            <div key={item.id} className={"nav-link "+(page===item.id||page==="detail"&&detailFrom===item.id?"active":"")}
              onClick={()=>{setPage(item.id);setSelectedMaterial(null);}}
              style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",fontSize:13,color:"rgba(255,255,255,0.75)"}}>
              <span style={{fontSize:15,minWidth:18,textAlign:"center"}}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        {/* User + logout */}
        <div style={{padding:"12px 16px",borderTop:"1px solid rgba(255,255,255,0.15)"}}>
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:8}}>
            <div style={{width:30,height:30,background:"rgba(255,255,255,0.25)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",flexShrink:0,border:"1.5px solid rgba(255,255,255,0.4)"}}>
              {user.initials}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:600,color:"#fff",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user.name}</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.6)"}}>{user.role}</div>
            </div>
          </div>
          <button onClick={()=>setUser(null)}
            style={{width:"100%",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:6,padding:"6px 0",color:"rgba(255,255,255,0.7)",fontSize:11,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}
            onMouseOver={e=>e.target.style.background="rgba(255,255,255,0.2)"}
            onMouseOut={e=>e.target.style.background="rgba(255,255,255,0.1)"}>
            Sign Out
          </button>
        </div>
      </div>

      {/* ── TOPBAR + CONTENT ── */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{height:52,background:"#fff",borderBottom:"1px solid #d1ddf7",display:"flex",alignItems:"center",padding:"0 24px",gap:14,flexShrink:0,boxShadow:"0 1px 6px rgba(26,79,214,0.08)"}}>
          <div style={{position:"relative",flex:"0 0 300px"}}>
            <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#94a3b8",fontSize:14}}>⌕</span>
            <input className="input" placeholder="Search materials, codes..." style={{paddingLeft:30,height:34,borderRadius:20,fontSize:13}} readOnly onClick={()=>setPage("materials")}/>
          </div>
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:14}}>
            <span style={{fontSize:12,color:"#94a3b8"}}>{db.length} materials</span>
            <div style={{width:1,height:20,background:"#e2e8f0"}}/>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:"#059669",animation:"pulse 2s ease infinite"}}/>
              <span style={{fontSize:11,color:"#059669",fontWeight:600}}>Live</span>
            </div>
            <div style={{fontSize:12,color:"#1a4fd6",fontWeight:600}}>{user.email}</div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{flex:1,overflow:"auto",position:"relative"}}>
          {/* Brady watermark */}
          <div style={{position:"fixed",bottom:30,right:30,pointerEvents:"none",zIndex:0,userSelect:"none"}}>
            <div style={{fontSize:130,fontWeight:900,color:"#1a4fd6",opacity:0.035,fontFamily:"'IBM Plex Sans',sans-serif",letterSpacing:-5,lineHeight:1,transform:"rotate(-12deg)",whiteSpace:"nowrap"}}>BRADY</div>
          </div>
          <div style={{position:"fixed",bottom:190,right:-50,pointerEvents:"none",zIndex:0,userSelect:"none"}}>
            <div style={{fontSize:75,fontWeight:900,color:"#1a4fd6",opacity:0.02,fontFamily:"'IBM Plex Sans',sans-serif",letterSpacing:-2,lineHeight:1,transform:"rotate(-12deg)",whiteSpace:"nowrap"}}>SOLUTION</div>
          </div>

          {page==="dashboard"  && <Dashboard db={db} suppliers={SUPPLIERS}/>}
          {page==="materials"  && <MaterialsPage db={db} setDb={setDb} onSelect={m=>openDetail(m,"materials")}/>}
          {page==="recommend"  && <RecommendPage db={db}/>}
          {page==="compliance" && <CompliancePage db={db}/>}
          {page==="stock"      && <StockPricingPage db={db} setDb={setDb}/>}
          {page==="upload"     && <UploadTDSPage onAdd={m=>{setDb(d=>[...d,m]);setPage("stock");}} db={db}/>}
          {page==="compare"    && <ComparisonPage db={db}/>}
          {page==="suppliers"  && <SuppliersPage suppliers={SUPPLIERS} db={db}/>}
          {page==="detail"     && selectedMaterial && <MaterialDetail material={selectedMaterial} db={db} onBack={closeDetail}/>}
        </div>
      </div>
    </div>
  );
}
