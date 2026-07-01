from __future__ import annotations

import math
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


PROJECT_NAME = "DevShelf Academy"
OUT_DIR = Path("public/downloads")
OUT_DIR.mkdir(parents=True, exist_ok=True)

PAGE_W, PAGE_H = A4

INK = colors.HexColor("#101014")
PAPER = colors.HexColor("#F4F6FB")
BLUE = colors.HexColor("#6D8CFF")
LIME = colors.HexColor("#C8FF4D")
CORAL = colors.HexColor("#FF6B7A")
MUTED = colors.HexColor("#606575")
LINE = colors.HexColor("#D9DDE9")


SOURCES = [
    {
        "short": "ODS",
        "title": "Open Data Structures",
        "author": "Pat Morin",
        "license": "Creative Commons Attribution 2.5",
        "url": "https://opendatastructures.org/",
        "topics": [
            "interfaces for stacks, queues, lists, unordered sets, and sorted sets",
            "array-backed lists, linked lists, hash tables, binary trees, heaps, sorting, and graph representations",
            "correctness, time complexity, space complexity, asymptotic notation, and practical tradeoffs",
        ],
    },
    {
        "short": "DIP3",
        "title": "Dive Into Python 3",
        "author": "Mark Pilgrim",
        "license": "Creative Commons Attribution-ShareAlike",
        "url": "https://diveintopython3.net/",
        "topics": [
            "Python installation, first programs, native data types, comprehensions, strings, files, unit testing, refactoring, packaging, and HTTP services",
            "practical Python examples that connect syntax to real tools and workflows",
        ],
    },
    {
        "short": "RUST",
        "title": "Comprehensive Rust",
        "author": "Google Android Team and contributors",
        "license": "CC BY 4.0",
        "url": "https://google.github.io/comprehensive-rust/",
        "topics": [
            "Rust ownership, borrowing, lifetimes, generics, traits, error handling, concurrency, and unsafe boundaries",
            "training flow for engineers moving from C++ or Java into Rust",
        ],
    },
    {
        "short": "SICP",
        "title": "Structure and Interpretation of Computer Programs",
        "author": "Harold Abelson, Gerald Jay Sussman, Julie Sussman",
        "license": "CC BY-SA 4.0",
        "url": "https://web.mit.edu/6.001/6.037/sicp.pdf",
        "topics": [
            "abstraction, procedures, data, recursion, higher-order functions, state, streams, and evaluation models",
            "building programs by controlling complexity through levels of abstraction",
        ],
    },
    {
        "short": "GRAPH",
        "title": "Introduction to Graph Theory",
        "author": "Darij Grinberg",
        "license": "CC0 1.0",
        "url": "https://www.cip.ifi.lmu.de/~grinberg/t/22s/graphs.pdf",
        "topics": [
            "vertices, edges, walks, paths, cycles, connectedness, graph representations, and proof habits",
            "discrete structures that support algorithmic thinking",
        ],
    },
]


