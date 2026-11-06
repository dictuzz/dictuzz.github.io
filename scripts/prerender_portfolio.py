#!/usr/bin/env python3
"""Prerender English, Indonesian, and German portfolio pages.

This writes the localized landing page and four case studies for each locale.
The resulting static HTML gives crawlers, no-JS users, and link previews the
full page content while ``portfolio.js`` keeps language switching interactive.

Usage:
    python scripts/prerender_portfolio.py          # write the files
    python scripts/prerender_portfolio.py --check  # verify they are in sync

The generated markup keeps the ``data-*`` hooks, so ``portfolio.js`` can update
the page after a language switch. ``--check`` exits non-zero when the checked-in
HTML differs from the prerender output.
"""

from __future__ import annotations

import argparse
import html
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOCALE_DIR = os.path.join(ROOT, "content", "portfolio", "locales")
SITE_URL = "https://dictuzz.me"
LANGS = ("en", "id", "de")

VOID_TAGS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
}

# Same glyphs as iconHtml() in portfolio.js, so no-JS visitors get the icons.
ICONS = {
    "envelope": (
        '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">'
        '<path d="M2.5 5.5h15v9h-15z" fill="none" stroke="currentColor" stroke-width="1.4"/>'
        '<path d="M2.8 6 10 11l7.2-5" fill="none" stroke="currentColor" stroke-width="1.4" '
        'stroke-linecap="round" stroke-linejoin="round"/></svg>'
    ),
    "calendar": (
        '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">'
        '<rect x="3" y="5" width="14" height="12" rx="1" fill="none" stroke="currentColor" '
        'stroke-width="1.4"/><path d="M3 8.5h14M7 3.5v3M13 3.5v3" fill="none" '
        'stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>'
    ),
    "linkedin": (
        '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">'
        '<rect x="2.5" y="2.5" width="15" height="15" rx="1.4" fill="none" '
        'stroke="currentColor" stroke-width="1.4"/><path d="M6 8.6v6M6 6.4v.05M9 14.6v-3.6'
        'c0-1.4 2.5-1.6 2.5 0v3.6M14 14.6v-3.6c0-1.4-2.5-1.6-2.5 0" fill="none" '
        'stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>'
    ),
    "sun": (
        '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">'
        '<circle cx="10" cy="10" r="3.6" fill="none" stroke="currentColor" stroke-width="1.5"/>'
        '<path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.4 4.4l1.4 1.4M14.2 14.2l1.4 1.4'
        'M4.4 15.6l1.4-1.4M14.2 5.8l1.4-1.4" stroke="currentColor" stroke-width="1.5" '
        'stroke-linecap="round"/></svg>'
    ),
    "moon": (
        '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">'
        '<path d="M16.5 12.4A6.5 6.5 0 0 1 7.6 3.5a7 7 0 1 0 8.9 8.9z" fill="none" '
        'stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>'
    ),
}

THEME_TOGGLE = (
    f'<span class="theme-toggle__icon theme-toggle__icon--sun">{ICONS["sun"]}</span>'
    f'<span class="theme-toggle__icon theme-toggle__icon--moon">{ICONS["moon"]}</span>'
)

LANG_BUTTONS = (
    '<button type="button" class="lang-btn is-active" data-lang="en" aria-pressed="true" '
    'aria-label="English">EN</button>'
    '<button type="button" class="lang-btn" data-lang="id" aria-pressed="false" '
    'aria-label="Indonesian">ID</button>'
    '<button type="button" class="lang-btn" data-lang="de" aria-pressed="false" '
    'aria-label="German">DE</button>'
)


def esc(value) -> str:
    return html.escape("" if value is None else str(value), quote=True)


def absolute_url(href: str) -> str:
    return href if re.match(r"^https?://", href) else SITE_URL + href


def localized_path(href: str, lang: str) -> str:
    if lang == "en" or not href.startswith("/portfolio/"):
        return href
    if href == "/portfolio/":
        return f"/portfolio/{lang}/"
    match = re.match(r"^/portfolio/cases/([^/]+)/?$", href)
    if match:
        return f"/portfolio/{lang}/cases/{match.group(1)}/"
    return href


def landing_path(lang: str) -> str:
    return "/portfolio/" if lang == "en" else f"/portfolio/{lang}/"


