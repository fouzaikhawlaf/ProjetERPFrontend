import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import PropTypes from 'prop-types';

const LeaveChart = ({ takenLeaveDays, remainingLeaveDays }) => {
  const chartData = {
    labels: ['Jours pris', 'Jours restants'],
    datasets: [
      {
        data: [takenLeaveDays, remainingLeaveDays],
        backgroundColor: ['#ff5e57', '#50b83c'],
        hoverBackgroundColor: ['#ff7571', '#60c94e'],
      },
    ],
  };

  return (
    <div style={{ maxWidth: '300px', margin: '0 auto' }}> {/* Ajustement de la largeur */}
      <h3 style={{ textAlign: 'center' }}>Statistiques des congés</h3>
      <Doughnut
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: true,
          legend: { position: 'bottom', labels: { fontSize: 14, boxWidth: 10 } },
        }}
      />
    </div>
  );
};

LeaveChart.propTypes = {
  takenLeaveDays: PropTypes.number.isRequired,
  remainingLeaveDays: PropTypes.number.isRequired,
};

export default LeaveChart;
