import { db } from "@/db";
import { workouts } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function getWorkoutById(userId: string, workoutId: string) {
  return db.query.workouts.findFirst({
    where: and(eq(workouts.id, workoutId), eq(workouts.userId, userId)),
  });
}

export async function updateWorkout(
  userId: string,
  workoutId: string,
  name: string | null,
  date: string
) {
  const [workout] = await db
    .update(workouts)
    .set({ name, date })
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .returning();
  return workout;
}

export async function createWorkout(userId: string, name: string | null, date: string) {
  const [workout] = await db.insert(workouts).values({ userId, name, date }).returning();
  return workout;
}

export async function getWorkoutsForDate(userId: string, date: string) {
  return db.query.workouts.findMany({
    where: and(eq(workouts.userId, userId), eq(workouts.date, date)),
    with: {
      workoutExercises: {
        orderBy: (we, { asc }) => [asc(we.order)],
        with: {
          exerciseType: true,
        },
      },
    },
  });
}
