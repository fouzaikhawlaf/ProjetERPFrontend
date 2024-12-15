import React from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ steps, currentStep }) => {
  return (
    <div style={styles.progressBarContainer}>
      {steps.map((step, index) => (
        <div
          key={index}
          style={{
            ...styles.progressStep,
            ...(index < currentStep ? styles.completedStep : {}),
            ...(index === currentStep ? styles.activeStep : {}),
          }}
        >
          <div
            style={{
              ...styles.stepCircle,
              ...(index < currentStep ? styles.completedCircle : {}),
              ...(index === currentStep ? styles.activeCircle : {}),
            }}
          >
            {index < currentStep ? '✔' : index + 1}
          </div>
          <div style={styles.stepLabel}>{step}</div>
          {index < steps.length - 1 && (
            <div
              style={{
                ...styles.stepConnector,
                ...(index < currentStep - 1 ? styles.completedConnector : {}),
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// Inline CSS styles
const styles = {
  progressBarContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    margin: '20px auto',
    position: 'relative',
  },
  progressStep: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    flex: 1,
  },
  stepCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: 'white',
    transition: 'background-color 0.3s, transform 0.3s',
    zIndex: 1,
  },
  completedCircle: {
    backgroundColor: '#007bff',
  },
  activeCircle: {
    backgroundColor: '#0056b3',
    transform: 'scale(1.1)',
  },
  stepLabel: {
    marginTop: '8px',
    fontSize: '14px',
    color: '#6c757d',
    textAlign: 'center',
  },
  stepConnector: {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: 'calc(100% + 8px)',
    height: '4px',
    width: '100%',
    backgroundColor: '#e0e0e0',
    zIndex: -1,
  },
  completedConnector: {
    backgroundColor: '#007bff',
  },
  completedStep: {
    color: '#007bff',
  },
  activeStep: {
    color: '#0056b3',
  },
};

// Adding PropTypes
ProgressBar.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string).isRequired, // Array of strings for step labels
  currentStep: PropTypes.number.isRequired, // Index of the current step (0-based)
};

export default ProgressBar;
