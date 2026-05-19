import GEtAllBookMark from "../components/GEtAllBookMark";

export default function MyProfile() {
  return (
    <main className="mx-auto w-full max-w-2xl px-3 py-5 sm:px-4">
      <section className="mb-4 rounded-2xl border border-white/80 bg-white p-5 shadow-sm shadow-slate-200/80">
        <p className="text-xs font-bold uppercase tracking-wide text-blue-600">My profile</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Saved posts</h1>
        <p className="mt-1 text-sm text-slate-500">A cleaner view of the posts you bookmarked.</p>
      </section>
      <GEtAllBookMark/>
    </main>
  )
}
