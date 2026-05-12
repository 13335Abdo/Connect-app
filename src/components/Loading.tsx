export default function Loading() {
  return (
    <div className="flex flex-col items-center h-lvh justify-center gap-4 py-12">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-blue-500 border-r-purple-500 animate-spin" />
        <div className="absolute top-1.75 left-1.75 w-9 h-9 rounded-full border-2 border-transparent border-b-cyan-500 animate-[spin_0.7s_linear_infinite_reverse]" />
      </div>
      <p className="text-sm text-muted-foreground tracking-widest animate-pulse">
        Loading...
      </p>
    </div>
  );
}