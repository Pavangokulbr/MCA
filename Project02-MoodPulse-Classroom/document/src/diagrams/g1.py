from lib import *
G='#eee'
# D1 architecture
s=S(900,600,16)
s.box(30,20,250,80,'Student phone browser\nAngular PWA, no login',G)
s.box(325,20,250,80,'Faculty browser\nAngular web app, JWT',G)
s.box(620,20,250,80,'Management browser\nAngular web app, JWT',G)
for x in (155,450,745): s.line(x,100,x,170,both=True)
s.label(450,135,'HTTPS  REST (JSON) and SignalR (WebSocket)',15)
s.box(30,170,840,300,'',fill='#fafafa',r=10,dash=True)
s.text(450,192,'ASP.NET Core Web API (Clean Architecture)',17,bold=True)
s.box(50,215,185,120,'API layer\nControllers\nSignalR hub\nRate limiter\nJWT and roles',G)
s.box(255,215,185,120,'Application layer\nPulse service\nTimetable service\nReporting service\nQR service',G)
s.box(460,215,185,120,'Domain layer\nEntities\nMood and Pace\nCooldown rule\nSlot rule',G)
s.box(665,215,185,120,'Infrastructure\nEF Core DbContext\nQR image writer\nCSV importer\nClock, hashing',G)
s.line(235,275,255,275); s.line(440,275,460,275); s.line(665,275,645,275)
s.box(50,360,640,90,'Cross-cutting concerns\nvalidation, logging without personal data,\nerror model, configuration from a secrets store',fill='#fff',fs=15)
s.line(757,335,757,520,)
s.box(500,505,370,80,'SQL Server\n(Azure SQL Database in deployment)',G)
s.box(30,505,400,80,'Printed A6 desk card with the room QR\n(scanned by the student phone)',fill='#fff',fs=15)
s.save('d-architecture.html')

# D2 use case
s=S(900,640,16)
s.box(170,15,560,610,'',fill='#fff',r=8)
s.text(450,38,'MoodPulse Classroom',17,bold=True)
def actor(x,y,n):
    s.add(f'<circle cx="{x}" cy="{y-30}" r="11" fill="#fff" stroke="#000" stroke-width="1.6"/>')
    s.line(x,y-19,x,y+12,False); s.line(x-20,y-8,x+20,y-8,False); s.line(x,y+12,x-16,y+38,False); s.line(x,y+12,x+16,y+38,False)
    s.text(x,y+58,n,16,bold=True)
stu=['Scan room QR code','Choose mood and pace','See cooldown or no lecture']
fac=['Sign in','View today\'s lectures','View lecture pulse timeline','Add topic marker','Open quick check','View course trend']
mgr=['Manage classrooms','Generate or regenerate QR','Import and edit timetable','View department heatmap','Print desk cards']
ys=[]
for i,t in enumerate(stu):
    y=100+i*62; s.ell(320,y,135,25,t,fs=15); ys.append(y)
for i,t in enumerate(mgr):
    y=350+i*62; s.ell(320,y,135,25,t,fs=15)
for i,t in enumerate(fac):
    y=100+i*62; s.ell(590,y,135,25,t,fs=15)
actor(70,150,'Student')
for i in range(3): s.line(92,150,185,100+i*62,False)
actor(70,470,'Management')
for i in range(5): s.line(92,470,185,350+i*62,False)
actor(830,260,'Faculty')
for i in range(6): s.line(808,260,725,100+i*62,False)
s.text(590,500,'Faculty and management\nsign in with college e-mail;\nstudents never sign in.',15,italic=True)
s.save('d-usecase.html')

# D3 sequence
s=S(900,760,15)
names=['Student\nphone','Web API','Timetable\nservice','SQL\ndatabase','SignalR\nhub','Faculty\ndashboard']
xs=[75,225,375,525,675,825]
for x,n in zip(xs,names):
    s.box(x-62,15,124,50,n,'#eee',fs=15)
    s.line(x,65,x,630,False,dash=True,sw=1.2)
msgs=[(0,1,'1 GET room context',False),(1,3,'2 find room by QR token',False),(1,2,'3 resolve slot',False),(1,0,'4 room, course, slot',True),
(0,1,'5 POST pulse',False),(1,3,'6 cooldown check',False),(1,3,'7 insert response',False),(1,4,'8 publish bucket update',False),(4,5,'9 push update',False),(1,0,'10 201 + next tap time',True)]
y=105
for a,b,t,d in msgs:
    x1,x2=xs[a],xs[b]
    s.line(x1,y,x2,y,dash=d)
    s.label((x1+x2)/2,y-13,t,15)
    y+=52
    if t.startswith('3'): pass
s.box(20,640,860,95,'',fill='#fafafa')
s.text(450,688,'Step 3, no active slot: 409 NO_ACTIVE_LECTURE, nothing stored.\nStep 6, tap inside the cooldown: 429 COOLDOWN with next time,\nnothing stored.',15)
s.save('d-sequence.html')

