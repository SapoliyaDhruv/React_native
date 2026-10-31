import urllib.request

test_urls = [
    ('Std 7 Maths', 'https://d.esevaonline.in/pdf/std-7/std-7-june-2026-maths.pdf'),
    ('Std 7 Science', 'https://d.esevaonline.in/pdf/std-7/std-7-june-2026-science.pdf'),
    ('Std 7 SS', 'https://d.esevaonline.in/pdf/std-7/std-7-june-2026-ss.pdf'),
    ('Std 7 Gujarati', 'https://d.esevaonline.in/pdf/std-7/std-7-june-2026-gujarati.pdf'),
    ('Std 7 English', 'https://d.esevaonline.in/pdf/std-7/std-7-june-2026-english.pdf'),
    ('Std 8 Maths', 'https://d.esevaonline.in/pdf/std-8/std-8-june-2026-maths.pdf'),
    ('Std 10 Maths', 'https://d.esevaonline.in/pdf/std-10/std-10-june-2026-maths.pdf'),
]

for label, url in test_urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=4) as r:
            print(f"OK: {label} -> {r.status} {r.headers.get('content-type')} {r.headers.get('content-length')} bytes")
    except Exception as e:
        print(f"NOT FOUND: {label} -> {e}")

