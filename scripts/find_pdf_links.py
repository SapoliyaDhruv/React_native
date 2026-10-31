import urllib.request
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

book_views = [
    ('Std 7 Gujarati', 'https://shalamitra.in/book-viewer/gujarati/240/1'),
    ('Std 7 English', 'https://shalamitra.in/book-viewer/english/283/1'),
    ('Std 8 Science', 'https://shalamitra.in/book-viewer/vignan/210/1'),
    ('Std 8 SS', 'https://shalamitra.in/book-viewer/samajika-vignan/195/1'),
    ('Std 9 Maths', 'https://shalamitra.in/book-viewer/ganit/197/1'),
    ('Std 9 Science', 'https://shalamitra.in/book-viewer/vignan/200/1'),
    ('Std 10 Maths', 'https://shalamitra.in/book-viewer/ganit/221/1'),
    ('Std 10 Science', 'https://shalamitra.in/book-viewer/vignan/202/1'),
    ('Std 10 SS', 'https://shalamitra.in/book-viewer/samajika-vignan/90/1'),
    ('Std 10 Gujarati', 'https://shalamitra.in/book-viewer/gujarati/88/1'),
    ('Std 10 English', 'https://shalamitra.in/book-viewer/english/92/1'),
]

for label, url in book_views:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as r:
            html = r.read().decode('utf-8')
            m = re.search(r'href=[\'\"](https?://[^\'\"]+\.pdf)[\'\"]', html)
            if m:
                print(f"FOUND: {label} -> {m.group(1)}")
            else:
                # check any link with download
                m2 = re.search(r'id=[\'\"]download-book[\'\"][^>]*href=[\'\"]([^\'\"]+)[\'\"]', html)
                if m2:
                    print(f"DOWNLOAD-BOOK: {label} -> {m2.group(1)}")
                else:
                    print(f"NO PDF LINK: {label}")
    except Exception as e:
        print(f"ERROR: {label} -> {e}")

