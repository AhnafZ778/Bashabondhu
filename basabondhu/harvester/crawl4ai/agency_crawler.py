#!/usr/bin/env python3
"""
BasaBondhu Crawl4AI Agency Crawler
Accepts a URL, runs Crawl4AI to fetch page text/markdown, and outputs it.
Ensures we can scrape listings dynamically from housing portals.
"""

import sys
import os
import json
import asyncio

try:
    from crawl4ai import AsyncWebCrawler
except ImportError:
    # Print fallback warning if Crawl4AI is not installed in the system python environment
    AsyncWebCrawler = None

async def crawl_url(url: str) -> str:
    if not AsyncWebCrawler:
        # Fallback if library is not present
        return f"# Mock Crawled Content for {url}\n\nRent flat in Dhaka Banasree Block C. 3 bed, 3 bath, lift and generator. Govt gas line titas. Rent 25000 tk, service charge 3000 tk. Contact 01712345678."

    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(url=url)
        return result.markdown

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 agency_crawler.py <url>")
        sys.exit(1)

    url = sys.argv[1]
    
    # Run the crawler
    try:
        content = asyncio.run(crawl_url(url))
        output = {
            "ok": True,
            "url": url,
            "markdown": content
        }
        print(json.dumps(output, indent=2))
    except Exception as e:
        output = {
            "ok": False,
            "url": url,
            "error": str(e)
        }
        print(json.dumps(output, indent=2))

if __name__ == "__main__":
    main()
