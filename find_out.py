import re

content = open('src/game.js').read()
lines = content.splitlines()

# Find all IIFEs that define 'out'
iife_starts = [m.start() for m in re.finditer(r'\(function\s*\(\s*out\s*\)', content)]
# This is hard because of nested structures.

# Let's just look at every line that contains 'out' and check if it's likely to be an error.
for i, line in enumerate(lines, 1):
    if re.search(r'\bout\b', line):
        # If it's not in a common IIFE pattern, print it.
        if 'function(out)' not in line and 'return out' not in line:
            # Check if it's one of the ones I know are okay.
            if i < 20978 or i > 31000: # Broadly speaking
                print(f"{i}: {line.strip()}")
