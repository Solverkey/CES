#!/usr/bin/env python3
"""Descarga páginas y publicaciones de ceslarioja.org y deja JSON limpio en src/content."""

from __future__ import annotations

import html
import json
import re
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src" / "content"
ORIGIN = "https://ceslarioja.org"
UA = "Mozilla/5.0 (compatible; CESLaRiojaImport/1.0)"

PAGE_SLUGS = {
    "institucion",
    "transparencia",
    "enlaces-de-interes",
    "aviso-legal",
    "politica-de-privacidad",
    "politica-de-cookies",
}

CATS = {
    10: ("actividades", "Actividades"),
    11: ("dictamenes", "Dictámenes"),
    12: ("noticias", "Notas de prensa"),
    1: ("otros", "Uncategorized"),
}

# Solo etiquetas con cierre. <input> no se cierra y dejaría el resto del HTML fuera.
SKIP_TAGS = {"script", "style", "noscript", "form", "svg", "iframe", "button", "select", "textarea"}
ALLOW = {"p", "h2", "h3", "h4", "ul", "ol", "li", "a", "strong", "em", "br", "blockquote", "img", "table", "thead", "tbody", "tr", "th", "td"}
NAV_SLUGS = {
    "institucion",
    "actividades",
    "dictamenes",
    "comunicacion",
    "transparencia",
    "enlaces",
    "enlaces-de-interes",
    "contacto",
    "politica-de-privacidad",
    "aviso-legal",
    "politica-de-cookies",
    "cookies",
}


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as res:
        return res.read()


def rewrite_href(href: str) -> str:
    href = html.unescape(href).strip()
    if href.startswith("javascript:") or href.startswith("mailto:") or href.startswith("tel:"):
        return href
    href = href.replace("http://ceslarioja.org", ORIGIN)
    if href.startswith(ORIGIN):
        path = href[len(ORIGIN) :]
        path = path.split("?")[0].split("#")[0]
        if "/wp-content/" in href:
            return href
        slug = path.strip("/")
        if slug in NAV_SLUGS or slug == "":
            return "/" if slug == "" else f"/{slug}"
        if slug and "/" not in slug:
            return f"/{slug}"
        return href
    if href.startswith("/") and not href.startswith("//"):
        slug = href.strip("/").split("?")[0]
        if slug in NAV_SLUGS:
            return f"/{slug}"
        if slug and "/" not in slug and not slug.startswith("wp-"):
            return f"/{slug}"
    return href


