"use client";

import { useState } from "react";
import { toast } from "react-toastify";

interface SetRow {
  setId: string;
  order: number;
  targetReps: string | null;
  targetTimeSec: number | null;
  measureType: string;
  logId: string;
}

interface SetTableProps {
  sets: SetRow[];
  onLogUpdate?: () => void;
}

interface RowState {
  done: boolean;
  reps: string;
  weight: string;
  saving: boolean;
}

export default function SetTable({ sets, onLogUpdate }: SetTableProps) {
  const [rows, setRows] = useState<Record<string, RowState>>(
    Object.fromEntries(
      sets.map((s) => [
        s.setId,
        { done: false, reps: s.targetReps ?? "", weight: "", saving: false },
      ])
    )
  );

  async function handleCheck(setId: string, logId: string) {
    const row = rows[setId];
    const newDone = !row.done;

    setRows((prev) => ({ ...prev, [setId]: { ...prev[setId], done: newDone, saving: true } }));

    try {
      await fetch("/api/logs/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logId,
          setId,
          done: newDone,
          reps: row.reps ? parseInt(row.reps) : null,
          weightKg: row.weight ? parseFloat(row.weight) : null,
          round: 1,
        }),
      });
      onLogUpdate?.();
    } catch {
      toast.error("Erro ao salvar série.");
      setRows((prev) => ({ ...prev, [setId]: { ...prev[setId], done: !newDone } }));
    } finally {
      setRows((prev) => ({ ...prev, [setId]: { ...prev[setId], saving: false } }));
    }
  }

  return (
    <div className="mt-3 rounded-xl overflow-hidden border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-white/5 text-white/50 uppercase text-xs">
            <th className="px-3 py-2 text-left w-10">Done</th>
            <th className="px-3 py-2 text-left">Reps</th>
            <th className="px-3 py-2 text-left">Weight (kg)</th>
            <th className="px-3 py-2 text-left w-12">Round</th>
          </tr>
        </thead>
        <tbody>
          {sets.map((s, i) => {
            const row = rows[s.setId];
            return (
              <tr
                key={s.setId}
                className={`border-t border-white/5 transition-colors ${row.done ? "bg-brand-yellow/10" : "hover:bg-white/5"}`}
              >
                <td className="px-3 py-2">
                  <button
                    onClick={() => handleCheck(s.setId, s.logId)}
                    disabled={row.saving}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      row.done
                        ? "bg-brand-yellow border-brand-yellow"
                        : "border-white/30 hover:border-white/60"
                    }`}
                  >
                    {row.done && (
                      <svg className="w-3 h-3 text-brand-black" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                </td>
                <td className="px-3 py-2">
                  {s.measureType === "time" ? (
                    <span className="text-white/60">
                      {s.targetTimeSec ? `${s.targetTimeSec}s` : "Max"}
                    </span>
                  ) : (
                    <input
                      type="number"
                      value={row.reps}
                      onChange={(e) =>
                        setRows((prev) => ({ ...prev, [s.setId]: { ...prev[s.setId], reps: e.target.value } }))
                      }
                      placeholder={s.targetReps ?? "0"}
                      className="w-16 bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-brand-yellow"
                    />
                  )}
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={row.weight}
                    onChange={(e) =>
                      setRows((prev) => ({ ...prev, [s.setId]: { ...prev[s.setId], weight: e.target.value } }))
                    }
                    placeholder="0"
                    className="w-16 bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-brand-yellow"
                  />
                </td>
                <td className="px-3 py-2 text-white/50 text-xs">{i + 1}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