LESSON_SETS = {
    "python": [
        ("Python setup and first program", "DIP3", "turn environment setup into a repeatable launch checklist"),
        ("Native data types", "DIP3", "compare strings, lists, dictionaries, tuples, and sets by use case"),
        ("Comprehensions", "DIP3", "rewrite loops into readable transformations only when clarity improves"),
        ("String processing", "DIP3", "clean, split, validate, and format text before storing it"),
        ("Files and paths", "DIP3", "separate path selection, file reading, parsing, and output"),
        ("Unit testing", "DIP3", "write examples that describe behavior before refactoring"),
        ("Refactoring", "DIP3", "change structure without changing visible behavior"),
        ("Packaging small tools", "DIP3", "turn a useful script into a repeatable command"),
    ],
    "data": [
        ("Interfaces before implementations", "ODS", "choose behavior first: stack, queue, list, map, set, or graph"),
        ("Array-backed lists", "ODS", "understand indexed access, resizing, and shifting costs"),
        ("Linked lists", "ODS", "use node-based structure when insertion patterns matter"),
        ("Hash tables", "ODS", "trade ordering for fast key lookup"),
        ("Binary trees", "ODS", "connect ordering, recursion, and search behavior"),
        ("Heaps and priority queues", "ODS", "retrieve the most important item efficiently"),
        ("Sorting and comparison", "ODS", "connect algorithm choice to data shape"),
        ("Graph representations", "ODS", "choose adjacency list or matrix based on density and query type"),
    ],
    "rust": [
        ("Ownership model", "RUST", "track which part of the program controls a value"),
        ("Borrowing and references", "RUST", "use data without moving ownership"),
        ("Lifetimes", "RUST", "make reference validity explicit in design"),
        ("Enums and pattern matching", "RUST", "represent cases directly instead of using vague flags"),
        ("Result and Option", "RUST", "model failure and absence as values"),
        ("Traits and generics", "RUST", "write behavior contracts without locking into one type"),
        ("Concurrency basics", "RUST", "design shared work around ownership and message passing"),
        ("Unsafe boundaries", "RUST", "keep risky operations small, documented, and isolated"),
    ],
    "cs": [
        ("Abstraction layers", "SICP", "hide detail behind a stable idea"),
        ("Procedures as building blocks", "SICP", "compose small actions into larger behavior"),
        ("Data abstraction", "SICP", "separate representation from use"),
        ("Recursion", "SICP", "describe a problem in terms of a smaller problem"),
        ("Higher-order thinking", "SICP", "pass behavior around when patterns repeat"),
        ("State and mutation", "SICP", "control what can change and when"),
        ("Streams and delayed work", "SICP", "think about sequences that do not need to exist all at once"),
        ("Evaluation models", "SICP", "trace how an expression becomes a result"),
    ],
    "graph": [
        ("Vertices and edges", "GRAPH", "model relationships as objects and connections"),
        ("Walks, paths, and cycles", "GRAPH", "distinguish movement, repetition, and closure"),
        ("Connectedness", "GRAPH", "ask whether every important item can reach another"),
        ("Trees as graphs", "GRAPH", "use connected acyclic structure for hierarchy"),
        ("Traversal planning", "GRAPH", "make visited state explicit"),
        ("Graph data in code", "GRAPH", "convert mathematical relationships into adjacency structures"),
        ("Proof habit", "GRAPH", "state assumptions before trying to prove a property"),
        ("Algorithmic graph checks", "GRAPH", "turn relationships into searchable state"),
    ],
}


TRACK_GUIDES = {
    "python": {
        "focus": "Python turns ideas into short executable experiments, so every lesson should end with a running script or a tested function.",
        "scenarios": [
            "a command-line note cleaner",
            "a file naming helper",
            "a small data parser",
            "a quiz checker",
            "a study progress tracker",
        ],
        "mistakes": [
            "mixing parsing, validation, and printing in one block",
            "using a list when lookup by key would be clearer",
            "ignoring failed input and letting the program crash silently",
            "refactoring before the first behavior is proven",
        ],
    },
    "data": {
        "focus": "Data structures are choices about behavior, cost, and clarity, not just names to memorize.",
        "scenarios": [
            "a task queue for pending study sessions",
            "a dictionary-backed glossary",
            "a priority list for review topics",
            "a searchable archive of notes",
            "a graph of related programming concepts",
        ],
        "mistakes": [
            "choosing a structure before knowing the main operation",
            "forgetting that fast lookup may cost memory",
            "assuming sorted data stays sorted after updates",
            "measuring only one input size and trusting the result",
        ],
    },
    "rust": {
        "focus": "Rust makes ownership, failure, and shared state explicit, which helps learners design safer systems.",
        "scenarios": [
            "a parser that returns Result instead of panicking",
            "a borrowed view over a larger text buffer",
            "a typed command enum for a study tool",
            "a small concurrent worker plan",
            "a module boundary for reusable logic",
        ],
        "mistakes": [
            "trying to share mutable state before defining ownership",
            "using unwrap in places where recovery should be designed",
            "making lifetimes harder by storing references unnecessarily",
            "hiding unsafe logic inside a large function",
        ],
    },
    "cs": {
        "focus": "Computer science fundamentals help reduce complexity by naming the right abstraction level.",
        "scenarios": [
            "a calculator broken into expression, operation, and output layers",
            "a recursive folder walk described before it is coded",
            "a stream-like process that handles one record at a time",
            "a stateful counter with a clear mutation boundary",
            "a higher-order helper for repeated validation rules",
        ],
        "mistakes": [
            "exposing representation details to every caller",
            "using recursion without identifying the base case",
            "mixing state changes with calculations that should be pure",
            "adding abstraction before there is a repeated pattern",
        ],
    },
    "graph": {
        "focus": "Graph thinking turns relationships into data that can be searched, validated, and explained.",
        "scenarios": [
            "a map of prerequisites between study topics",
            "a dependency graph for project files",
            "a route between concepts using edges",
            "a connected-components check for isolated notes",
            "a cycle check for tasks that depend on each other",
        ],
        "mistakes": [
            "forgetting to record visited nodes",
            "using a matrix for sparse relationships without a reason",
            "confusing a path with a walk that repeats vertices",
            "drawing a graph but never defining what an edge means",
        ],
    },
}