def case_path(slug: str, lang: str) -> str:
    prefix = "" if lang == "en" else f"{lang}/"
    return f"/portfolio/{prefix}cases/{slug}/"


def page_path(page: str, lang: str, slug: str = "") -> str:
    return landing_path(lang) if page == "landing" else case_path(slug, lang)


def set_document_language(text: str, lang: str) -> str:
    return re.sub(r'(<html\b[^>]*\blang=")[^\"]*', lambda match: match.group(1) + esc(lang), text, count=1, flags=re.IGNORECASE)


def set_hreflangs(text: str, page: str, slug: str) -> str:
    paths = {"en": page_path(page, "en", slug), "id": page_path(page, "id", slug),
             "de": page_path(page, "de", slug), "x-default": page_path(page, "en", slug)}
    for code, route in paths.items():
        pattern = re.compile(r'(<link\b[^>]*\bhreflang="' + re.escape(code) + r'"[^>]*\bhref=")[^\"]*("[^>]*>)', re.IGNORECASE)
        text = pattern.sub(lambda match: match.group(1) + esc(SITE_URL + route) + match.group(2), text, count=1)
    return text


# --------------------------------------------------------------------------- #
# Minimal tag-balanced editing (the shells are simple, but nested <div>s exist)
# --------------------------------------------------------------------------- #

def _element_bounds(text: str, marker: str):
    pattern = re.compile(
        r"<([a-zA-Z][\w:-]*)\b[^>]*\b" + re.escape(marker) + r"\b[^>]*>"
    )
    match = pattern.search(text)
    if not match:
        raise KeyError(f"marker {marker!r} not found")
    tag = match.group(1).lower()
    open_end = match.end()
    if tag in VOID_TAGS:
        return match.start(), match.end(), None, tag
    token = re.compile(r"<(/?)" + re.escape(tag) + r"\b[^>]*>", re.IGNORECASE)
    depth = 1
    for found in token.finditer(text, open_end):
        if found.group(0).rstrip().endswith("/>"):
            continue
        if found.group(1):
            depth -= 1
            if depth == 0:
                return match.start(), open_end, found.start(), tag
        else:
            depth += 1
    raise ValueError(f"unclosed <{tag}> for {marker!r}")


def _base_indent(text: str, start: int) -> str:
    line_start = text.rfind("\n", 0, start) + 1
    prefix = text[line_start:start]
    return prefix if prefix.strip() == "" else "  "


def replace_content(text: str, marker: str, content: str) -> str:
    """Replace an element's children, keeping its attributes and indentation."""
    start, open_end, close_start, tag = _element_bounds(text, marker)
    if close_start is None:
        raise ValueError(f"{marker!r} is a void element; use set_attr")
    newline = "\r\n" if "\r\n" in text else "\n"
    base = _base_indent(text, start)
    child = base + "  "
    body = newline.join(
        (child + line) if line.strip() else "" for line in content.strip("\n").split("\n")
    )
    replacement = newline + body + newline + base
    return text[:open_end] + replacement + text[close_start:]


def replace_raw(text: str, marker: str, raw: str) -> str:
    """Replace an element's children with raw text (scripts, JSON-LD)."""
    start, open_end, close_start, tag = _element_bounds(text, marker)
    if close_start is None:
        raise ValueError(f"{marker!r} is a void element")
    return text[:open_end] + raw + text[close_start:]


def set_attr(text: str, marker: str, attr: str, value: str) -> str:
    start, open_end, close_start, tag = _element_bounds(text, marker)
    open_tag = text[start:open_end]
    if attr in open_tag:
        new_open = re.sub(
            r"\b" + re.escape(attr) + r'="[^"]*"',
            f'{attr}="{esc(value)}"',
            open_tag,
            count=1,
        )
    else:
        new_open = re.sub(r"\s*(/?>)$", f' {attr}="{esc(value)}"\\1', open_tag, count=1)
    return text[:start] + new_open + text[open_end:]


def add_attr(text: str, marker: str, attr: str, value: str = "") -> str:
    start, open_end, close_start, tag = _element_bounds(text, marker)
    open_tag = text[start:open_end]
    if re.search(r"\b" + re.escape(attr) + r"\b", open_tag):
        return text
    new_open = re.sub(r"\s*(/?>)$", f' {attr}="{esc(value)}"\\1', open_tag, count=1)
    return text[:start] + new_open + text[open_end:]


