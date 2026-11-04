from lib import *
G='#eee'
# Azure topology
s=S(900,500,16)
s.box(20,20,200,70,'Browsers\nstudent, faculty,\nmanagement',G,fs=15)
s.box(300,20,260,70,'Azure Static Web Apps\n(Angular build output)',G,fs=15)
s.box(300,160,260,80,'Azure App Service\nASP.NET Core Web API\n(HTTPS only)',G,fs=15)
s.box(640,160,240,80,'Azure SignalR Service\n(optional, for scale-out)',fill='#fff',dash=True,fs=15)
s.box(300,320,260,80,'Azure SQL Database\n(private endpoint,\nautomated backups)',G,fs=15)
s.box(640,320,240,80,'Azure Key Vault\nsecrets and keys',G,fs=15)
s.box(20,320,230,80,'Azure Monitor and\nApplication Insights\n(no personal data)',G,fs=15)
s.line(220,55,300,55,both=True); s.label(260,35,'HTTPS',14)
s.path([(120,90),(120,200),(300,200)]); s.label(205,185,'REST, WebSocket',14)
s.line(430,90,430,160,False,dash=True); s.label(480,125,'API base URL',14)
s.line(430,240,430,320,both=True); s.label(480,280,'EF Core',14)
s.line(560,200,640,200,both=True)
s.line(560,230,700,320); s.label(660,285,'managed identity',14)
s.line(300,205,250,350,dash=True)
s.text(450,455,'Proposed topology. Nothing in this diagram has been provisioned.',15,italic=True)
s.save('d-azure.html')

# layers
s=S(900,520,16)
s.box(60,20,330,110,'Api project\nControllers, SignalR hub, middleware,\nDTOs, dependency injection',G,fs=15)
s.box(510,20,330,110,'Infrastructure project\nEF Core DbContext, repositories,\nQR image writer, CSV importer',G,fs=15)
s.box(220,200,460,110,'Application project\nUse cases: RecordPulse, GetLecturePulse,\nImportTimetable, RegenerateQr; interfaces',G,fs=15)
s.box(220,380,460,110,'Domain project\nEntities, Mood, Pace, value objects,\nCooldownPolicy, SlotResolver (no framework code)',G,fs=15)
s.line(225,130,330,200); s.label(215,175,'calls',14)
s.line(675,130,570,200); s.label(700,175,'implements',14)
s.line(450,310,450,380); s.label(520,345,'depends on',14)
s.text(450,505,'Arrows point from the dependent project to the project it depends on.',14,italic=True)
s.save('d-layers.html')

# buckets
s=S(900,520,16)
s.box(20,30,190,110,'1 Select responses\nfor one lecture\nsession',G,fs=15)
s.box(250,30,190,110,'2 Group by\nfloor(time / 5 min)\nand mood',G,fs=15)
s.box(480,30,190,110,'3 Count taps\nper bucket',G,fs=15)
s.box(710,30,170,110,'4 Total below 5?\nyes: hide\nno: show shares',G,fs=15)
for x in (210,440,670): s.line(x,85,x+40,85)
s.text(450,185,'Illustrative example (made-up numbers for explanation only)',15,italic=True)
cols=[('Bucket',80),('Total taps',160),('Decision',200)]
rows=[('10:15','3','hidden (fewer than 5)'),('10:20','12','shown, shares computed'),('10:25','5','shown, shares computed'),('10:30','4','hidden (fewer than 5)')]
x0=150; y0=215; wcol=[140,170,300]
xx=x0
for (c,_),w in zip(cols,wcol):
    s.box(xx,y0,w,40,c,'#ddd',r=0,bold=True,fs=15); xx+=w
for i,r in enumerate(rows):
    xx=x0
    for c,w in zip(r,wcol):
        s.box(xx,y0+40*(i+1),w,40,c,'#fff' if 'shown' in r[2] else '#eee',r=0,fs=15); xx+=w
s.text(450,470,'The rule is applied on the server, so hidden buckets never reach the browser.',15,italic=True)
s.save('d-buckets.html')

# iterative thin slice
s=S(900,440,16)
inc=[('Increment 1','Classroom and\nQR generation'),('Increment 2','Scan, tap,\nstore response'),('Increment 3','Map timestamp\nto lecture slot'),('Increment 4','Faculty timeline\nper lecture'),('Increment 5','Management\ntrends, heatmap')]
for i,(a,b) in enumerate(inc):
    x=20+i*172; y=225-i*55
    s.box(x,y,160,110,'',G)
    s.text(x+80,y+24,a,15,bold=True); s.text(x+80,y+70,b,15)
    if i<4: s.line(x+160,y+55,x+172,y+25)
s.box(20,350,860,70,'Every increment ends with a review against the PRD scope, a working vertical slice,\nand a decision on what to change in the next increment.',fill='#fff',fs=15,dash=True)
s.save('d-iterative.html')

# mood scale
s=S(900,370,16)
cols=[('Lost','#C2410C',"I can't follow this"),('Confused','#F08C2E','Some parts are unclear'),('Okay','#B9B5C4','Getting by'),('Following','#5E8FEA','I understand it'),('Engaged','#1F4FBF','Really interested')]
for i,(n,c,t) in enumerate(cols):
    x=20+i*174
    s.box(x,20,160,90,'',c,r=10)
    s.text(x+80,140,n,17,bold=True); s.text(x+80,166,t,14)
    s.text(x+80,190,c,14)
s.text(100,235,'struggling',14,italic=True); s.text(450,235,'neutral',14,italic=True); s.text(800,235,'with the lesson',14,italic=True)
s.line(90,255,810,255,True,both=True)
s.text(450,292,'Struggle share = Lost + Confused',16,bold=True)
s.text(450,318,'Positive share = Following + Engaged',16,bold=True)
s.text(450,346,'Optional pace question (separate): Too fast, Just right, Too slow',15)
s.save('d-moodscale.html')
