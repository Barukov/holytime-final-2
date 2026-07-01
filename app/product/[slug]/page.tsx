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

  if (!product) return <main className="min-h-screen bg-[#101014] p-10 text-white">Product not found</main>;

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
    <main className="min-h-screen bg-[#101014] text-[#f4f6fb]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#101014]/92 px-5 py-5 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-black md:text-2xl">DevShelf Academy</Link>
          <Link href="/pricing" className="border border-white/14 px-5 py-3 text-sm font-black text-white transition hover:border-[#6d8cff] hover:text-[#6d8cff]">Pricing</Link>
        </div>
      </header>

      <section className="relative overflow-hidden px-5 py-14 md:px-8 md:py-20">
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_430px]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#6d8cff]">{product.tag} dossier</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.98] md:text-7xl">{product.name}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/64">{product.description}</p>

            <div className="mt-9 grid max-w-3xl gap-4 sm:grid-cols-3">
              <div className="border border-white/10 bg-white/[0.05] p-5">
                <p className="text-3xl font-black">PDF</p>
                <p className="mt-2 text-sm font-bold text-white/45">Digital format</p>
              </div>
              <div className="border border-white/10 bg-white/[0.05] p-5">
                <p className="text-3xl font-black">Email</p>
                <p className="mt-2 text-sm font-bold text-white/45">Delivery method</p>
              </div>
              <div className="border border-white/10 bg-white/[0.05] p-5">
                <p className="text-3xl font-black">Paddle</p>
                <p className="mt-2 text-sm font-bold text-white/45">Secure checkout</p>
              </div>
            </div>

            <div className="mt-10 max-w-4xl border border-white/10 bg-[#101720] p-6 shadow-[0_24px_80px_rgba(0,0,0,.22)]">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c8ff4d]">File preview</p>
                <p className="text-sm font-black text-white/45">Included resources</p>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {product.includes.map((item, index) => (
                  <div key={item} className="include-row border border-white/10 bg-white/[0.04] p-4" style={{ animationDelay: `${index * 90}ms` }}>
                    <p className="text-sm font-black text-[#6d8cff]">{String(index + 1).padStart(2, "0")}</p>
                    <h3 className="mt-3 text-xl font-black">{item}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/48">Part of the downloadable digital package.</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-[#6d8cff]/28 bg-[#f4f6fb] p-6 text-[#101014] shadow-[0_30px_85px_rgba(0,0,0,.34)]">
              <div className="flex items-start justify-between gap-4 border-b border-black/10 pb-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#6d8cff]">Checkout</p>
                  <h2 className="mt-3 text-3xl font-black">{product.name}</h2>
                </div>
                <p className="bg-[#101014] px-4 py-3 text-xl font-black text-white">{product.price}</p>
              </div>

              <label className="mt-6 block">
                <span className="text-sm font-black">Delivery email</span>
                <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="your@email.com" className="mt-2 w-full border border-black/12 bg-white px-4 py-4 text-[#101014] outline-none transition placeholder:text-black/28 focus:border-[#6d8cff]" />
              </label>

              <button onClick={handlePayment} disabled={!canPay || loading} className={"mt-5 w-full px-6 py-4 font-black transition " + (canPay ? "bg-[#101014] text-white hover:-translate-y-1 hover:bg-[#6d8cff]" : "bg-black/10 text-black/35")}>
                {loading ? "Opening checkout..." : canPay ? "Proceed to payment" : "Enter email first"}
              </button>

              <div className="mt-6 grid gap-3 border-t border-black/10 pt-5">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span>Product type</span>
                  <span>Digital</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold">
                  <span>Delivery</span>
                  <span>Email link</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold">
                  <span>Payment</span>
                  <span>Paddle</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-[#f4f6fb] px-5 py-16 text-[#101014] md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#6d8cff]">Product questions</p>
            <h2 className="mt-3 text-5xl font-black">Before you buy</h2>
          </div>
          <div className="space-y-3">
            {faq.map(([question, answer], index) => (
              <div key={question} className="border border-black/10 bg-white shadow-[0_14px_45px_rgba(20,16,10,.06)]">
                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="flex w-full justify-between gap-4 px-6 py-5 text-left text-xl font-black">
                  <span>{question}</span>
                  <span>{openFaq === index ? "Close" : "Open"}</span>
                </button>
                {openFaq === index && <p className="px-6 pb-6 leading-7 text-black/60">{answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/10 bg-white px-5 py-4 text-[#101014] shadow-[0_-18px_50px_rgba(20,16,10,.1)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="font-black">{product.name}</p>
            <p className="text-sm text-black/55">{product.price}</p>
          </div>
          <a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="bg-[#101014] px-6 py-3 text-sm font-black text-white">Buy now</a>
        </div>
      </div>
    </main>
  );
}