def set_head_meta(text: str, selector_attr: str, selector_value: str, content: str) -> str:
    pattern = re.compile(
        r'<meta\b(?=[^>]*\b' + re.escape(selector_attr) + r'="' + re.escape(selector_value)
        + r'")(?=[^>]*\bcontent=")[^>]*>',
        re.IGNORECASE,
    )
    match = pattern.search(text)
    tag = match.group(0) if match else None
    if tag and re.search(r'\bcontent="[^"]*"', tag, re.IGNORECASE):
        updated = re.sub(r'\bcontent="[^"]*"', f'content="{esc(content)}"', tag, count=1, flags=re.IGNORECASE)
        return text[:match.start()] + updated + text[match.end():]
    if tag:
        updated = tag[:-1] + f' content="{esc(content)}">'
        return text[:match.start()] + updated + text[match.end():]
    meta = f'<meta {selector_attr}="{esc(selector_value)}" content="{esc(content)}">'
    return text.replace('</head>', f'  {meta}\n</head>', 1)


def set_head_metadata(text: str, title: str, description: str, page_url: str) -> str:
    text = re.sub(r'<title>[^<]*</title>', f'<title>{esc(title)}</title>', text, count=1, flags=re.IGNORECASE)
    for attr, value, content in (
        ('name', 'description', description),
        ('property', 'og:title', title),
        ('property', 'og:description', description),
        ('property', 'og:url', page_url),
        ('property', 'og:site_name', 'dictuzz'),
        ('property', 'og:locale', 'en_US'),
        ('name', 'twitter:card', 'summary_large_image'),
        ('name', 'twitter:url', page_url),
        ('name', 'twitter:title', title),
        ('name', 'twitter:description', description),
    ):
        text = set_head_meta(text, attr, value, content)
    image_match = re.search(r'<meta\b[^>]*\bproperty="og:image"[^>]*\bcontent="([^"]+)"', text, re.IGNORECASE)
    if image_match:
        text = set_head_meta(text, 'name', 'twitter:image', html.unescape(image_match.group(1)))
    return text


def set_canonical(text: str, page_url: str) -> str:
    pattern = re.compile(r'(<link\b(?=[^>]*\brel="canonical")[^>]*\bhref=")[^"]*("[^>]*>)', re.IGNORECASE)
    return pattern.sub(lambda match: match.group(1) + esc(page_url) + match.group(2), text, count=1)


def set_og_locale_alternates(text: str, lang: str) -> str:
    locales = {"en": "en_US", "id": "id_ID", "de": "de_DE"}
    text = re.sub(r'<meta\b(?=[^>]*\bproperty="og:locale:alternate")[^>]*>\s*', "", text, flags=re.IGNORECASE)
    alternates = "".join(
        f'<meta property="og:locale:alternate" content="{locale}">\n  '
        for code, locale in locales.items() if code != lang
    )
    pattern = re.compile(r'(<meta\b[^>]*\bproperty="og:locale"[^>]*>)', re.IGNORECASE)
    return pattern.sub(lambda match: match.group(1) + "\n  " + alternates.rstrip(), text, count=1)


def ensure_reveal_fallback(text: str) -> str:
    if "reveal-fallback" in text:
        return text
    anchor = '<link rel="stylesheet" href="/portfolio/portfolio.css?v=v9">'
    if anchor not in text:
        raise ValueError("portfolio stylesheet link not found")
    newline = "\r\n" if "\r\n" in text else "\n"
    fallback = (
        newline
        + '  <noscript id="reveal-fallback"><style>'
        '.reveal{opacity:1!important;transform:none!important}</style></noscript>'
    )
    return text.replace(anchor, anchor + fallback, 1)


# --------------------------------------------------------------------------- #
# Shared chrome
# --------------------------------------------------------------------------- #

def topbar_nav(page: str, lang: str, ui: dict) -> str:
    labels = ui["topbar"]
    if page == "case":
        items = [
            (landing_path(lang), ui["allFiles"]),
            ("/", labels["home"]),
            ("/resume/" if lang == "en" else f"/resume/{lang}/", labels["resume"]),
        ]
    else:
        items = [
            ("/", labels["home"]),
            ("/resume/" if lang == "en" else f"/resume/{lang}/", labels["resume"]),
            ("#cases", labels["files"]),
            ("#contact", labels["contact"]),
        ]
    return "".join(f'<a href="{href}">{esc(label)}</a>' for href, label in items)


