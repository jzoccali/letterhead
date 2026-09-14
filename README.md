# Letterhead

A free email-signature tool. Clients fill in their details, copy the signature, and paste it into Gmail, Outlook, Apple Mail, or Fastmail.

Nothing is uploaded. No account. No watermark. No third-party SaaS bill.

## Run it

```bash
cd ~/Projects/email-signature
python3 -m http.server 8765
```

Open http://localhost:8765

Docker:

```bash
docker compose up -d
```

Then http://localhost:8080

## What it makes

Table-based HTML with inline styles so Outlook and Gmail do not flatten the layout. Three layouts (letterhead, split, compact). Optional logo, headshot, booking button, and disclaimer. Socials are text links, not icon CDNs, so they do not break when a third-party image host dies.

Uploaded images are data URIs for preview. For a signature that lasts, host the logo at a public URL (the company website).

## Offer it to clients

Point them at the live URL once this is on a static host (GitHub Pages, Cloudflare Pages, or a cheap Vercel project). Footer already names Joey Zoccali / joeyzoccali.com.

## Tests

```bash
python3 tests/contract.py
```
