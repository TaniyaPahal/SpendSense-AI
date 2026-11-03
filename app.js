const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];

const SEED=[{id:1,name:"Canteen lunch",category:"Food",amount:120,type:"Expense",date:"2026-11-03"},{id:2,name:"Auto to college",category:"Travel",amount:80,type:"Expense",date:"2026-11-03"},{id:3,name:"Notebook & pens",category:"Education",amount:240,type:"Expense",date:"2026-11-02"},{id:4,name:"Coffee with friends",category:"Food",amount:160,type:"Expense",date:"2026-11-02"},{id:5,name:"Monthly mobile recharge",category:"Bills",amount:299,type:"Expense",date:"2026-11-01"},{id:6,name:"Online course",category:"Education",amount:499,type:"Expense",date:"2026-11-01"},{id:7,name:"Movie night",category:"Entertainment",amount:350,type:"Expense",date:"2026-10-31"},{id:8,name:"Clothes",category:"Shopping",amount:850,type:"Expense",date:"2026-10-30"},{id:9,name:"Bus pass",category:"Travel",amount:450,type:"Expense",date:"2026-10-29"},{id:10,name:"Pocket money",category:"Income",amount:5000,type:"Income",date:"2026-10-28"},{id:11,name:"Snacks",category:"Food",amount:280,type:"Expense",date:"2026-10-27"},{id:12,name:"Pharmacy",category:"Health",amount:220,type:"Expense",date:"2026-10-26"},{id:13,name:"Online shopping",category:"Shopping",amount:1200,type:"Expense",date:"2026-10-25"},{id:14,name:"Canteen",category:"Food",amount:650,type:"Expense",date:"2026-10-23"},{id:15,name:"Travel home",category:"Travel",amount:400,type:"Expense",date:"2026-10-21"},{id:16,name:"Printouts",category:"Education",amount:300,type:"Expense",date:"2026-10-19"}];

const colors={Food:"#80e2d5",Travel:"#91b6ff",Shopping:"#b8a7ec",Education:"#edc28c",Bills:"#4e9dba",Entertainment:"#e68db9",Health:"#77c99d",Other:"#91a9c1",Income:"#72d7b7"};

const icons={Food:"♨",Travel:"⌁",Shopping:"◇",Education:"▤",Bills:"▣",Entertainment:"♫",Health:"✚",Other:"✦",Income:"↗"};

let user=null,tx=[],budget=12000,goals=[];

function money(n){return"₹"+Math.round(n).toLocaleString("en-IN")}function expenses(){return tx.filter(t=>t.type==="Expense")}function spent(){return expenses().reduce((a,t)=>a+t.amount,0)}function byCategory(){let o={};expenses().forEach(t=>o[t.category]=(o[t.category]||0)+t.amount);return o}

function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}

function dateLabel(d){if(!d)return"Today";let[y,m,day]=d.split("-").map(Number);return new Date(y,m-1,day).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}

function toast(s){let x=$("#toast");x.textContent=s;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),2300)}

function getUsers(){try{return JSON.parse(localStorage.getItem("ss_users")||"[]")}catch{return[]}}

function saveUsers(a){localStorage.setItem("ss_users",JSON.stringify(a))}

function switchAuth(mode){$$(".auth-tab").forEach(b=>b.classList.toggle("active",b.dataset.auth===mode));$("#loginPane").hidden=mode!=="login";$("#signupPane").hidden=mode!=="signup";$("#authError").textContent=""}

$$(".auth-tab").forEach(b=>b.onclick=()=>switchAuth(b.dataset.auth));

$$(".show-pass").forEach(b=>b.onclick=()=>{let i=$("#"+b.dataset.target);i.type=i.type==="password"?"text":"password";b.textContent=i.type==="password"?"Show":"Hide"});

