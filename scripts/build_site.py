"""Build the static site into _site/.

Copies content folders and site/ assets, and fills the {{SECTIONS}} slot of
site/index.template.html with the lesson/reference list.

Usage: python scripts/build_site.py
"""
import glob, html, os, re, shutil

OUT = "_site"
COPY = ["lessons", "reference", "assets", "figures"]
SECTIONS = [("lessons", "Lessons"), ("reference", "Reference")]


def title(path):
    text = open(path, encoding="utf-8", errors="ignore").read()
    m = re.search(r"<title>(.*?)</title>", text, re.S)
    return html.escape(m.group(1).strip()) if m else os.path.basename(path)[:-5]


def section(folder, label):
    items = []
    for p in sorted(glob.glob(f"{folder}/*.html")):
        name = os.path.basename(p)
        items.append(
            f"<li><a class='item' href='{folder}/{name}'>"
            f"<span class='n'>{name.split('-')[0]}</span><span>{title(p)}</span></a></li>"
        )
    return f"<section><h2>{label} ({len(items)})</h2><ul>{''.join(items)}</ul></section>"


def main():
    shutil.rmtree(OUT, ignore_errors=True)
    os.makedirs(OUT)
    for d in COPY:
        if os.path.isdir(d):
            shutil.copytree(d, f"{OUT}/{d}", ignore=shutil.ignore_patterns(".hyperframes"))
    for f in ("style.css", "app.js"):
        shutil.copy(f"site/{f}", OUT)
    page = open("site/index.template.html", encoding="utf-8").read()
    body = "".join(section(d, label) for d, label in SECTIONS)
    open(f"{OUT}/index.html", "w", encoding="utf-8").write(page.replace("{{SECTIONS}}", body))


if __name__ == "__main__":
    main()
