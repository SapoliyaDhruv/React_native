import urllib.request
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

url = 'https://shalamitra.in/book/ganit/212'
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=5) as r:
        html = r.read().decode('utf-8')
        print("Page length:", len(html))
        # Look for pdf links, iframe links, embed links
        links = re.findall(r'(https?://[^\s"\'<>]+\.pdf[^\s"\'<>]*)', html)
        print("PDF links found:", links)
        drives = re.findall(r'(https?://(?:drive|docs)\.google\.com/[^\s"\'<>]+)', html)
        print("Drive links found:", drives)
        for line in html.split('\n'):
            if 'pdf' in line.lower() or 'chapter' in line.lower() or 'download' in line.lower() or 'read' in line.lower():
                print(line.strip()[:140])
except Exception as e:
    print("Error:", e)

