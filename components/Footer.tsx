export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="print:hidden mt-auto border-t border-black/10 dark:border-white/15">
      <div className="mx-auto max-w-4xl px-6 py-6 text-sm text-black/60 dark:text-white/60">
        <p>&copy; {year} Riverside Ward. Built with Next.js for WDD 430.</p>
      </div>
    </footer>
  );
}
