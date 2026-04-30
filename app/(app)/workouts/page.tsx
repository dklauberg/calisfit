import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

const LEVEL_CONFIG: Record<string, { label: string; color: string; emoji: string }> = {
  beginner:     { label: "Iniciante",    color: "text-green-400",  emoji: "🌱" },
  intermediate: { label: "Intermediário", color: "text-orange-400", emoji: "🔥" },
  advanced:     { label: "Avançado",     color: "text-red-400",    emoji: "⚡" },
};

const LEVEL_ORDER = ["beginner", "intermediate", "advanced"];

export default async function WorkoutsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const workouts = await prisma.workout.findMany({
    include: { _count: { select: { blocks: true } } },
    orderBy: { createdAt: "asc" },
  });

  const grouped = LEVEL_ORDER.reduce((acc, level) => {
    acc[level] = workouts.filter((w) => w.level === level);
    return acc;
  }, {} as Record<string, typeof workouts>);

  return (
    <div className="min-h-screen bg-white pb-24">
      <header className="sticky top-0 bg-brand-black z-30 px-4 py-4">
        <h1 className="text-white font-black uppercase text-xl tracking-tight">
          CALIS<span className="text-brand-yellow">FIT</span>
        </h1>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        <h2 className="font-black uppercase text-2xl tracking-tight text-brand-black">Workouts</h2>

        {LEVEL_ORDER.map((level) => {
          const list = grouped[level];
          if (!list?.length) return null;
          const cfg = LEVEL_CONFIG[level];

          return (
            <div key={level}>
              {/* Level header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{cfg.emoji}</span>
                <h3 className={`font-black uppercase text-base tracking-wide ${cfg.color}`}>
                  {cfg.label}
                </h3>
                <span className="text-gray-300 text-xs font-bold ml-1">
                  {list.length} treinos
                </span>
              </div>

              <div className="space-y-2">
                {list.map((w, i) => (
                  <Link
                    key={w.id}
                    href={`/workouts/${w.id}`}
                    className="flex items-center gap-4 card-black rounded-2xl p-4 hover:opacity-90 transition-opacity"
                  >
                    <span className="text-white/20 font-black text-lg w-6 shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-black uppercase text-sm leading-tight truncate">
                        {w.title}
                      </h4>
                      {w.description && (
                        <p className="text-white/40 text-xs mt-0.5 line-clamp-1">{w.description}</p>
                      )}
                      <div className="flex gap-3 mt-1 text-white/30 text-xs">
                        <span>🔥 {w.warmupMinutes}min</span>
                        <span>{w._count.blocks} exercícios</span>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-white/30 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
