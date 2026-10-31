import urllib.request
import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

urls = [
    # Social Science
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQG_Cq-YBLFUz00UAbQJf6ipaTlbI-OtdM6DZfs7xDRYjGJlnjsAo_hbLbqP63SccaQDwsIjs4vQeAhXoiWPDP-Y5EbZdaFElSvmFIxMnydDz5Cak8VKTf27xD2hPRJogodZ",
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFjScvLQE-Ak02CUuNvQSVKwHRkIGIEX1LEIPJvDmMwdzrh4bCzzvPcPsoiHS0b-iRA02o4c1iZ-wMcMJGSZHArAMwOeI5KJSXZ_GrseLvji3f96qVJOQT4afWs2w8Zc2Gd",
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEn7e18P5fTrygZ_acbbTPTgNoSG7lnR1oF0AFRIdTmjr5JuJHwLJYnJiE9yUneD_lSk4FQEMEWV2TQg23mF6O5Q5o6hD-Nc5j4yfyF_DX5z1KXnXWidg4R1TCiGa2wUhTd",
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHUOpcIE9VvDjCCPkjqyt3Z-tz8l_4Ro9O5idci0w-x9Yn64_A5mMyI4rnuquyEA6gW15CK7RX8P8ZgxV6Nfls84OQWe0-pr45Fg1OIfWwXGgX5vMB9VejxOtk4XQtDCLTZ",
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQH-jQB-ccfJzMQIWwa3pbpvx-LECFLaVOcTdMAZBjrbU7husDktNyvA4unQuawrcnYggkXIHZB3oJDxeLKOwGEWoG-dXqy7zHuFCDTEBrGzLokeaoK5wFVfG-N52SKCMPgg",
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFyIRI8GED_gY4diwBrZY79sNQOdL_pXutZexVO9Pwg2ccbZDpR5s7XYsH0ITwYliRp0r313afglFWwxkkvHFXQ1ZGRMtQfO-nR10AKgh1-Efrb7MyPl-2tbqNV-KddjsR5",
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHok4tsupRD5vojg7KZSb8epT1lMZ1JsAaGB2coUxeHLEsFQHV6TtOpAuA_h8ChK8tyKe8arnQlfastCoUxYJrf__nHGaxvrFcgmF40h7P4W4f16-GX-kAVlyqYkZvgvk4c",
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQG1UpoZGZ7ZP_BkvqyoqkUQhvAViA3VYi3sbFhZ9sbAMv7BodAjbF6otvImId37qzXWjDlvT8fBAgZbiKTEKRE5sHfjJTAu7bDRag1iq1ZnQX4_SfFgPNyojs3BHtcY-jRK",
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQH_cNH-7qtWeqBJtkeSX31r8D2KAlkGLbX5OzigVK68FeAHYgfYUADq32VuqmZqRt5JzCsRfLWLsLVV1kDLZFhHOGi6wi91czUJ_PK-wt8usj709_hZLvYbe66QH9gfEI6m"
]

results = []
for u in urls:
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as r:
            final_url = r.geturl()
            m = re.search(r'v=([a-zA-Z0-9_-]{11})', final_url)
            if m:
                vid = m.group(1)
                # check oembed
                try:
                    oembed_url = f'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json'
                    oreq = urllib.request.Request(oembed_url, headers={'User-Agent': 'Mozilla/5.0'})
                    with urllib.request.urlopen(oreq, timeout=3) as orsp:
                        odata = json.loads(orsp.read().decode('utf-8'))
                        print(f"OK: {vid} -> {odata.get('title')} [{odata.get('author_name')}]")
                        results.append((vid, odata.get('title'), odata.get('author_name')))
                except Exception as oe:
                    print(f"Oembed fail: {vid}: {oe}")
    except Exception as e:
        print(f"Failed for {u}: {e}")

print("Total valid SS:", len(results))

