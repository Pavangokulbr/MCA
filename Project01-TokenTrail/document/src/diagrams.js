// Regenerates the diagram PNGs in ../figures: node diagrams.js (needs Playwright, see tools/report-builder/shot.js)
const fs=require('fs'),cp=require('child_process');
const W=require('os').tmpdir()+'/tt-diagrams';require('fs').mkdirSync(W+'/html',{recursive:true});
const FIG=require('path').resolve(__dirname,'../figures');
const FS=15;
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function wrap(t,max){const out=[];for(const para of String(t).split('\n')){let line='';for(const w of para.split(' ')){if((line+' '+w).trim().length>max){out.push(line);line=w}else line=(line+' '+w).trim()}out.push(line)}return out}
class S{constructor(w,h){this.w=w;this.h=h;this.b=[]}
 add(x){this.b.push(x);return this}
 rect(x,y,w,h,o={}){return this.add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx??6}" fill="${o.fill||'#fff'}" stroke="${o.stroke||'#222'}" stroke-width="${o.sw||1.5}" ${o.dash?'stroke-dasharray="6 4"':''}/>`)}
 text(x,y,t,o={}){const size=o.size||FS;const lines=Array.isArray(t)?t:String(t).split('\n');const lh=o.lh||size*1.25;const y0=y-(o.mid?(lines.length-1)*lh/2:0);
  return this.add(lines.map((l,i)=>`<text x="${x}" y="${y0+i*lh}" font-size="${size}" text-anchor="${o.anchor||'middle'}" font-weight="${o.bold?700:400}" font-style="${o.italic?'italic':'normal'}" ${o.mono?'font-family="DejaVu Sans Mono"':''} dominant-baseline="${o.mid?'central':'alphabetic'}" fill="${o.fill||'#111'}" paint-order="stroke" stroke="#fff" stroke-width="${o.halo??0}" stroke-linejoin="round">${esc(l)}</text>`).join(''))}
 box(x,y,w,h,t,o={}){this.rect(x,y,w,h,o);const size=o.size||FS;const lines=o.nowrap?String(t).split('\n'):wrap(t,Math.floor((w-12)/(size*0.5)));
  if(o.title){this.text(x+w/2,y+size+6,o.title,{size,bold:true});const rest=lines;return this.text(x+w/2,y+size+6+size*1.35+ (h-size*2.6-rest.length*size*1.25)/2+size*0.5,rest,{size})}
  return this.text(x+w/2,y+h/2,lines,{size,mid:true,bold:o.bold,mono:o.mono})}
 line(pts,o={}){const d=pts.map((p,i)=>(i?'L':'M')+p[0]+' '+p[1]).join(' ');return this.add(`<path d="${d}" fill="none" stroke="#222" stroke-width="1.5" ${o.dash?'stroke-dasharray="6 4"':''} ${o.head===false?'':'marker-end="url(#a)"'} ${o.tail?'marker-start="url(#as)"':''}/>`)}
 html(){return `<!doctype html><meta charset=utf-8><body style="margin:0;background:#fff"><div id="d" style="width:${this.w}px;height:${this.h}px;background:#fff"><svg xmlns="http://www.w3.org/2000/svg" width="${this.w}" height="${this.h}" font-family="Carlito, Calibri, sans-serif"><defs><marker id="a" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0 0 L10 4 L0 8 z" fill="#222"/></marker><marker id="as" markerWidth="10" markerHeight="8" refX="1" refY="4" orient="auto-start-reverse"><path d="M0 0 L10 4 L0 8 z" fill="#222"/></marker></defs>${this.b.join('')}</svg></div>`}}
function out(name,s){fs.writeFileSync(`${W}/html/${name}.html`,s.html());cp.execSync(`node /home/user/MCA/tools/report-builder/shot.js ${W}/html/${name}.html ${FIG}/${name}.png ${s.w}`,{stdio:'inherit'})}
const G='#ececec';