function enter(u,isDemo=false){user=u;localStorage.setItem("ss_session",u.email);let prefix="ss_data_"+u.email.toLowerCase();try{let savedTx=localStorage.getItem(prefix+"_tx"),savedGoals=localStorage.getItem(prefix+"_goals");tx=savedTx?JSON.parse(savedTx):(isDemo?SEED.map(x=>({...x})):[]);goals=savedGoals?JSON.parse(savedGoals):[];if(!isDemo&&tx.length){const seedKeys=new Set(SEED.map(s=>[s.name,s.amount,s.category,s.date,s.type].join("|")));tx=tx.filter(t=>!seedKeys.has([t.name,t.amount,t.category,t.date,t.type].join("|")));localStorage.setItem(prefix+"_tx",JSON.stringify(tx));}}catch{tx=[];goals=[]}budget=Number(localStorage.getItem(prefix+"_budget"))||Number(u.budget)||12000;splitRecords=JSON.parse(localStorage.getItem(prefix+"_splits")||"[]");$("#authScreen").hidden=true;$("#appShell").hidden=false;updateProfileUI();renderAll();renderSplitHistory();go("dashboard")}

function persist(){if(!user)return;let p="ss_data_"+user.email.toLowerCase();localStorage.setItem(p+"_tx",JSON.stringify(tx));localStorage.setItem(p+"_goals",JSON.stringify(goals));localStorage.setItem(p+"_budget",budget)}

$("#loginForm").onsubmit=e=>{e.preventDefault();let email=$("#loginEmail").value.trim().toLowerCase(),pass=$("#loginPassword").value,record=getUsers().find(x=>x.email.toLowerCase()===email&&x.password===pass);if(!record){$("#authError").textContent="We couldn't find that demo account. Check your details or create an account.";return}enter(record)};

$("#signupForm").onsubmit=e=>{e.preventDefault();let name=$("#signupName").value.trim(),email=$("#signupEmail").value.trim().toLowerCase(),password=$("#signupPassword").value,b=Number($("#signupBudget").value);let users=getUsers();if(users.some(x=>x.email.toLowerCase()===email)){ $("#authError").textContent="An account with this email already exists. Please sign in.";return}if(b<500){$("#authError").textContent="Please enter a monthly budget of at least ₹500.";return}let u={name,email,password,budget:b};users.push(u);saveUsers(users);enter(u)};

$("#demoLogin").onclick=()=>{let u={name:"Diksha",email:"demo@spendsense.local",password:"demo",budget:12000};enter(u,true)};

$("#forgot").onclick=()=>{$("#authError").textContent="Demo mode: create a new account or use Continue with demo account."};

function signout(){if(user)persist();user=null;localStorage.removeItem("ss_session");$("#appShell").hidden=true;$("#authScreen").hidden=false;$("#profileMenu").classList.remove("open");$("#loginForm").reset();switchAuth("login")}

$("#logoutMini").onclick=signout;$("#menuLogout").onclick=signout;$("#profileSignout").onclick=signout;

function updateProfileUI(){let name=user?.name||"Diksha",email=user?.email||"";let initials=name.split(/\s+/).map(x=>x[0]).join("").slice(0,2).toUpperCase();["sideAvatar","topAvatar","menuAvatar","profileAvatar"].forEach(id=>{if($("#"+id))$("#"+id).textContent=initials});$("#sideName").textContent=name;$("#topName").textContent=name;$("#menuName").textContent=name;$("#menuEmail").textContent=email;$("#sideEmail").textContent=email;$("#welcomeTitle").textContent=`A fresh start, ${name.split(" ")[0]}.`;$("#profileDisplayName").textContent=name;$("#profileDisplayEmail").textContent=email;$("#profileNameInput").value=name;$("#profileEmailInput").value=email;$("#profileBudgetInput").value=budget;$("#sessionEmail").textContent=email+" · Local session"}

$("#profileTrigger").onclick=()=>$("#profileMenu").classList.toggle("open");document.addEventListener("click",e=>{if(!e.target.closest(".profile-wrap"))$("#profileMenu").classList.remove("open")});

