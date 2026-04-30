import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BottomNav from "@/components/BottomNav";

export default async function ExercisesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const exercises = await prisma.exercise.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="min-h-screen bg-white pb-24">
      <header className="sticky top-0 bg-brand-black z-30 px-4 py-4">
        <h1 className="text-white font-black uppercase text-xl tracking-tight">
          CALIS<span className="text-brand-yellow">FIT</span>
        </h1>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <h2 className="font-black uppercase text-2xl tracking-tight text-brand-black">Exercises</h2>

        <div className="grid gap-3">
          {exercises.map((ex) => (
            <div key={ex.id} className="card-black rounded-2xl p-4 space-y-2">
              <p className="text-white font-black uppercase text-base">{ex.name}</p>
              <div className="flex flex-wrap gap-1.5">
                {ex.primaryMuscles.map((m) => (
                  <span key={m} className="text-xs px-2 py-0.5 rounded-full bg-brand-yellow/20 text-brand-yellow">
                    {m}
                  </span>
                ))}
                {ex.equipment.map((eq) => (
                  <span key={eq} className="text-xs px-2 py-0.5 rounded-full border border-white/20 text-white/50">
                    {eq}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
