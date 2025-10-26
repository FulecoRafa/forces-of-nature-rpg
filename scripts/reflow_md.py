#!/usr/bin/env python3
import sys
import textwrap

if len(sys.argv) < 2:
    print("Usage: reflow_md.py <input.md> [width]", file=sys.stderr)
    sys.exit(2)

infile = sys.argv[1]
width = int(sys.argv[2]) if len(sys.argv) > 2 else 90

with open(infile, 'r', encoding='utf-8') as f:
    lines = f.readlines()

out_lines = []
buffer = []
in_front = False
in_code = False

def flush_buffer():
    global buffer
    if not buffer:
        return
    # join buffer with spaces, collapse multiple spaces
    text = ' '.join(line.strip() for line in buffer)
    # preserve leading/trailing blank lines handled by caller
    wrapped = textwrap.fill(text, width=width)
    out_lines.extend([wrapped + "\n"])
    buffer = []

for line in lines:
    stripped = line.rstrip('\n')
    # detect front matter delimiter (+++)
    if stripped.strip() == '+++':
        flush_buffer()
        out_lines.append(line)
        in_front = not in_front
        continue
    if in_front:
        out_lines.append(line)
        continue
    # detect code fence start/end
    if stripped.strip().startswith('```'):
        flush_buffer()
        out_lines.append(line)
        in_code = not in_code
        continue
    if in_code:
        out_lines.append(line)
        continue
    # preserve headings, list items, blockquote lines, HTML comments and short directive lines
    lstrip = stripped.lstrip()
    if not stripped:
        flush_buffer()
        out_lines.append(line)
        continue
    if lstrip.startswith('#') or lstrip.startswith('>') or lstrip.startswith('- ') or lstrip.startswith('* ') or lstrip.startswith('+ ') or lstrip.startswith('<!--') or lstrip.startswith('```') or lstrip.startswith('```') or lstrip.startswith('::'):
        flush_buffer()
        out_lines.append(line)
        continue
    # otherwise accumulate for paragraph reflow
    buffer.append(stripped)

# flush final
flush_buffer()

# write to stdout
sys.stdout.write(''.join(out_lines))
