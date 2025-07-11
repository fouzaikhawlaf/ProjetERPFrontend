import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/listClients');
    }, 3000); // Redirige après 3 secondes

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎉 Félicitations !</h1>
      <p style={styles.message}>
        Votre formulaire a été soumis avec succès.<br />
        Merci de nous avoir fourni vos informations.<br />
        <span style={{ color: '#888', fontSize: '1rem' }}>
          Vous allez être redirigé vers la liste des clients...
        </span>
      </p>
      <img 
        src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
        alt="Succès" 
        style={styles.image} 
      />
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px'
  },
  title: {
    fontSize: '2.5rem',
    color: '#4CAF50'
  },
  message: {
    fontSize: '1.2rem',
    color: '#333',
    margin: '20px 0'
  },
  image: {
    width: '120px',
    height: '120px',
    marginTop: '20px'
  }
};

export default Success;
