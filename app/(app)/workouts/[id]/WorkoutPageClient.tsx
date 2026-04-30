"use client";

import { useState } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import ProgramPreview from "@/components/ProgramPreview";

interface Exercise {
  id: string;
  name: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string[];
  grip: string | null;
  position: string | null;
  steps: string[];
  tutorialVideoUrl: string | null;
}

interface WorkoutSet {
  id: string;
  order: number;
  targetReps: string | null;
  targetTimeSec: number | null;
}

interface WorkoutBlock {
  id: string;
  order: number;
  measureType: string;
  exercise: Exercise;
  sets: WorkoutSet[];
}

interface Workout {
  id: string;
  title: string;
  warmupMinutes: number;
  cooldownMinutes: number;
  blocks: WorkoutBlock[];
}

interface Props {
  workout: Workout;
  logId: string;
}

export default function WorkoutPageClient({ workout, logId }: Props) {
  const [activeBlockOrder, setActiveBlockOrder] = useState(1);

  const activeBlock = workout.blocks.find((b) => b.order === activeBlockOrder) ?? workout.blocks[0];

  const repsBadge = activeBlock?.sets
    .map((s) =>
      activeBlock.measureType === "time"
        ? s.targetTimeSec
          ? `${s.targetTimeSec}s`
          : "Max"
        : s.targetReps ?? "?"
    )
    .join("•");

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      {/* Top bar */}
      <header className="sticky top-0 bg-white border-b border-gray-100 z-30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/workouts" className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </a>
          <h1 className="font-black uppercase text-brand-black text-sm tracking-tight truncate max-w-[200px]">
            {workout.title}
          </h1>
        </div>
        <span className="bg-brand-yellow text-brand-black text-xs font-bold px-3 py-1 rounded-full uppercase">
          In Progress
        </span>
      </header>

      {/* Main layout — 2 columns on desktop */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 bg-gray-50 min-h-screen rounded-t-none">

        {/* LEFT COLUMN */}
        <div className="space-y-4">
          {/* Video player */}
          <VideoPlayer
            url={activeBlock?.exercise.videoUrl ?? ""}
            exerciseName={activeBlock?.exercise.name ?? ""}
            repsBadge={repsBadge}
          />

          {/* Exercise info block */}
          <div className="card-black rounded-2xl p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-white font-black uppercase text-2xl tracking-tighter leading-tight">
                {activeBlock?.exercise.name}
              </h2>
              <button className="shrink-0 border border-white/20 text-white/70 text-xs font-bold uppercase px-3 py-1.5 rounded-xl hover:border-white/40 transition-colors">
                View Logs
              </button>
            </div>

            {/* Muscles */}
            <div className="space-y-2">
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-white/40 text-xs uppercase font-bold mr-1">Primary</span>
                {activeBlock?.exercise.primaryMuscles.map((m) => (
                  <span key={m} className="text-xs px-2 py-0.5 rounded-full bg-brand-yellow/20 text-brand-yellow font-medium">
                    {m}
                  </span>
                ))}
              </div>
              {activeBlock?.exercise.secondaryMuscles.length > 0 && (
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-white/40 text-xs uppercase font-bold mr-1">Secondary</span>
                  {activeBlock.exercise.secondaryMuscles.map((m) => (
                    <span key={m} className="label-muscle">
                      {m}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-white/40 text-xs uppercase font-bold mr-1">Equipment</span>
                {activeBlock?.exercise.equipment.map((eq) => (
                  <span key={eq} className="text-xs px-2 py-0.5 rounded-full border border-brand-yellow/30 text-brand-yellow/70">
                    {eq}
                  </span>
                ))}
              </div>
            </div>

            {/* Steps preview */}
            {activeBlock?.exercise.steps.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <p className="text-white/40 text-xs uppercase font-bold">Steps</p>
                <ol className="space-y-2">
                  {activeBlock.exercise.steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-white/70">
                      <span className="shrink-0 w-5 h-5 bg-brand-yellow/20 text-brand-yellow rounded-full flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:sticky lg:top-[64px] lg:h-[calc(100vh-80px)]">
          <ProgramPreview
            workout={workout}
            logId={logId}
            activeBlockOrder={activeBlockOrder}
            onSelectBlock={setActiveBlockOrder}
          />
        </div>
      </div>
    </div>
  );
}
