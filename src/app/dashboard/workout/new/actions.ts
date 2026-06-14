"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createWorkout } from "@/data/workouts";

const CreateWorkoutSchema = z.object({
  name: z.string().max(256).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be a valid date"),
});

export async function createWorkoutAction(name: string, date: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = CreateWorkoutSchema.parse({ name: name || undefined, date });
  const workout = await createWorkout(userId, parsed.name ?? null, parsed.date);

  redirect(`/dashboard?date=${workout.date}`);
}
