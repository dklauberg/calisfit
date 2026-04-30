import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workouts = await prisma.workout.findMany({
    include: {
      blocks: {
        orderBy: { order: "asc" },
        include: {
          exercise: true,
          sets: { orderBy: { order: "asc" } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(workouts);
}
