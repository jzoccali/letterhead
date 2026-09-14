#!/usr/bin/env python3
"""Failable checks for the static signature app."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
html = (ROOT / "index.html").read_text()
css = (ROOT / "styles.css").read_text()
js = (ROOT / "app.js").read_text()
blob = html + css + js

fails = []


def ok(cond, msg):
    if not cond:
        fails.append(msg)


ok("FocalPoint" not in blob, "FocalPoint leaked into the app")
ok("focalpoint" not in blob.lower(), "focalpoint leaked")
ok("fieldmesh" not in blob.lower(), "FieldMesh leaked")
ok("Coach Joey" not in blob, "old coaching brand leaked")
ok("cellpadding" in js, "signature HTML is not table-based")
ok("ClipboardItem" in js, "rich-text copy missing")
ok("Fastmail" in html, "Fastmail paste guide missing")
ok("Gmail" in html, "Gmail paste guide missing")
ok("letterhead" in js and "split" in js and "compact" in js, "missing a layout")
ok("Georgia" in html and "Arial" in html, "web-safe fonts missing")
ok("Fraunces" in blob, "app display face missing")
ok("Public Sans" in blob, "app UI face missing")
ok("Inter" not in blob, "Inter slipped in")
ok("Geist" not in blob, "Geist slipped in")
ok("joeyzoccali.com" in html, "Joey credit missing")
ok("Letterhead" in html, "product name missing")
ok("No account" in html or "no account" in html.lower(), "privacy line missing")
ok("showCta" in js and "booking" in js, "booking button missing")
ok("localStorage" in js, "form persistence missing")
ok("#8b3d2e" in css.lower() or "#8B3D2E" in css, "oxblood app accent missing")
ok("violet" not in css.lower() and "indigo" not in css.lower(), "purple palette slipped in")
ok('id="sigPreview"' in html, "preview mount missing")
ok("nginx" in (ROOT / "Dockerfile").read_text().lower(), "Dockerfile is not nginx static")

if fails:
    print("FAIL")
    for f in fails:
        print(" -", f)
    raise SystemExit(1)

print("PASS", ROOT)