$("#profileForm").onsubmit=e=>{e.preventDefault();let name=$("#profileNameInput").value.trim(),email=$("#profileEmailInput").value.trim().toLowerCase(),b=Number($("#profileBudgetInput").value);if(name.length<2||!email.includes("@")||b<500)return toast("Please check your profile details.");let old=user.email;let users=getUsers(),idx=users.findIndex(x=>x.email.toLowerCase()===old.toLowerCase());if(idx>=0){if(users.some((x,i)=>i!==idx&&x.email.toLowerCase()===email))return toast("That email is already in use.");users[idx]={...users[idx],name,email,budget:b};saveUsers(users)}user={...user,name,email,budget:b};budget=b;localStorage.setItem("ss_session",email);updateProfileUI();persist();renderAll();toast("Your profile has been updated.")};

function go(id){$$(".page").forEach(p=>p.classList.toggle("active",p.id===id));$$(".nav").forEach(n=>n.classList.toggle("active",n.dataset.page===id));let names={home:"Welcome to SpendSense.",dashboard:"Your money, in focus.",transactions:"Transactions",assistant:"Your personal money coach.",budgets:"Budget planner",predictions:"Look a little ahead.",goals:"Savings goals",split:"Split it fairly.",analytics:"Your money, visualized.",insights:"AI money insights",profile:"Profile & settings"};$("#pageTitle").textContent=names[id];$("#crumb").textContent=id.toUpperCase();$("#sidebar").classList.remove("open");$("#profileMenu").classList.remove("open");if(id==="transactions")renderTransactions();if(id==="budgets")renderBudgets();if(id==="insights")renderInsights();if(id==="goals")renderGoals();if(id==="profile")updateProfileUI();if(id==="assistant")renderAssistantStats();if(id==="predictions")renderPredictions();if(id==="analytics")renderAnalytics();if(id==="home")$("#homeBudget").textContent=money(budget);window.scrollTo({top:0,behavior:"smooth"})}

$$(".nav").forEach(n=>n.onclick=()=>go(n.dataset.page));$$("[data-page]").forEach(n=>n.onclick=()=>go(n.dataset.page));$("#menu").onclick=()=>$("#sidebar").classList.toggle("open");$("#quickInsight").onclick=()=>go("insights");

function openTx(){$("#txModal").classList.add("show");$("#txName").focus()}$$("[data-action='add']").forEach(b=>b.onclick=openTx);$("#closeTx").onclick=()=>$("#txModal").classList.remove("show");$("#txModal").onclick=e=>{if(e.target.id==="txModal")$("#txModal").classList.remove("show")};

$("#txForm").onsubmit=e=>{e.preventDefault();let item={id:Date.now(),name:$("#txName").value.trim(),amount:Number($("#txAmount").value),type:$("#txType").value,category:$("#txCategory").value,date:$("#txDate").value||new Date().toISOString().slice(0,10)};if(!item.name||item.amount<=0)return toast("Enter a valid description and amount.");if(item.type==="Income"&&item.category==="Food")item.category="Income";tx.unshift(item);persist();$("#txForm").reset();$("#txDate").value=new Date().toISOString().slice(0,10);$("#txModal").classList.remove("show");renderAll();toast("Transaction saved.")};

function renderAll(){renderMetrics();renderDonut();renderRecent();renderTransactions();renderBudgets();renderInsights();renderGoals();renderAssistantStats();renderPredictions();renderAnalytics();renderSmartTools();$("#homeBudget").textContent=money(budget)}

