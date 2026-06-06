import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { LandingNav } from "@/components/landing-nav";
import { APP_NAME } from "@/lib/constants";
import { formatCurrencyUGX } from "@/lib/format";

const packages = [
  {
    key: "standard",
    label: "Standard",
    summary: "Without auto number plate recognition",
    setupLabel: "Setup",
    setupFee: 300000,
    monthlyFee: 80000,
    description:
      "Built for businesses that want clear parking records, staff accountability, and payment tracking without hardware setup.",
  },
  {
    key: "auto",
    label: "Pro",
    summary: "With auto number plate recognition",
    setupLabel: "Setup starts from",
    setupFee: 2500000,
    monthlyFee: 200000,
    description:
      "Built for busier businesses that want a more automated capture flow with camera hardware and a stronger control point at entry.",
  },
];

const howItWorksSteps = [
  {
    number: "01",
    title: "Record vehicle entry",
    body: "Staff can add a vehicle quickly and send an SMS confirmation at the point of entry.",
  },
  {
    number: "02",
    title: "Track active cars",
    body: "The dashboard shows which cars are still inside and how long each one has stayed in parking.",
  },
  {
    number: "03",
    title: "Checkout and send receipt",
    body: "At exit, ParkControl calculates the total, marks payment, and can send an SMS receipt to the customer.",
  },
  {
    number: "04",
    title: "Monitor owner reporting",
    body: "Owners can review completed payments, staff activity, and daily parking revenue from one dashboard.",
  },
];

