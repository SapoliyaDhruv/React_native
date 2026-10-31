import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

ids = [
    'j9XrSK6rdPw', 'lF4Fu7Nf1_g', 'Ga3vizxidWw', 'VOKoxJjisOE', 
    'ecX2BNjmzj0', '6Ajwdj_Pc5E', '1O9sBnz-cJw', 'ef0eYKQ0C9M', 
    'aoBGAprzSL8', 'F3u6gFcwg7o', 'HfDY6V8392M', 'Fqu_AAK55qU', 
    'tThbKopFvvM', 'xCTp_EeVVKU', 'ESB25kX3368', 'aBtifG544ng'
]

valid = []
for vid in ids:
    try:
        url = f'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json'
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=4) as r:
            data = json.loads(r.read().decode('utf-8'))
            title = data.get('title', '')
            author = data.get('author_name', '')
            print(f'OK: {vid} -> {title} [{author}]')
            valid.append((vid, title, author))
    except Exception as e:
        print(f'FAIL: {vid} -> {e}')

print(f'\nTotal embeddable valid: {len(valid)} / {len(ids)}')
