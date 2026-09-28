import type { CSSProperties } from "react";
import heroImg from "../assets/raw/hero.jpg";

const d = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export default function Hero() {
  return (
    <section aria-label="Featured collection" className="relative overflow-hidden bg-[#e6e5e3]">
      <img
        src={heroImg}
        alt="Young man in a white sweatshirt, brown chinos and a rust cap sitting on a bench"
        className="animate-slow-zoom absolute inset-0 h-full w-full object-cover object-[22%_center] md:object-left"
        fetchPriority="high"
      />
      {/* soft wash to keep copy legible on narrow screens */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-white/70 md:hidden" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-[460px] max-w-[1230px] items-center justify-end px-[15px] sm:min-h-[540px] md:min-h-[600px] lg:min-h-[760px] xl:min-h-[810px]">
        <div className="w-[62%] text-center sm:w-[55%] md:w-1/2 md:pr-[2%] lg:pr-[4%]">
          <div className="animate-fade-up flex items-center justify-center gap-4 md:gap-[30px]" style={d(200)}>
            <span className="animate-line h-[2px] w-8 origin-right bg-ink sm:w-12 lg:w-[80px]" style={d(500)} />
            <p className="text-[16px] font-medium text-ink sm:text-[20px] lg:text-[24px]">Stylish</p>
            <span className="animate-line h-[2px] w-8 origin-left bg-ink sm:w-12 lg:w-[80px]" style={d(500)} />
          </div>
          <h1
            className="animate-fade-up mt-2 text-[34px] font-normal leading-[1.15] text-ink sm:text-[48px] md:text-[56px] lg:mt-3 lg:text-[72px]"
            style={d(350)}
          >
            Male Clothes
          </h1>
          <p className="animate-fade-up mt-2 text-[13px] font-medium text-body sm:text-[15px] lg:mt-4 lg:text-[18px]" style={d(500)}>
            30% off Summer Vacation
          </p>
          <div className="animate-fade-up mt-6 lg:mt-[52px]" style={d(650)}>
            <a
              href="#new-arrival"
              className="group relative inline-block overflow-hidden border border-ink px-6 py-2.5 text-[12px] font-medium uppercase text-ink transition-colors duration-500 hover:text-white sm:text-[14px] lg:px-[43px] lg:py-[18px] lg:text-[16px]"
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
              <span className="relative">Shop Now</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
