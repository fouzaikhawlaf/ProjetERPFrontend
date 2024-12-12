import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OverdueTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOverdueTasks = async () => {
    try {
      const response = await axios.get('https://api.example.com/overdue-tasks');
      setTasks(response.data); // Assuming the API returns an array of tasks
      setLoading(false);
    } catch (error) {
      console.error('Error fetching overdue tasks:', error);
      setLoading(false);
    }
  };

  // Fetch tasks on component mount and every 60 seconds
  useEffect(() => {
    fetchOverdueTasks();
    const interval = setInterval(fetchOverdueTasks, 60000);  // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading overdue tasks...</div>;
  }

  return (
    <div>
      <h4>Overdue Tasks</h4>
      {tasks.length === 0 ? (
        <p>No overdue tasks</p>
      ) : (
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>{task.name} - {task.dueDate}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OverdueTasks;
