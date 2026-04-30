import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import WorkoutPageClient from "./WorkoutPageClient";

interface Props {
  params: { id: string };
}

export default async function WorkoutPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

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

  if (!workout) notFound();

  // Create or get active workout log
  let log = await prisma.workoutLog.findFirst({
    where: {
      userId: session.user.id,
      workoutId: workout.id,
      finishedAt: null,
    },
    orderBy: { startedAt: "desc" },
  });

  if (!log) {
    log = await prisma.workoutLog.create({
      data: {
        userId: session.user.id,
        workoutId: workout.id,
      },
    });
  }

  return <WorkoutPageClient workout={workout} logId={log.id} />;
}
