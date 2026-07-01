import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f6f4ec] text-[#16130f]">
      <header className="bg-[#11100d] px-6 py-7 text-white md:px-8"><div className="mx-auto flex max-w-7xl items-center justify-between"><Link href="/" className="text-2xl font-black md:text-3xl">DevShelf Academy</Link><Link href="/" className="rounded-full bg-[#d6ff5f] px-6 py-3 font-black text-black">Back home</Link></div></header>
      <section className="mx-auto max-w-5xl px-6 py-20 md:px-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(22,19,15,.08)] md:p-10">
          <p className="font-black uppercase tracking-[0.28em] text-[#607000]">DevShelf Academy</p>
          <h1 className="mt-4 text-5xl font-black md:text-6xl">Terms and Conditions</h1>
          <p className="mt-5 text-black/55">Last updated: July 1, 2026</p>
          <div className="mt-10 space-y-7 text-lg leading-8 text-black/65">
<section><h2 className="text-2xl font-black text-[#16130f]">1. Website and business</h2><p className="mt-2">These Terms and Conditions govern the DevShelf Academy website at https://devshelf.company/ and all digital products offered through this website.</p></section>
<section><h2 className="text-2xl font-black text-[#16130f]">2. Digital products</h2><p className="mt-2">DevShelf Academy sells downloadable digital study materials, including PDF files, course-style resources, worksheets, notes, exercises, templates and related digital resources. No physical goods are shipped.</p></section>
<section><h2 className="text-2xl font-black text-[#16130f]">3. Pricing and checkout</h2><p className="mt-2">Prices are displayed before checkout. Customers are responsible for reviewing the selected product, price and delivery email before completing payment.</p></section>
<section><h2 className="text-2xl font-black text-[#16130f]">4. Payment processing</h2><p className="mt-2">Payments are processed securely by Paddle or another approved payment provider. DevShelf Academy does not store full card numbers or sensitive payment credentials on this website.</p></section>
<section><h2 className="text-2xl font-black text-[#16130f]">5. Delivery</h2><p className="mt-2">Digital products are delivered by email after successful payment confirmation. If delivery fails, contact support@devshelf.company with your checkout email and transaction details.</p></section>
<section><h2 className="text-2xl font-black text-[#16130f]">6. License</h2><p className="mt-2">Purchased files are licensed for personal study use only. Customers may not resell, redistribute, upload, publicly share or make purchased files available to third parties.</p></section>
<section><h2 className="text-2xl font-black text-[#16130f]">7. Educational use</h2><p className="mt-2">Materials are provided for general educational and informational purposes. They are not legal, financial, tax, medical or professional advice.</p></section>
<section><h2 className="text-2xl font-black text-[#16130f]">8. Support</h2><p className="mt-2">For product access, delivery, refund or order questions, contact support@devshelf.company or use the Contact page.</p></section></div>
          <div className="mt-10 flex flex-wrap gap-4"><Link href="/terms" className="rounded-2xl bg-[#f6f4ec] px-6 py-3 font-black">Terms</Link><Link href="/privacy" className="rounded-2xl bg-[#f6f4ec] px-6 py-3 font-black">Privacy</Link><Link href="/refund-policy" className="rounded-2xl bg-[#f6f4ec] px-6 py-3 font-black">Refunds</Link><Link href="/contact" className="rounded-2xl bg-[#11100d] px-6 py-3 font-black text-white">Contact</Link></div>
        </div>
      </section>
    </main>
  );
}