function renderMetrics(){let s=spent(),left=budget-s,pct=budget?Math.round(s/budget*100):0,cat=byCategory(),top=Object.entries(cat).sort((a,b)=>b[1]-a[1])[0],potential=Math.round((cat.Food||0)*.15+(cat.Shopping||0)*.12+(cat.Entertainment||0)*.1),days=Math.max(1,30-new Date().getDate()+1);$("#leftMetric").textContent=money(left);$("#leftMetric").style.color=left<0?"#ffaaa0":"";$("#budgetPct").textContent=pct+"%";$("#balanceBar").style.width=Math.min(100,pct)+"%";$("#spentCaption").textContent=money(s)+" spent";$("#budgetCaption").textContent="of "+money(budget);$("#balanceCaption").textContent=left<0?"You've crossed your monthly plan":"You're within your monthly plan";$("#budgetMetric").textContent=money(budget);$("#spentMetric").textContent=money(s);$("#savingMetric").textContent=money(potential);$("#dailySafe").textContent=money(Math.max(0,left)/days);$("#topCategory").textContent=top?top[0]:"—";$("#coachTitle").textContent=top?`Your biggest category is ${top[0]}`:"Start logging to unlock insights";$("#coachText").textContent=top?`${top[0]} accounts for ${Math.round(top[1]/Math.max(1,s)*100)}% of your logged expenses. A weekly cap could make spending more intentional.`:"Add a few expenses and SpendSense will find patterns in your money habits."}

function renderDonut(){let entries=Object.entries(byCategory()).sort((a,b)=>b[1]-a[1]),total=spent(),angle=0,stops=[];entries.forEach(([k,v])=>{let end=angle+(total?v/total*100:0);stops.push(`${colors[k]||colors.Other} ${angle}% ${end}%`);angle=end});$("#donut").style.background=stops.length?`conic-gradient(${stops.join(",")})`:"#26394b";$("#donutTotal").textContent=money(total);$("#legend").innerHTML=entries.slice(0,6).map(([k,v])=>`<div class="legend-row"><i style="background:${colors[k]||colors.Other}"></i>${k}<b>${money(v)}</b></div>`).join("")||"<small>No expenses yet</small>"}

function renderRecent(){$("#recentList").innerHTML=tx.slice(0,5).map(t=>`<div class="recent-row"><div class="tx-icon">${icons[t.category]||"✦"}</div><div class="tx-info"><b>${esc(t.name)}</b><small>${t.category} · ${dateLabel(t.date)}</small></div><span class="tx-amount ${t.type==="Income"?"income":"expense"}">${t.type==="Income"?"+":"−"}${money(t.amount)}</span></div>`).join("")}

function renderTransactions(){let q=$("#searchTx").value.toLowerCase(),f=$("#filterCat").value,list=tx.filter(t=>(f==="All"||t.category===f)&&(`${t.name} ${t.category} ${t.type}`).toLowerCase().includes(q));$("#txTable").innerHTML=list.map(t=>`<tr><td><span class="tx-title">${esc(t.name)}</span><span class="tx-sub">#${String(t.id).slice(-6)}</span></td><td>${t.category}</td><td>${dateLabel(t.date)}</td><td><span class="type-pill ${t.type==="Expense"?"exp":""}">${t.type}</span></td><td class="${t.type==="Income"?"income":"expense"}">${t.type==="Income"?"+":"−"}${money(t.amount)}</td><td><button class="delete-tx" data-delete="${t.id}" aria-label="Delete ${esc(t.name)}">×</button></td></tr>`).join("");$("#noTx").hidden=list.length>0;$$("[data-delete]").forEach(b=>b.onclick=()=>{if(confirm("Delete this transaction?")){tx=tx.filter(t=>String(t.id)!==b.dataset.delete);persist();renderAll();toast("Transaction deleted.")}})}

$("#searchTx").oninput=renderTransactions;$("#filterCat").onchange=renderTransactions;

function renderBudgets(){let s=spent(),pct=budget?Math.round(s/budget*100):0;$("#budgetBig").textContent=money(budget);$("#budgetInput").value=budget;$("#budgetUsage").textContent=money(s)+" spent";$("#budgetPct2").textContent=pct+"%";$("#budgetBigBar").style.width=Math.min(100,pct)+"%";let caps={Food:.25,Travel:.15,Shopping:.15,Education:.2,Bills:.1,Entertainment:.08,Health:.07},cat=byCategory();$("#categoryBudgetList").innerHTML=Object.entries(caps).map(([k,p])=>{let cap=budget*p,v=cat[k]||0,pc=Math.round(v/cap*100);return`<div class="cat-budget"><div class="cat-budget-top"><span>${k}</span><b>${money(v)} / ${money(cap)}</b></div><div class="balance-track"><i style="width:${Math.min(100,pc)}%;background:${pc>100?"#f19b9e":colors[k]}"></i></div><small>${pc>100?"Over suggested cap":money(Math.max(0,cap-v))+" remaining"} · Suggested cap ${Math.round(p*100)}%</small></div>`}).join("")}

