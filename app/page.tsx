import Link from "next/link";
import SearchInput from "./components/SearchInput";

const TRENDING_SEARCHES = ["CELICA", "Skyline GT-R", "SUPRA", "SILVIA"] as const;

const FEATURES = [
  {
    title: "3D Models",
    description:
      "Interactive web gl models to inspect engine bays, chassis, and bodywork.",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path
          d="M12 3L2 8.5v7L12 21l10-5.5v-7L12 3z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M12 12l10-3.5M12 12v9M12 12L2 8.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Detailed Specs",
    description:
      "Factory gear ratios, engine specs, torque curves, and production numbers.",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Maintenance & Marketplace",
    description:
      "Keep track of vehicle logs and find authentic Japanese parts.",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path
          d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
] as const;

export default function Home() {
  return (
    <>
      <section className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-zinc-950/90" />
          <div className="absolute left-1/2 top-1/2 h-[min(45vw,220px)] w-[min(110vw,1260px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/15 blur-[120px]" />
          <div className="absolute left-1/2 top-[38%] h-[min(35vw,4 0px)] w-[min(85vw,920px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-600/10 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        
          <h1 className="mb-10 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            NIGHT RUN
          </h1>

          <SearchInput variant="hero" />

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {TRENDING_SEARCHES.map((tag) => (
              <Link
                key={tag}
                href={`/cars?search=${encodeURIComponent(tag)}`}
                className="rounded-full border border-zinc-800 bg-zinc-900/80 px-3.5 py-1.5 text-sm font-medium text-zinc-400 transition duration-200 hover:border-red-600/40 hover:bg-zinc-800 hover:text-red-400"
              >
                {tag}
              </Link>
            ))}
          </div>

          <p className="mt-10 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Comprehensive technical specifications, interactive 3D models, and
            maintenance logs for legendary Japanese cars. Built for enthusiasts,
            drivers, and builders.
          </p>
        </div>
      </section>

      <section className="border-t border-zinc-900 bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition duration-300 hover:border-red-600/30 hover:bg-zinc-900"
            >
              <div className="mb-4 inline-flex rounded-xl border border-red-600/20 bg-red-950/30 p-3 text-red-500 transition duration-300 group-hover:border-red-600/40 group-hover:bg-red-950/50">
                {feature.icon}
              </div>
              <h2 className="mb-2 text-lg font-bold text-zinc-100">{feature.title}</h2>
              <p className="text-sm leading-relaxed text-zinc-400">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
