"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { products } from "./lib/products";

const filters = ["All", "Starter", "Popular", "Practice", "Complete"];

const previewModes = [
  {
    id: "Checklist",
    title: "Session checklist",
    text: "A clean step-by-step page for planning a focused digital study session.",
    lines: ["Define the objective", "Collect source notes", "Complete the worksheet", "Write a short summary", "Save the next action"],
  },
  {
    id: "Worksheet",
    title: "Guided worksheet",
    text: "Structured fields for turning notes into something usable instead of loose files.",
    lines: ["Main goal", "Key ideas", "Questions to solve", "Session output", "Follow-up task"],
  },
  {
    id: "Map",
    title: "Resource map",
    text: "A quick overview page that helps the buyer understand what each file is for.",
    lines: ["Notes library", "Templates", "Practice files", "Review pages", "Delivery support"],
  },
];

const deliverySteps = [
  ["Select", "Open a pack and review what is included."],
  ["Checkout", "Pay securely through Paddle with the email that should receive the files."],
  ["Access", "The digital download is sent after payment confirmation."],
];

const faqs = [
  ["What is DevShelf Academy?", "A digital library for downloadable study packs, PDF files, notes, templates and learning resources."],
  ["How do I receive files?", "After successful Paddle payment, the download link is sent to the email used during checkout."],
  ["Are products physical?", "No. All products are digital files. Nothing is shipped by post."],
  ["Can I request support?", "Yes. Use the contact page and include the email used at checkout so we can find your order."],
];