// D1 architecture
{const s=new S(720,520);
 s.rect(10,10,700,125,{dash:1,fill:'#fafafa'}).text(360,32,'Clients  -  one Angular progressive web app',{bold:1});
 [['Patient view','mobile browser, opened from the QR link'],['Staff console','registration desk and doctor\'s room'],['Admin screens','daily summary and clinic setup']].forEach((c,i)=>s.box(25+i*230,45,210,75,c[1],{title:c[0],fill:G}));
 s.line([[250,135],[250,200]]).text(258,172,'HTTPS + JSON (REST)',{anchor:'start',size:14});
 s.line([[500,200],[500,135]]).text(508,172,'SignalR (live updates)',{anchor:'start',size:14});
 s.rect(10,200,700,195,{dash:1,fill:'#fafafa'}).text(360,222,'ASP.NET Core Web API  -  Clean Architecture layers',{bold:1});
 s.box(25,235,150,72,'JWT sign-in, role checks',{title:'REST controllers'});
 s.box(190,235,150,72,'groups per department queue',{title:'SignalR hub'});
 s.box(355,235,180,72,'tokens, queue, wait estimate',{title:'Application services'});
 s.box(550,235,145,72,'hosted background service',{title:'Alert engine'});
 s.box(25,320,320,62,'entities, token state machine, rules',{title:'Domain model',fill:G});
 s.box(360,320,335,62,'EF Core repositories, SMS and push adapters',{title:'Infrastructure',fill:G});
 s.line([[125,395],[125,440]]).text(133,424,'EF Core',{anchor:'start',size:14});
 s.line([[360,395],[360,440]]).text(368,424,'Web Push',{anchor:'start',size:14});
 s.line([[595,395],[595,440]]).text(603,424,'HTTPS API',{anchor:'start',size:14});
 s.box(25,440,200,65,'Azure SQL in deployment',{title:'SQL Server'});
 s.box(260,440,200,65,'browser push services',{title:'Web Push'});
 s.box(495,440,200,65,'SMS provider',{title:'SMS gateway'});
 out('d-architecture',s)}

// D2 use case
{const s=new S(720,590);
 s.rect(155,8,410,574,{dash:1,fill:'#fff'}).text(360,28,'TokenTrail',{bold:1});
 const L=['Scan token QR','View live queue status','Receive milestone alerts','Tap "I\'m on my way"','Switch language','Give 2-tap feedback','Sign in and pick desk','Create token','Show QR or print slip','Resend SMS link','Re-queue missed token'];
 const R=['Call next patient','Recall patient','Mark no-show','Pause queue','View daily summary','Export CSV','Configure departments','Configure alert rules'];
 const ly=i=>58+i*48, ry=i=>60+i*62;
 L.forEach((t,i)=>{s.add(`<ellipse cx="255" cy="${ly(i)}" rx="92" ry="20" fill="#fff" stroke="#222" stroke-width="1.4"/>`);s.text(255,ly(i),t,{mid:1,size:14})});
 R.forEach((t,i)=>{s.add(`<ellipse cx="465" cy="${ry(i)}" rx="92" ry="20" fill="#fff" stroke="#222" stroke-width="1.4"/>`);s.text(465,ry(i),t,{mid:1,size:14})});
 function actor(x,y,label){s.add(`<circle cx="${x}" cy="${y-22}" r="9" fill="#fff" stroke="#222" stroke-width="1.5"/><path d="M${x} ${y-13} V${y+14} M${x-16} ${y-5} H${x+16} M${x} ${y+14} L${x-13} ${y+34} M${x} ${y+14} L${x+13} ${y+34}" stroke="#222" stroke-width="1.5" fill="none"/>`);s.text(x,y+54,label,{size:14,bold:1})}
 const pc=ly(2.5), rc=ly(8);
 actor(60,pc,'Patient or\nattendant'); actor(60,rc,'Registration\nstaff');
 const rr=ry(1.5), ra=ry(5.5);
 actor(660,rr,'Room staff'); actor(660,ra,'Administrator');
 for(let i=0;i<6;i++)s.line([[78,pc],[163,ly(i)]],{head:false});
 for(let i=6;i<11;i++)s.line([[78,rc],[163,ly(i)]],{head:false});
 for(let i=0;i<4;i++)s.line([[642,rr],[557,ry(i)]],{head:false});
 for(let i=4;i<8;i++)s.line([[642,ra],[557,ry(i)]],{head:false});
 out('d-usecase',s)}

