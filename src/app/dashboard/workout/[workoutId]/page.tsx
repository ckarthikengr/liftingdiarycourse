import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkoutById } from "@/data/workouts";
import { EditWorkoutForm } from "./_components/EditWorkoutForm";

interface EditWorkoutPageProps {
  params: Promise<{ workoutId: string }>;
}

export default async function EditWorkoutPage({ params }: EditWorkoutPageProps) {
  const { workoutId } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/");

  const workout = await getWorkoutById(userId, workoutId);
  if (!workout) notFound();

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Workout</CardTitle>
        </CardHeader>
        <CardContent>
          <EditWorkoutForm
            workoutId={workout.id}
            initialName={workout.name ?? null}
            initialDate={workout.date}
          />
        </CardContent>
      </Card>
    </div>
  );
}
