"use client";

import { useEffect } from "react";
import ReactPlayer from "react-player/youtube";

interface Exercise {
  id: string;
  name: string;
  videoUrl: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string[];
  grip: string | null;
  position: string | null;
  steps: string[];
  tutorialVideoUrl: string | null;
}

interface ExerciseInfoDrawerProps {
  exercise: Exercise | null;
  onClose: () => void;
}

export default function ExerciseInfoDrawer({ exercise, onClose }: ExerciseInfoDrawerProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!exercise) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-brand-black z-50 overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-brand-black border-b border-white/10 px-5 py-4 flex items-center justify-between z-10">
          <h2 className="text-white font-black uppercase text-lg tracking-tight truncate pr-4">
            {exercise.name}
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors shrink-0"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Mini player */}
          <div className="aspect-video rounded-xl overflow-hidden bg-black">
            <ReactPlayer
              url={exercise.videoUrl}
              width="100%"
              height="100%"
              config={{ playerVars: { modestbranding: 1, rel: 0 } }}
            />
          </div>

          {/* Muscles & equipment */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-white/50 uppercase mr-1">Primary:</span>
              {exercise.primaryMuscles.map((m) => (
                <span key={m} className="text-xs px-2 py-0.5 rounded-full bg-brand-yellow/20 text-brand-yellow font-medium">
                  {m}
                </span>
              ))}
            </div>
            {exercise.secondaryMuscles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-white/50 uppercase mr-1">Secondary:</span>
                {exercise.secondaryMuscles.map((m) => (
                  <span key={m} className="text-xs px-2 py-0.5 rounded-full border border-white/20 text-white/60">
                    {m}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-white/50 uppercase mr-1">Equipment:</span>
              {exercise.equipment.map((eq) => (
                <span key={eq} className="text-xs px-2 py-0.5 rounded-full border border-brand-yellow/30 text-brand-yellow/70">
                  {eq}
                </span>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white/5 rounded-xl p-4 space-y-2">
            <h3 className="text-white/60 text-xs uppercase font-bold tracking-wide">Instructions</h3>
            {exercise.grip && (
              <p className="text-sm text-white"><span className="text-white/40">Grip: </span>{exercise.grip}</p>
            )}
            {exercise.position && (
              <p className="text-sm text-white"><span className="text-white/40">Position: </span>{exercise.position}</p>
            )}
            {exercise.equipment.length > 0 && (
              <p className="text-sm text-white"><span className="text-white/40">Equipment: </span>{exercise.equipment.join(", ")}</p>
            )}
          </div>

          {/* Steps */}
          <div className="space-y-3">
            <h3 className="text-white font-bold uppercase tracking-wide text-sm">Steps</h3>
            <ol className="space-y-3">
              {exercise.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 bg-brand-yellow text-brand-black rounded-full flex items-center justify-center text-xs font-black">
                    {i + 1}
                  </span>
                  <p className="text-white/80 text-sm leading-relaxed pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Tutorial video */}
          {exercise.tutorialVideoUrl && (
            <div className="space-y-2">
              <h3 className="text-white font-bold uppercase tracking-wide text-sm">
                Master the move — {exercise.name}
              </h3>
              <div className="aspect-video rounded-xl overflow-hidden bg-black">
                <ReactPlayer
                  url={exercise.tutorialVideoUrl}
                  width="100%"
                  height="100%"
                  config={{ playerVars: { modestbranding: 1, rel: 0 } }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