$("#saveBudget").onclick=()=>{let v=Number($("#budgetInput").value);if(v<500)return toast("Budget must be at least ₹500.");budget=v;persist();renderAll();toast("Monthly budget updated.")};

function insights(){let cat=byCategory(),entries=Object.entries(cat).sort((a,b)=>b[1]-a[1]),s=spent(),top=entries[0],left=budget-s,cards=[];if(top)cards.push(["◈",`Watch ${top[0]}`,`${top[0]} is your highest logged category at ${money(top[1])}. A weekly cap can make spending more predictable.`]);cards.push([left<0?"⚑":"✓",left<0?"Budget exceeded":"Room in your budget",left<0?`You're ${money(Math.abs(left))} over your monthly budget. Review flexible expenses.`:`You have ${money(left)} left. Check your daily safe-spend estimate before discretionary purchases.`]);let food=cat.Food||0,shop=cat.Shopping||0;if(food)cards.push(["♨","Small food swaps",`Food spending is ${money(food)}. Planning snacks or meals may reduce impulse purchases.`]);if(shop)cards.push(["◇","Pause before checkout",`Shopping totals ${money(shop)}. Try a 24-hour wait for non-essential purchases.`]);if(!top)cards.push(["✳","Start with one entry","Log your first transaction to get category trends and practical suggestions."]);return{top,left,cards,entries,s}}

function renderInsights(){let d=insights(),max=Math.max(1,...d.entries.map(x=>x[1]));$("#insightHeadline").textContent=d.top?`${d.top[0]} is your biggest spending category.`:"Your money story starts with one transaction.";$("#insightSub").textContent=d.top?`You've logged ${money(d.s)} in expenses. Here are practical patterns from your entries.`:"Add transactions to unlock personalized observations.";$("#insightCards").innerHTML=d.cards.slice(0,3).map(c=>`<article class="insight-card"><span>${c[0]}</span><b>${c[1]}</b><p>${c[2]}</p></article>`).join("");$("#insightBars").innerHTML=d.entries.map(([k,v])=>`<div class="insight-bar"><div><span>${k}</span><b>${money(v)}</b></div><div class="balance-track"><i style="width:${v/max*100}%;background:${colors[k]||colors.Other}"></i></div></div>`).join("")||"<small>No spending data yet.</small>"}

$("#refreshInsights").onclick=()=>{renderInsights();toast("Insights refreshed.")};

function renderGoals(){$("#goalGrid").innerHTML=goals.map(g=>{let p=Math.min(100,Math.round(g.saved/g.target*100));return`<article class="goal-card"><div class="goal-top"><span class="goal-icon">${g.icon||"◎"}</span><span class="section-kicker">${p}% COMPLETE</span></div><h3>${esc(g.name)}</h3><p>One step closer to your goal.</p><div class="goal-amount">${money(g.saved)} <small>of ${money(g.target)}</small></div><div class="balance-track"><i style="width:${p}%"></i></div><div class="goal-foot"><span>${money(Math.max(0,g.target-g.saved))} to go</span><span>${p}%</span></div><button class="under-link contribute" data-id="${g.id}">＋ Add savings</button></article>`}).join("");$$(".contribute").forEach(b=>b.onclick=()=>{let g=goals.find(x=>x.id==b.dataset.id),v=Number(prompt(`How much did you add to ${g.name}? (₹)`));if(v>0){g.saved+=v;persist();renderGoals();toast("Savings progress updated.")}})}

