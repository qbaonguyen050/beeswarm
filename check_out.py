import re

iife_ranges = [
    (20978, 21106),
    (21766, 29283),
    (28535, 28792),
    (28794, 29229),
    (29231, 29285),
    (29287, 31000)
]

def is_in_range(line_num):
    for start, end in iife_ranges:
        if start <= line_num <= end:
            return True
    return False

with open('src/game.js', 'r') as f:
    for i, line in enumerate(f, 1):
        if re.search(r'\bout\b', line):
            if not is_in_range(i):
                print(f"{i}: {line.strip()}")
