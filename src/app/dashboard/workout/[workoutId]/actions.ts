"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { updateWorkout } from "@/data/workouts";

const UpdateWorkoutSchema = z.object({
  workoutId: z.string().uuid(),
  name: z.string().max(256).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be a valid date"),
});

export async function updateWorkoutAction(
  workoutId: string,
  name: string,
  date: string
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = UpdateWorkoutSchema.parse({
    workoutId,
    name: name || undefined,
    date,
  });

  return updateWorkout(userId, parsed.workoutId, parsed.name ?? null, parsed.date);
}