$("#newGoal").onclick=()=>$("#goalModal").classList.add("show");$("#closeGoal").onclick=()=>$("#goalModal").classList.remove("show");$("#goalModal").onclick=e=>{if(e.target.id==="goalModal")$("#goalModal").classList.remove("show")};$("#goalForm").onsubmit=e=>{e.preventDefault();let name=$("#goalName").value.trim(),target=Number($("#goalTarget").value),saved=Number($("#goalSaved").value)||0;if(!name||target<=0||saved<0)return toast("Enter valid goal details.");goals.push({id:Date.now(),name,target,saved,icon:"✳"});persist();renderGoals();$("#goalForm").reset();$("#goalModal").classList.remove("show");toast("Savings goal created.")};

 

function renderAssistantStats(){let cat=byCategory(),top=Object.entries(cat).sort((a,b)=>b[1]-a[1])[0];if($("#assistantSpent"))$("#assistantSpent").textContent=money(spent());if($("#assistantLeft"))$("#assistantLeft").textContent=money(budget-spent());if($("#assistantTop"))$("#assistantTop").textContent=top?top[0]:"—"}

function coachReply(q){let cat=byCategory(),entries=Object.entries(cat).sort((a,b)=>b[1]-a[1]),s=spent(),left=budget-s,top=entries[0],v=q.toLowerCase();if(v.includes("most")||v.includes("category"))return top?`Your highest spending category is ${top[0]} at ${money(top[1])}. That is about ${Math.round(top[1]/Math.max(1,s)*100)}% of your logged expenses. Try setting a weekly limit for this category.`:"I don't have enough spending data yet. Add a few transactions and I'll spot your top category.";if(v.includes("budget")||v.includes("stay"))return left>=0?`You're currently ${money(left)} under your monthly budget of ${money(budget)}. Your logged spending is ${money(s)}. Keep an eye on flexible categories and check your daily safe-spend amount.`:`Your logged expenses are ${money(Math.abs(left))} above your budget. Review non-essential shopping or entertainment first, and adjust your plan if your budget was unrealistic.`;if(v.includes("save"))return top?`A practical first step: try reducing ${top[0]} by 10% next month. Based on your current ${money(top[0]&&cat[top[0]])} spend, that could free roughly ${money(top[1]*.1)}. You can also create a savings goal and track progress.`:`Start by recording expenses for a few days. Then choose one flexible category to reduce and put that amount toward a savings goal.`;if(v.includes("goal"))return goals.length?`You have ${goals.length} savings goal(s). Keep contributions small and consistent. Your next step is to add a contribution from the Savings Goals page.`:"Create your first savings goal to give your money a clear purpose.";return `Here's your snapshot: you've logged ${money(s)} in expenses against a ${money(budget)} budget, leaving ${money(left)}. ${top?`${top[0]} is your largest category.`:"Add more transactions for a useful pattern."} What matters most is choosing one small action you can repeat.`}

function sendChat(q){q=(q||"").trim();if(!q)return;let box=$("#chatMessages");box.insertAdjacentHTML("beforeend",`<div class="chat-bubble user">${esc(q)}</div>`);box.insertAdjacentHTML("beforeend",`<div class="chat-bubble bot">${esc(coachReply(q))}</div>`);$("#chatInput").value="";box.scrollTop=box.scrollHeight}

if($("#chatForm"))$("#chatForm").onsubmit=e=>{e.preventDefault();sendChat($("#chatInput").value)};

$$("[data-prompt]").forEach(b=>b.onclick=()=>sendChat(b.dataset.prompt));

function renderPredictions(){let now=new Date(),day=Math.max(1,now.getDate()),monthSpend=expenses().filter(t=>{let d=new Date(t.date+"T12:00:00");return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear()}).reduce((a,t)=>a+t.amount,0),avg=monthSpend/day,forecast=avg*30,buffer=budget-forecast,pct=budget?Math.round(forecast/budget*100):0;$("#predictedSpend").textContent=money(forecast);$("#dailyAverage").textContent=money(avg);$("#predictedBuffer").textContent=(buffer<0?"−":"")+money(Math.abs(buffer));$("#predictionBudget").textContent=money(budget);$("#predictionBar").style.width=Math.min(100,pct)+"%";$("#predictionText").textContent=forecast<=budget?`At this pace, you may finish the month around ${money(Math.max(0,buffer))} under budget.`:`At this pace, you may exceed your monthly budget by ${money(Math.abs(buffer))}. Consider slowing flexible spending.`}

