import React, { useState } from "react";
import VenteProgressBar from "./VenteNavbar";
//import VenteProgressBar from "./VenteProgressBar";

const SaleProcess = () => {
  const steps = ["New Sale", "New Order", "New Invoice", "Delivery Note", "Review & Complete"];
  const [activeStep, setActiveStep] = useState(0);

  const handleStepChange = (step) => setActiveStep(step);

  const handlePrevious = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));

  const handleComplete = () => {
    alert("Sale process completed!");
    setActiveStep(0); // Reset the process
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel the process?")) {
      setActiveStep(0); // Reset to the beginning
    }
  };

  return (
    <VenteProgressBar
      steps={steps}
      activeStep={activeStep}
      onStepChange={handleStepChange}
      onPrevious={handlePrevious}
      onNext={handleNext}
      onCancel={handleCancel}
      onComplete={handleComplete}
    />
  );
};

export default SaleProcess;
