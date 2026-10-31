import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('constants/academicData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find("g7-math")
print("g7-math index:", idx)
if idx != -1:
    print(text[idx:idx+2500])
