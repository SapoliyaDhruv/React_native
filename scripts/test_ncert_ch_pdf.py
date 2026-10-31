import urllib.request

urls = [
    ('Class 7 Math Ch 1', 'https://ncert.nic.in/textbook/pdf/ghma101.pdf'),
    ('Class 7 Math Ch 2', 'https://ncert.nic.in/textbook/pdf/ghma102.pdf'),
    ('Class 8 Math Ch 1', 'https://ncert.nic.in/textbook/pdf/hhma101.pdf'),
    ('Class 10 Math Ch 1', 'https://ncert.nic.in/textbook/pdf/jhma101.pdf'),
]

for label, u in urls:
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=4) as r:
            print(f"OK: {label} -> {r.status} {r.headers.get('content-type')} {r.headers.get('content-length')} bytes")
    except Exception as e:
        print(f"FAIL: {label} -> {e}")

