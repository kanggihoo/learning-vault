import sys,re
p='STORYBOARD.md'; s=open(p).read()
for n in sys.argv[1:]:
    s=re.sub(r'(## Frame %s —[^\n]*\n(?:(?!## Frame).*\n)*?)- status: \w+'%n, r'\1- status: animated', s, count=1)
open(p,'w').write(s)
