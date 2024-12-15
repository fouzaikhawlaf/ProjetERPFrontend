import React, { useState } from "react";
import { Steps } from "antd";
import { SolutionOutlined, CarryOutOutlined, LoadingOutlined, FileDoneOutlined } from "@ant-design/icons";
import DevisForm from "./forms/devisForm";
import OrderForm from "./forms/devisForm";
import DeliveryForm from "./forms/DeleveyForm";
import FactureForm from "./forms/FactureForm";

const SaleProcess = () => {
  // State to keep track of the current step
  const [current, setCurrent] = useState(0);

  // Handle form submission for the current step
  const handleFormSubmit = () => {
    next(); // Move to the next step on form submission
  };

  // Function to get the appropriate form based on the current step
  const getStepContent = (step) => {
  
    switch (step) {
      case 0:
        console.log("hello steps")
        return <DevisForm onSubmit={handleFormSubmit} />;
      case 1:
        return <OrderForm onSubmit={handleFormSubmit} />;
      case 2:
        return <DeliveryForm onSubmit={handleFormSubmit} />;
      case 3:
        return <FactureForm onSubmit={handleFormSubmit} />;
      default:
        return <p>No content for this step.</p>;
    }
  };

  // Function to go to the next step
  const next = () => {
    setCurrent((prev) => Math.min(prev + 1, 3)); // Prevent going beyond the last step
  };

  // Function to go to the previous step
  const prev = () => {
    setCurrent((prev) => Math.max(prev - 1, 0)); // Prevent going below the first step
  };

  return (
    <div>
      {/* Step indicator */}
      <Steps current={current}>
        <Steps.Step title="Devis" icon={<SolutionOutlined />} />
        <Steps.Step title="Order Client" icon={<CarryOutOutlined />} />
        <Steps.Step title="Delivery" icon={<LoadingOutlined />} />
        <Steps.Step title="Facture" icon={<FileDoneOutlined />} />
      </Steps>

      {/* Display the form for the current step using getStepContent */}
      <div style={{ marginTop: 20 }}>
        {getStepContent(current)}
      </div>

      {/* Navigation buttons */}
      <div style={{ marginTop: 20 }}>
        <button onClick={prev} disabled={current === 0}>
          Previous
        </button>
        <button onClick={next} disabled={current === 3}>
          Next
        </button>
      </div>
    </div>
  );
};

export default SaleProcess;