const problemCards = [
  {
    title: "Cars may not be recorded properly",
    body: "Some vehicle entries are missed or written inconsistently.",
  },
  {
    title: "Daily collections are hard to verify",
    body: "It is harder to match expected parking income with collected cash.",
  },
  {
    title: "Paper receipts can get lost or duplicated",
    body: "Receipt records are easy to lose, repeat, or dispute.",
  },
  {
    title: "Owners cannot monitor activity remotely",
    body: "It is harder to know what is happening when the owner is away.",
  },
  {
    title: "Manual fee calculations can lead to mistakes",
    body: "Hand calculations can create avoidable checkout errors.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background pb-24 text-foreground sm:pb-0">
      <header className="sticky top-0 z-40 border-b border-line bg-[#f6f7f3]/96 shadow-[0_8px_24px_rgba(31,41,55,0.06)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <BrandLogo />
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold tracking-tight text-foreground">
                {APP_NAME}
              </p>
              <p className="hidden text-sm text-foreground/56 sm:block">
                Parking records and payment tracking
              </p>
            </div>
          </Link>

          <LandingNav />

          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href="/staff"
              className="inline-flex items-center justify-center rounded-full border border-foreground bg-foreground px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#17202c]"
            >
              Try It Out
            </Link>
            <Link
              href="/waitlist"
              className="inline-flex items-center justify-center rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold text-foreground hover:border-accent hover:text-accent"
            >
              Join Waitlist
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-line">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
            <div className="space-y-8">
              <div className="space-y-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                  Built for parking business owners
                </p>
                <h2 className="max-w-5xl text-3xl font-semibold leading-tight tracking-[-0.05em] text-foreground sm:text-5xl lg:text-5xl">
                  Take control of your parking records and daily revenue
                </h2>
                <p className="max-w-3xl text-base leading-8 text-foreground/70 sm:text-lg">
                  ParkControl helps parking businesses track vehicles, payments,
                  staff activity, and daily revenue from a simple dashboard.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/staff"
                  className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-white hover:bg-[#17202c]"
                >
                  Try It Out
                </Link>
                <Link
                  href="/waitlist"
                  className="inline-flex items-center justify-center rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold text-foreground hover:border-accent hover:text-accent"
                >
                  Join Waitlist
                </Link>
              </div>
            </div>

          </div>
        </section>

        <section className="border-b border-line">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                How it works
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
                A simple parking flow from entry to owner reporting.
              </h2>
              <p className="mt-4 text-sm leading-7 text-foreground/66 sm:text-base">
                ParkControl is designed to help staff operate parking more consistently while giving owners a clearer view of activity and collections.
              </p>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-4">
              {howItWorksSteps.map((step) => (
                <article
                  key={step.number}
                  className="rounded-[1.5rem] border border-line bg-white px-5 py-6 shadow-[0_12px_30px_rgba(31,41,55,0.04)] sm:px-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                      Step {step.number}
                    </span>
                    <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-line bg-surface px-2 text-xs font-semibold text-foreground/58">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-foreground/64">
                    {step.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-line">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
              <div className="rounded-[1.8rem] border border-foreground bg-foreground px-6 py-7 text-white sm:px-7">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/58">
                  Why ParkControl
                </p>
                <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] sm:text-4xl">
                  Know what is happening even when you are not there
                </h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-white/76 sm:text-base">
                  ParkControl helps owners track cars, payments, and daily parking activity more clearly.
                </p>

                <div className="mt-8 space-y-3 border-t border-white/10 pt-5">
                  <div className="flex items-center justify-between text-sm text-white/72">
                    <span>Vehicle records</span>
                    <span>Clearer</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-white/72">
                    <span>Payment tracking</span>
                    <span>Stronger</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-white/72">
                    <span>Owner visibility</span>
                    <span>Remote</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {problemCards.map((item, index) => (
                  <article
                    key={item.title}
                    className={`rounded-[1.5rem] border border-line bg-white px-5 py-5 shadow-[0_12px_30px_rgba(31,41,55,0.04)] sm:px-6 ${
                      index === problemCards.length - 1 ? "sm:col-span-2" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="max-w-xs text-lg font-semibold tracking-tight text-foreground">
                        {item.title}
                      </h3>
                      <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-line bg-surface px-2 text-xs font-semibold text-foreground/58">
                        0{index + 1}
                      </span>
                    </div>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-foreground/64">
                      {item.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-line bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                Price Packages
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
                Choose the setup that fits how your parking business operates.
              </h2>
              </div>
            </div>

            <div className="mt-8 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
              {packages.map((item) => {
                const isPro = item.key === "auto";

                return (
                  <article
                    key={item.key}
                    className={`rounded-[1.9rem] border ${
                      isPro
                        ? "border-foreground bg-foreground text-white shadow-[0_22px_45px_rgba(31,41,55,0.14)]"
                        : "border-line bg-[#f7f8f5] text-foreground shadow-[0_16px_34px_rgba(31,41,55,0.06)]"
                    }`}
                  >
                    <div className="border-b border-current/10 px-6 py-6 sm:px-7">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p
                            className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                              isPro ? "text-white/58" : "text-accent"
                            }`}
                          >
                            {item.label}
                          </p>
                          <h3 className="mt-3 text-3xl font-semibold tracking-tight sm:text-[2rem]">
                            {item.summary}
                          </h3>
                        </div>
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                            isPro
                              ? "border-white/14 bg-white/8 text-white/74"
                              : "border-line bg-white text-foreground/62"
                          }`}
                        >
                          {isPro ? "Camera based" : "Software only"}
                        </span>
                      </div>
                      <p
                        className={`mt-4 max-w-xl text-sm leading-7 ${
                          isPro ? "text-white/76" : "text-foreground/66"
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>

                    <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 sm:px-7">
                      <div
                        className={`rounded-[1.35rem] border px-5 py-5 ${
                          isPro
                            ? "border-white/12 bg-white/6"
                            : "border-line bg-white"
                        }`}
                      >
                        <p
                          className={`text-sm ${
                            isPro ? "text-white/62" : "text-foreground/52"
                          }`}
                        >
                          {isPro ? "Setup starts from" : "Setup"}
                        </p>
                        <p className="mt-3 text-3xl font-semibold tracking-tight">
                          {formatCurrencyUGX(item.setupFee)}
                        </p>
                      </div>

                      <div
                        className={`rounded-[1.35rem] border px-5 py-5 ${
                          isPro
                            ? "border-white/12 bg-white/6"
                            : "border-line bg-white"
                        }`}
                      >
                        <p
                          className={`text-sm ${
                            isPro ? "text-white/62" : "text-foreground/52"
                          }`}
                        >
                          Monthly subscription
                        </p>
                        <p className="mt-3 text-3xl font-semibold tracking-tight">
                          {formatCurrencyUGX(item.monthlyFee)}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-foreground/58 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p className="font-medium text-foreground">{APP_NAME}</p>
          <p>Parking records and payment tracking</p>
          <p>A Rompact product</p>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-[#f6f7f3]/96 p-3 shadow-[0_-10px_24px_rgba(31,41,55,0.08)] backdrop-blur-xl sm:hidden">
        <Link
          href="/waitlist"
          className="inline-flex w-full items-center justify-center rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-white hover:bg-[#17202c]"
        >
          Join Waitlist
        </Link>
      </div>
    </div>
  );
}