PRODUCTS = [
    {
        "file": "DevShelf-Starter-Study-Kit.pdf",
        "title": "Starter Study Kit",
        "subtitle": "Programming foundations, Python basics, and a structured first-project path.",
        "pages": 200,
        "price": "EUR 161",
        "tracks": ["python", "cs"],
    },
    {
        "file": "DevShelf-Digital-Notes-Bundle.pdf",
        "title": "Digital Notes Bundle",
        "subtitle": "A curated developer note system built from Python, CS, and data-structure study patterns.",
        "pages": 220,
        "price": "EUR 199",
        "tracks": ["python", "cs", "data"],
    },
    {
        "file": "DevShelf-Method-Starter-Pack.pdf",
        "title": "Method Starter Pack",
        "subtitle": "A repeatable learning method combining abstraction, Python practice, and data-structure reasoning.",
        "pages": 240,
        "price": "EUR 219",
        "tracks": ["cs", "python", "data"],
    },
    {
        "file": "DevShelf-Practice-File-Lab.pdf",
        "title": "Practice File Lab",
        "subtitle": "Programming drills, review sheets, debugging logs, and data-structure exercises.",
        "pages": 260,
        "price": "EUR 245",
        "tracks": ["python", "data", "graph", "cs"],
    },
    {
        "file": "DevShelf-Resource-Desk-Pack.pdf",
        "title": "Resource Desk Pack",
        "subtitle": "Reference sheets and implementation checklists for Python, data structures, graphs, and Rust.",
        "pages": 280,
        "price": "EUR 249",
        "tracks": ["data", "python", "graph", "rust"],
    },
    {
        "file": "DevShelf-Advanced-Study-Vault.pdf",
        "title": "Advanced Study Vault",
        "subtitle": "Advanced data structures, graph reasoning, Rust concepts, and abstraction practice.",
        "pages": 320,
        "price": "EUR 250",
        "tracks": ["data", "graph", "rust", "cs"],
    },
    {
        "file": "DevShelf-Professional-Archive.pdf",
        "title": "Professional Archive",
        "subtitle": "A professional training archive for project design, robust code, Rust, algorithms, and review.",
        "pages": 360,
        "price": "EUR 255",
        "tracks": ["rust", "data", "python", "graph", "cs"],
    },
    {
        "file": "DevShelf-Complete-Digital-Library.pdf",
        "title": "Complete Digital Library",
        "subtitle": "The full DevShelf Academy study library combining all source-informed programming paths.",
        "pages": 420,
        "price": "EUR 500",
        "tracks": ["python", "data", "rust", "cs", "graph"],
    },
]


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="Tiny", parent=styles["Normal"], fontName="Helvetica", fontSize=7.5, leading=9, textColor=MUTED))
styles.add(ParagraphStyle(name="Kicker", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=8, leading=10, textColor=BLUE, spaceAfter=5, uppercase=True))
styles.add(ParagraphStyle(name="TitleBig", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=32, leading=35, textColor=INK, spaceAfter=12))
styles.add(ParagraphStyle(name="SubTitle", parent=styles["Normal"], fontName="Helvetica", fontSize=13, leading=18, textColor=MUTED, spaceAfter=14))
styles.add(ParagraphStyle(name="H1x", parent=styles["Heading1"], fontName="Helvetica-Bold", fontSize=18, leading=22, textColor=INK, spaceBefore=6, spaceAfter=10))
styles.add(ParagraphStyle(name="H2x", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=13, leading=16, textColor=INK, spaceBefore=4, spaceAfter=6))
styles.add(ParagraphStyle(name="Bodyx", parent=styles["BodyText"], fontName="Helvetica", fontSize=9.7, leading=14, textColor=colors.HexColor("#20232D"), spaceAfter=7))
styles.add(ParagraphStyle(name="BodySmall", parent=styles["BodyText"], fontName="Helvetica", fontSize=8.5, leading=12, textColor=colors.HexColor("#272B36"), spaceAfter=5))
styles.add(ParagraphStyle(name="CodeBlock", parent=styles["BodyText"], fontName="Courier", fontSize=8.2, leading=11, textColor=colors.HexColor("#20232D")))


