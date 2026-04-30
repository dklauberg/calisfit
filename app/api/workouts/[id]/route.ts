import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workout = await prisma.workout.findUnique({
    where: { id: params.id },
    include: {
      blocks: {
        orderBy: { order: "asc" },
        include: {
          exercise: true,
          sets: { orderBy: { order: "asc" } },
        },
      },
    },
  });

  if (!workout) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(workout);
}
