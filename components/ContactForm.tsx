"use client";

import { type FormEvent, useState } from "react";

const CONTACT_EMAIL = "hello@maincharacter.one";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [brief, setBrief] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      name.trim()
        ? `Project inquiry — ${name.trim()}`
        : "Project inquiry — Main Character"
    );
    const body = encodeURIComponent(
      [
        name.trim() && `Name: ${name.trim()}`,
        email.trim() && `Email: ${email.trim()}`,
        "",
        brief.trim() || "Project brief:",
      ]
        .filter(Boolean)
        .join("\n")
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mt-10 grid max-w-xl gap-4"
      noValidate
    >
      <label className="grid gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
          Name
        </span>
        <input
          name="name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-line bg-surface px-4 py-3 font-sans text-sm outline-none transition focus-visible:border-ink"
        />
      </label>
      <label className="grid gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
          Email
        </span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-line bg-surface px-4 py-3 font-sans text-sm outline-none transition focus-visible:border-ink"
        />
      </label>
      <label className="grid gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
          What are we building?
        </span>
        <textarea
          name="brief"
          required
          rows={5}
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          className="resize-y border border-line bg-surface px-4 py-3 font-sans text-sm outline-none transition focus-visible:border-ink"
        />
      </label>
      <button
        type="submit"
        className="inline-flex w-fit items-center justify-center border border-ink bg-ink px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-paper transition hover:bg-transparent hover:text-ink"
      >
        Send via email
      </button>
      <p className="text-xs leading-5 text-mute">
        Opens your email app with the message ready for{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="underline underline-offset-4"
        >
          {CONTACT_EMAIL}
        </a>
        . No account or third-party form required.
      </p>
    </form>
  );
}