def render_topbar(text: str, page: str, lang: str, ui: dict) -> str:
    text = replace_content(text, "data-topbar-nav", topbar_nav(page, lang, ui))
    lang_buttons = LANG_BUTTONS
    for code in LANGS:
        active_class = " is-active" if code == lang else ""
        pressed = str(code == lang).lower()
        lang_buttons = re.sub(
            rf'class="lang-btn(?: is-active)?" data-lang="{code}" aria-pressed="(?:true|false)"',
            f'class="lang-btn{active_class}" data-lang="{code}" aria-pressed="{pressed}"',
            lang_buttons,
        )
        lang_buttons = re.sub(
            rf'aria-label="[^"]*"(?=[^>]*data-lang="{code}")',
            f'aria-label="{esc(ui["languageNames"][code])}"',
            lang_buttons,
            count=1,
        )
    text = replace_content(text, "data-lang-switcher", lang_buttons)
    text = replace_content(text, "data-theme-toggle", THEME_TOGGLE)
    return text


# --------------------------------------------------------------------------- #
# Landing page
# --------------------------------------------------------------------------- #

def dispatch_card(index: int, item: dict, lang: str) -> str:
    is_external = bool(re.match(r"^https?:\/\/", item.get("href", "")))
    href = localized_path(item["href"], lang)
    ext_attrs = ' target="_blank" rel="noopener noreferrer"' if is_external else ''
    track = 'tool' if is_external else 'case'
    return "\n".join([
        '<article class="dispatch reveal">',
        f'  <span class="dispatch__num">{index:02d}</span>',
        f'  <a class="dispatch__inner" href="{esc(href)}" data-track="{track}" '
        f'data-slug="{esc(item["slug"])}"{ext_attrs}>',
        f'    <p class="dispatch__kicker">{esc(item["kicker"])}</p>',
        f'    <h3 class="dispatch__title">{esc(item["title"])}</h3>',
        f'    <p class="dispatch__deck">{esc(item["deck"])}</p>',
        f'    <p class="dispatch__meta">{esc(item["meta"])}</p>',
        "  </a>",
        "</article>",
    ])


def contact_action(action: dict, lang: str) -> str:
    cls = "btn-cta btn-cta--primary" if action.get("type") == "primary" else "btn-cta btn-cta--ghost"
    ext = ' target="_blank" rel="noopener"' if action.get("external") else ""
    icon = ICONS.get(action.get("icon", ""), "")
    return (
        f'<a class="{cls}" href="{esc(localized_path(action["href"], lang))}"{ext}>'
        f'{icon}<span>{esc(action["label"])}</span></a>'
    )


