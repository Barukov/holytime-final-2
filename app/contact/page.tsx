"use client";

import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const form = e.target;
    await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name.value, email: form.email.value, message: form.message.value }) });
    setSent(true);
    form.reset();
  };

  return (
    <main className="min-h-screen bg-[#f6f4ec] text-[#16130f]">
      <header className="bg-[#11100d] px-6 py-7 text-white md:px-8"><div className="mx-auto flex max-w-7xl items-center justify-between"><Link href="/" className="text-2xl font-black md:text-3xl">DevShelf Academy</Link><Link href="/" className="rounded-full bg-[#d6ff5f] px-6 py-3 font-black text-black">Back home</Link></div></header>
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div><p className="font-black uppercase tracking-[0.28em] text-[#607000]">Support</p><h1 className="mt-4 text-6xl font-black leading-tight">Contact DevShelf</h1><p className="mt-6 text-lg leading-8 text-black/60">Questions about delivery, payment, refunds or a digital pack? Send a message and include your checkout email.</p><div className="mt-10 rounded-[1.5rem] bg-white p-7 shadow-sm"><p className="text-sm font-black uppercase tracking-[0.2em] text-[#607000]">Email</p><p className="mt-3 text-2xl font-black">support@devshelf.company</p></div><div className="mt-6 rounded-[1.5rem] bg-white p-7 shadow-sm"><p className="text-sm font-black uppercase tracking-[0.2em] text-[#607000]">Response time</p><p className="mt-3 text-2xl font-black">24-48 hours</p></div></div>
        <form onSubmit={handleSubmit} className="rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(22,19,15,.08)]"><h2 className="text-4xl font-black">Send a message</h2>{sent && <p className="mt-5 rounded-xl bg-green-100 px-5 py-4 font-bold text-green-700">Message sent successfully</p>}<div className="mt-8 space-y-5"><input name="name" placeholder="Your name" required className="w-full rounded-xl border border-black/15 px-5 py-4 outline-none focus:border-[#11100d]" /><input name="email" type="email" placeholder="Your email" required className="w-full rounded-xl border border-black/15 px-5 py-4 outline-none focus:border-[#11100d]" /><textarea name="message" placeholder="Your message" rows={7} required className="w-full rounded-xl border border-black/15 px-5 py-4 outline-none focus:border-[#11100d]" /><button type="submit" className="w-full rounded-2xl bg-[#11100d] px-8 py-4 font-black text-white transition hover:scale-[1.02]">Send message</button></div></form>
      </section>
    </main>
  );
}