// D3 state
{const s=new S(720,380);
 const st=(x,y,w,t,o={})=>s.box(x,y,w,50,t,{fill:o.fill||'#fff',rx:22,bold:1,nowrap:1});
 s.add('<circle cx="22" cy="125" r="8" fill="#222"/>');
 st(50,100,120,'WAITING'); st(300,100,150,'CALLED (in room)'); st(580,100,120,'COMPLETED',{fill:G});
 st(300,250,150,'MISSED'); st(580,250,120,'EXPIRED',{fill:G});
 s.line([[30,125],[50,125]]).text(6,90,'Staff creates\ntoken',{size:13,anchor:'start'});
 s.line([[170,125],[300,125]]).text(235,108,'Call next',{size:14});
 s.line([[450,125],[580,125]]).text(515,96,'Consultation\nfinished',{size:14});
 s.line([[340,100],[340,72],[410,72],[410,100]]).text(375,60,'Recall',{size:14});
 s.line([[375,150],[375,250]]).text(385,195,'Grace of 5 min over,\nor no-show marked',{size:14,anchor:'start'});
 s.line([[300,275],[110,275],[110,150]]).text(200,298,'Re-queue (once, after\ncurrent patient)',{size:14});
 s.line([[450,275],[580,275]]).text(515,262,'Second miss',{size:13});
 s.text(360,350,'At day end any unfinished token (WAITING, CALLED or MISSED) also becomes EXPIRED.',{size:14});
 out('d-state',s)}

// D4 sequence
{const s=new S(720,640);
 const X=[70,230,390,540,660], N=['Staff app','Web API','SQL Server','Alert engine','Patient phone'];
 N.forEach((n,i)=>{s.box(X[i]-55,8,110,34,n,{bold:1,nowrap:1,fill:G});s.line([[X[i],42],[X[i],625]],{dash:1,head:false})});
 const M=[[0,1,'POST /tokens'],[1,2,'insert token row'],[1,0,'201 + token link',1],[4,1,'GET /t/code (QR scan)'],[1,4,'status and position',1],[4,1,'SignalR connect'],[0,1,'POST call-next'],[1,2,'update token states'],[1,4,'queueUpdated (SignalR)'],[1,3,'evaluate thresholds'],[3,4,'Web Push or SMS alert']];
 M.forEach((m,i)=>{const y=72+i*50;s.line([[X[m[0]],y],[X[m[1]],y]],{dash:m[3]});const mx=(X[m[0]]+X[m[1]])/2;s.text(mx,y-7,`${i+1}. ${m[2]}`,{size:14,halo:5})});
 out('d-sequence',s)}

// D5 layers
{const s=new S(720,400);
 s.rect(10,10,440,115,{dash:1,fill:'#fafafa'}).text(230,30,'Outer layer  (frameworks and details)',{bold:1});
 s.box(25,42,200,70,'controllers, SignalR hubs, auth',{title:'TokenTrail.Api'});
 s.box(235,42,200,70,'EF Core, SMS and push adapters',{title:'Infrastructure'});
 s.box(10,170,440,90,'use cases, DTOs, interfaces such as IQueueRepository and IAlertSender',{title:'TokenTrail.Application',fill:G});
 s.box(10,305,440,85,'entities, token state machine, queue rules; no framework references',{title:'TokenTrail.Domain',fill:G});
 s.line([[230,125],[230,170]]).text(240,152,'depends on',{anchor:'start',size:14});
 s.line([[230,260],[230,305]]).text(240,287,'depends on',{anchor:'start',size:14});
 s.text(470,70,'Replaceable: the SMS provider, the\ndatabase and the web framework\ncan change without touching the\nrules below.',{anchor:'start',size:14});
 s.text(470,215,'Orchestrates one use case at a\ntime and defines the interfaces\nthat the outer layer implements.',{anchor:'start',size:14});
 s.text(470,345,'The most stable code: it knows\nnothing about HTTP, SQL or SMS.',{anchor:'start',size:14});
 out('d-layers',s)}

