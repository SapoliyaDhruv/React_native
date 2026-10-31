import urllib.request
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

url = 'https://shalamitra.in/book-viewer/ganit/212/13'
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=5) as r:
        html = r.read().decode('utf-8')
        print("Page length:", len(html))
        for line in html.split('\n'):
            if any(k in line.lower() for k in ['pdf', 'drive', 'iframe', 'embed', 'viewer', 'src', 'canvas', 'page']):
                print(line.strip()[:140])
except Exception as e:
    print("Error:", e)

