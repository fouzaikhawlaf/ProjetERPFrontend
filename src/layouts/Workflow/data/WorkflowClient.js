import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const WorkflowClient = ({ clientId }) => {
  const [currentStep, setCurrentStep] = useState(0);  // Initial step state
  const [role, setRole] = useState("");  // Role of user

  // Define client steps
  const clientSteps = ["Register", "Validate", "Activate"];

  // Fetch current workflow step for client
  useEffect(() => {
    fetch(`/api/workflow/client/${clientId}`)
      .then(res => res.json())
      .then(data => {
        setCurrentStep(data.currentStep);
        setRole(data.role);  // set role for possible decision-making
      })
      .catch(err => console.log("Error fetching client workflow", err));
  }, [clientId]);

  const handleValidate = () => {
    fetch(`/api/workflow/client/validate`, {
      method: 'POST',
      body: JSON.stringify({ clientId }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        setCurrentStep(data.currentStep);  // Update workflow step after validation
      });
  };

  return (
    <div className="container mt-4" style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
      <h3 className="mb-4" style={{ color: '#007bff' }}>Client Workflow Progress</h3>
      <ul className="list-group">
        {clientSteps.map((step, index) => (
          <li 
            key={index} 
            className={`list-group-item ${currentStep >= index ? 'bg-success text-white' : 'bg-light'}`}
            style={{ borderRadius: '4px', marginBottom: '5px' }}
          >
            {step}
          </li>
        ))}
      </ul>
      {role === 'admin' && (
        <button 
          className="btn btn-success mt-3" 
          onClick={handleValidate}
        >
          Validate Client
        </button>
      )}
    </div>
  );
};

export default WorkflowClient;