let splitRecords=[];

function renderSplitHistory(){if(!$("#splitHistory"))return;$("#splitHistory").innerHTML=splitRecords.length?splitRecords.map(r=>`<div class="recent-row"><div class="tx-icon">⇄</div><div class="tx-info"><b>${esc(r.title)}</b><small>${r.people} people · Paid by ${esc(r.payer)}</small></div><span class="tx-amount">${money(r.share)} each</span></div>`).join(""):`<p class="muted-copy">Your saved bill splits will appear here.</p>`}

if($("#splitForm"))$("#splitForm").onsubmit=e=>{e.preventDefault();let title=$("#splitTitle").value.trim(),amount=Number($("#splitAmount").value),people=Number($("#splitPeople").value),payer=$("#splitPayer").value.trim();if(!title||amount<=0||people<2)return;let share=amount/people,record={title,amount,people,payer,share};splitRecords.unshift(record);localStorage.setItem("ss_data_"+user.email.toLowerCase()+"_splits",JSON.stringify(splitRecords));$("#splitResult").innerHTML=`<span class="section-kicker">YOUR SPLIT SUMMARY</span><div class="split-summary"><small class="section-kicker">${esc(title.toUpperCase())}</small><strong>${money(share)} <small style="font-size:9px">per person</small></strong><p>${money(amount)} shared between ${people} people. ${esc(payer)} paid the bill. Each person’s equal share is ${money(share)}.</p><p>For an equal split, everyone except the payer owes their share to ${esc(payer)}.</p></div>`;$("#splitHistory").innerHTML=splitRecords.map(r=>`<div class="recent-row"><div class="tx-icon">⇄</div><div class="tx-info"><b>${esc(r.title)}</b><small>${r.people} people · Paid by ${esc(r.payer)}</small></div><span class="tx-amount">${money(r.share)} each</span></div>`).join("");toast("Bill split calculated.")};

function renderAnalytics(){let cat=Object.entries(byCategory()).sort((a,b)=>b[1]-a[1]),max=Math.max(1,...cat.map(x=>x[1])),top=cat[0],s=spent(),left=budget-s;$("#analyticsSpent").textContent=money(s);$("#analyticsCount").textContent=tx.length;$("#analyticsTop").textContent=top?top[0]:"—";$("#analyticsBars").innerHTML=cat.map(([k,v])=>`<div class="insight-bar"><div><span>${k}</span><b>${money(v)}</b></div><div class="balance-track"><i style="width:${v/max*100}%;background:${colors[k]||colors.Other}"></i></div></div>`).join("")||"<p class='muted-copy'>No expense data yet. Add transactions to see your analytics.</p>";$("#analyticsInsight").textContent=`You have recorded ${tx.length} transactions and spent ${money(s)}. Your monthly budget is ${money(budget)}. ${left>=0?`${money(left)} remains in your plan.`:`You are ${money(Math.abs(left))} above your plan.`} ${top?`${top[0]} is your largest expense category.`:"Start logging to identify your spending patterns."}`}

 

function autoLogin(){let email=localStorage.getItem("ss_session");if(!email)return;let u=getUsers().find(x=>x.email.toLowerCase()===email.toLowerCase());if(u)enter(u);else if(email==="demo@spendsense.local")enter({name:"Diksha",email,budget:12000},true)}

if(document.getElementById("todayDate"))document.getElementById("todayDate").textContent=new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});

if(document.getElementById("txDate"))document.getElementById("txDate").value=new Date().toISOString().slice(0,10);

autoLogin();

