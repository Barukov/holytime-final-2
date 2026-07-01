import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f4f6fb] text-[#101014]">
      <header className="bg-[#101014] px-6 py-7 text-white md:px-8"><div className="mx-auto flex max-w-7xl items-center justify-between"><Link href="/" className="text-2xl font-black md:text-3xl">DevShelf Academy</Link><Link href="/" className="rounded-full bg-[#c8ff4d] px-6 py-3 font-black text-black">Back home</Link></div></header>
      <section className="mx-auto max-w-5xl px-6 py-20 md:px-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(22,19,15,.08)] md:p-10">
          <p className="font-black uppercase tracking-[0.28em] text-[#6d8cff]">DevShelf Academy</p>
          <h1 className="mt-4 text-5xl font-black md:text-6xl">Privacy Policy</h1>
          <p className="mt-5 text-black/55">Last updated: July 1, 2026</p>
          <div className="mt-10 space-y-7 text-lg leading-8 text-black/65">
<section><h2 className="text-2xl font-black text-[#101014]">Information we collect</h2><p className="mt-2">We collect the email address used at checkout, order details, product delivery information, support messages and basic technical/security information needed to operate the website and prevent fraud.</p></section>
<section><h2 className="text-2xl font-black text-[#101014]">How we use information</h2><p className="mt-2">Information is used to process orders, deliver digital files, provide support, handle refunds, prevent abuse and comply with payment, tax, accounting and legal requirements.</p></section>
<section><h2 className="text-2xl font-black text-[#101014]">Payments</h2><p className="mt-2">Payments are processed by Paddle or another approved provider. We do not store full card numbers, bank authentication details or sensitive payment credentials.</p></section>
<section><h2 className="text-2xl font-black text-[#101014]">Sharing</h2><p className="mt-2">We do not sell personal information. We only share information with service providers needed for payment processing, email delivery, hosting, support, fraud prevention and compliance.</p></section>
<section><h2 className="text-2xl font-black text-[#101014]">Retention and requests</h2><p className="mt-2">Order and support records are retained as needed for delivery, refunds, accounting, fraud prevention and legal compliance. Contact support@devshelf.company for privacy questions.</p></section></div>
          <div className="mt-10 flex flex-wrap gap-4"><Link href="/terms" className="rounded-2xl bg-[#f4f6fb] px-6 py-3 font-black">Terms</Link><Link href="/privacy" className="rounded-2xl bg-[#f4f6fb] px-6 py-3 font-black">Privacy</Link><Link href="/refund-policy" className="rounded-2xl bg-[#f4f6fb] px-6 py-3 font-black">Refunds</Link><Link href="/contact" className="rounded-2xl bg-[#101014] px-6 py-3 font-black text-white">Contact</Link></div>
        </div>
      </section>
    </main>
  );
}