// D6 ER
{const s=new S(720,760);
 const ent=(x,y,w,name,rows)=>{const h=30+rows.length*19+8;s.rect(x,y,w,h,{rx:4,fill:'#fff'});s.rect(x,y,w,26,{rx:4,fill:G});s.text(x+w/2,y+18,name,{bold:1});rows.forEach((r,i)=>s.text(x+8,y+45+i*19,r,{anchor:'start',size:13.5}));return h};
 ent(10,10,200,'Department',['PK  Id','Name','Prefix','DefaultConsultMinutes','OpenTime / CloseTime','IsActive']);
 ent(260,10,200,'Room',['PK  Id','FK  DepartmentId','Name','DoctorName','IsPaused']);
 ent(510,10,200,'ClinicSetting',['PK  Id','AlertThresholds (10,5,2)','GraceMinutes','MaxReEntries','RepeatAtOne','Languages','CreatedAt (one row per save)']);
 ent(260,190,200,'Token',['PK  Id','UQ  PublicCode','Sequence, Number','FK  DepartmentId','FK  RoomId','FK  IssuedByStaffId','FK  SettingsId','IssueDate','VisitType','IsPriority','Status','PatientName, Age, Sex','PhoneCipher, PhoneHash','ReEntryCount','QueueClass, QueueStamp','IssuedAt, CalledAt','CompletedAt']);
 ent(10,330,200,'StaffUser',['PK  Id','UQ  StaffCode','PinHash','Role','DisplayName','IsActive']);
 ent(510,190,200,'PushSubscription',['PK  Id','FK  TokenId','Endpoint','P256dh, Auth','CreatedAt']);
 ent(10,560,200,'AuditLog',['PK  Id','FK  StaffUserId','Action','TokenId (nullable)','At']);
 ent(260,620,200,'AlertLog',['PK  Id','FK  TokenId','Threshold','Channel','SentAt, Status']);
 ent(510,560,200,'Feedback',['PK  Id','FK  TokenId (unique)','WaitRating','SteppedOut','SubmittedAt']);
 const lbl=(x,y,t)=>s.text(x,y,t,{size:13,bold:1});
 s.line([[210,70],[260,70]],{head:false});lbl(222,62,'1');lbl(248,62,'N');
 s.line([[360,142],[360,190]],{head:false});lbl(370,158,'1');lbl(370,184,'N');
 s.line([[60,162],[60,215],[260,215]],{head:false});lbl(72,180,'1');lbl(248,208,'N');
 s.line([[210,420],[260,420]],{head:false});lbl(222,412,'1');lbl(248,412,'N');
 s.line([[460,230],[510,230]],{head:false});lbl(472,222,'1');lbl(500,222,'N');
 s.line([[460,380],[610,380],[610,560]],{head:false});lbl(472,372,'1');lbl(622,552,'0..1');
 s.line([[110,560],[110,482]],{head:false});lbl(122,545,'N');lbl(122,500,'1');
 s.line([[360,570],[360,620]],{head:false});lbl(370,590,'1');lbl(370,614,'N');
 out('d-er',s)}

