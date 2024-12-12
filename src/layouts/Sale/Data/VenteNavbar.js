import PropTypes from 'prop-types';

const VenteProgressBar = ({ steps = [], activeStep = 0 }) => {
  if (!Array.isArray(steps) || steps.length === 0) {
    return <p>No steps defined</p>; // Affiche un message si steps est vide ou invalide
  }

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '20px 0',
  };

  const stepStyle = {
    flex: 1,
    padding: '10px',
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ccc',
    borderRadius: '5px',
    marginRight: '10px',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  };

  const activeStepStyle = {
    ...stepStyle,
    backgroundColor: '#007bff',
    color: '#fff',
    fontWeight: 'bold',
  };

  return (
    <div style={containerStyle}>
      {steps.map((step, index) => (
        <div
          key={index}
          style={index === activeStep ? activeStepStyle : stepStyle}
        >
          {step}
        </div>
      ))}
    </div>
  );
};

VenteProgressBar.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string), // Les étapes doivent être un tableau de chaînes
  activeStep: PropTypes.number, // L'étape active doit être un entier
};

export default VenteProgressBar;
