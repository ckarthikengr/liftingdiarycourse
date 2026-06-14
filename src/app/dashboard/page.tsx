import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { Dumbbell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkoutsForDate } from "@/data/workouts";
import { DatePicker } from "./_components/DatePicker";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  const { date: dateParam } = await searchParams;
  const date = dateParam ?? format(new Date(), "yyyy-MM-dd");

  const workouts = await getWorkoutsForDate(userId!, date);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Workout Dashboard</h1>

      <div className="flex gap-8 items-start">
        <div className="w-56 shrink-0">
          <p className="text-sm text-muted-foreground mb-2">Viewing workouts for</p>
          <DatePicker selected={date} />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold mb-4">
            Workouts on {format(new Date(date + "T00:00:00"), "do MMM yyyy")}
          </h2>

          {workouts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Dumbbell className="h-10 w-10 mb-3 opacity-40" />
                <p className="text-sm">No workouts logged for this date.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              {workouts.map((workout) => (
                <Card key={workout.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{workout.name ?? "Untitled Workout"}</CardTitle>
                  </CardHeader>
                  {workout.workoutExercises.length > 0 && (
                    <CardContent>
                      <ul className="flex flex-col gap-1">
                        {workout.workoutExercises.map((we) => (
                          <li
                            key={we.id}
                            className="text-sm text-muted-foreground flex items-center gap-2"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground inline-block" />
                            {we.exerciseType.name}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
