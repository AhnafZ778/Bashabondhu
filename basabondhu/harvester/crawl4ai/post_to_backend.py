#!/usr/bin/env python3
"""
BasaBondhu Crawl4AI Post Utility
Posts crawled listing blocks back to the BasaBondhu harvester API for pipeline ingestion.
"""

import sys
import json
import urllib.request
import urllib.error

def post_to_backend(api_url: str, raw_text: str, source_name: str) -> dict:
    payload = {
        "rawText": raw_text,
        "userContext": {
            "sourceName": source_name,
            "ip": "127.0.0.1",
            "userAgent": "BasaBondhu-Crawl4AI-Worker"
        }
    }
    
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(
        api_url,
        data=data,
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode('utf-8')
            return json.loads(res_body)
    except urllib.error.HTTPError as e:
        res_body = e.read().decode('utf-8')
        try:
            return {"ok": False, "status": e.code, "error": json.loads(res_body)}
        except Exception:
            return {"ok": False, "status": e.code, "error": res_body}
    except Exception as e:
        return {"ok": False, "error": str(e)}

def main():
    if len(sys.argv) < 4:
        print("Usage: python3 post_to_backend.py <api_url> <source_name> <listing_block_or_file>")
        sys.exit(1)
        
    api_url = sys.argv[1]
    source_name = sys.argv[2]
    content_arg = sys.argv[3]
    
    # Try reading from file first, else treat as raw string
    try:
        with open(content_arg, 'r', encoding='utf-8') as f:
            raw_text = f.read()
    except Exception:
        raw_text = content_arg
        
    result = post_to_backend(api_url, raw_text, source_name)
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
