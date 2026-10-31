import sys,json,glob,os
from PIL import Image
tag=sys.argv[1];out={}
acc={}
for f in sorted(glob.glob(f'bright/{tag}/*/*_*.png')):
  t=f.split('/')[-2];i=int(os.path.basename(f).split('_')[0]);hh=Image.open(f).convert('L').histogram();a=acc.setdefault((t,i),[0]*256)
  for k in range(256):a[k]+=hh[k]
for (t,i),h in acc.items():
  n=sum(h);out.setdefault(t,{})[i]=dict(clip=round(100*sum(h[250:])/n,1),mean=round(sum(k*v for k,v in enumerate(h))/n),dark=round(100*sum(h[:12])/n,1),hi=round(100*sum(h[235:])/n,1),p99=next(k for k in range(256) if sum(h[:k+1])>=.99*n))
json.dump(out,open(f'bright/{tag}/stats.json','w'));names=json.load(open(f'bright/{tag}/names.json'))
for t in out:
  for i in sorted(out[t]):print(tag,t,i,names[i] if i<len(names) else '',out[t][i])