# D4 DFD
s=S(960,660,15)
s.box(4,45,134,60,'Student',G,fs=16,bold=True)
s.box(4,380,134,60,'Faculty',G,fs=16,bold=True)
s.box(4,545,134,60,'Management',G,fs=16,bold=True)
for y,t_ in ((30,'1.0 Resolve room\nand lecture slot'),(190,'2.0 Validate and\nrecord pulse'),(360,'3.0 Aggregate\nand suppress'),(520,'4.0 Manage rooms,\nQR and timetable')):
    s.box(290,y,200,90,t_,fill='#fff',r=30,fs=16)
s.box(630,22,260,48,'D1  Rooms and QR versions',G,r=0,fs=15)
s.box(630,82,260,48,'D2  Timetable slots',G,r=0,fs=15)
s.box(630,190,260,90,'D3  Pulse responses\nroom, slot, mood, pace,\ntime, daily device hash',G,r=0,fs=15)
s.box(630,340,260,180,'',fill='#fff',dash=True)
s.text(760,365,'Never stored',16,bold=True)
s.text(760,445,'name, roll number, phone\nnumber, e-mail, location,\ncontacts, IP address,\nadvertising ID',15)
s.line(138,65,290,65); s.label(214,48,'QR token',14)
s.line(290,95,138,95); s.label(214,114,'room, course, slot',14)
s.path([(40,105),(40,215),(290,215)]); s.label(165,198,'mood, pace, code',14)
s.path([(290,255),(100,255),(100,105)]); s.label(195,274,'receipt, next tap',14)
s.line(490,60,630,46); s.line(490,85,630,106)
s.line(490,240,630,240); s.label(560,224,'valid pulse',14)
s.line(630,265,490,375); s.label(600,330,'responses',14)
s.line(290,405,138,405); s.label(214,388,'buckets, shares',14)
s.line(138,575,290,575); s.label(214,558,'room, timetable',14)
s.path([(490,565),(915,565),(915,100),(890,100)]); s.path([(490,590),(940,590),(940,46),(890,46)])
s.line(390,120,390,190,dash=True); s.label(445,155,'slot id',14)
s.save('d-dfd.html')

# D5 ER
s=S(850,800,15)
def ent(x,y,t,rows):
    h=30+len(rows)*21+8
    s.box(x,y,240,h,'',fill='#fff',r=4)
    s.add(f'<rect x="{x}" y="{y}" width="240" height="28" fill="#ddd" stroke="#000" stroke-width="1.6"/>')
    s.text(x+120,y+14,t,16,bold=True)
    for i,r in enumerate(rows): s.text(x+10,y+44+i*21,r,15,anchor='start')
X=[15,305,595]; Y=[15,215,420,615]
ent(X[0],Y[0],'QrCodes',['PK QrCodeId','FK ClassroomId','Version','Token (unique)','IssuedAt, RevokedAt'])
ent(X[1],Y[0],'Classrooms',['PK ClassroomId','Code (unique)','Block, Floor','DeskCount','PulseEnabled'])
ent(X[2],Y[0],'BlockedScans',['PK BlockedScanId','FK ClassroomId','OccurredAt','Reason'])
ent(X[0],Y[1],'Courses',['PK CourseId','Code, Title','Programme, Section','EnrolledCount'])
ent(X[1],Y[1],'TimetableSlots',['PK SlotId','FK ClassroomId','FK CourseId, FK StaffId','DayOfWeek','StartTime, EndTime'])
ent(X[2],Y[1],'Staff',['PK StaffId','Email (unique)','PasswordHash','Role'])
ent(X[0],Y[2],'TopicMarkers',['PK MarkerId','FK SessionId','Label','MarkedAt'])
ent(X[1],Y[2],'LectureSessions',['PK SessionId','FK SlotId','LectureDate','Status'])
ent(X[2],Y[2],'LectureNotes',['PK NoteId','FK SessionId, FK StaffId','Body'])
ent(X[2],Y[3],'QuickCheckWindows',['PK QuickCheckId','FK SessionId','OpenedAt, ClosesAt'])
ent(X[1],Y[3],'PulseResponses',['PK ResponseId','FK SessionId','FK QuickCheckId (null)','Mood, Pace (null)','SubmittedAt','DeviceHash'])
def h(y,l,r,xa,xb):
    s.line(xa,y,xb,y,False); s.text(xa+12,y-11,l,15,bold=True); s.text(xb-12,y-11,r,15,bold=True)
h(70,'N','1',255,305); h(70,'1','N',545,595); h(285,'1','N',255,305); h(285,'N','1',545,595)
h(495,'N','1',255,305); h(495,'1','N',545,595); h(675,'N','1',545,595)
def v(x,y1,y2): 
    s.line(x,y1,x,y2,False); s.text(x+12,y1+14,'1',15,bold=True); s.text(x+12,y2-8,'N',15,bold=True)
v(425,158,215); v(425,358,420); v(425,542,615)
s.line(500,542,660,615,False); s.text(512,556,'1',15,bold=True); s.text(650,607,'N',15,bold=True)
s.save('d-er.html')