def source_by_short(short: str) -> dict:
    return next(source for source in SOURCES if source["short"] == short)


def make_lesson(product: dict, index: int) -> dict:
    track = product["tracks"][index % len(product["tracks"])]
    name, source_short, angle = LESSON_SETS[track][index % len(LESSON_SETS[track])]
    source = source_by_short(source_short)
    guide = TRACK_GUIDES[track]
    scenario = guide["scenarios"][index % len(guide["scenarios"])]
    mistake = guide["mistakes"][(index + 2) % len(guide["mistakes"])]
    source_topic = source["topics"][index % len(source["topics"])]
    adjacent_track = product["tracks"][(index + 1) % len(product["tracks"])]
    adjacent_name = LESSON_SETS[adjacent_track][(index + 2) % len(LESSON_SETS[adjacent_track])][0]

    concept = (
        f"Source lens: {source['title']} is used here for the topic area of {source_topic}. "
        f"DevShelf Academy converts that public learning direction into an original workbook "
        f"page about {name.lower()}, with a practical scenario: {scenario}."
    )
    explanation = (
        f"{guide['focus']} In this lesson, {name.lower()} should be studied through a working "
        f"artifact, not through passive reading. Start with the scenario, define the input and "
        f"output, then decide which part of the program needs the concept. A useful learner's "
        f"answer should include the concept's purpose, the cost it introduces, and the failure "
        f"mode it helps prevent. Watch for this common mistake: {mistake}."
    )
    applied = (
        f"Connect this lesson to {adjacent_name.lower()}. For example, build the first version "
        f"with the simplest implementation, then add the adjacent idea only when it removes "
        f"duplication, clarifies ownership, improves lookup, or makes testing easier. This is "
        f"how the public-source topic becomes a custom DevShelf practice path."
    )

    tasks = [
        f"Write a five-sentence explanation of {name.lower()} without looking at the source.",
        f"Build a 20-line example for {scenario} that demonstrates {angle}.",
        "Add one invalid input or edge case and describe the expected behavior.",
        "Refactor the example once for naming and once for simpler control flow.",
        f"Write a final note: when should a learner use {name.lower()}, and when should they avoid it?",
    ]

    code = make_code_shape(track, name)

    return {
        "track": track,
        "title": name,
        "source": source,
        "concept": concept,
        "explanation": explanation,
        "applied": applied,
        "tasks": tasks,
        "code": code,
    }


