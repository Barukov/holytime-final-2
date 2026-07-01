"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { products } from "./lib/products";

const filters = ["All", "Starter", "Popular", "Practice", "Complete"];

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
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const visibleProducts = useMemo(() => {
    if (activeFilter === "All") return products;
    return products.filter((product) => product.tag === activeFilter);
  }, [activeFilter]);

  const activeProduct = products.find((product) => product.slug === activeSlug) || products[0];
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
        <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(#ffffff_1px,transparent_1px),linear-gradient(90deg,#ffffff_1px,transparent_1px)] [background-size:56px_56px]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="self-end">
            <p className="mb-5 inline-flex border border-[#f5c84b]/35 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[#f5c84b]">Digital download library</p>
            <h1 className="max-w-3xl text-5xl font-black leading-[0.98] md:text-7xl">Choose files through a cleaner study desk.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/62">Browse downloadable packs by use case, preview the included resources, then open a product dossier with checkout. The flow is built like a library desk instead of a simple card wall.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#library" className="rounded-full bg-[#f5c84b] px-8 py-4 font-black text-[#14100a] transition hover:-translate-y-1">Browse products</a>
              <Link href="/pricing" className="rounded-full border border-white/18 px-8 py-4 font-black text-white transition hover:bg-white/8">Compare pricing</Link>
            </div>
          </div>

          <div className="grid gap-4 rounded-[2rem] border border-white/12 bg-white/[0.05] p-4 shadow-2xl md:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-[1.5rem] bg-[#151b23] p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#86e3d0]">Library stats</p>
              <div className="mt-6 grid gap-3">
                <div className="border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-4xl font-black">{products.length}</p>
                  <p className="mt-1 text-sm text-white/55">active packs</p>
                </div>
                <div className="border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-4xl font-black">EUR {totalValue}</p>
                  <p className="mt-1 text-sm text-white/55">full catalog value</p>
                </div>
                <div className="border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-4xl font-black">PDF</p>
                  <p className="mt-1 text-sm text-white/55">digital delivery</p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.5rem] bg-[#f7f2e8] p-6 text-[#14100a]">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#087f72]">Selected pack</p>
                <p className="bg-[#14100a] px-4 py-2 text-sm font-black text-white">{activeProduct.price}</p>
              </div>
              <h2 className="mt-8 text-4xl font-black leading-tight">{activeProduct.name}</h2>
              <p className="mt-4 leading-7 text-black/62">{activeProduct.description}</p>
              <div className="mt-6 grid gap-2">
                {activeProduct.includes.map((item) => (
                  <div key={item} className="flex items-center justify-between border-b border-black/10 py-3 text-sm font-bold">
                    <span>{item}</span>
                    <span className="text-[#087f72]">included</span>
                  </div>
                ))}
              </div>
              <Link href={"/product/" + activeProduct.slug} className="mt-7 block rounded-full bg-[#14100a] px-6 py-4 text-center font-black text-white transition hover:-translate-y-0.5">Open product dossier</Link>
            </div>
          </div>
        </div>
      </section>

      <section id="library" className="border-y border-white/10 bg-[#111820] px-5 py-16 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[330px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#86e3d0]">Browse mode</p>
            <h2 className="mt-3 text-4xl font-black">Library desk</h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button key={filter} onClick={() => setActiveFilter(filter)} className={"rounded-full px-4 py-2 text-sm font-black transition " + (activeFilter === filter ? "bg-[#f5c84b] text-[#14100a]" : "bg-white/8 text-white/66 hover:bg-white/12")}>{filter}</button>
              ))}
            </div>
            <p className="mt-6 leading-7 text-white/55">Click a row to preview the pack on the right, or open the full product page for checkout.</p>
          </aside>

          <div className="grid gap-4">
            {visibleProducts.map((product, index) => (
              <button key={product.slug} onClick={() => setActiveSlug(product.slug)} className={"grid gap-4 border p-5 text-left transition hover:-translate-y-1 md:grid-cols-[72px_1fr_auto] md:items-center " + (activeSlug === product.slug ? "border-[#f5c84b] bg-[#f5c84b] text-[#14100a]" : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.07]")}>
                <span className={"flex h-14 w-14 items-center justify-center rounded-full text-lg font-black " + (activeSlug === product.slug ? "bg-[#14100a] text-white" : "bg-[#f7f2e8] text-[#14100a]")}>{String(index + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block text-xs font-black uppercase tracking-[0.22em] opacity-70">{product.tag}</span>
                  <span className="mt-2 block text-2xl font-black">{product.name}</span>
                  <span className="mt-2 block leading-7 opacity-70">{product.shortDescription}</span>
                </span>
                <span className="text-2xl font-black">{product.price}</span>
              </button>
            ))}
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
