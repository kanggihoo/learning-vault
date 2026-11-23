"""Build the static site into _site/ (copy content folders + generate index.html).

Usage: python scripts/build_site.py
"""
import glob, html, os, re, shutil

OUT = "_site"
COPY = ["lessons", "reference", "assets", "figures"]
SECTIONS = [("lessons", "Lessons"), ("reference", "Reference")]

CSS = """
:root{--bg:#f6f7f9;--card:#fff;--fg:#1f2430;--muted:#6b7280;--accent:#4f46e5;--border:#e5e7eb}
@media(prefers-color-scheme:dark){:root{--bg:#0f1117;--card:#181b24;--fg:#e6e8ee;--muted:#9aa1b2;--accent:#818cf8;--border:#2a2f3c}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:860px;margin:0 auto;padding:2.5rem 1rem 4rem}
h1{margin:0 0 .25rem;font-size:2rem}
.sub{color:var(--muted);margin:0 0 1.5rem}
#q{width:100%;padding:.7rem 1rem;font:inherit;color:inherit;background:var(--card);border:1px solid var(--border);border-radius:10px;margin-bottom:1.5rem}
#q:focus{outline:2px solid var(--accent)}
h2{font-size:1.1rem;margin:2rem 0 .75rem;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}
ul{list-style:none;margin:0;padding:0;display:grid;gap:.5rem}
a.item{display:flex;gap:.9rem;align-items:baseline;padding:.75rem 1rem;background:var(--card);border:1px solid var(--border);border-radius:10px;color:inherit;text-decoration:none;transition:.12s}
a.item:hover{border-color:var(--accent);transform:translateY(-1px)}
.n{font:600 .85rem ui-monospace,Consolas,monospace;color:var(--accent);min-width:2.8rem}
.hidden{display:none}
"""

JS = """
const q=document.getElementById('q');
q.addEventListener('input',()=>{const s=q.value.toLowerCase();
document.querySelectorAll('li').forEach(li=>li.classList.toggle('hidden',!li.textContent.toLowerCase().includes(s)));
document.querySelectorAll('section').forEach(sec=>sec.classList.toggle('hidden',!sec.querySelector('li:not(.hidden)')));});
"""


def title(path):
    text = open(path, encoding="utf-8", errors="ignore").read()
    m = re.search(r"<title>(.*?)</title>", text, re.S)
    return html.escape(m.group(1).strip()) if m else os.path.basename(path)[:-5]


def section(folder, label):
    items = []
    for p in sorted(glob.glob(f"{folder}/*.html")):
        name = os.path.basename(p)
        num = name.split("-")[0]
        items.append(
            f"<li><a class='item' href='{folder}/{name}'>"
            f"<span class='n'>{num}</span><span>{title(p)}</span></a></li>"
        )
    return f"<section><h2>{label} ({len(items)})</h2><ul>{''.join(items)}</ul></section>"


def main():
    shutil.rmtree(OUT, ignore_errors=True)
    os.makedirs(OUT)
    for d in COPY:
        if os.path.isdir(d):
            shutil.copytree(d, f"{OUT}/{d}", ignore=shutil.ignore_patterns(".hyperframes"))
    body = "".join(section(d, label) for d, label in SECTIONS)
    page = (
        "<!doctype html><html lang='ko'><head><meta charset='utf-8'>"
        "<meta name='viewport' content='width=device-width,initial-scale=1'>"
        f"<title>Learning Vault</title><style>{CSS}</style></head><body><main>"
        "<h1>Learning Vault</h1><p class='sub'>학습 lesson과 reference 모음</p>"
        f"<input id='q' type='search' placeholder='검색...' autofocus>{body}"
        f"</main><script>{JS}</script></body></html>"
    )
    open(f"{OUT}/index.html", "w", encoding="utf-8").write(page)


if __name__ == "__main__":
    main()
