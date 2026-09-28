import Reveal from "./Reveal";
import { MoneyReturnIcon, Support24Icon, TruckFreeIcon } from "./Icons";

const FEATURES = [
  { title: "Free Shipping", Icon: TruckFreeIcon },
  { title: "Support 24/7", Icon: Support24Icon },
  { title: "Money Return", Icon: MoneyReturnIcon },
];

export default function Features() {
  return (
    <section aria-label="Store benefits" className="pt-[70px] pb-[40px] lg:pt-[100px] lg:pb-[55px]">
      <div className="mx-auto max-w-[1230px] px-[15px]">
        <ul className="grid gap-10 sm:grid-cols-3 sm:gap-0">
          {FEATURES.map(({ title, Icon }, i) => (
            <Reveal
              as="li"
              key={title}
              delay={i * 120}
              className={`group px-6 text-center lg:px-12 ${i > 0 ? "sm:border-l sm:border-line" : ""}`}
            >
              <div className="mx-auto grid h-[50px] w-[50px] place-items-center text-ink transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:text-accent">
                <Icon className="h-[46px] w-[46px]" />
              </div>
              <h3 className="mt-2 text-[16px] font-normal text-body transition-colors group-hover:text-accent lg:text-[18px]">{title}</h3>
              <p className="mx-auto mt-3 max-w-[290px] text-[13px] leading-[26px] text-muted lg:text-[14px]">
                Lorem ipsum dolor sit amet consectetu adipisicing elit sed
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
