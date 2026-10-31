import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

ids = [
    # Maths
    ('lF4Fu7Nf1_g', 'Std 7 Maths - Ch 1 પૂર્ણાંક સંખ્યાઓ (Vidyakul)'),
    ('VOKoxJjisOE', 'Std 7 Maths - Ch 1 સમજૂતી (Ocean GyanLive)'),
    ('xCTp_EeVVKU', 'Std 7 Maths - Ch 1 સ્વાધ્યાય 1.1 (Ved Digital)'),
    ('Fqu_AAK55qU', 'Std 7 Maths - Ch 2 અપૂર્ણાંક અને દશાંશ સંખ્યાઓ (Ocean GyanLive)'),
    ('tThbKopFvvM', 'Std 8 Maths - Ch 1 સંમેય સંખ્યાઓ (Ocean GyanLive)'),
    ('F3u6gFcwg7o', 'Std 10 Maths - IMP Questions & One Shot (WebSankul)'),
    # Science
    ('6Ajwdj_Pc5E', 'Std 7 Science - Ch 1 વનસ્પતિમાં પોષણ (Science Guru)'),
    ('1O9sBnz-cJw', 'Std 7 Science - Ch 1 સ્વાધ્યાય (PathshalaMitra)'),
    ('aoBGAprzSL8', 'Std 10 Science - One Shot Revision (WebSankul)'),
    # Social Science
    ('vFQOvYmagAs', 'Std 7 Social Science - Ch 1 રાજપૂત યુગ (Mehul Mavani)'),
    ('-C9P-vtoI2U', 'Std 7 Social Science - Ch 2 દિલ્હી સલ્તનત (SS Academy)'),
    ('q0SUQjz4FMA', 'Std 7 Social Science - Ch 6 ભક્તિયુગ (Ved Digital)'),
    ('pIKyvkUP0vA', 'Std 7 Social Science - Ch 7 (Academy Gujarati)'),
    ('9NxtJ3cXbuE', 'Std 8 Social Science - Ch 1 (Ved Digital)'),
    ('PNrSE1lrqEw', 'Std 8 Social Science - Ch 9 સંસાધન (Sarasvati Edu)'),
    ('T4DhyPEaY6w', 'Std 8 Social Science - Ch 18 સામાજિક ન્યાય (Gujarati Avnavu)'),
    ('HfDY6V8392M', 'Std 10 Social Science - વાવાઝોડું (WebSankul)'),
    # Gujarati
    ('n8BWnVkegOE', 'Std 7 Gujarati - Ch 1 પ્રાણીમાત્રને (Sanjay Patel)'),
    ('Kywb4BkBnzA', 'Std 7 Gujarati - Ch 2 ગુપ્તદાન (Sanjay Patel)'),
    ('iKNo6-GJrxY', 'Std 7 Gujarati - Ch 8 સાહેબ બધાં જોડાઈ ગયાં છે'),
    ('gjziOhhEaqA', 'Std 8 Gujarati - Ch 1 આ તો ઈશ તણો આવાસ'),
    ('2Ganj9qPCq8', 'Std 8 Gujarati - Ch 2'),
    ('ef0eYKQ0C9M', 'Std 10 Gujarati - સંપૂર્ણ વ્યાકરણ One Shot (WebSankul)'),
    # English
    ('86G3T4BSEu0', 'Std 7 English - Unit 1 Water'),
    ('RIQBs6OPhmU', 'Std 7 English - Unit 2 Fairs And Festivals')
]

for vid, desc in ids:
    try:
        url = f'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json'
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=3) as r:
            data = json.loads(r.read().decode('utf-8'))
            print(f"VERIFIED: {vid} | {desc} | {data.get('title')}")
    except Exception as e:
        print(f"FAILED: {vid} | {e}")

