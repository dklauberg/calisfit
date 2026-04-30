import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const exercises = await prisma.exercise.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(exercises);
}
