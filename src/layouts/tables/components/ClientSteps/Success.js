import React from 'react';

const Success = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Félicitations !</h1>
      <p style={styles.message}>
        Votre formulaire a été soumis avec succès. Merci de nous avoir fourni vos informations.
      </p>
      <img 
        src="https://path/to/your/success-image.png" // Remplace par l'URL de ton image
        alt="Succès" 
        style={styles.image} 
      />
    </div>
  );
};

// Styles simples pour la page de succès
const styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px'
  },
  title: {
    fontSize: '2.5rem',
    color: '#4CAF50' // Vert pour le succès
  },
  message: {
    fontSize: '1.2rem',
    color: '#333',
    margin: '20px 0'
  },
  image: {
    width: '150px',
    height: '150px',
    marginTop: '20px'
  }
};

export default Success;
