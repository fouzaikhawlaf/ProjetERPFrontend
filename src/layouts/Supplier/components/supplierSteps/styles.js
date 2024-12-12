const styles = {
    card: {
      padding: '30px',
      marginTop: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      transition: 'box-shadow 0.3s ease',
      '&:hover': {
        boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
      }
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '15px',
    },
    titleIcon: {
      marginRight: '10px',
      color: '#1976d2',
    },
    description: {
      color: 'rgba(0, 0, 0, 0.6)',
      marginBottom: '15px',
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '30px',
      gap: '10px',
    },
    divider: {
      margin: '20px 0',
    }
  };
  
  export default styles;
  