def make_code_shape(track: str, name: str) -> list[str]:
    if track == "python":
        return [
            "def run_tool(raw_text):",
            "    items = clean_input(raw_text)",
            "    checked = validate(items)",
            "    return format_result(checked)",
        ]
    if track == "data":
        return [
            "structure = choose_for(main_operation)",
            "for item in incoming_items:",
            "    structure.add(item)",
            "answer = structure.query(target)",
        ]
    if track == "rust":
        return [
            "fn handle(input: &str) -> Result<Output, Error> {",
            "    let parsed = parse(input)?;",
            "    Ok(process(parsed))",
            "}",
        ]
    if track == "graph":
        return [
            "visited = set()",
            "frontier = [start]",
            "while frontier:",
            "    node = frontier.pop()",
        ]
    return [
        "define representation",
        "define constructor",
        "define selector",
        "hide the internal details",
    ]


class ProductDocTemplate(BaseDocTemplate):
    def __init__(self, filename: str, product: dict):
        self.product = product
        super().__init__(
            filename,
            pagesize=A4,
            rightMargin=18 * mm,
            leftMargin=18 * mm,
            topMargin=20 * mm,
            bottomMargin=18 * mm,
        )
        frame = Frame(self.leftMargin, self.bottomMargin, self.width, self.height, id="normal")
        self.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=self.draw_page)])

    def draw_page(self, canvas, doc):
        page = canvas.getPageNumber()
        canvas.saveState()
        canvas.setFillColor(PAPER)
        canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
        canvas.setFillColor(INK)
        canvas.setFont("Helvetica-Bold", 7.5)
        canvas.drawString(18 * mm, PAGE_H - 11 * mm, PROJECT_NAME)
        canvas.setFillColor(BLUE)
        canvas.circle(PAGE_W - 22 * mm, PAGE_H - 9 * mm, 3.2, fill=1, stroke=0)
        canvas.setFillColor(MUTED)
        canvas.setFont("Helvetica", 7.5)
        canvas.drawRightString(PAGE_W - 18 * mm, 10 * mm, f"{self.product['title']} | {page}")
        canvas.setStrokeColor(LINE)
        canvas.line(18 * mm, PAGE_H - 15 * mm, PAGE_W - 18 * mm, PAGE_H - 15 * mm)
        canvas.restoreState()


def para(text: str, style: str = "Bodyx") -> Paragraph:
    escaped = (
        str(text)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )
    return Paragraph(escaped, styles[style])


