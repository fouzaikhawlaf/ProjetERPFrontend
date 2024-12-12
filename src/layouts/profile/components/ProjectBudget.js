import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProjectBudget = () => {
  const [budget, setBudget] = useState({ allocated: 0, spent: 0 });
  const [loading, setLoading] = useState(true);

  const fetchProjectBudget = async () => {
    try {
      const response = await axios.get('https://api.example.com/project-budget');
      setBudget(response.data);  // Assuming the API returns { allocated: number, spent: number }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching project budget:', error);
      setLoading(false);
    }
  };

  // Fetch budget on component mount and every 60 seconds
  useEffect(() => {
    fetchProjectBudget();
    const interval = setInterval(fetchProjectBudget, 60000);  // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading project budget...</div>;
  }

  const percentageSpent = ((budget.spent / budget.allocated) * 100).toFixed(2);

  return (
    <div>
      <h4>Project Budget</h4>
      <div>
        <p>Allocated Budget: ${budget.allocated}</p>
        <p>Spent: ${budget.spent}</p>
        <div style={{ height: '20px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          <div
            style={{
              width: `${percentageSpent}%`,
              backgroundColor: percentageSpent > 100 ? '#ff0000' : '#00ff00',
              height: '100%',
              borderRadius: '4px',
            }}
          ></div>
        </div>
        <p>{percentageSpent}% of budget spent</p>
      </div>
    </div>
  );
};

export default ProjectBudget;
