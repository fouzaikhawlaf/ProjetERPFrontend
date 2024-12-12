// src/components/CalendarComponent.js
import React from 'react';
import PropTypes from 'prop-types';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';


const localizer = momentLocalizer(moment);

const CalendarComponent = ({ events }) => {
  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad'; // Default color
    if (event.type === 'holiday') {
      backgroundColor = '#f00';
    } else if (event.type === 'meeting') {
      backgroundColor = '#0f0';
    }

    const style = {
      backgroundColor,
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };

    return {
      style
    };
  };

  const handleSelectEvent = (event) => {
    // Logic to handle event click, e.g., show details in a modal
    alert(`Event: ${event.title}`);
  };

  return (
    <div style={{ height: 500 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleSelectEvent}
        popup
      />
    </div>
  );
};

CalendarComponent.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      start: PropTypes.instanceOf(Date).isRequired,
      end: PropTypes.instanceOf(Date).isRequired,
      type: PropTypes.oneOf(['holiday', 'meeting']),
    })
  ).isRequired
};

export default CalendarComponent;
