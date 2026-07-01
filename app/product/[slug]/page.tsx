"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { productMap } from "../../lib/products";

const faq = [
  ["What do I receive?", "You receive the digital PDF/course pack connected to this product."],
  ["How is it delivered?", "Delivery is sent by email after Paddle confirms the payment."],
  ["Is this a physical product?", "No. DevShelf Academy sells digital files only."],
  ["Can I request help?", "Yes. Contact support with your checkout email and transaction details."],
];

export default function ProductPage() {
  const { slug } = useParams();
  const product = productMap[String(slug)];
  const [email, setEmail] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);

  if (!product) return <main className="min-h-screen bg-[#0d1117] p-10 text-white">Product not found</main>;

  const canPay = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handlePayment = async () => {
    if (!canPay || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, productId: product.slug }),
      });
      const data = await res.json();
      if (!data.checkoutUrl) {
        alert("Payment error");
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error(error);
      alert("Payment error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f2e8] text-[#14100a]">
      <header className="border-b border-white/10 bg-[#0d1117] px-5 py-6 text-white md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-black md:text-2xl">DevShelf Academy</Link>
          <Link href="/pricing" className="rounded-full border border-white/18 px-5 py-3 text-sm font-black text-white">Pricing</Link>
        </div>
      </header>

      <section className="bg-[#0d1117] px-5 py-14 text-white md:px-8 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f5c84b]">{product.tag} dossier</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.98] md:text-7xl">{product.name}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/64">{product.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {product.includes.map((item) => (
                <span key={item} className="border border-white/12 bg-white/[0.06] px-4 py-3 text-sm font-bold text-white/72">{item}</span>
              ))}
            </div>
          </div>

          <aside className="border border-white/12 bg-white/[0.06] p-6 shadow-2xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#86e3d0]">Checkout panel</p>
            <div className="mt-6 border-y border-white/10 py-6">
              <p className="text-sm text-white/55">Selected file pack</p>
              <h2 className="mt-2 text-3xl font-black">{product.name}</h2>
              <p className="mt-4 text-5xl font-black text-[#f5c84b]">{product.price}</p>
            </div>
            <label className="mt-6 block">
              <span className="text-sm font-bold text-white/70">Delivery email</span>
              <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="your@email.com" className="mt-2 w-full border border-white/14 bg-[#0d1117] px-4 py-4 text-white outline-none transition placeholder:text-white/28 focus:border-[#f5c84b]" />
            </label>
            <button onClick={handlePayment} disabled={!canPay || loading} className={"mt-5 w-full rounded-full px-6 py-4 font-black transition " + (canPay ? "bg-[#f5c84b] text-[#14100a] hover:-translate-y-0.5" : "bg-white/10 text-white/35")}>
              {loading ? "Opening checkout..." : canPay ? "Proceed to payment" : "Enter email first"}
            </button>
            <p className="mt-4 text-center text-xs text-white/42">Secure checkout powered by Paddle</p>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 md:px-8 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#087f72]">Inside</p>
          <h2 className="mt-3 text-5xl font-black">What the pack contains</h2>
          <p className="mt-5 leading-8 text-black/60">This product is designed as a replaceable digital pack: the storefront keeps the structure clean while the file content can be updated later.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {product.includes.map((item, index) => (
            <div key={item} className="border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(20,16,10,.08)]">
              <p className="text-4xl font-black text-[#087f72]">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-6 text-2xl font-black">{item}</h3>
              <p className="mt-3 leading-7 text-black/58">Included in the downloadable digital package.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-black/10 bg-white px-5 py-16 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#087f72]">FAQ</p>
            <h2 className="mt-3 text-5xl font-black">Product questions</h2>
          </div>
          <div className="space-y-3">
            {faq.map(([question, answer], index) => (
              <div key={question} className="border border-black/10 bg-[#f7f2e8]">
                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-xl font-black">
                  <span>{question}</span>
                  <span>{openFaq === index ? "Close" : "Open"}</span>
                </button>
                {openFaq === index && <p className="px-6 pb-6 leading-7 text-black/60">{answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/10 bg-white px-5 py-4 shadow-[0_-18px_50px_rgba(20,16,10,.1)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="font-black">{product.name}</p>
            <p className="text-sm text-black/55">{product.price}</p>
          </div>
          <a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-full bg-[#14100a] px-6 py-3 text-sm font-black text-white">Buy now</a>
        </div>
      </div>
    </main>
  );
}
