import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, Button, Modal } from 'react-bootstrap';
import RequestLeaveForm from './RequestLeaveForm';  // Import the form

const localizer = momentLocalizer(moment);

const leaves = [
  { title: 'Vacation', start: new Date(2024, 9, 20), end: new Date(2024, 9, 25) },
  { title: 'Sick Leave', start: new Date(2024, 10, 1), end: new Date(2024, 10, 3) },
];

const LeaveCalendar = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const leaveEvents = leaves.map((leave) => ({
      title: leave.title,
      start: leave.start,
      end: leave.end,
    }));
    setEvents(leaveEvents);
  }, []);

  // Handle the form submission
  const handleLeaveRequest = (leaveRequest) => {
    console.log('Leave Request Submitted:', leaveRequest);
    // Add the new leave request to the calendar or send to backend
    const newLeaveEvent = {
      title: `Leave: ${leaveRequest.reason}`,
      start: new Date(leaveRequest.startDate),
      end: new Date(leaveRequest.endDate),
    };
    setEvents([...events, newLeaveEvent]);
    setShowModal(false);  // Close the modal after submission
  };

  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        Your Leave Calendar
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Request Leave
        </Button>
      </Card.Header>
      <div className="p-3">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 400 }}
        />
      </div>

      {/* Request Leave Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Request Leave</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RequestLeaveForm onSubmit={handleLeaveRequest} />
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default LeaveCalendar;
