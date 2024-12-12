import { Bar } from 'react-chartjs-2';
import { useState } from 'react';

// Mock task data for employees
const employeeTasks = {
  George: ['Task 1', 'Task 2'],
  Nancy: ['Task 3'],
  Richard: ['Task 4', 'Task 5', 'Task 6'],
  Kate: ['Task 7'],
  Paula: ['Task 8', 'Task 9'],
};

const WorkloadChart = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const workloadData = {
    labels: ['George', 'Nancy', 'Richard', 'Kate', 'Paula'],
    datasets: [
      {
        label: 'Workload (%)',
        data: [67, 95, 48, 34, 30],
        backgroundColor: '#007bff',
      },
    ],
  };

  const handleChartClick = (event, elements) => {
    if (elements.length === 0) return;
    const clickedElementIndex = elements[0].index;
    const employeeName = workloadData.labels[clickedElementIndex];
    setSelectedEmployee(employeeName); // Set the clicked employee
  };

  return (
    <div>
      <Bar 
        data={workloadData} 
        options={{
          onClick: handleChartClick,  // Add the click event
          maintainAspectRatio: false,
        }} 
      />
      {selectedEmployee && (
        <div style={{ marginTop: '20px' }}>
          <h4>Tasks for {selectedEmployee}:</h4>
          <ul>
            {employeeTasks[selectedEmployee].map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WorkloadChart;
