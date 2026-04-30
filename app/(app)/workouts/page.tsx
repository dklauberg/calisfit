import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default async function WorkoutsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const workouts = await prisma.workout.findMany({
    include: {
      _count: { select: { blocks: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-white pb-24">
      <header className="sticky top-0 bg-brand-black z-30 px-4 py-4">
        <h1 className="text-white font-black uppercase text-xl tracking-tight">
          CALIS<span className="text-brand-yellow">FIT</span>
        </h1>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <h2 className="font-black uppercase text-2xl tracking-tight text-brand-black">Workouts</h2>

        {workouts.map((w) => (
          <Link
            key={w.id}
            href={`/workouts/${w.id}`}
            className="block card-black rounded-2xl p-5 hover:opacity-90 transition-opacity"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-brand-yellow text-xs uppercase font-bold mb-1">
                  {w.level} · {w.category}
                </p>
                <h3 className="text-white font-black uppercase text-lg leading-tight">{w.title}</h3>
                {w.description && (
                  <p className="text-white/50 text-sm mt-1 line-clamp-2">{w.description}</p>
                )}
              </div>
              <span className="shrink-0 bg-brand-yellow text-brand-black text-xs font-bold px-2 py-1 rounded-full">
                {w._count.blocks} ex
              </span>
            </div>
            <div className="flex gap-4 mt-3 text-white/40 text-xs">
              <span>🔥 {w.warmupMinutes}min warmup</span>
              <span>❄️ {w.cooldownMinutes}min cooldown</span>
            </div>
          </Link>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
