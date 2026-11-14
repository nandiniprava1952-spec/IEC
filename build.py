import json,re
from openpyxl import load_workbook
BASE="https://cdn.jsdelivr.net/gh/nandiniprava1952-spec/IEC@main/"
wb=load_workbook('/mnt/user-data/uploads/a9TU8yxd7M9VF6gCm9pnDp.xlsx',read_only=True)
def split(s):
    a,_,b=s.partition(' / '); return a.strip(),b.strip()
secs=[]
for r in list(wb['choices'].iter_rows(values_only=True))[1:]:
    if r[0]=='sections':
        en,od=split(r[2]); secs.append(dict(id=r[1],en=en,or_=od,items=[]))
by={s['id']:s for s in secs}
rows=list(wb['survey'].iter_rows(values_only=True))[1:]
stack=[]
for r in rows:
    r=list(r)+[None]*9
    typ,name,label,_,rel,img,_,vid,aud=r[:9]
    if typ=='begin_group': stack.append(re.search(r"'([^']+)'",rel).group(1) if rel else (stack[-1] if stack else None)); continue
    if typ=='end_group': stack.pop(); continue
    grp=stack[-1] if stack else None
    if typ!='note' or not label or not name or name=='OFFLINE_ACCESS_TIP': continue
    m=re.search(r'\[[^\]]*\]\((https?://[^)]+)\)',label)
    title=label.split('  [')[0].strip()
    en,od=split(title)
    sid=(re.search(r"'([^']+)'",rel).group(1) if rel else grp)
    if aud or vid:
        pass
    if aud:
        it=dict(t='audio',en=en,or_=od,url=BASE+aud,thumb='')
    elif vid:
        it=dict(t='video',en=en,or_=od,url=BASE+vid,thumb=BASE+img if img else '')
    else:
        if not m: print('SKIP',name); continue
        url=m.group(1)
        pdf=url.lower().endswith('.pdf')
        it=dict(t='pdf' if pdf else 'image',en=en,or_=od,url=url,thumb=(BASE+img if pdf and img else url if not pdf else ''))
    by[sid]['items'].append(it)
secs=[s for s in secs if s['items']]
for s in secs: s['or']=s.pop('or_'); [i.__setitem__('or',i.pop('or_')) for i in s['items']]
json.dump(dict(base=BASE,sections=secs),open('content.json','w'),ensure_ascii=False,indent=1)
print(len(secs),'sections',sum(len(s['items']) for s in secs),'items')
from PIL import Image,ImageDraw
for n in (192,512):
    im=Image.new('RGB',(n,n),'#0f766e');d=ImageDraw.Draw(im);c=n/2;a=n*.30;w=n*.13
    d.rounded_rectangle((c-w,c-a,c+w,c+a),n*.04,fill='white');d.rounded_rectangle((c-a,c-w,c+a,c+w),n*.04,fill='white')
    im.save(f'icons/icon-{n}.png')
