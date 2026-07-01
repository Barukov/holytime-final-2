import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f4f6fb] text-[#101014]">
      <header className="bg-[#101014] px-6 py-7 text-white md:px-8"><div className="mx-auto flex max-w-7xl items-center justify-between"><Link href="/" className="text-2xl font-black md:text-3xl">DevShelf Academy</Link><Link href="/" className="rounded-full bg-[#c8ff4d] px-6 py-3 font-black text-black">Back home</Link></div></header>
      <section className="mx-auto max-w-5xl px-6 py-20 md:px-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(22,19,15,.08)] md:p-10">
          <p className="font-black uppercase tracking-[0.28em] text-[#6d8cff]">DevShelf Academy</p>
          <h1 className="mt-4 text-5xl font-black md:text-6xl">Delivery Policy</h1>
          <p className="mt-5 text-black/55">Last updated: July 1, 2026</p>
          <div className="mt-10 space-y-7 text-lg leading-8 text-black/65">
<section><h2 className="text-2xl font-black text-[#101014]">Digital delivery only</h2><p className="mt-2">All DevShelf Academy products are digital downloads. No physical product is shipped.</p></section>
<section><h2 className="text-2xl font-black text-[#101014]">Delivery method</h2><p className="mt-2">After successful payment confirmation through Paddle, a download link is sent to the email entered during checkout.</p></section>
<section><h2 className="text-2xl font-black text-[#101014]">Delivery timing</h2><p className="mt-2">Delivery is normally automatic and immediate after payment confirmation. Email provider delays or spam filtering may affect receipt time.</p></section>
<section><h2 className="text-2xl font-black text-[#101014]">Delivery support</h2><p className="mt-2">If you do not receive your product, contact support@devshelf.company with your checkout email and payment details.</p></section></div>
          <div className="mt-10 flex flex-wrap gap-4"><Link href="/terms" className="rounded-2xl bg-[#f4f6fb] px-6 py-3 font-black">Terms</Link><Link href="/privacy" className="rounded-2xl bg-[#f4f6fb] px-6 py-3 font-black">Privacy</Link><Link href="/refund-policy" className="rounded-2xl bg-[#f4f6fb] px-6 py-3 font-black">Refunds</Link><Link href="/contact" className="rounded-2xl bg-[#101014] px-6 py-3 font-black text-white">Contact</Link></div>
        </div>
      </section>
    </main>
  );
}
