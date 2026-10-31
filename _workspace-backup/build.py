import glob,subprocess,sys
parts=sorted(glob.glob('src/*.txt'))
s=''.join(open(p).read() for p in parts)
open('index.html','w').write(s)
import re
m=re.search(r'<script>([\s\S]*)</script>\s*</body>',s)
open('/tmp/chk.js','w').write(m.group(1))
r=subprocess.run(['node','--check','/tmp/chk.js'],capture_output=True,text=True)
print('syntax ok' if r.returncode==0 else r.stderr[:2000], len(s))

# v8.1 release check: no DROP / test-build label in any player-visible version string
html=re.sub(r'<script[\s\S]*?</script>|<style[\s\S]*?</style>|<!--[\s\S]*?-->','',s)
text=re.sub(r'<[^>]+>',' ',html)
BAD=re.compile(r'\bDROP\b|\bv\d+d\d+[ab]?\b|test ?build|\bWIP\b|\bbeta\b',re.I)
bad=[x.strip() for x in BAD.findall(text)]
js=m.group(1)
lits=re.findall(r"'(?:[^'\\\n]|\\.)*'|\"(?:[^\"\\\n]|\\.)*\"",re.sub(r'/\*[\s\S]*?\*/|(?<![:\'"\\])//[^\n]*','',js))
bad+=[l for l in lits if re.search(r'\bDROP\b|\bV8 ?D\d|test build',l)]
ver=re.findall(r'class="appVer">([^<]*)<',s)
if bad or not ver or any(not re.fullmatch(r'v\d+(\.\d+)*',v) for v in ver):
    print('RELEASE CHECK FAILED',bad[:8],ver);import os;os.rename('index.html','index.REJECTED.html');sys.exit(1)
print('release check ok',ver)
