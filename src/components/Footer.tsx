import { useState, type FormEvent } from "react";
import Reveal from "./Reveal";

const COLS = [
  { title: "About Us", links: ["About us", "Store location", "Contact", "Orders tracking"] },
  { title: "Useful Links", links: ["Returns", "Support Policy", "Size guide", "FAQs"] },
  { title: "Follow Us", links: ["Facebook", "Twitter", "Instagram", "Youtube"] },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("ok");
      setEmail("");
    } else {
      setStatus("err");
    }
  };

  return (
    <footer className="bg-footer pb-[60px] pt-[70px] lg:pb-[70px] lg:pt-[100px]">
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-x-6 gap-y-10 px-[15px] md:grid-cols-3 lg:grid-cols-[1.25fr_1fr_1fr_1fr_1.6fr] lg:gap-x-[30px]">
        <Reveal className="col-span-2 md:col-span-3 lg:col-span-1 lg:pt-[42px]">
          <a href="#" className="text-[32px] font-bold leading-none tracking-tight text-ink">
            Precious
          </a>
          <p className="mt-4 text-[13px] leading-[1.6] text-muted lg:text-[14px]">
            © 2019 <a href="#" className="hover:text-accent">Precious</a>.
            <br />
            All Rights Reserved
          </p>
        </Reveal>

        {COLS.map((col, i) => (
          <Reveal as="nav" key={col.title} delay={(i + 1) * 90} aria-label={col.title}>
            <h3 className="text-[14px] font-medium uppercase text-ink lg:text-[16px]">{col.title}</h3>
            <ul className="mt-[22px] space-y-[12px]">
              {col.links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="inline-block text-[13px] text-muted transition-all duration-300 hover:translate-x-1.5 hover:text-accent lg:text-[14px]"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}

        <Reveal delay={400} className="col-span-2 md:col-span-3 lg:col-span-1">
          <h3 className="text-[14px] font-medium uppercase text-ink lg:text-[16px]">Subscribe</h3>
          <p className="mt-[22px] text-[13px] leading-[24px] text-muted lg:text-[14px]">
            Get E-mail updates about our latest shop and special offers.
          </p>
          <form onSubmit={submit} className="mt-6" noValidate>
            <label htmlFor="newsletter" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setStatus("idle");
              }}
              placeholder="Enter your email here.."
              className="w-full border-b border-[#ddd] bg-transparent pb-3 text-[13px] text-body outline-none transition-colors placeholder:text-body focus:border-accent lg:text-[14px]"
            />
            <button
              type="submit"
              className="mt-4 border-b-2 border-ink pb-0.5 text-[13px] font-medium uppercase text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Subscribe
            </button>
            <p aria-live="polite" className={`mt-3 min-h-[18px] text-[12px] ${status === "err" ? "text-alert" : "text-accent"}`}>
              {status === "ok" && "Thanks for subscribing!"}
              {status === "err" && "Please enter a valid email address."}
            </p>
          </form>
        </Reveal>
      </div>
    </footer>
  );
}
