import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('backend/routes/academicDataSeed.js', 'r', encoding='utf-8') as f:
    text = f.read()

print('Length of academicDataSeed.js:', len(text))
for g in ['6', '7', '8', '9', '10', '11', '12', 'college']:
    m = re.search(r'"' + g + r'":\s*\{\s*"grade":\s*"' + g + r'"', text)
    if m:
        print(f'Grade {g} found in academicDataSeed.js')
    else:
        print(f'Grade {g} NOT found in academicDataSeed.js')