def render_landing(text: str, data: dict, lang: str) -> str:
    landing = data["landing"]
    ui = data["ui"]

    # Masthead
    text = replace_content(text, "data-masthead-strap-left", esc(landing["masthead"]["strapLeft"]))
    text = replace_content(text, "data-masthead-strap-center", esc(landing["masthead"]["strapCenter"]))
    text = replace_content(text, "data-masthead-strap-right", esc(landing["masthead"]["strapRight"]))
    text = replace_content(text, "data-masthead-wordmark", esc(landing["masthead"]["wordmark"]))
    text = replace_content(text, "data-masthead-subtitle", esc(landing["masthead"]["subtitle"]))
    text = replace_content(text, "data-masthead-rule", esc(ui["magazineLabel"]))
    text = replace_content(text, "data-masthead-work-cta", esc(ui["workCta"]))
    text = replace_content(text, "data-masthead-contact-cta", esc(ui["contactCta"]))
    text = replace_content(text, "data-artifact-kicker", esc(ui["artifactKicker"]))
    text = replace_content(text, "data-artifact-label", esc(ui["artifactLabel"]))
    text = replace_content(text, "data-artifact-period", esc(ui["artifactPeriod"]))
    text = set_attr(text, "data-masthead-artifact", "aria-label", ui["artifactAria"])
    feature_href = localized_path(landing["feature"]["href"], lang)
    text = set_attr(text, "data-feature-link", "href", feature_href)
    text = set_attr(text, "data-masthead-work-cta", "href", feature_href)

    # Feature
    feature = landing["feature"]
    text = replace_content(text, "data-feature-kicker", esc(feature["kicker"]))
    text = replace_content(text, "data-feature-headline", esc(feature["headline"]))
    text = replace_content(text, "data-feature-deck", esc(feature["deck"]))
    text = replace_content(text, "data-feature-byline", esc(feature["byline"]))
    text = replace_content(text, "data-feature-meta", esc(feature["meta"]))
    text = set_attr(text, "data-feature-image", "src", feature["image"])
    text = set_attr(text, "data-feature-image", "alt", feature.get("imageAlt", ""))
    text = replace_content(text, "data-feature-caption", esc(feature["caption"]))

    # Issue index
    text = replace_content(text, "data-index-label", esc(landing["indexLabel"]))
    text = replace_content(text, "data-index-note", esc(landing["indexNote"]))
    secondary = "\n".join(
        dispatch_card(i + 1, item, lang) for i, item in enumerate(landing["secondary"])
    )
    text = replace_content(text, "data-secondary-list", secondary)

    # Editor dossier
    editor = landing["editor"]
    text = replace_content(text, "data-editor-kicker", esc(editor["kicker"]))
    text = replace_content(text, "data-editor-title", esc(editor["title"]))
    text = replace_content(text, "data-editor-lede", esc(editor["lede"]))
    text = replace_content(
        text, "data-editor-body", "\n".join(f"<p>{esc(p)}</p>" for p in editor["body"])
    )
    facts = "\n".join(
        '<div class="dossier__row">\n'
        f'  <dt>{esc(fact["label"])}</dt>\n'
        f'  <dd>{esc(fact["value"])}</dd>\n'
        "</div>"
        for fact in editor["facts"]
    )
    text = replace_content(text, "data-editor-facts", facts)

    # Contact
    contact = landing["contact"]
    text = replace_content(text, "data-contact-kicker", esc(contact["kicker"]))
    text = replace_content(text, "data-contact-title", esc(contact["title"]))
    text = replace_content(text, "data-contact-body", esc(contact["body"]))
    text = replace_content(
        text, "data-contact-actions",
        "\n".join(contact_action(a, lang) for a in contact["actions"]),
    )

    # JSON-LD (clean canonical URLs, no ?lang=)
    item_list = [
        {"@type": "ListItem", "position": 1,
         "url": absolute_url(localized_path(feature["href"], lang)), "name": feature["headline"]},
    ]
    for i, item in enumerate(landing["secondary"]):
        item_list.append({
            "@type": "ListItem",
            "position": i + 2,
            "url": absolute_url(localized_path(item["href"], lang)),
            "name": item["title"],
        })
    payload = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": landing["documentTitle"],
        "description": landing["metaDescription"],
        "inLanguage": lang,
        "url": SITE_URL + landing_path(lang),
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": len(item_list),
            "itemListElement": item_list,
        },
        "hasPart": [
            {"@type": "Article", "name": entry["name"], "url": entry["url"]}
            for entry in item_list
        ],
    }
    return replace_raw(text, "data-jsonld", json_ld(payload))


# --------------------------------------------------------------------------- #
# Case pages
# --------------------------------------------------------------------------- #

