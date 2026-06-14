"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function DatePicker({ selected }: { selected: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [y, m, d] = selected.split("-").map(Number);
  const date = new Date(y, m - 1, d);

  function onSelect(next: Date | undefined) {
    if (!next) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", format(next, "yyyy-MM-dd"));
    router.push(`?${params.toString()}`);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-2">
          <CalendarIcon className="h-4 w-4" />
          {format(date, "do MMM yyyy")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={onSelect} />
      </PopoverContent>
    </Popover>
  );
}
