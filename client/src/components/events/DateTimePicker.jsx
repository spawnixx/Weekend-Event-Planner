import { useState } from "react";
import { format } from "date-fns";
import { CalendarDays, Clock3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick a date",
}) {
  const [open, setOpen] = useState(false);

  const selectedDate = value ? new Date(value) : undefined;

  function handleDateSelect(date) {
    if (!date) return;

    const nextDate = new Date(date);

    if (selectedDate) {
      nextDate.setHours(
        selectedDate.getHours(),
        selectedDate.getMinutes(),
        0,
        0,
      );
    } else {
      nextDate.setHours(12, 0, 0, 0);
    }

    onChange(nextDate);
    setOpen(false);
  }

  function handleTimeChange(event) {
    const [hours, minutes] = event.target.value.split(":").map(Number);

    const nextDate = selectedDate ? new Date(selectedDate) : new Date();

    nextDate.setHours(hours, minutes, 0, 0);

    onChange(nextDate);
  }

  return (
    <div className="flex overflow-hidden rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="h-10 flex-1 justify-start gap-2 rounded-none border-0 px-3 font-normal hover:bg-muted/50"
          >
            <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />

            <span
              className={
                selectedDate ? "truncate" : "truncate text-muted-foreground"
              }
            >
              {selectedDate ? format(selectedDate, "MMM d, yyyy") : placeholder}
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <div className="flex items-center border-l border-input px-3">
        <Clock3 className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />

        <Input
          type="time"
          value={selectedDate ? format(selectedDate, "HH:mm") : ""}
          onChange={handleTimeChange}
          disabled={!selectedDate}
          className="h-auto w-[92px] border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
        />
      </div>
    </div>
  );
}
