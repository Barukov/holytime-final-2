export type DevShelfProduct = {
  slug: string;
  name: string;
  price: string;
  amount: number;
  priceId: string;
  tag: string;
  shortDescription: string;
  description: string;
  downloadFile: string;
  includes: string[];
};

export const products: DevShelfProduct[] = [
  {
    slug: "starter-study-kit",
    name: "Starter Study Kit",
    price: "EUR 161",
    amount: 161,
    priceId: "pri_01kwegvcfyape1fy1nwv9v34dv",
    tag: "Starter",
    shortDescription: "A compact file set with notes, quick references and guided study pages.",
    description: "A compact digital study kit with structured notes, quick references, worksheets and guided pages for focused independent learning.",
    downloadFile: "/downloads/Starter-Study-Kit.pdf",
    includes: ["Core notes", "Quick references", "Guided worksheets", "Study checklist"],
  },
  {
    slug: "digital-notes-bundle",
    name: "Digital Notes Bundle",
    price: "EUR 199",
    amount: 199,
    priceId: "pri_01kwegvd2gcwjcy4jy12ky0e0d",
    tag: "Popular",
    shortDescription: "Organized PDF notes, planning pages and reusable learning sheets.",
    description: "A clean bundle of PDF notes, planning pages, reusable learning sheets and reference files for building a personal digital library.",
    downloadFile: "/downloads/Digital-Notes-Bundle.pdf",
    includes: ["PDF notes", "Planning pages", "Learning sheets", "Reference files"],
  },
  {
    slug: "method-starter-pack",
    name: "Method Starter Pack",
    price: "EUR 219",
    amount: 219,
    priceId: "pri_01kwegvdmj1g6rbcr5z4d1srvk",
    tag: "Workflow",
    shortDescription: "Step-by-step materials, checklists and simple framework pages.",
    description: "A starter pack with step-by-step materials, checklists, framework pages and practical files for keeping study sessions organized.",
    downloadFile: "/downloads/Method-Starter-Pack.pdf",
    includes: ["Step-by-step files", "Checklists", "Framework pages", "Setup notes"],
  },
  {
    slug: "practice-file-lab",
    name: "Practice File Lab",
    price: "EUR 245",
    amount: 245,
    priceId: "pri_01kwegve71ty3r4fmpmg94f3x6",
    tag: "Practice",
    shortDescription: "Exercises, task sheets, review pages and progress trackers.",
    description: "A practical digital lab with exercises, task sheets, review pages and progress trackers for repeatable learning sessions.",
    downloadFile: "/downloads/Practice-File-Lab.pdf",
    includes: ["Exercise files", "Task sheets", "Review pages", "Progress tracker"],
  },
  {
    slug: "resource-desk-pack",
    name: "Resource Desk Pack",
    price: "EUR 249",
    amount: 249,
    priceId: "pri_01kwegvesqdx9wb64xv9vz5vvm",
    tag: "Resources",
    shortDescription: "Reference sheets, planning templates and clean workflow documents.",
    description: "A resource pack with reference sheets, planning templates, workflow documents and study assets for a tidy digital workspace.",
    downloadFile: "/downloads/Resource-Desk-Pack.pdf",
    includes: ["Reference sheets", "Planning templates", "Workflow documents", "Study assets"],
  },
  {
    slug: "advanced-study-vault",
    name: "Advanced Study Vault",
    price: "EUR 250",
    amount: 250,
    priceId: "pri_01kwegvfc9e6wzsrsgpybkpagv",
    tag: "Advanced",
    shortDescription: "Expanded files, examples, deeper notes and applied study pages.",
    description: "An advanced digital vault with expanded files, examples, deeper notes and applied study pages for users who want a larger resource set.",
    downloadFile: "/downloads/Advanced-Study-Vault.pdf",
    includes: ["Expanded files", "Example pages", "Deep notes", "Applied study pages"],
  },
  {
    slug: "professional-archive",
    name: "Professional Archive",
    price: "EUR 255",
    amount: 255,
    priceId: "pri_01kwegvfyrz47pw4z4rxebmcmx",
    tag: "Archive",
    shortDescription: "A larger archive with premium notes, templates and reusable resources.",
    description: "A professional archive with premium notes, templates, reusable resources and a larger set of organized digital learning files.",
    downloadFile: "/downloads/Professional-Archive.pdf",
    includes: ["Premium notes", "Reusable resources", "Template files", "Archive extras"],
  },
  {
    slug: "complete-digital-library",
    name: "Complete Digital Library",
    price: "EUR 500",
    amount: 500,
    priceId: "pri_01kwegvgqn1dh2p9d73z3qxwwv",
    tag: "Complete",
    shortDescription: "The full library with all packs, worksheets, notes, templates and bonuses.",
    description: "The full DevShelf library with all packs, worksheets, notes, templates, reference pages and bonus digital resources in one bundle.",
    downloadFile: "/downloads/Complete-Digital-Library.pdf",
    includes: ["Full PDF library", "All study packs", "Templates and notes", "Bonus resources"],
  },
];

export const productMap = Object.fromEntries(products.map((product) => [product.slug, product])) as Record<string, DevShelfProduct>;
