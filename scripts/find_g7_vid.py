import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('constants/videoData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find("પૂર્ણાંક સંખ્યાઓ")
if idx != -1:
    print(text[idx-200:idx+400])
else:
    print("Not found")

