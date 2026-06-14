"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MOCK_WORKOUTS = [
  {
    id: 1,
    name: "Morning Push",
    exercises: ["Bench Press", "Overhead Press", "Tricep Dips"],
    duration: "45 min",
    date: new Date(),
  },
  {
    id: 2,
    name: "Chest & Shoulders",
    exercises: ["Incline Dumbbell Press", "Lateral Raises", "Cable Flyes"],
    duration: "60 min",
    date: new Date(),
  },
];

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const workoutsForDate = MOCK_WORKOUTS.filter(
    (w) => format(w.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
  );

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="mb-8">
        <p className="text-sm text-muted-foreground mb-2">Viewing workouts for</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2">
              <CalendarIcon className="h-4 w-4" />
              {format(selectedDate, "do MMM yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">
          Workouts on {format(selectedDate, "do MMM yyyy")}
        </h2>

        {workoutsForDate.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Dumbbell className="h-10 w-10 mb-3 opacity-40" />
              <p className="text-sm">No workouts logged for this date.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {workoutsForDate.map((workout) => (
              <Card key={workout.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{workout.name}</CardTitle>
                    <Badge variant="secondary">{workout.duration}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="flex flex-col gap-1">
                    {workout.exercises.map((exercise) => (
                      <li key={exercise} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground inline-block" />
                        {exercise}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
