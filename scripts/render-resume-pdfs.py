"""Generate text-based, linked résumé PDFs from the website's shared content.

Usage: python scripts/render-resume-pdfs.py <exported-json> <output-directory>
Requires reportlab. Prefer `npm run pdf:generate`, which exports the source first.
"""
import json
import sys
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import KeepTogether, Paragraph, SimpleDocTemplate, Spacer

data = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
output = Path(sys.argv[2])
violet = colors.HexColor("#642799")
ink = colors.HexColor("#20202a")
muted = colors.HexColor("#4a4a55")
styles = {
    "name": ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=22, leading=25, textColor=ink, spaceAfter=5),
    "title": ParagraphStyle("title", fontName="Helvetica-Bold", fontSize=14, leading=18, textColor=violet, spaceAfter=7),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=9.2, leading=12.7, textColor=ink, spaceAfter=5),
    "small": ParagraphStyle("small", fontName="Helvetica", fontSize=8.2, leading=11, textColor=muted, spaceAfter=5),
    "section": ParagraphStyle("section", fontName="Helvetica-Bold", fontSize=10, leading=13, textColor=violet, spaceBefore=10, spaceAfter=6, keepWithNext=True),
    "item": ParagraphStyle("item", fontName="Helvetica-Bold", fontSize=9.5, leading=13, textColor=ink, spaceAfter=3, keepWithNext=True),
    "bullet": ParagraphStyle("bullet", fontName="Helvetica", fontSize=9.1, leading=12.4, textColor=ink, leftIndent=9, firstLineIndent=-7, spaceAfter=3),
}


def clean(value):
    return escape(value.replace("—", "-").replace("–", "-").replace("‑", "-").replace("’", "'"))


def para(text, style="body"):
    return Paragraph(text, styles[style])


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#ded9e4"))
    canvas.line(15 * mm, 13 * mm, A4[0] - 15 * mm, 13 * mm)
    canvas.setFillColor(muted)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(15 * mm, 9 * mm, "Arnaud ANDRE | arnaud-a.dev")
    canvas.drawRightString(A4[0] - 15 * mm, 9 * mm, str(doc.page))
    canvas.restoreState()


for language, variants in data["resumes"].items():
    labels = data["labels"][language]
    fr = language == "fr"
    for variant, resume in variants.items():
        file = output / f"arnaud-andre-{variant}-{language}.pdf"
        doc = SimpleDocTemplate(str(file), pagesize=A4, rightMargin=15 * mm, leftMargin=15 * mm,
                                topMargin=14 * mm, bottomMargin=18 * mm,
                                title=f"Arnaud ANDRE - {resume['title']}", author="Arnaud ANDRE")
        story = [para("Arnaud ANDRE", "name"), para(clean(resume["title"]), "title")]
        story.append(para(clean(" | ".join([labels["location"], labels["remote"], labels["employment"], labels["since"]])), "small"))
        story.append(para('<link href="mailto:arnaud.a.dev@gmail.com">arnaud.a.dev@gmail.com</link> | '
                          '<link href="https://www.arnaud-a.dev/">arnaud-a.dev</link> | '
                          f'<link href="{data["contact"]["linkedin"]}">LinkedIn</link> | '
                          f'<link href="{data["contact"]["github"]}">GitHub</link>', "small"))
        story.append(para(clean(resume["intro"])))
        story.append(para(clean(labels["expertise"]).upper(), "section"))
        for expertise in resume["expertise"]:
            story.append(para(f'<b>{clean(expertise["title"])}</b> - {clean(expertise["description"])}'))
        story.append(para(clean(" / ".join(dict.fromkeys(t for item in resume["expertise"] for t in item["technologies"]))), "small"))
        story.append(para(clean(labels["experience"]).upper(), "section"))
        for experience in resume["experiences"]:
            items = [para(f'{clean(experience["company"])} | {clean(experience["period"])}', "item"),
                     para(f'{clean(experience["role"])} - {clean(experience["context"])}', "small")]
            items += [para('- ' + clean(point), "bullet") for point in experience["points"]]
            story.append(KeepTogether(items))
            story.append(Spacer(1, 4))
        story.append(para(clean(labels["projects"]).upper(), "section"))
        for project in resume["projects"]:
            href = project.get("href", "")
            if href.startswith("/"):
                href = "https://www.arnaud-a.dev" + href
            title = clean(project["title"])
            if href:
                title = f'<link href="{escape(href, {chr(34): "&quot;"})}" color="#642799">{title}</link>'
            story.append(KeepTogether([para(title, "item"), para(clean(project["description"]))]))
        story.append(para(clean(labels["certifications"] + " & " + labels["languages"]).upper(), "section"))
        story.append(para("AZ-900 | AZ-204 | AI-102 | PSPO I", "small"))
        language_text = "Français : langue maternelle | Anglais : B2+ | Allemand : B1" if fr else "French: native | English: B2+ | German: B1"
        story.append(para(clean(language_text), "small"))
        doc.build(story, onFirstPage=footer, onLaterPages=footer)
        print(file.name)
