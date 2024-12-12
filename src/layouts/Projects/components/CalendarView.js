import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Initialize moment.js for calendar localization
const localizer = momentLocalizer(moment);

// Example tasks array
const tasks = [
  { title: 'Design Homepage', employee: 'John Doe', start: new Date(2024, 9, 1), end: new Date(2024, 9, 3) },
  { title: 'Fix Login Bug', employee: 'Jane Smith', start: new Date(2024, 9, 4), end: new Date(2024, 9, 6) },
  { title: 'Prepare Report', employee: 'Alex Johnson', start: new Date(2024, 9, 2), end: new Date(2024, 9, 5) },
];

const CalendarView = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Convert tasks into events for the calendar
    const taskEvents = tasks.map((task) => ({
      title: `${task.title} - ${task.employee}`,
      start: task.start,
      end: task.end,
    }));
    setEvents(taskEvents);
  }, []);

  return (
    <div className="calendar-container">
      <h3 className="mb-4">Project and Task Calendar</h3>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default CalendarView;