def source_card(source: dict) -> Table:
    data = [
        [para("SOURCE", "Tiny"), para(source["title"], "BodySmall")],
        [para("LICENSE", "Tiny"), para(source["license"], "BodySmall")],
        [para("URL", "Tiny"), para(source["url"], "Tiny")],
    ]
    table = Table(data, colWidths=[25 * mm, 125 * mm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                ("BOX", (0, 0), (-1, -1), 0.5, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.25, LINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    return table


def checklist_table(items: list[str]) -> Table:
    rows = [[para("TASK", "Tiny"), para("BUYER ACTION", "Tiny")]]
    for idx, item in enumerate(items, 1):
        rows.append([para(str(idx), "BodySmall"), para(item, "BodySmall")])
    table = Table(rows, colWidths=[14 * mm, 136 * mm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), INK),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("BACKGROUND", (0, 1), (-1, -1), colors.white),
                ("BOX", (0, 0), (-1, -1), 0.5, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.25, LINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    return table


def code_box(lines: list[str]) -> Table:
    text = "<br/>".join(line.replace(" ", "&nbsp;") for line in lines)
    table = Table([[Paragraph(text, styles["CodeBlock"])]], colWidths=[150 * mm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#E9ECF8")),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#C6CDE8")),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    return table


def ownership_notice(product: dict) -> list:
    return [
        para(
            f"{PROJECT_NAME} owns this compiled commercial study product, including the product "
            "layout, original explanations, exercises, worksheets, project prompts, checklists, "
            "and delivery package."
        ),
        para(
            "Referenced open educational works remain owned by their respective authors and are "
            "credited in the license section. This product does not claim ownership of those works "
            "and is not a resale of any third-party book as-is."
        ),
        para(f"Product price: {product['price']}", "BodySmall"),
    ]


def build_story(product: dict) -> list:
    story = []

    story.extend(
        [
            para("COMMERCIAL DIGITAL STUDY PRODUCT", "Kicker"),
            para(product["title"], "TitleBig"),
            para(product["subtitle"], "SubTitle"),
            para(f"Prepared by {PROJECT_NAME}", "H2x"),
            *ownership_notice(product),
            Spacer(1, 8),
            checklist_table(
                [
                    "Use this PDF as a study workbook, not a passive reading file.",
                    "Every lesson page connects an open educational source theme with a new DevShelf exercise.",
                    "Code along, create notes, and keep the final review pages with your project files.",
                    "Follow the attribution notes if you redistribute any adapted share-alike material.",
                ]
            ),
            PageBreak(),
            para("What This Pack Contains", "H1x"),
            para(
                "This file combines source-informed programming topics with DevShelf Academy's own "
                "learning flow. The public sources provide topic framing and licensing transparency; "
                "the actual sequence, explanations, worksheets, review prompts, and commercial "
                "product presentation are original to DevShelf Academy."
            ),
            para("Source-informed tracks", "H2x"),
        ]
    )

    for track in product["tracks"]:
        sample = LESSON_SETS[track][0]
        source = source_by_short(sample[1])
        story.append(para(f"{track.upper()} - informed by {source['title']}", "Bodyx"))

    story.extend([Spacer(1, 10), para("Ownership and licensing", "H2x"), *ownership_notice(product), PageBreak()])

    lesson_count = product["pages"] - 4
    for i in range(lesson_count):
        lesson = make_lesson(product, i)
        story.append(para(f"LESSON {i + 1:03d} | {lesson['track'].upper()}", "Kicker"))
        story.append(para(lesson["title"], "H1x"))
        story.append(source_card(lesson["source"]))
        story.append(Spacer(1, 8))
        story.append(para("Source-informed concept", "H2x"))
        story.append(para(lesson["concept"]))
        story.append(para("DevShelf explanation", "H2x"))
        story.append(para(lesson["explanation"]))
        story.append(para("Applied connection", "H2x"))
        story.append(para(lesson["applied"]))
        story.append(para("Practice checklist", "H2x"))
        story.append(checklist_table(lesson["tasks"]))
        story.append(Spacer(1, 8))
        story.append(para("Example workflow shape", "H2x"))
        story.append(code_box(lesson["code"]))
        story.append(PageBreak())

    story.extend(
        [
            para("Final Project Plan", "H1x"),
            para(
                "Choose one product-sized project and connect at least three tracks from this PDF. "
                "For example: a Python command-line study tracker using dictionaries, file output, "
                "basic tests, and a graph-like relationship map between topics."
            ),
            checklist_table(
                [
                    "Define the user action and visible output.",
                    "Select the data structure before writing code.",
                    "Write one test for normal input and one test for invalid input.",
                    "Document one refactor and explain what became simpler.",
                    "Write a final attribution note if your project includes adapted source material.",
                ]
            ),
            PageBreak(),
            para("Attribution and License Notes", "H1x"),
            para(
                "The following sources were used for topic selection and educational framing. "
                "The DevShelf Academy product is a newly compiled study guide with original "
                "lesson text, exercises, worksheets, project prompts, and layout."
            ),
        ]
    )

    for source in SOURCES:
        story.append(source_card(source))
        story.append(Spacer(1, 5))

    story.extend(
        [
            para("Commercial use note", "H2x"),
            para(
                "Only sources with commercial-friendly licenses were selected for this product "
                "family. NonCommercial sources were intentionally excluded from the product content."
            ),
            para("Customer license", "H2x"),
            para(
                "Customers may use this purchased DevShelf Academy PDF for personal study and "
                "internal learning. The PDF itself, its commercial packaging, original lesson "
                "sequence, and DevShelf worksheets may not be resold as a competing product."
            ),
        ]
    )
    return story


def make_pdf(product: dict):
    filename = OUT_DIR / product["file"]
    doc = ProductDocTemplate(str(filename), product)
    doc.build(build_story(product))


def main():
    for product in PRODUCTS:
        make_pdf(product)
    print(f"Generated {len(PRODUCTS)} source-informed PDFs in {OUT_DIR.resolve()}")


if __name__ == "__main__":
    main()
