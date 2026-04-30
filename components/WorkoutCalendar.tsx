"use client";

import { useState } from "react";

interface WorkoutCalendarProps {
  completedDates: string[]; // "YYYY-MM-DD"
}

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export default function WorkoutCalendar({ completedDates }: WorkoutCalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const doneSet = new Set(completedDates);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  function toKey(d: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Count workouts this month
  const monthCount = completedDates.filter(d =>
    d.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`)
  ).length;

  return (
    <div className="card-black rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-white/50 text-xs uppercase font-bold tracking-wide">Calendário</p>
          <p className="text-white font-black text-lg leading-tight">
            {MONTHS[month]} {year}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <span className="bg-brand-yellow/20 text-brand-yellow text-xs font-bold px-2 py-0.5 rounded-full mr-2">
            {monthCount} treinos
          </span>
          <button
            onClick={prevMonth}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map(d => (
          <div key={d} className="text-center text-white/30 text-xs font-bold py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells before first day */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const key = toKey(day);
          const isDone = doneSet.has(key);
          const isToday = key === todayKey;

          return (
            <div
              key={day}
              className={`
                aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-colors
                ${isDone
                  ? "bg-brand-yellow text-brand-black"
                  : isToday
                  ? "bg-white/20 text-white ring-1 ring-brand-yellow"
                  : "text-white/40 hover:bg-white/10"
                }
              `}
            >
              {isDone ? (
                <span className="flex flex-col items-center gap-0.5">
                  <span>{day}</span>
                  <span className="text-[8px] leading-none">✓</span>
                </span>
              ) : day}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/10">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-brand-yellow" />
          <span className="text-white/40 text-xs">Treino feito</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-white/20 ring-1 ring-brand-yellow" />
          <span className="text-white/40 text-xs">Hoje</span>
        </div>
      </div>
    </div>
  );
}
