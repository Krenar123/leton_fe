import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { CalendarEvent } from "@/types/calendar";
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getYear, getMonth, setYear, setMonth, startOfWeek, endOfWeek, eachHourOfInterval, startOfDay, endOfDay } from "date-fns";
interface CalendarViewProps {
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}
type ViewMode = 'month' | 'week' | 'year';
export const CalendarView = ({
  events,
  onDateClick,
  onEventClick
}: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onDateClick(date);
    }
  };
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);

      // Check if date falls within event range
      return date >= eventStart && date <= eventEnd;
    });
  };
  const getColorClass = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      pink: 'bg-pink-500',
      orange: 'bg-orange-500',
      gray: 'bg-gray-500'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-blue-500';
  };
  const handleYearChange = (year: string) => {
    setCurrentDate(setYear(currentDate, parseInt(year)));
  };
  const handleMonthChange = (month: string) => {
    setCurrentDate(setMonth(currentDate, parseInt(month)));
  };
  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    }
  };
  const navigateWeek = (direction: 'prev' | 'next') => {
    const days = direction === 'prev' ? -7 : 7;
    setCurrentDate(new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000));
  };
  const navigateYear = (direction: 'prev' | 'next') => {
    const years = direction === 'prev' ? -1 : 1;
    setCurrentDate(setYear(currentDate, getYear(currentDate) + years));
  };
  const navigate = (direction: 'prev' | 'next') => {
    switch (viewMode) {
      case 'month':
        navigateMonth(direction);
        break;
      case 'week':
        navigateWeek(direction);
        break;
      case 'year':
        navigateYear(direction);
        break;
    }
  };
  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarDays = eachDayOfInterval({
      start: monthStart,
      end: monthEnd
    });
    return <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 border-b">
            {day}
          </div>)}

        {/* Calendar days */}
        {calendarDays.map(day => {
        const dayEvents = getEventsForDate(day);
        const isToday = isSameDay(day, new Date());
        return <div key={day.toISOString()} className={`min-h-24 p-2 border border-gray-100 cursor-pointer hover:bg-gray-50 ${isToday ? 'bg-blue-50' : ''}`} onClick={() => handleDateSelect(day)}>
              <div className={`text-sm mb-1 ${isToday ? 'font-bold text-blue-600' : ''}`}>
                {format(day, 'd')}
              </div>
              
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map(event => <div key={event.id} className={`text-xs p-1 rounded text-white cursor-pointer ${getColorClass(event.color)}`} onClick={e => {
              e.stopPropagation();
              onEventClick(event);
            }}>
                    {event.title}
                  </div>)}
                {dayEvents.length > 3 && <div className="text-xs text-gray-500">
                    +{dayEvents.length - 3} more
                  </div>}
              </div>
            </div>;
      })}
      </div>;
  };
  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    const weekDays = eachDayOfInterval({
      start: weekStart,
      end: weekEnd
    });
    const hours = eachHourOfInterval({
      start: startOfDay(new Date()),
      end: endOfDay(new Date())
    });
    return <div className="flex flex-col">
        {/* Week header */}
        <div className="grid grid-cols-8 gap-1 mb-2">
          <div className="p-2 text-center text-sm font-medium text-gray-500">Time</div>
          {weekDays.map(day => <div key={day.toISOString()} className="p-2 text-center text-sm font-medium text-gray-500 border-b">
              <div>{format(day, 'EEE')}</div>
              <div className={`text-lg ${isSameDay(day, new Date()) ? 'font-bold text-blue-600' : ''}`}>
                {format(day, 'd')}
              </div>
            </div>)}
        </div>

        {/* Week grid */}
        <div className="grid grid-cols-8 gap-1 max-h-96 overflow-y-auto">
          {hours.map(hour => <div key={hour.toISOString()} className="contents">
              <div className="p-2 text-xs text-gray-500 border-r">
                {format(hour, 'HH:mm')}
              </div>
              {weekDays.map(day => {
            const dayHour = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour.getHours());
            const hourEvents = events.filter(event => {
              if (event.isAllDay) return false;
              const eventStart = new Date(event.startDate);
              const eventHour = eventStart.getHours();
              return isSameDay(eventStart, day) && eventHour === hour.getHours();
            });
            return <div key={`${day.toISOString()}-${hour.toISOString()}`} className="min-h-12 p-1 border border-gray-100 cursor-pointer hover:bg-gray-50" onClick={() => handleDateSelect(dayHour)}>
                    {hourEvents.map(event => <div key={event.id} className={`text-xs p-1 rounded text-white cursor-pointer mb-1 ${getColorClass(event.color)}`} onClick={e => {
                e.stopPropagation();
                onEventClick(event);
              }}>
                        {event.title}
                      </div>)}
                  </div>;
          })}
            </div>)}
        </div>
      </div>;
  };
  const renderYearView = () => {
    const currentYear = getYear(currentDate);
    const months = Array.from({
      length: 12
    }, (_, i) => new Date(currentYear, i, 1));
    return <div className="grid grid-cols-4 gap-4">
        {months.map(month => {
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);
        const monthEvents = events.filter(event => {
          const eventStart = new Date(event.startDate);
          return eventStart >= monthStart && eventStart <= monthEnd;
        });
        return <div key={month.toISOString()} className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => {
          setCurrentDate(month);
          setViewMode('month');
        }}>
              <h3 className="font-medium text-center mb-2">{format(month, 'MMM')}</h3>
              <div className="text-xs text-gray-500 text-center">
                {monthEvents.length} event{monthEvents.length !== 1 ? 's' : ''}
              </div>
            </div>;
      })}
      </div>;
  };
  const getViewTitle = () => {
    switch (viewMode) {
      case 'year':
        return format(currentDate, 'yyyy');
      case 'week':
        return `Week of ${format(startOfWeek(currentDate), 'MMM d, yyyy')}`;
      case 'month':
      default:
        return format(currentDate, 'MMMM yyyy');
    }
  };
  return <div className="rounded-lg border border-slate-200 p-6 my-[16px] py-[24px] bg-slate-50 mx-[16px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => navigate('prev')} className="text-sm bg-inherit text-inherit">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold min-w-[200px] text-center">
            {getViewTitle()}
          </h2>
          <Button variant="outline" size="icon" onClick={() => navigate('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          {/* Year Selector */}
          <Select value={getYear(currentDate).toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({
              length: 10
            }, (_, i) => {
              const year = getYear(new Date()) - 5 + i;
              return <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>;
            })}
            </SelectContent>
          </Select>

          {/* Month Selector - Only show when NOT in year view */}
          {viewMode !== 'year' && <Select value={getMonth(currentDate).toString()} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({
              length: 12
            }, (_, i) => <SelectItem key={i} value={i.toString()}>
                    {format(new Date(2000, i, 1), 'MMMM')}
                  </SelectItem>)}
              </SelectContent>
            </Select>}

          {/* View Mode Selector */}
          <Select value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => onDateClick(new Date())} className="bg-[#0a1f44]">
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </Button>
        </div>
      </div>

      {viewMode === 'month' && renderMonthView()}
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'year' && renderYearView()}
    </div>;
};