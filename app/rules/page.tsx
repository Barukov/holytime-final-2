import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f4f6fb] text-[#101014]">
      <header className="bg-[#101014] px-6 py-7 text-white md:px-8"><div className="mx-auto flex max-w-7xl items-center justify-between"><Link href="/" className="text-2xl font-black md:text-3xl">DevShelf Academy</Link><Link href="/" className="rounded-full bg-[#c8ff4d] px-6 py-3 font-black text-black">Back home</Link></div></header>
      <section className="mx-auto max-w-5xl px-6 py-20 md:px-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(22,19,15,.08)] md:p-10">
          <p className="font-black uppercase tracking-[0.28em] text-[#6d8cff]">DevShelf Academy</p>
          <h1 className="mt-4 text-5xl font-black md:text-6xl">Store Rules</h1>
          <p className="mt-5 text-black/55">Last updated: July 1, 2026</p>
          <div className="mt-10 space-y-7 text-lg leading-8 text-black/65">
<section><h2 className="text-2xl font-black text-[#101014]">Store rules</h2><p className="mt-2">Use a correct delivery email, keep your download link private, do not resell or redistribute purchased files, and contact support if delivery or payment issues occur.</p></section>
<section><h2 className="text-2xl font-black text-[#101014]">Product access</h2><p className="mt-2">Purchased files are intended for personal learning use. Sharing download links publicly may result in access restrictions and refund refusal.</p></section></div>
          <div className="mt-10 flex flex-wrap gap-4"><Link href="/terms" className="rounded-2xl bg-[#f4f6fb] px-6 py-3 font-black">Terms</Link><Link href="/privacy" className="rounded-2xl bg-[#f4f6fb] px-6 py-3 font-black">Privacy</Link><Link href="/refund-policy" className="rounded-2xl bg-[#f4f6fb] px-6 py-3 font-black">Refunds</Link><Link href="/contact" className="rounded-2xl bg-[#101014] px-6 py-3 font-black text-white">Contact</Link></div>
        </div>
      </section>
    </main>
  );
}
