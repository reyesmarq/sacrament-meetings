"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden rounded-md border border-black/15 px-4 py-2 text-sm font-medium transition hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:border-white/20 dark:hover:bg-white/10 dark:focus-visible:outline-white"
    >
      Print program
    </button>
  );
}
