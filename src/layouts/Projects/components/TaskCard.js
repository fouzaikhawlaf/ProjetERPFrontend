import React from 'react';
import PropTypes from 'prop-types';
import { ListGroupItem, Badge } from 'react-bootstrap';
import moment from 'moment'; // For date formatting

const TaskCard = ({ task }) => {
  const dueDate = moment(task.dueDate, 'YYYY-MM-DD', true).isValid() 
    ? moment(task.dueDate).format('MMMM Do, YYYY') 
    : 'No Due Date';

  return (
    <ListGroupItem>
      <div className="d-flex justify-content-between align-items-center">
        <strong>{task.title || 'Untitled Task'}</strong>
        <div>
          <Badge bg="info">{task.employee || 'Unassigned'}</Badge>
          <span className="ms-3">Due: {dueDate}</span>
        </div>
      </div>
    </ListGroupItem>
  );
};

TaskCard.propTypes = {
  task: PropTypes.shape({
    title: PropTypes.string,
    employee: PropTypes.string,
    dueDate: PropTypes.string,
  }).isRequired,
};

export default TaskCard;
