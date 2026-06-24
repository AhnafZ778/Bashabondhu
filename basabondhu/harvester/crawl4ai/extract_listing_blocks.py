#!/usr/bin/env python3
"""
BasaBondhu Crawl4AI Listing Extractor
Splits raw crawled markdown page into discrete, individual property listing markdown blocks.
"""

import sys
import json
import re

def extract_listing_blocks(markdown: str) -> list:
    # Standard splitting patterns for housing portals (cards, items, listing sections)
    blocks = []
    
    # Try to find common markdown list item formats or sections representing listings
    # Look for H2/H3 headers which usually represent property listing titles
    title_matches = list(re.finditer(r'^(?:##|###)\s+(.*)$', markdown, re.MULTILINE))
    
    if len(title_matches) > 1:
        for i in range(len(title_matches)):
            start_pos = title_matches[i].start()
            end_pos = title_matches[i+1].start() if i + 1 < len(title_matches) else len(markdown)
            block_text = markdown[start_pos:end_pos].strip()
            
            # Simple heuristic: block must contain rental terms
            if any(term in block_text.lower() for term in ["rent", "bdt", "tk", "bed", "bath", "flat", "apartment", "ভাড়া"]):
                blocks.append(block_text)
    else:
        # Fallback split by double newlines or horizontal rules
        parts = re.split(r'\n{3,}|---|__+', markdown)
        for part in parts:
            part = part.strip()
            if len(part) > 100 and any(term in part.lower() for term in ["rent", "bdt", "tk", "bed", "bath", "flat", "apartment"]):
                blocks.append(part)
                
    # If no blocks detected, return the whole text as a single block
    if not blocks and len(markdown.strip()) > 50:
        blocks.append(markdown.strip())
        
    return blocks

def main():
    if len(sys.argv) < 2:
        # If no argument, read from stdin
        markdown_content = sys.stdin.read()
    else:
        file_path = sys.argv[1]
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                markdown_content = f.read()
        except Exception as e:
            print(json.dumps({"ok": False, "error": f"Failed to read file: {e}"}))
            sys.exit(1)

    try:
        blocks = extract_listing_blocks(markdown_content)
        print(json.dumps({
            "ok": True,
            "blocks_count": len(blocks),
            "blocks": blocks
        }, indent=2))
    except Exception as e:
        print(json.dumps({"ok": False, "error": str(e)}))

if __name__ == "__main__":
    main()