export default function Page() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeSlug, setActiveSlug] = useState(products[1].slug);
  const [previewMode, setPreviewMode] = useState(previewModes[0].id);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const visibleProducts = useMemo(() => {
    if (activeFilter === "All") return products;
    return products.filter((product) => product.tag === activeFilter);
  }, [activeFilter]);

  const activeProduct = products.find((product) => product.slug === activeSlug) || products[0];
  const activePreview = previewModes.find((mode) => mode.id === previewMode) || previewModes[0];
  const totalValue = products.reduce((sum, product) => sum + product.amount, 0);

  return (
    <main className="min-h-screen bg-[#0d1117] text-[#f7f2e8]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0d1117]/92 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="text-xl font-black tracking-tight md:text-2xl">DevShelf Academy</Link>
          <nav className="hidden items-center gap-6 text-sm font-bold text-white/62 md:flex">
            <a href="#library">Library</a>
            <Link href="/pricing">Pricing</Link>
            <Link href="/delivery">Delivery</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/refund-policy">Refunds</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <a href="#library" className="rounded-full bg-[#f5c84b] px-5 py-3 text-sm font-black text-[#14100a] transition hover:-translate-y-0.5">Open library</a>
        </div>
      </header>

      <section className="relative overflow-hidden px-5 py-16 md:px-8 md:py-24">
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(#ffffff_1px,transparent_1px),linear-gradient(90deg,#ffffff_1px,transparent_1px)] [background-size:56px_56px]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#f5c84b]/12 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0d1117] to-transparent" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="self-center">
            <p className="mb-5 inline-flex border border-[#f5c84b]/35 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[#f5c84b]">Digital download library</p>
            <h1 className="max-w-3xl text-5xl font-black leading-[0.98] md:text-7xl">Choose files through a cleaner study desk.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/62">Browse downloadable packs by use case, preview the included resources, then open a product dossier with checkout. The flow is built like a library desk instead of a simple card wall.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#library" className="rounded-full bg-[#f5c84b] px-8 py-4 font-black text-[#14100a] transition hover:-translate-y-1">Browse products</a>
              <Link href="/pricing" className="rounded-full border border-white/18 px-8 py-4 font-black text-white transition hover:bg-white/8">Compare pricing</Link>
            </div>
          </div>

          <div className="relative min-h-[610px] overflow-hidden border border-white/12 bg-[#101720] shadow-[0_34px_90px_rgba(0,0,0,.38)]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(245,200,75,.14),transparent_34%),linear-gradient(180deg,rgba(134,227,208,.10),transparent_42%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f5c84b] to-transparent" />
            <div className="scan-line absolute left-0 right-0 top-16 h-px bg-[#86e3d0]/55" />

            <div className="absolute left-6 top-6 z-10 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff6d5a]" />
              <span className="h-3 w-3 rounded-full bg-[#f5c84b]" />
              <span className="h-3 w-3 rounded-full bg-[#86e3d0]" />
            </div>

            <div className="absolute left-6 top-20 z-10 w-[190px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#86e3d0]">Live shelf</p>
              <div className="mt-5 space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-white/55"><span>Packs</span><span>{products.length}/8</span></div>
                  <div className="mt-2 h-2 bg-white/10"><div className="load-bar h-full bg-[#f5c84b]" /></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-white/55"><span>Files</span><span>PDF</span></div>
                  <div className="mt-2 h-2 bg-white/10"><div className="load-bar load-bar-delay h-full bg-[#86e3d0]" /></div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="border border-white/10 p-3">
                    <p className="text-2xl font-black">{products.length}</p>
                    <p className="text-xs text-white/45">packs</p>
                  </div>
                  <div className="border border-white/10 p-3">
                    <p className="text-2xl font-black">EUR</p>
                    <p className="text-xs text-white/45">{totalValue}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="file-stack absolute bottom-16 left-[11%] h-[310px] w-[310px] md:left-[16%]">
              {products.slice(0, 5).map((product, index) => (
                <button
                  key={product.slug}
                  onClick={() => setActiveSlug(product.slug)}
                  className={"stack-sheet absolute h-[225px] w-[180px] border p-5 text-left shadow-2xl transition duration-500 hover:-translate-y-4 " + (activeSlug === product.slug ? "border-[#f5c84b] bg-[#f5c84b] text-[#14100a]" : "border-white/16 bg-[#f7f2e8] text-[#14100a]")}
                  style={{ left: `${index * 34}px`, top: `${index * 18}px`, zIndex: index + 1, animationDelay: `${index * 120}ms` }}
                >
                  <span className="block text-[10px] font-black uppercase tracking-[0.22em] opacity-65">{product.tag}</span>
                  <span className="mt-5 block text-xl font-black leading-tight">{product.name}</span>
                  <span className="mt-5 block h-1.5 w-16 bg-[#087f72]" />
                  <span className="mt-3 block h-1.5 w-24 bg-black/12" />
                  <span className="mt-2 block h-1.5 w-20 bg-black/12" />
                  <span className="absolute bottom-5 left-5 text-sm font-black">{product.price}</span>
                </button>
              ))}
            </div>

            <div className="preview-panel absolute bottom-8 right-6 top-24 z-20 w-[min(380px,calc(100%-48px))] border border-black/10 bg-[#f7f2e8] p-6 text-[#14100a] shadow-[0_26px_70px_rgba(0,0,0,.35)] md:right-8">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#087f72]">Selected pack</p>
                <p className="bg-[#14100a] px-4 py-2 text-sm font-black text-white">{activeProduct.price}</p>
              </div>
              <h2 className="mt-7 text-4xl font-black leading-tight">{activeProduct.name}</h2>
              <p className="mt-4 leading-7 text-black/62">{activeProduct.description}</p>
              <div className="mt-6 grid gap-3">
                {activeProduct.includes.map((item, index) => (
                  <div key={item} className="include-row flex items-center justify-between border-b border-black/10 pb-3 text-sm font-bold" style={{ animationDelay: `${index * 90}ms` }}>
                    <span>{item}</span>
                    <span className="text-[#087f72]">ready</span>
                  </div>
                ))}
              </div>
              <Link href={"/product/" + activeProduct.slug} className="mt-7 block rounded-full bg-[#14100a] px-6 py-4 text-center font-black text-white transition hover:-translate-y-1 hover:bg-[#087f72]">Open product dossier</Link>
              <div className="mt-5 flex items-center gap-3 text-xs font-bold text-black/45">
                <span className="h-2 w-2 rounded-full bg-[#087f72]" />
                <span>Download delivery after payment</span>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-0 h-28 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,.08)_0_1px,transparent_1px_76px)]" />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#f7f2e8] px-5 py-20 text-[#14100a] md:px-8">
        <div className="absolute inset-y-0 left-0 w-1/2 bg-[radial-gradient(circle_at_30%_30%,rgba(8,127,114,.16),transparent_32%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#087f72]">Preview lab</p>
            <h2 className="mt-3 max-w-3xl text-5xl font-black leading-tight md:text-6xl">Show value before checkout.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-black/62">Each pack is presented as a usable digital workspace, not just a download link. The buyer can understand what the product contains before opening checkout.</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {previewModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setPreviewMode(mode.id)}
                  className={"border px-5 py-4 text-left font-black transition duration-300 hover:-translate-y-1 " + (previewMode === mode.id ? "border-[#14100a] bg-[#14100a] text-white" : "border-black/10 bg-white text-[#14100a] hover:border-[#087f72]")}
                >
                  {mode.id}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="border border-black/10 bg-white p-5">
                <p className="text-3xl font-black">01</p>
                <p className="mt-2 text-sm font-bold text-black/55">Clear product structure</p>
              </div>
              <div className="border border-black/10 bg-white p-5">
                <p className="text-3xl font-black">PDF</p>
                <p className="mt-2 text-sm font-bold text-black/55">Readable downloadable files</p>
              </div>
              <div className="border border-black/10 bg-white p-5">
                <p className="text-3xl font-black">24h</p>
                <p className="mt-2 text-sm font-bold text-black/55">Support response target</p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[520px]">
            <div className="absolute left-0 top-12 hidden h-[390px] w-[260px] rotate-[-7deg] border border-black/10 bg-[#f5c84b] shadow-[0_25px_70px_rgba(20,16,10,.14)] md:block" />
            <div className="absolute right-0 top-0 hidden h-[420px] w-[290px] rotate-[5deg] border border-black/10 bg-[#86e3d0] shadow-[0_25px_70px_rgba(20,16,10,.14)] md:block" />
            <div className="sample-document relative mx-auto max-w-[430px] border border-black/10 bg-white p-7 shadow-[0_35px_90px_rgba(20,16,10,.18)]">
              <div className="flex items-start justify-between gap-4 border-b border-black/10 pb-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-[#087f72]">DevShelf sample</p>
                  <h3 className="mt-3 text-3xl font-black">{activePreview.title}</h3>
                </div>
                <span className="bg-[#14100a] px-3 py-2 text-xs font-black text-white">PDF</span>
              </div>
              <p className="mt-5 leading-7 text-black/62">{activePreview.text}</p>
              <div className="mt-7 space-y-3">
                {activePreview.lines.map((line, index) => (
                  <div key={line} className="sample-line flex items-center gap-3 border border-black/10 bg-[#f7f2e8] p-4" style={{ animationDelay: `${index * 95}ms` }}>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#087f72] text-xs font-black text-white">{index + 1}</span>
                    <span className="font-bold">{line}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex items-center justify-between border-t border-black/10 pt-5 text-sm font-bold text-black/52">
                <span>Digital file preview</span>
                <span>Included in packs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="library" className="relative overflow-hidden border-y border-white/10 bg-[#111820] px-5 py-20 md:px-8">
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:92px_92px]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#86e3d0]">Browse mode</p>
              <h2 className="mt-3 text-5xl font-black">Library desk</h2>
            </div>
            <p className="max-w-xl leading-7 text-white/55">Filter packs, preview the active file set, then open the dossier page for checkout and delivery details.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <aside className="border border-white/10 bg-white/[0.04] p-5 lg:sticky lg:top-24 lg:self-start">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f5c84b]">Filters</p>
              <div className="mt-5 grid gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={"group flex items-center justify-between border px-4 py-4 text-left text-sm font-black transition duration-300 " + (activeFilter === filter ? "border-[#f5c84b] bg-[#f5c84b] text-[#14100a]" : "border-white/10 bg-[#151d27] text-white/65 hover:border-[#86e3d0] hover:text-white")}
                  >
                    <span>{filter}</span>
                    <span className={"h-2 w-2 rounded-full transition " + (activeFilter === filter ? "bg-[#14100a]" : "bg-white/18 group-hover:bg-[#86e3d0]")} />
                  </button>
                ))}
              </div>

              <div className="mt-7 border-t border-white/10 pt-6">
                <p className="text-sm font-bold text-white/55">Selected now</p>
                <p className="mt-2 text-2xl font-black">{activeProduct.name}</p>
                <p className="mt-3 text-sm leading-6 text-white/48">{activeProduct.shortDescription}</p>
              </div>
            </aside>

            <div className="space-y-6">
              <div className="feature-strip relative overflow-hidden border border-[#f5c84b]/30 bg-[#f5c84b] p-6 text-[#14100a] shadow-[0_24px_70px_rgba(245,200,75,.13)] md:p-8">
                <div className="absolute inset-y-0 right-0 w-1/3 bg-[repeating-linear-gradient(135deg,rgba(20,16,10,.12)_0_1px,transparent_1px_14px)]" />
                <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.24em] opacity-65">{activeProduct.tag}</p>
                    <h3 className="mt-3 text-4xl font-black leading-tight">{activeProduct.name}</h3>
                    <p className="mt-3 max-w-2xl leading-7 opacity-70">{activeProduct.description}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-4xl font-black">{activeProduct.price}</p>
                    <Link href={"/product/" + activeProduct.slug} className="mt-4 inline-flex rounded-full bg-[#14100a] px-6 py-3 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-[#087f72]">Open dossier</Link>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleProducts.map((product, index) => (
                  <button
                    key={product.slug}
                    onClick={() => setActiveSlug(product.slug)}
                    className={"catalog-tile group relative min-h-[245px] overflow-hidden border p-5 text-left transition duration-300 hover:-translate-y-2 " + (activeSlug === product.slug ? "border-[#f5c84b] bg-[#f7f2e8] text-[#14100a]" : "border-white/10 bg-white/[0.045] text-white hover:border-[#86e3d0] hover:bg-white/[0.075]")}
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
                    <span className={"absolute right-5 top-5 text-sm font-black " + (activeSlug === product.slug ? "text-[#087f72]" : "text-white/35")}>{String(index + 1).padStart(2, "0")}</span>
                    <span className={"inline-flex border px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] " + (activeSlug === product.slug ? "border-[#087f72]/30 text-[#087f72]" : "border-white/10 text-[#86e3d0]")}>{product.tag}</span>
                    <span className="mt-5 block text-2xl font-black leading-tight">{product.name}</span>
                    <span className={"mt-4 block leading-7 " + (activeSlug === product.slug ? "text-black/58" : "text-white/55")}>{product.shortDescription}</span>
                    <span className="absolute bottom-5 left-5 text-2xl font-black">{product.price}</span>
                    <span className={"absolute bottom-6 right-5 h-9 w-9 rounded-full transition group-hover:translate-x-1 " + (activeSlug === product.slug ? "bg-[#14100a]" : "bg-[#f5c84b]")}>
                      <span className={"absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full " + (activeSlug === product.slug ? "bg-white" : "bg-[#14100a]")} />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f2e8] px-5 py-20 text-[#14100a] md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#087f72]">Delivery flow</p>
            <h2 className="mt-3 text-5xl font-black">Simple after payment.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {deliverySteps.map(([title, text], index) => (
              <div key={title} className="border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(20,16,10,.08)]">
                <p className="text-4xl font-black text-[#087f72]">{index + 1}</p>
                <h3 className="mt-5 text-2xl font-black">{title}</h3>
                <p className="mt-3 leading-7 text-black/58">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0d1117] px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#86e3d0]">FAQ</p>
            <h2 className="mt-3 text-5xl font-black">Before checkout</h2>
            <Link href="/contact" className="mt-8 inline-block rounded-full bg-[#f5c84b] px-8 py-4 font-black text-[#14100a]">Contact support</Link>
          </div>
          <div className="space-y-3">
            {faqs.map(([question, answer], index) => (
              <div key={question} className="border border-white/10 bg-white/[0.04]">
                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-xl font-black">
                  <span>{question}</span>
                  <span>{openFaq === index ? "Close" : "Open"}</span>
                </button>
                {openFaq === index && <p className="px-6 pb-6 leading-7 text-white/60">{answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#0d1117] px-5 py-10 text-white md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 text-sm text-white/55">
          <p>DevShelf Academy - Digital products and downloadable study files</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/pricing">Pricing</Link>
            <Link href="/delivery">Delivery</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/refund-policy">Refund</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
