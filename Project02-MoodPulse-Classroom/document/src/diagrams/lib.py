import html
FONT="font-family:'Liberation Sans',Arial,Helvetica,sans-serif;"
class S:
    def __init__(s,w,h,fs=16):
        s.w,s.h,s.fs,s.o=w,h,fs,[]; s.k=1.22
    def add(s,x): s.o.append(x)
    def text(s,x,y,t,fs=None,anchor='middle',bold=False,fill='#000',italic=False,lh=None):
        fs=(fs or s.fs)*s.k; lh=lh or fs*1.22
        lines=t.split('\n'); y0=y-(len(lines)-1)*lh/2
        for i,l in enumerate(lines):
            s.add(f'<text x="{x}" y="{y0+i*lh+fs*0.35:.1f}" text-anchor="{anchor}" font-size="{fs}" fill="{fill}" {"font-weight=\"700\"" if bold else ""} {"font-style=\"italic\"" if italic else ""}>{html.escape(l)}</text>')
    def box(s,x,y,w,h,t='',fill='#fff',r=6,bold=False,fs=None,dash=False,sw=1.6,stroke='#000'):
        s.add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" {"stroke-dasharray=\"6 4\"" if dash else ""}/>')
        if t: s.text(x+w/2,y+h/2,t,fs=fs,bold=bold)
    def ell(s,cx,cy,rx,ry,t='',fill='#fff',fs=None):
        s.add(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{fill}" stroke="#000" stroke-width="1.5"/>')
        if t: s.text(cx,cy,t,fs=fs)
    def line(s,x1,y1,x2,y2,arrow=True,dash=False,both=False,sw=1.6):
        m=' marker-end="url(#a)"' if arrow else ''
        if both: m+=' marker-start="url(#as)"'
        s.add(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#000" stroke-width="{sw}" {"stroke-dasharray=\"6 4\"" if dash else ""}{m}/>')
    def path(s,pts,arrow=True,dash=False):
        d='M'+' L'.join(f'{x} {y}' for x,y in pts)
        s.add(f'<path d="{d}" fill="none" stroke="#000" stroke-width="1.6" {"stroke-dasharray=\"6 4\"" if dash else ""}{" marker-end=\"url(#a)\"" if arrow else ""}/>')
    def label(s,x,y,t,fs=None,pad=3):
        f=(fs or s.fs)*s.k; lines=t.split('\n'); w=max(len(l) for l in lines)*f*0.52+2*pad; h=len(lines)*f*1.25+pad
        s.add(f'<rect x="{x-w/2:.1f}" y="{y-h/2:.1f}" width="{w:.1f}" height="{h:.1f}" fill="#fff" opacity="0.92"/>')
        s.text(x,y,t,fs=fs)
    def save(s,fn):
        defs='<defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#000"/></marker><marker id="as" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M10 0 L0 5 L10 10 z" fill="#000"/></marker></defs>'
        open(fn,'w').write(f'<!doctype html><html><head><meta charset="utf-8"><style>body{{margin:0;background:#fff}}svg{{display:block;{FONT}}}</style></head><body><div id="d" style="width:{s.w}px;height:{s.h}px"><svg xmlns="http://www.w3.org/2000/svg" width="{s.w}" height="{s.h}" viewBox="0 0 {s.w} {s.h}">{defs}<rect width="100%" height="100%" fill="#fff"/>{"".join(s.o)}</svg></div></body></html>')
