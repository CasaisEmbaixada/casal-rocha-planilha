import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface MonthNavigatorProps {
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
}

export const MonthNavigator = ({ selectedMonth, onMonthChange }: MonthNavigatorProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedMonth);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    onMonthChange(newDate);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onMonthChange(date);
      setIsCalendarOpen(false);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-4 mb-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigateMonth('prev')}
        className="flex items-center space-x-2"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Anterior</span>
      </Button>

      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[200px] justify-center text-left font-normal",
              !selectedMonth && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR })}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="single"
            selected={selectedMonth}
            onSelect={handleDateSelect}
            defaultMonth={selectedMonth}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="sm"
        onClick={() => navigateMonth('next')}
        className="flex items-center space-x-2"
      >
        <span className="hidden sm:inline">Próximo</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};