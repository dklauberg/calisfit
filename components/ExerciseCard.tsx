"use client";

import { useState } from "react";
import Image from "next/image";
import SetTable from "./SetTable";

interface SetData {
  setId: string;
  order: number;
  targetReps: string | null;
  targetTimeSec: number | null;
  measureType: string;
  logId: string;
}

interface ExerciseCardProps {
  order: number;
  exercise: {
    id: string;
    name: string;
    thumbnailUrl: string | null;
    videoUrl: string;
    primaryMuscles: string[];
  };
  sets: SetData[];
  measureType: string;
  isActive?: boolean;
  onSelectActive?: () => void;
  onInfoClick?: () => void;
  logId: string;
}

export default function ExerciseCard({
  order,
  exercise,
  sets,
  measureType,
  isActive,
  onSelectActive,
  onInfoClick,
  logId,
}: ExerciseCardProps) {
  const [expanded, setExpanded] = useState(false);

  const repsBadge = sets
    .map((s) => (measureType === "time" ? (s.targetTimeSec ? `${s.targetTimeSec}s` : "Max") : s.targetReps ?? "?"))
    .join("•");

  return (
    <div
      className={`rounded-2xl border transition-colors bg-brand-black ${
        isActive
          ? "border-brand-yellow"
          : "border-white/10 hover:border-white/30"
      }`}
    >
      {/* Card header */}
      <div
        className="flex items-center gap-3 p-3 cursor-pointer"
        onClick={() => {
          setExpanded(!expanded);
          onSelectActive?.();
        }}
      >
        {/* Thumbnail */}
        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white/10 shrink-0">
          {exercise.thumbnailUrl ? (
            <Image
              src={exercise.thumbnailUrl}
              alt={exercise.name}
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <svg className="w-4 h-4 text-white/80" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-white/40 text-xs">{order}.</span>
            <p className="text-white font-bold uppercase text-sm truncate">{exercise.name}</p>
          </div>
          <p className="text-white/50 text-xs mt-0.5">
            Sets: {sets.length}{"  "}
            {measureType === "reps" ? "Reps:" : "Time:"} {repsBadge}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInfoClick?.();
            }}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            title="How to do it"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            title="View history"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 transition-transform">
            <svg
              className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded set table */}
      {expanded && (
        <div className="px-3 pb-3">
          <SetTable
            sets={sets.map((s) => ({ ...s, measureType, logId }))}
          />
        </div>
      )}
    </div>
  );
}
