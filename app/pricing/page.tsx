import Link from "next/link";
import { products } from "../lib/products";

export default function PricingPage() {
  const featured = products.find((product) => product.slug === "complete-digital-library") || products[products.length - 1];

  return (
    <main className="min-h-screen bg-[#101014] text-[#f4f6fb]">
      <header className="border-b border-white/10 bg-[#101014] px-5 py-6 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-black md:text-2xl">DevShelf Academy</Link>
          <Link href="/" className="border border-white/14 px-5 py-3 text-sm font-black text-white transition hover:border-[#6d8cff] hover:text-[#6d8cff]">Back home</Link>
        </div>
      </header>

      <section className="relative overflow-hidden px-5 py-16 md:px-8 md:py-20">
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#c8ff4d]">Pricing matrix</p>
            <h1 className="mt-3 max-w-4xl text-5xl font-black leading-tight md:text-7xl">Pick the right digital pack.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">Every product is delivered as a digital download after Paddle payment confirmation. Start with a focused pack or open the complete library.</p>
          </div>

          <Link href={"/product/" + featured.slug} className="group border border-[#6d8cff]/35 bg-[#6d8cff] p-7 text-[#101014] shadow-[0_24px_80px_rgba(109,140,255,.20)] transition hover:-translate-y-1">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] opacity-60">Complete option</p>
                <h2 className="mt-3 text-3xl font-black">{featured.name}</h2>
                <p className="mt-3 max-w-xl leading-7 opacity-70">{featured.shortDescription}</p>
              </div>
              <p className="shrink-0 bg-[#101014] px-4 py-3 text-xl font-black text-white">{featured.price}</p>
            </div>
            <div className="mt-6 inline-flex bg-[#101014] px-5 py-3 text-sm font-black text-white transition group-hover:bg-[#6d8cff]">Open complete pack</div>
          </Link>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#15151b] px-5 py-14 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product, index) => (
              <Link
                key={product.slug}
                href={"/product/" + product.slug}
                className={"catalog-tile group relative min-h-[330px] overflow-hidden border p-6 transition duration-300 hover:-translate-y-2 " + (product.slug === featured.slug ? "border-[#6d8cff] bg-[#6d8cff] text-[#101014]" : "border-white/10 bg-white/[0.045] text-white hover:border-[#c8ff4d] hover:bg-white/[0.075]")}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <span className={"absolute right-5 top-5 text-sm font-black " + (product.slug === featured.slug ? "text-[#101014]/55" : "text-white/30")}>{String(index + 1).padStart(2, "0")}</span>
                <span className={"inline-flex border px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] " + (product.slug === featured.slug ? "border-[#101014]/20" : "border-white/10 text-[#c8ff4d]")}>{product.tag}</span>
                <h2 className="mt-7 text-3xl font-black leading-tight">{product.name}</h2>
                <p className={"mt-4 leading-7 " + (product.slug === featured.slug ? "text-[#101014]/70" : "text-white/55")}>{product.shortDescription}</p>
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-4">
                  <p className="text-3xl font-black">{product.price}</p>
                  <span className={"h-10 w-10 transition group-hover:translate-x-1 " + (product.slug === featured.slug ? "bg-[#101014]" : "bg-[#6d8cff]")}>
                    <span className={"mx-auto mt-[15px] block h-2 w-2 rounded-full " + (product.slug === featured.slug ? "bg-white" : "bg-[#101014]")} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f4f6fb] px-5 py-16 text-[#101014] md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          <div className="border border-black/10 bg-white p-7 shadow-[0_18px_55px_rgba(20,16,10,.08)]">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#6d8cff]">Delivery</p>
            <h3 className="mt-4 text-3xl font-black">Digital only</h3>
            <p className="mt-4 leading-7 text-black/58">No postal shipping. Delivery is handled by email after payment confirmation.</p>
          </div>
          <div className="border border-black/10 bg-white p-7 shadow-[0_18px_55px_rgba(20,16,10,.08)]">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#6d8cff]">Payment</p>
            <h3 className="mt-4 text-3xl font-black">Secure checkout</h3>
            <p className="mt-4 leading-7 text-black/58">Payments are processed by Paddle using supported payment methods.</p>
          </div>
          <div className="border border-black/10 bg-white p-7 shadow-[0_18px_55px_rgba(20,16,10,.08)]">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#6d8cff]">Support</p>
            <h3 className="mt-4 text-3xl font-black">Order help</h3>
            <p className="mt-4 leading-7 text-black/58">Use the contact page with your checkout email if delivery help is needed.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