// Smart Spend tools: explainable score, needs-vs-wants, unusual-spend alerts and what-if planning.

function renderSmartTools(){

 const month=new Date().toISOString().slice(0,7),monthTx=tx.filter(t=>String(t.date||"").startsWith(month)),monthExp=monthTx.filter(t=>t.type==="Expense"),monthSpent=monthExp.reduce((a,t)=>a+Number(t.amount||0),0),income=monthTx.filter(t=>t.type==="Income").reduce((a,t)=>a+Number(t.amount||0),0);

 const needs=new Set(["Education","Bills","Health","Travel"]),need=monthExp.filter(t=>needs.has(t.category)).reduce((a,t)=>a+t.amount,0),wants=monthExp.filter(t=>!needs.has(t.category)).reduce((a,t)=>a+t.amount,0);

 const budgetScore=budget?Math.max(0,100-Math.max(0,monthSpent/budget*100-70)*1.5):50,recordScore=Math.min(20,monthExp.length*2),score=Math.round(Math.min(100,budgetScore*.8+recordScore));

 const node=id=>document.getElementById(id);

 if(node("spendScore"))node("spendScore").textContent=monthExp.length?score+"/100":"—";

 if(node("scoreMessage"))node("scoreMessage").textContent=!monthExp.length?"Add expenses to calculate your score.":score>=80?"Great control. Keep your routine consistent.":score>=55?"Good start. Review flexible spending once a week.":"Your spending is running high against your budget. Check the alerts below.";

 if(node("needsValue"))node("needsValue").textContent=money(need);if(node("wantsValue"))node("wantsValue").textContent=money(wants);

 if(node("needWantBar")){let total=Math.max(1,need+wants);node("needWantBar").innerHTML=`<i style="width:${need/total*100}%"></i><b style="width:${wants/total*100}%"></b>`}

 const grouped={};monthExp.forEach(t=>(grouped[t.category]??=[]).push(Number(t.amount)));let alerts=[];monthExp.forEach(t=>{let vals=grouped[t.category]||[],avg=vals.reduce((a,v)=>a+v,0)/Math.max(1,vals.length);if(vals.length>=3&&t.amount>avg*1.8)alerts.push(`${t.name} (${money(t.amount)}) is unusually high compared with your ${t.category} average.`)});

 if(monthSpent>budget)alerts.unshift(`You are ${money(monthSpent-budget)} over your monthly budget.`);

 if(node("spendAlerts"))node("spendAlerts").innerHTML=alerts.length?alerts.slice(0,3).map(a=>`<p class="smart-alert">⚑ ${esc(a)}</p>`).join(""):`<p class="muted-copy">${monthExp.length?"No unusual spending pattern detected in the current month.":"Alerts will appear after you add expenses."}</p>`;

 if(node("whatIfResult")){let cut=Number(node("whatIfSlider")?.value||10);node("whatIfResult").textContent=money(wants*cut/100)+" potential monthly savings";if(node("whatIfLabel"))node("whatIfLabel").textContent=cut+"% less on wants"}

}

if(document.getElementById("whatIfSlider")){document.getElementById("whatIfSlider").oninput=renderSmartTools}

function startVoiceEntry(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return toast("Voice entry is not supported in this browser. Try Chrome.");const rec=new SR();rec.lang="en-IN";rec.interimResults=false;rec.onresult=e=>{const phrase=e.results[0][0].transcript;const amount=(phrase.match(/(?:rupees|rs|₹)?\s*(\d+(?:\.\d+)?)/i)||[])[1];const name=phrase.replace(/(?:rupees|rs|₹)?\s*\d+(?:\.\d+)?/i,"").replace(/spent|expense|on/ig,"").trim();if(name)$("#txName").value=name;if(amount)$("#txAmount").value=amount;toast("Voice entry captured. Please review and save.")};rec.onerror=()=>toast("Could not hear that. Please try again.");rec.start()}

const voiceBtn=document.getElementById("voiceEntry");if(voiceBtn)voiceBtn.onclick=startVoiceEntry;

