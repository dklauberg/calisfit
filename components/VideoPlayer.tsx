"use client";

import { useState, useRef, useCallback } from "react";
import ReactPlayer from "react-player/youtube";

interface VideoPlayerProps {
  url: string;
  exerciseName: string;
  repsBadge?: string;
}

export default function VideoPlayer({ url, exerciseName, repsBadge }: VideoPlayerProps) {
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.();
    }
  }, []);

  function formatTime(secs: number) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function handleProgress({ playedSeconds }: { playedSeconds: number }) {
    setPlayed(playedSeconds);
  }

  return (
    <div ref={containerRef} className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden group">
      <ReactPlayer
        ref={playerRef}
        url={url}
        width="100%"
        height="100%"
        playing={playing}
        onProgress={handleProgress}
        onDuration={setDuration}
        config={{ playerVars: { modestbranding: 1, rel: 0 } }}
      />

      {/* Overlay bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/60 text-xs mb-0.5">
              {formatTime(played)} / {formatTime(duration)}
            </p>
            <p className="text-white font-black text-sm uppercase tracking-wide truncate max-w-[200px]">
              {exerciseName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {repsBadge && (
              <span className="bg-brand-yellow text-brand-black text-xs font-bold px-2 py-0.5 rounded-full">
                Reps: {repsBadge}
              </span>
            )}
            <button
              onClick={() => setPlaying(!playing)}
              className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
            >
              {playing ? (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>
            <button
              onClick={handleFullscreen}
              className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
