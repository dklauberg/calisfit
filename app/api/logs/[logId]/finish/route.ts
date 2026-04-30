import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(
  _req: NextRequest,
  { params }: { params: { logId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const log = await prisma.workoutLog.findFirst({
    where: { id: params.logId, userId: session.user.id },
  });

  if (!log) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.workoutLog.update({
    where: { id: params.logId },
    data: { finishedAt: new Date() },
  });

  return NextResponse.json(updated);
}
