import re
with open('constants/academicData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r'"textbookPdfUrl":\s*"([^"]+)"', text)
print(f"Total: {len(matches)}")
print("Sample:", matches[:6])

