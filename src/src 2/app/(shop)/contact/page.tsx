"use client";
import { useState } from "react";
import PageShell from "@/components/PageShell";
import { useStore } from "@/lib/store";

export default function Contact() {
  const { state, toast } = useStore();
  const s = state.settings;
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim() || !/^\S+@\S+\.\S+$/.test(f.email) || f.message.trim().length < 10) return toast("Add your name, a valid email and a message of at least 10 characters.", "err");
    setF({ name: "", email: "", message: "" });
    toast("Message received (demo, nothing was sent).");
  };
  return (
    <PageShell title="Contact" intro="We reply within one business day.">
      <div className="grid gap-10 sm:grid-cols-2">
        <form onSubmit={submit} className="space-y-3" noValidate>
          <input className="input" placeholder="Your name" aria-label="Your name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <input className="input" type="email" placeholder="Email" aria-label="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
          <textarea className="input min-h-32" placeholder="How can we help?" aria-label="Message" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
          <button className="btn-lime">Send message</button>
        </form>
        <address className="space-y-2 not-italic">
          <p className="text-bone">{s.address}</p>
          <p><a href={`mailto:${s.email}`}>{s.email}</a></p>
          <p><a href={`tel:${s.phone.replace(/\s/g, "")}`}>{s.phone}</a></p>
          <p className="text-sm text-mute">Mon–Sat, 10am–7pm IST</p>
        </address>
      </div>
    </PageShell>
  );
}
