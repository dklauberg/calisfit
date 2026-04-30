"use client";

import { useState } from "react";
import ExerciseCard from "./ExerciseCard";
import ExerciseInfoDrawer from "./ExerciseInfoDrawer";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Exercise {
  id: string;
  name: string;
  thumbnailUrl: string | null;
  videoUrl: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string[];
  grip: string | null;
  position: string | null;
  steps: string[];
  tutorialVideoUrl: string | null;
}

interface SetData {
  id: string;
  order: number;
  targetReps: string | null;
  targetTimeSec: number | null;
}

interface Block {
  id: string;
  order: number;
  measureType: string;
  exercise: Exercise;
  sets: SetData[];
}

interface ProgramPreviewProps {
  workout: {
    id: string;
    title: string;
    warmupMinutes: number;
    cooldownMinutes: number;
    blocks: Block[];
  };
  logId: string;
  activeBlockOrder: number;
  onSelectBlock: (order: number) => void;
}

export default function ProgramPreview({
  workout,
  logId,
  activeBlockOrder,
  onSelectBlock,
}: ProgramPreviewProps) {
  const router = useRouter();
  const [drawerExercise, setDrawerExercise] = useState<Exercise | null>(null);
  const [ending, setEnding] = useState(false);

  async function handleEndWorkout() {
    setEnding(true);
    try {
      await fetch(`/api/logs/${logId}/finish`, { method: "POST" });
      toast.success("Treino finalizado!");
      router.push("/dashboard");
    } catch {
      toast.error("Erro ao finalizar treino.");
    } finally {
      setEnding(false);
    }
  }

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-brand-black font-black uppercase text-sm tracking-wide">
            Program Preview
          </h2>
          <button className="btn-yellow text-xs py-1.5 px-3">
            Exercise Guide
          </button>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {/* Warm up */}
          <div className="card-black rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/50 text-xs uppercase font-bold tracking-wide mb-0.5">
                  Warm Up
                </p>
                <p className="text-white font-black text-lg">{workout.warmupMinutes} min</p>
              </div>
              <span className="text-2xl">🔥</span>
            </div>
            <p className="text-white/40 text-xs mt-1">
              Boost your performance and make your workout safer.
            </p>
          </div>

          {/* Exercises */}
          {workout.blocks.map((block) => (
            <ExerciseCard
              key={block.id}
              order={block.order}
              exercise={block.exercise}
              sets={block.sets.map((s) => ({
                setId: s.id,
                order: s.order,
                targetReps: s.targetReps,
                targetTimeSec: s.targetTimeSec,
                measureType: block.measureType,
                logId,
              }))}
              measureType={block.measureType}
              isActive={block.order === activeBlockOrder}
              onSelectActive={() => onSelectBlock(block.order)}
              onInfoClick={() => setDrawerExercise(block.exercise)}
              logId={logId}
            />
          ))}

          {/* Cool down */}
          <div className="card-black rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/50 text-xs uppercase font-bold tracking-wide mb-0.5">
                  Cool Down
                </p>
                <p className="text-white font-black text-lg">{workout.cooldownMinutes} min</p>
              </div>
              <span className="text-2xl">❄️</span>
            </div>
          </div>
        </div>

        {/* End workout button */}
        <div className="pt-4 border-t border-gray-100 mt-4">
          <button
            onClick={handleEndWorkout}
            disabled={ending}
            className="w-full btn-black py-4 text-base disabled:opacity-50"
          >
            {ending ? "Finalizando..." : "End Workout"}
          </button>
        </div>
      </div>

      {/* Info Drawer */}
      {drawerExercise && (
        <ExerciseInfoDrawer
          exercise={drawerExercise}
          onClose={() => setDrawerExercise(null)}
        />
      )}
    </>
  );
}
