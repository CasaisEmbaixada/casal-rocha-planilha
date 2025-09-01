import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface MonthNavigatorProps {
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
  selectedRange?: DateRange;
  onRangeChange?: (range: DateRange | undefined) => void;
}

export const MonthNavigator = ({ 
  selectedMonth, 
  onMonthChange, 
  selectedRange, 
  onRangeChange 
}: MonthNavigatorProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onMonthChange(date);
      setIsCalendarOpen(false);
    }
  };

  const handleRangeSelect = (range: DateRange | undefined) => {
    if (onRangeChange) {
      onRangeChange(range);
      if (range?.from) {
        onMonthChange(range.from);
      }
    }
  };

  const getDisplayText = () => {
    if (selectedRange?.from && selectedRange?.to) {
      const fromFormatted = format(selectedRange.from, "dd/MM/yyyy", { locale: ptBR });
      const toFormatted = format(selectedRange.to, "dd/MM/yyyy", { locale: ptBR });
      return `${fromFormatted} - ${toFormatted}`;
    } else if (selectedRange?.from) {
      return format(selectedRange.from, "dd/MM/yyyy", { locale: ptBR });
    }
    return format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <div className="flex items-center justify-center mb-6">
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-auto min-w-[250px] justify-center text-left font-normal",
              !selectedMonth && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {getDisplayText()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          {onRangeChange ? (
            <Calendar
              mode="range"
              selected={selectedRange}
              onSelect={handleRangeSelect}
              defaultMonth={selectedMonth}
              numberOfMonths={2}
              className="pointer-events-auto"
            />
          ) : (
            <Calendar
              mode="single"
              selected={selectedMonth}
              onSelect={handleDateSelect}
              defaultMonth={selectedMonth}
              className="pointer-events-auto"
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};