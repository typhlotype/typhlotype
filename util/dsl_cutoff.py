#!/usr/bin/env python3

import sys
import json

cutoff = int(sys.argv[2])
words = []

with open(sys.argv[1]) as f:
    i = 0
    while i < cutoff:
        line = f.readline()
        word = line.split('\t')[1]
        if '@' in word:
            continue
        i += 1
        words.append(word)

print(json.dumps(words, indent='\t', ensure_ascii=False))
