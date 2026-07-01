import Link from "next/link";
import { products } from "../lib/products";

const columns = ["Pack", "Best for", "Includes", "Price", "Action"];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f7f2e8] text-[#14100a]">
      <header className="border-b border-black/10 bg-[#0d1117] px-5 py-6 text-white md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-black md:text-2xl">DevShelf Academy</Link>
          <Link href="/" className="rounded-full bg-[#f5c84b] px-5 py-3 text-sm font-black text-[#14100a]">Back home</Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#087f72]">Pricing board</p>
            <h1 className="mt-3 text-5xl font-black leading-tight md:text-7xl">Compare the digital packs.</h1>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-black/60">All items are downloadable digital products sold through devshelf.company. Choose a focused pack or open the complete library if you want every included resource.</p>
        </div>

        <div className="mt-12 overflow-hidden border border-black/10 bg-white shadow-[0_20px_70px_rgba(20,16,10,.08)]">
          <div className="hidden grid-cols-[1.2fr_1.1fr_1.4fr_.55fr_.75fr] bg-[#0d1117] text-sm font-black uppercase tracking-[0.16em] text-white/66 lg:grid">
            {columns.map((column) => <div key={column} className="px-5 py-4">{column}</div>)}
          </div>

          <div className="divide-y divide-black/10">
            {products.map((product) => (
              <div key={product.slug} className="grid gap-4 px-5 py-6 transition hover:bg-[#fff9e8] lg:grid-cols-[1.2fr_1.1fr_1.4fr_.55fr_.75fr] lg:items-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#087f72]">{product.tag}</p>
                  <h2 className="mt-2 text-2xl font-black">{product.name}</h2>
                </div>
                <p className="leading-7 text-black/62">{product.shortDescription}</p>
                <div className="flex flex-wrap gap-2">
                  {product.includes.slice(0, 3).map((item) => (
                    <span key={item} className="border border-black/10 bg-[#f7f2e8] px-3 py-2 text-xs font-bold">{item}</span>
                  ))}
                </div>
                <p className="text-2xl font-black">{product.price}</p>
                <Link href={"/product/" + product.slug} className="inline-flex justify-center rounded-full bg-[#14100a] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5">Open</Link>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="border border-black/10 bg-white p-6">
            <p className="text-3xl font-black">Digital only</p>
            <p className="mt-3 leading-7 text-black/58">No postal shipping. Delivery is handled by email after payment confirmation.</p>
          </div>
          <div className="border border-black/10 bg-white p-6">
            <p className="text-3xl font-black">Secure checkout</p>
            <p className="mt-3 leading-7 text-black/58">Payments are processed by Paddle using supported payment methods.</p>
          </div>
          <div className="border border-black/10 bg-white p-6">
            <p className="text-3xl font-black">Support ready</p>
            <p className="mt-3 leading-7 text-black/58">Use the contact page with your checkout email if delivery help is needed.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