class Cleaner(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.out: list[str] = []
        self.skip = 0
        self.stack: list[str] = []

    def handle_starttag(self, tag: str, attrs) -> None:
        if tag in SKIP_TAGS:
            self.skip += 1
            return
        if self.skip:
            return
        if tag == "h1":
            tag = "h2"
        if tag == "b":
            tag = "strong"
        if tag == "i":
            tag = "em"
        if tag not in ALLOW:
            return
        data = dict(attrs)
        rendered: list[tuple[str, str]] = []
        if tag == "a":
            href = data.get("href") or ""
            if not href or href.startswith("#"):
                self.stack.append("")
                return
            href = rewrite_href(href)
            if href.startswith("javascript:"):
                self.stack.append("")
                return
            rendered.append(("href", href))
            if href.startswith("http"):
                rendered.append(("target", "_blank"))
                rendered.append(("rel", "noopener noreferrer"))
        elif tag == "img":
            src = data.get("src") or ""
            if not src or any(name in src for name in ("Recurso-2", "LogoLaRioja", "Isotipo", "cropped-")):
                self.stack.append("")
                return
            rendered.append(("src", src))
            rendered.append(("alt", data.get("alt") or ""))
        elif tag == "br":
            self.out.append("<br>")
            return
        attr = "".join(f' {key}="{html.escape(value, quote=True)}"' for key, value in rendered)
        self.out.append(f"<{tag}{attr}>")
        self.stack.append(tag)

    def handle_endtag(self, tag: str) -> None:
        if tag in SKIP_TAGS:
            if self.skip:
                self.skip -= 1
            return
        if self.skip:
            return
        if tag == "h1":
            tag = "h2"
        if tag == "b":
            tag = "strong"
        if tag == "i":
            tag = "em"
        if tag not in ALLOW:
            return
        if not self.stack:
            return
        opened = self.stack.pop()
        if opened == tag:
            self.out.append(f"</{tag}>")

    def handle_data(self, data: str) -> None:
        if self.skip:
            return
        if not data.strip():
            return
        self.out.append(html.escape(data))


def clean_html(raw: str) -> str:
    parser = Cleaner()
    parser.feed(raw or "")
    parser.close()
    text = "".join(parser.out)
    text = re.sub(r"<p>\s*</p>", "", text)
    text = re.sub(r"(<br>\s*){3,}", "<br><br>", text)
    text = re.sub(r"\s+", " ", text)
    text = text.replace("> <", "><")
    return text.strip()


def plain(raw: str) -> str:
    text = re.sub(r"<[^>]+>", " ", raw or "")
    text = html.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def grab(text: str, label: str) -> str:
    match = re.search(
        rf"{label}\s*:\s*(.+?)(?=\s+(?:LUGAR|FECHA|HORA)\s*:|\s+Comisión\b|\.\s|$)",
        text,
        re.I,
    )
    value = match.group(1).strip() if match else ""
    if label.upper() == "HORA":
        horas = re.match(r"(.{0,40}?horas)", value, re.I)
        if horas:
            value = horas.group(1)
    return value[:140]


def category_of(ids: list[int], title: str) -> tuple[str, str]:
    for cid in (11, 10, 12):
        if cid in ids:
            return CATS[cid]
    if title.lower().startswith("dictamen"):
        return CATS[11]
    if 1 in ids:
        return CATS[1]
    return ("otros", "Uncategorized")


def load_posts() -> list[dict]:
    posts: list[dict] = []
    page = 1
    while True:
        url = f"{ORIGIN}/wp-json/wp/v2/posts?per_page=100&page={page}&_embed=wp:featuredmedia,wp:term"
        try:
            batch = json.loads(fetch(url).decode())
        except Exception as error:
            if page == 1:
                raise
            print("fin de posts", error)
            break
        if not isinstance(batch, list) or not batch:
            break
        posts.extend(batch)
        if len(batch) < 100:
            break
        page += 1
    return posts


def featured(post: dict) -> str | None:
    media = (post.get("_embedded") or {}).get("wp:featuredmedia") or []
    if not media or not isinstance(media, list):
        return None
    url = media[0].get("source_url") if isinstance(media[0], dict) else None
    return url or None


def term_ids(post: dict) -> list[int]:
    groups = (post.get("_embedded") or {}).get("wp:term") or []
    ids: list[int] = []
    for group in groups:
        if not isinstance(group, list):
            continue
        for term in group:
            if isinstance(term, dict) and term.get("taxonomy") == "category":
                ids.append(int(term["id"]))
    return ids or list(post.get("categories") or [])


def pdf_of(raw: str) -> str | None:
    match = re.search(r'href="([^"]+\.pdf[^"]*)"', raw or "", re.I)
    return html.unescape(match.group(1)) if match else None


def links_of(raw: str) -> list[dict]:
    found: list[dict] = []
    seen: set[str] = set()
    for href, label in re.findall(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', raw or "", re.I | re.S):
        label = plain(label)
        href = rewrite_href(html.unescape(href))
        if len(label) < 3 or href in seen:
            continue
        if href.startswith("/") and href.strip("/") in NAV_SLUGS:
            continue
        if "ceslarioja.org" in href and "/wp-content/" not in href:
            continue
        seen.add(href)
        found.append({"label": label, "href": href})
    return found


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    raw_posts = load_posts()
    posts = []
    seen_slugs: set[str] = set()
    for post in raw_posts:
        title = plain(post["title"]["rendered"])
        slug = post["slug"]
        if slug in seen_slugs or slug in NAV_SLUGS:
            slug = f"{slug}-{post['id']}"
        seen_slugs.add(slug)
        raw = post.get("content", {}).get("rendered") or ""
        text = plain(raw)
        cat, label = category_of(term_ids(post), title)
        lugar, fecha, hora = grab(text, "LUGAR"), grab(text, "FECHA"), grab(text, "HORA")
        comision = ""
        match = re.search(r"(Comisión[^.]{0,180})", text)
        if match:
            comision = match.group(1).strip()
        if lugar or fecha or hora:
            excerpt = " ".join(
                bit
                for bit in (
                    f"LUGAR: {lugar}" if lugar else "",
                    f"FECHA: {fecha}" if fecha else "",
                    f"HORA: {hora}" if hora else "",
                )
                if bit
            )
        else:
            excerpt = plain(post.get("excerpt", {}).get("rendered") or "") or text[:240]
            excerpt = re.sub(r"\[…\]|\[&hellip;\]|…$", "", excerpt).strip()
        posts.append(
            {
                "slug": slug,
                "title": title,
                "date": (post.get("date") or "")[:10],
                "category": cat,
                "categoryLabel": label,
                "excerpt": excerpt[:320],
                "image": featured(post),
                "pdf": pdf_of(raw),
                "lugar": lugar,
                "fechaTexto": fecha,
                "hora": hora,
                "comision": comision,
                "html": clean_html(raw),
            }
        )
    posts.sort(key=lambda item: item["date"], reverse=True)

    pages_raw = json.loads(fetch(f"{ORIGIN}/wp-json/wp/v2/pages?per_page=100&_fields=slug,title,content").decode())
    pages = {}
    for page in pages_raw:
        slug = page["slug"]
        if slug not in PAGE_SLUGS:
            continue
        raw = page.get("content", {}).get("rendered") or ""
        entry = {"title": plain(page["title"]["rendered"]), "html": clean_html(raw)}
        if slug == "enlaces-de-interes":
            entry["links"] = links_of(raw)
        pages[slug] = entry

    (OUT / "posts.json").write_text(json.dumps(posts, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT / "pages.json").write_text(json.dumps(pages, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"posts {len(posts)} -> {(OUT / 'posts.json').stat().st_size}")
    print(f"pages {list(pages)} -> {(OUT / 'pages.json').stat().st_size}")
    from collections import Counter

    print(Counter(item["category"] for item in posts))


if __name__ == "__main__":
    main()