def render_case(text: str, data: dict, slug: str, lang: str) -> str:
    case = data["cases"][slug]
    ui = data["ui"]

    text = replace_content(text, "data-byline-prefix", esc(ui["byline"]) + "&nbsp;")
    text = replace_content(text, "data-case-vol", esc(case["vol"]))
    text = replace_content(text, "data-case-kicker", esc(case["kicker"]))
    text = replace_content(text, "data-case-title", esc(case["title"]))
    text = replace_content(text, "data-case-deck", esc(case["deck"]))
    text = replace_content(text, "data-case-byline-role", esc(case["bylineRole"]))
    text = replace_content(text, "data-case-byline-meta", esc(case["bylineMeta"]))

    if case.get("image"):
        figure = (
            f'<img src="{esc(case["image"])}" alt="{esc(case.get("imageAlt", ""))}">\n'
            f'<figcaption>{esc(case.get("caption", ""))}</figcaption>'
        )
        text = replace_content(text, "data-case-figure", figure)
    else:
        text = add_attr(text, "data-case-figure", "hidden")

    text = replace_content(text, "data-case-lead", esc(case["lead"]))

    process = case.get("process")
    if process:
        def process_steps(steps: list[str]) -> str:
            parts = []
            for index, step in enumerate(steps, start=1):
                if index > 1:
                    parts.append('<li class="workflow-arrow" aria-hidden="true">\u2192</li>')
                parts.append(
                    '\n'.join([
                        '<li class="workflow-step">',
                        f'  <span class="workflow-step__index" aria-hidden="true">{index:02d}</span>',
                        f'  <span class="workflow-step__label">{esc(step)}</span>',
                        '</li>',
                    ])
                )
            return "\n".join(parts)

        workflow = "\n".join([
            '<div class="workflow-heading">',
            f'  <p class="article__block-label">{esc(process["kicker"])}</p>',
            f'  <h2 id="workflow-title">{esc(process["title"])}</h2>',
            f'  <p>{esc(process["description"])}</p>',
            '</div>',
            '<div class="workflow-lane workflow-lane--before">',
            f'  <h3>{esc(process["beforeLabel"])}</h3>',
            f'  <ol class="workflow-steps">\n{process_steps(process["before"])}\n  </ol>',
            '</div>',
            '<div class="workflow-lane workflow-lane--after">',
            f'  <h3>{esc(process["afterLabel"])}</h3>',
            f'  <ol class="workflow-steps">\n{process_steps(process["after"])}\n  </ol>',
            '</div>',
        ])
        text = replace_content(text, "data-process-flow", workflow)

    narrative = "\n".join(
        '<section class="article__section reveal">\n'
        f'  <h2>{esc(section["heading"])}</h2>\n'
        f'  <p>{esc(section["body"])}</p>\n'
        "</section>"
        for section in case.get("narrative", [])
    )
    text = replace_content(text, "data-case-narrative", narrative)
    text = replace_content(text, "data-case-pull", esc(case.get("pull", "")))

    text = replace_content(text, "data-evidence-label", esc(ui["evidence"]))
    evidence = "\n".join(
        f'<li><span class="evidence__num">{i + 1:02d}</span><span>{esc(line)}</span></li>'
        for i, line in enumerate(case.get("evidence", []))
    )
    text = replace_content(text, "data-case-evidence", evidence)

    text = replace_content(text, "data-impact-label", esc(ui["impact"]))
    impact = "\n".join(
        '<div class="impact__cell">\n'
        f'  <p class="impact__value">{esc(stat["value"])}</p>\n'
        f'  <p class="impact__label">{esc(stat["label"])}</p>\n'
        f'  <p class="impact__note">{esc(stat["note"])}</p>\n'
        "</div>"
        for stat in case.get("impact", [])
    )
    text = replace_content(text, "data-case-impact", impact)

    text = replace_content(text, "data-scope-label", esc(ui["scope"]))
    text = replace_content(text, "data-tools-label", esc(ui["tools"]))
    text = replace_content(
        text, "data-case-scope",
        "\n".join(f"<li>{esc(item)}</li>" for item in case.get("scope", [])),
    )
    text = replace_content(
        text, "data-case-tools",
        "\n".join(f"<li>{esc(item)}</li>" for item in case.get("tools", [])),
    )

    prev_case = case.get("prev")
    if prev_case:
        prev_html = (
            f'<a href="{case_path(esc(prev_case["slug"]), lang)}">'
            f'<span class="case-nav__direction">\u2190 {esc(ui["previous"])}</span>'
            f'<span class="case-nav__title">{esc(prev_case["title"])}</span></a>'
        )
    else:
        prev_html = (
            f'<a href="{landing_path(lang)}"><span class="case-nav__direction">\u2190 '
            f'{esc(ui["allFiles"])}</span></a>'
        )
    text = replace_content(text, "data-case-prev", prev_html)

    next_case = case.get("next")
    if next_case:
        next_html = (
            f'<a href="{case_path(esc(next_case["slug"]), lang)}">'
            f'<span class="case-nav__direction">{esc(ui["next"])} \u2192</span>'
            f'<span class="case-nav__title">{esc(next_case["title"])}</span></a>'
        )
    else:
        next_html = (
            f'<a href="{landing_path(lang)}"><span class="case-nav__direction">'
            f'{esc(ui["allFiles"])} \u2192</span></a>'
        )
    text = replace_content(text, "data-case-next", next_html)

    payload = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": case["title"],
        "description": case["metaDescription"],
        "inLanguage": lang,
        "author": {
            "@type": "Person",
            "name": "Benedictus Richard Ricardo",
            "url": SITE_URL + "/",
        },
        "publisher": {
            "@type": "Person",
            "name": "Benedictus Richard Ricardo",
            "url": SITE_URL + "/",
        },
        "url": SITE_URL + case_path(slug, lang),
    }
    if case.get("image"):
        payload["image"] = SITE_URL + case["image"]
    return replace_raw(text, "data-jsonld", json_ld(payload))


