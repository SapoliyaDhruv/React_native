import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
models_dir = 'backend/models'
for fname in sorted(os.listdir(models_dir)):
    if fname.endswith('.js'):
        fpath = os.path.join(models_dir, fname)
        print(f"\n==================== {fname} ====================")
        with open(fpath, 'r', encoding='utf-8') as f:
            print(f.read())
