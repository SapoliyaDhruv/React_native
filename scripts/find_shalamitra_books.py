import urllib.request
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

req = urllib.request.Request('https://shalamitra.in/std/7', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=5) as r:
    html = r.read().decode('utf-8')
    for m in re.finditer(r'/book/([a-zA-Z0-9_-]+)/(\d+)', html):
        print(m.group(0))
