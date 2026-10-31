import urllib.request
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

all_books = {}
for std in [7, 8, 9, 10, 11, 12]:
    url = f'https://shalamitra.in/std/{std}'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as r:
            html = r.read().decode('utf-8')
            matches = list(set(re.findall(r'/book/([a-zA-Z0-9_-]+)/(\d+)', html)))
            all_books[std] = matches
            print(f"Std {std} matches:", matches[:8])
    except Exception as e:
        print(f"Error for std {std}: {e}")

print("\nDone finding books.")