// D7 deployment
{const s=new S(720,470);
 s.box(10,180,150,110,'Angular PWA in a phone or PC browser',{title:'Client',fill:G});
 s.rect(185,10,525,340,{dash:1,fill:'#fafafa'}).text(447,30,'Microsoft Azure  (proposed topology)',{bold:1});
 s.box(205,45,200,70,'optional, for scale-out',{title:'Azure SignalR Service'});
 s.box(470,45,220,70,'relational data store',{title:'Azure SQL Database'});
 s.box(205,165,200,100,'ASP.NET Core Web API and static Angular files',{title:'Azure App Service',fill:G});
 s.box(470,165,220,70,'secrets and keys',{title:'Azure Key Vault'});
 s.box(470,265,220,70,'telemetry and health alerts',{title:'Application Insights'});
 s.line([[160,235],[205,215]]);s.text(184,258,'HTTPS',{size:13,halo:4});
 s.line([[85,180],[85,80],[205,80]]).text(95,128,'WebSocket',{size:13,anchor:'start'});
 s.line([[305,165],[305,115]]).text(313,145,'hub',{size:13,anchor:'start'});
 s.line([[405,190],[437,190],[437,80],[470,80]]).text(445,140,'EF Core, TLS',{size:13,anchor:'start'});
 s.line([[405,205],[470,205]]).text(437,232,'',{size:12});
 s.line([[405,250],[470,285]]);
 s.box(205,395,190,60,'alert fallback',{title:'SMS gateway provider'});
 s.box(470,395,220,60,'browser push alerts',{title:'Browser push services'});
 s.line([[270,265],[270,395]]).text(280,335,'SMS request',{size:13,anchor:'start'});
 s.line([[340,265],[540,395]]).text(548,380,'Web Push request',{size:13,anchor:'start'});
 out('d-deploy',s)}

// D8 alert flowchart
{const s=new S(720,720);const cx=240;
 const pr=(y,h,t)=>s.box(cx-190,y,380,h,t,{});
 s.box(cx-190,8,380,48,'Queue event: token created, call next, no-show, re-queue',{rx:24,fill:G});
 s.line([[cx,56],[cx,86]]);
 pr(86,48,'Recompute people ahead for every waiting token'); s.line([[cx,134],[cx,164]]);
 pr(164,62,'Crossed = thresholds T in {10, 5, 2, 0} with ahead <= T and no AlertLog row for (token, T)'); s.line([[cx,226],[cx,256]]);
 s.add(`<path d="M${cx} 256 L${cx+120} 306 L${cx} 356 L${cx-120} 306 Z" fill="#fff" stroke="#222" stroke-width="1.5"/>`).text(cx,306,'Crossed is empty?',{mid:1});
 s.line([[cx,356],[cx,396]]).text(cx+8,382,'No',{anchor:'start',size:14,bold:1});
 s.line([[cx+120,306],[470,306]]).text(cx+135,296,'Yes',{anchor:'start',size:14,bold:1});
 s.box(470,266,230,92,'Repeat rule: if ahead = 1, the page was not opened since the last alert and no reminder was sent, send a reminder',{size:14});
 pr(396,66,'Record every crossed threshold in AlertLog; send one message only, for the smallest T crossed');
 s.line([[cx,462],[cx,500]]);
 pr(500,66,'Choose channel: Web Push when a subscription is active, otherwise or on failure the SMS backup');
 s.line([[585,358],[585,533],[cx+190,533]]);
 s.line([[cx,566],[cx,604]]);
 pr(604,52,'Store delivery status; publish queueUpdated through SignalR'); s.line([[cx,656],[cx,676]]);
 s.box(cx-80,676,160,36,'End',{rx:18,fill:G});
 out('d-alertflow',s)}

// D9 sdlc
{const s=new S(720,330);
 const I=[['Increment 1','Core loop','Staff creates a token; the QR opens a page with the position'],['Increment 2','Live updates','Call next moves the queue and the page updates itself'],['Increment 3','Alerts','10, 5, 2 and next alerts, with SMS backup'],['Increment 4','Daily summary','Admin KPIs and CSV export'],['Increment 5','Hardening','Accessibility, edge states and languages']];
 I.forEach((c,i)=>{const x=8+i*143;s.box(x,15,130,150,c[2],{title:c[0]+'\n'+c[1],size:14,fill:i==0?G:'#fff'});if(i<4)s.line([[x+130,90],[x+143,90]])});
 s.text(360,200,'Every increment repeats the same short cycle',{bold:1});
 ['Plan','Design','Build','Test','Review'].forEach((t,i)=>{const x=40+i*130;s.box(x,215,110,40,t,{rx:20,bold:1,nowrap:1});if(i<4)s.line([[x+110,235],[x+130,235]])});
 s.line([[40,290],[680,290]]).text(360,315,'Working system grows with each increment (build order set in the project plan)',{size:14});
 out('d-sdlc',s)}
