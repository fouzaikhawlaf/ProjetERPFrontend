import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (date) => {
    setDate(date);
    // Do something with the selected date
  };

  return (
    <div className="calendar-container">
      <h2>Calendar</h2>
      <Calendar
        onChange={handleDateChange}
        value={date}
      />
    </div>
  );
};

export default CalendarComponent;