def json_ld(payload: dict) -> str:
    raw = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    return raw.replace("</", "<\\/")


# --------------------------------------------------------------------------- #
# Driver
# --------------------------------------------------------------------------- #

def read_text(path: str) -> str:
    with open(path, "r", encoding="utf-8", newline="") as handle:
        return handle.read()


def normalize_eol(text: str, newline: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    return text.replace("\n", newline) if newline == "\r\n" else text


def build() -> dict[str, str]:
    outputs: dict[str, str] = {}
    for lang in LANGS:
        with open(os.path.join(LOCALE_DIR, f"{lang}.json"), "r", encoding="utf-8") as handle:
            data = json.load(handle)

        source_landing = os.path.join(ROOT, "portfolio", "index.html")
        raw = read_text(source_landing)
        newline = "\r\n" if "\r\n" in raw else "\n"
        text = normalize_eol(raw, newline)
        text = ensure_reveal_fallback(text)
        text = render_topbar(text, "landing", lang, data["ui"])
        text = render_landing(text, data, lang)
        landing_route = landing_path(lang)
        text = set_head_metadata(text, data["landing"]["documentTitle"], data["landing"]["metaDescription"], SITE_URL + landing_route)
        text = set_canonical(text, SITE_URL + landing_route)
        text = set_head_meta(text, "property", "og:locale", {"en": "en_US", "id": "id_ID", "de": "de_DE"}[lang])
        text = set_og_locale_alternates(text, lang)
        text = set_document_language(text, lang)
        text = set_hreflangs(text, "landing", "")
        output_path = source_landing if lang == "en" else os.path.join(ROOT, "portfolio", lang, "index.html")
        outputs[output_path] = normalize_eol(text, newline)

        for slug in data["cases"]:
            source_case = os.path.join(ROOT, "portfolio", "cases", slug, "index.html")
            if not os.path.exists(source_case):
                print(f"warning: missing case shell for {slug}", file=sys.stderr)
                continue
            raw = read_text(source_case)
            newline = "\r\n" if "\r\n" in raw else "\n"
            text = normalize_eol(raw, newline)
            text = ensure_reveal_fallback(text)
            text = render_topbar(text, "case", lang, data["ui"])
            text = render_case(text, data, slug, lang)
            case = data["cases"][slug]
            route = case_path(slug, lang)
            text = set_head_metadata(text, case["documentTitle"], case["metaDescription"], SITE_URL + route)
            text = set_canonical(text, SITE_URL + route)
            text = set_head_meta(text, "property", "og:locale", {"en": "en_US", "id": "id_ID", "de": "de_DE"}[lang])
            text = set_og_locale_alternates(text, lang)
            text = set_document_language(text, lang)
            text = set_hreflangs(text, "case", slug)
            output_path = source_case if lang == "en" else os.path.join(ROOT, "portfolio", lang, "cases", slug, "index.html")
            outputs[output_path] = normalize_eol(text, newline)

    return outputs


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check",
        action="store_true",
        help="exit non-zero if the checked-in HTML is not up to date",
    )
    args = parser.parse_args()

    outputs = build()
    stale = []

    for path, content in outputs.items():
        current = read_text(path) if os.path.exists(path) else None
        if current == content:
            continue
        if args.check:
            stale.append(os.path.relpath(path, ROOT))
            continue
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8", newline="") as handle:
            handle.write(content)
        print(f"prerendered {os.path.relpath(path, ROOT)}")

    if stale:
        print("out of date; run: python scripts/prerender_portfolio.py", file=sys.stderr)
        for path in stale:
            print(f"  {path}", file=sys.stderr)
        return 1

    if args.check:
        print(f"portfolio prerender is up to date ({len(outputs)} files)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
