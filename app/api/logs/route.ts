import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { workoutId } = await req.json();
  if (!workoutId) return NextResponse.json({ error: "workoutId required" }, { status: 400 });

  const log = await prisma.workoutLog.create({
    data: { userId: session.user.id, workoutId },
  });

  return NextResponse.json(log, { status: 201 });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const logs = await prisma.workoutLog.findMany({
    where: { userId: session.user.id },
    include: {
      workout: { select: { id: true, title: true } },
      setLogs: true,
    },
    orderBy: { startedAt: "desc" },
  });

  return NextResponse.json(logs);
}
