#!/usr/bin/env python3
import json
import sys

def b_uri(uri):
    return f'vscode.Uri.file("{uri["path"]}")'

def b_position(position):
    return f'new vscode.Position({position["line"]}, {position["character"]})'

def b_range(range_):
    return f'new vscode.Range({b_position(range_[0])}, {b_position(range_[1])})'

def b_location(location):
    return f'new vscode.Location(\n{b_uri(location["uri"])},\n{b_range(location["range"])})'

def b_symbol(symbol):
    return \
    f"""{{
        "name": "{symbol["name"]}",
        "detail": "{symbol["detail"]}",
        "kind": {symbol['kind']},
        "location": {b_location(symbol['location'])},
        "children": {b_symbols(symbol['children'])}
    }}"""

def b_symbols(symbols):
    symbols = [b_symbol(symbol) for symbol in symbols]
    return '[' + ', '.join(symbols) + ']'

def b_all(symbols):
    return

text = '\n'.join(sys.stdin.readlines())
input = json.loads(text)
output = b_symbols(input)
print(output)
