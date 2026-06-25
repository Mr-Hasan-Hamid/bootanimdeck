import Link from "next/link";

export function BulkDownloaderHeader() {
  return (
    <section className="relative overflow-hidden bg-neutral-50 dark:bg-black border-b border-neutral-200 dark:border-neutral-900 py-12 md:py-16">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider text-neutral-450 uppercase mb-4">
          <Link href="/" className="hover:text-cyan-500 transition-colors">Gallery</Link>
          <span>/</span>
          <span className="text-neutral-900 dark:text-white font-semibold">Bulk Downloader</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3 text-gradient">
          Bulk Downloader
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl text-xs md:text-sm leading-relaxed">
          Select, package, and download multiple flashable boot sequences simultaneously. Downloads are fetched from the CDN and zipped 100% inside your browser safely.
        </p>
      </div>
    </section>
  );
}
