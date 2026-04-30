import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { logId, setId, done, reps, weightKg, timeSec, round } = await req.json();

  // Verify log belongs to user
  const log = await prisma.workoutLog.findFirst({
    where: { id: logId, userId: session.user.id },
  });
  if (!log) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Upsert set log
  const setLog = await prisma.setLog.upsert({
    where: {
      // compound unique not defined — use findFirst + create/update pattern
      id: (
        await prisma.setLog.findFirst({
          where: { logId, setId, round: round ?? 1 },
          select: { id: true },
        })
      )?.id ?? "create",
    },
    update: { done, reps, weightKg, timeSec },
    create: {
      logId,
      setId,
      done: done ?? false,
      reps,
      weightKg,
      timeSec,
      round: round ?? 1,
    },
  });

  return NextResponse.json(setLog);
}
