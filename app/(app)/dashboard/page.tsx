import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import WorkoutCalendar from "@/components/WorkoutCalendar";
import DeleteLogButton from "@/components/DeleteLogButton";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [recentLogs, workouts, allCompletedLogs] = await Promise.all([
    prisma.workoutLog.findMany({
      where: { userId: session.user.id },
      include: {
        workout: { select: { id: true, title: true } },
        setLogs: { where: { done: true } },
      },
      orderBy: { startedAt: "desc" },
      take: 5,
    }),
    prisma.workout.findMany({
      include: { _count: { select: { blocks: true } } },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.workoutLog.findMany({
      where: { userId: session.user.id, finishedAt: { not: null } },
      select: { finishedAt: true },
    }),
  ]);

  const totalWorkouts = allCompletedLogs.length;

  // Convert finished dates to "YYYY-MM-DD" strings
  const completedDates = allCompletedLogs.map((log) => {
    const d = log.finishedAt!;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });

  function formatDate(d: Date) {
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(d);
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="bg-brand-black px-4 pt-6 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-white font-black uppercase text-2xl tracking-tight">
              CALIS<span className="text-brand-yellow">FIT</span>
            </h1>
            <div className="w-9 h-9 rounded-full bg-brand-yellow flex items-center justify-center">
              <span className="text-brand-black font-black text-sm">
                {(session.user.name ?? session.user.email ?? "U")[0].toUpperCase()}
              </span>
            </div>
          </div>
          <p className="text-white/50 text-sm">Bem-vindo de volta,</p>
          <p className="text-white font-black text-xl">
            {session.user.name ?? session.user.email}
          </p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 -mt-4 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="card-black rounded-2xl p-4">
            <p className="text-white/50 text-xs uppercase font-bold">Treinos feitos</p>
            <p className="text-brand-yellow font-black text-3xl mt-1">{totalWorkouts}</p>
          </div>
          <div className="card-black rounded-2xl p-4">
            <p className="text-white/50 text-xs uppercase font-bold">Em andamento</p>
            <p className="text-white font-black text-3xl mt-1">
              {recentLogs.filter((l) => !l.finishedAt).length}
            </p>
          </div>
        </div>

        {/* Calendar */}
        <WorkoutCalendar completedDates={completedDates} />

        {/* Quick start */}
        <div>
          <h2 className="font-black uppercase text-brand-black text-base tracking-tight mb-3">
            Começar treino
          </h2>
          <div className="space-y-2">
            {workouts.map((w) => (
              <Link
                key={w.id}
                href={`/workouts/${w.id}`}
                className="flex items-center gap-4 card-black rounded-2xl p-4 hover:opacity-90 transition-opacity"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-yellow flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-brand-black" fill="currentColor" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold uppercase text-sm truncate">{w.title}</p>
                  <p className="text-white/40 text-xs">{w._count.blocks} exercícios</p>
                </div>
                <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            ))}
            <Link
              href="/workouts"
              className="flex items-center justify-center gap-2 border border-brand-black/10 rounded-2xl p-3 text-brand-black/60 text-sm font-bold hover:border-brand-black/30 transition-colors"
            >
              Ver todos os treinos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Recent activity */}
        {recentLogs.length > 0 && (
          <div>
            <h2 className="font-black uppercase text-brand-black text-base tracking-tight mb-3">
              Atividade recente
            </h2>
            <div className="space-y-2">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4">
                  <div
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      log.finishedAt ? "bg-green-400" : "bg-brand-yellow"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-brand-black truncate">
                      {log.workout.title}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {formatDate(log.startedAt)} ·{" "}
                      {log.finishedAt ? "Concluído" : "Em andamento"} ·{" "}
                      {log.setLogs.length} séries feitas
                    </p>
                  </div>
                  {!log.finishedAt && (
                    <div className="flex gap-2 shrink-0">
                      <Link
                        href={`/workouts/${log.workout.id}`}
                        className="btn-yellow text-xs py-1.5 px-3"
                      >
                        Continuar
                      </Link>
                      <DeleteLogButton logId={log.id} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
